const User = require("../models/user");
const Misc = require("../models/misc");
const JobOrder = require("../models/jobOrder");


const getJobOrderDashboardOptions = async (personnelID) => {
  // Not Added in Models due to Circular Dependency
  const getUser = await User.getUser("PersonnelID", personnelID);
  let dashboardOptions = {};
  dashboardOptions.noOfReturnedJOs = await JobOrder.getJobOrdersByUserAndStatus("Returned", getUser[0].PersonnelID).then(result => result.length);
  dashboardOptions.noOfSubmittedJOs = await JobOrder.getJobOrdersByUserAndStatus("Submitted", getUser[0].PersonnelID).then(result => result.length);
  dashboardOptions.noOfServedJOs = await JobOrder.getJobOrdersByUserAndStatus("Served", getUser[0].PersonnelID).then(result => result.length);
  dashboardOptions.noOfCancelledJOs = await JobOrder.getJobOrdersByUserAndStatus("Cancelled", getUser[0].PersonnelID).then(result => result.length);
  dashboardOptions.noOfPendingJOs = await JobOrder.getJobOrdersByUserAndStatus("Pending", getUser[0].PersonnelID).then(result => result.length);

  return dashboardOptions;
};

exports.getJobOrder = async (req, res, next) => {
  if (req.xhr) {
    let joNumber = req.params.rowJoNum;
    let jobOrderNumber;
    let formDetails;
    let jobOrder;
    if (req.params.mode == "Add") {
      jobOrderNumber = await JobOrder.getJobOrderNumber();
      formDetails = {
        priority: await JobOrder.getPriority(),
        status: await Misc.getStatus(req.session.personnelID, req.session.personnelID, 0)
      }
      return res.send({ jobOrderNumber, formDetails });
    } else if (req.params.mode == "View") {
      jobOrder = {
        details: await JobOrder.getJobOrder("JobNumber", joNumber),
        jobItems: await JobOrder.getJobItemsFromJobOrder("JobNumber", joNumber),
        attachedFile: await Misc.getAttachedFile("JobOrder", joNumber),
        userGroupName: req.session.userGroupName
      }
      formDetails = {
        details: await JobOrder.getJobOrder("JobNumber", joNumber),
        priority: await JobOrder.getPriority(),
        status: await Misc.getStatus(req.session.personnelID, req.session.personnelID, 0),
        attachedFile: await Misc.getAttachedFile("JobOrder", joNumber)
      }
      return res.send({ jobOrder, formDetails })
    } else if (req.params.mode = "Authenticate") {
      jobOrder = {
        details: await JobOrder.getJobOrder("JobNumber", joNumber),
        jobItems: await JobOrder.getJobItemsFromJobOrder("JobNumber", joNumber),
        userGroupName: req.session.userGroupName
      }
      return res.send({ jobOrder })
    }
  }
};

exports.getJobOrderLink = async (req, res, next) => {
  if (req.query.jobOrderNumber) {
    return res.render("jobs/job-order", {
      pageTitle: "Job Order",
      path: "/jobs/job-order"
    });
  }
};

exports.getJOStatusPerUser = async (req, res, next) => {
  if (req.xhr) {
    const JOStatusList = await Misc.getStatus(req.query.personnelId, req.query.assignedTo, req.query.userGroupId)
    return res.send(JOStatusList)
  }
};

exports.getJobOrders = async (req, res, next) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  const jobOrderList = {
    priorityList: await JobOrder.getPriority("PriorityID", "")
  };
  if (req.xhr) {
    if (req.query.statusName !== "undefined") {
      jobOrderList.data = await JobOrder.getJobOrdersByUserAndStatus(req.session.personnelID, req.query.statusID);
    } else {
      jobOrderList.data = await JobOrder.getJobOrderByUser(req.session.personnelID);
    }
    return res.send(jobOrderList);
  } 

  return res.render("jobs/job-orders", {
    pageTitle: "Job Orders",
    path: "/jobs/job-orders",
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    jobName: "Order",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    jobOrderNumber: await JobOrder.getJobOrderNumber(),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getJobItems = async (req, res, next) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const jobItemlist = {
      data: await JobOrder.getJobItems(req.query.columnName, req.query.searchVal)
    };
    return res.send(jobItemlist);
  }
  return res.render("references/jobItem-list", {
    pageTitle: "Job Items",
    path: "/jobs/job-items",
    personnelID: req.session.personnelID,
    personnelInitial: req.session.personnelInitial,
    userGroupName: req.session.userGroupName
  });
};

exports.getJobItemsFromCategories = async (req, res, next) => {
  if (req.xhr) {
    const jobItemlist = {
      data: await JobOrder.getJobItemsFromCategories(req.query.categoryId, req.query.subCategoryId)
    };
    return res.send(jobItemlist); 
  } 
};
    
exports.getJobOrderDashboard = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("jobs/job-order-dashboard", {
    pageTitle: "Job Requests",
    path: "/jobs/job-requests",
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    jobName: "Request",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    dashboardOptions: await getJobOrderDashboardOptions(req.session.personnelID),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.postJobOrders = async (req, res, next) => {
  const request = req.body;
  if (req.xhr) {
    await JobOrder.deleteJobItems("JobNumber", req.body.jobNumber);
    await JobOrder.insertJobItems(req.body.jobItems);
    return res.send("")
  }
  const jobOrder = new JobOrder(
    request.joId || null,
    req.session.personnelID,
    request.joNum,
    request.jrNum,
    request.company,
    request.department,
    request.section,
    request.joRequestedBy,
    // request.joRequestor,
    request.joAssignedTo,
    request.joReviewedBy,
    request.joStatus,
    request.joPriority,
    request.joDetails,
    request.joActions,
    request.joRemarks,
    request.joDateRequested,
    request.joDateServed,
    request.joDeadline,
    request.categoryId,
    request.subCategoryId
  );
  await jobOrder.insertJobOrder(req.session.personnelID)
  await JobOrder.attachJobRequestToJobOrder(request.jrNum, request.joNum, req.files["file-jobOrder"]);
  return res.redirect("/jobs/job-orders?personnelId=" + req.session.personnelID);
};

exports.postDeleteJobOrder = async (req, res, next) => {
  await JobOrder.deleteJobOrder(req.session.personnelID, req.body.joNum);
  await JobOrder.deleteJobItems("JobNumber", req.body.joNum);
  return res.redirect("/jobs/job-orders?personnelId=" + req.session.personnelID);
};

exports.postDeleteJobItem = async (req, res, next) => {
  await JobOrder.deleteJobItems("JobItemID", req.body.jobItemID);
  return res.send("Successfully Deleted!");
};

exports.postJobOrderReview = async (req, res, next) => {
  if (req.xhr) {
    await JobOrder.insertReview(req.body.joNum, req.body.reviewDesc, req.body.reviewVal);
    return res.send("Review Added!")
  }
};
