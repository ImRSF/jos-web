const User = require("../models/user");
const JobRequest = require("../models/jobRequest");
const Misc = require("../models/misc");

exports.getRequestNumber = async (req, res) => {
  try {
    if (req.xhr) {
      const jobRequestNumber = await JobRequest.getJobRequestNumber();
      return res.send(jobRequestNumber);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getJobRequestsForAttachment = async (req, res) => {
  if (req.params.option === "Attachment") {
    const jobRequestList = {
      data: await JobRequest.getJobRequestsForAttachment(),
    };
    return res.send(jobRequestList);
  }
};

exports.getJobRequests = async (req, res) => {
  try {
    if (!req.session.personnelID) {
      return res.redirect("/auth/login");
    }
    if (req.xhr) {
      const jobRequestList = {
        data: await JobRequest.getJobRequestByUserAndStatus(
          req.query.personnelID,
          req.query.statusID
        ),
      };
      return res.send(jobRequestList);
    }
    return res.render("jobs/job-requests", {
      pageTitle: "Job Requests",
      path: "/jobs/job-requests",
      assignedCategoriesLink: await Misc.getAssignedCategoriesLink(
        req.session.assignedCategoryID
      ),
      jobName: "Request",
      user: await User.getUser("PersonnelID", req.session.personnelID),
      profileImage: (profileImage) => {
        if (!profileImage) {
          return "/img/user-default.png";
        } else {
          return profileImage;
        }
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getJobRequest = async (req, res) => {
  if (req.xhr) {
    return res.send({
      jobRequestList: await JobRequest.getJobRequest(
        "RequestNumber",
        req.query.requestNumber
      ),
      personnelID: req.session.personnelID,
      attachedFile: await Misc.getAttachedFile(
        "JobRequest",
        req.query.requestNumber
      ),
    });
  }
  if (req.query.requestNumber) {
    return res.render("jobs/job-request", {
      pageTitle: "Job Request",
      path: "/jobs/job-request",
    });
  }
};

exports.postDeleteJobRequest = async (req, res) => {
  const request = req.body;
  await JobRequest.deleteJobRequest(request.requestId);
  return res.redirect("/jobs/job-requests");
};

exports.postJobRequests = async (req, res) => {
  const request = req.body;
  const jobRequest = new JobRequest(
    request.requestId || null,
    request.requestNumber,
    request.contactNo,
    request.subject,
    request.description,
    request.dateSent,
    request.dateApproved,
    req.session.personnelID,
    request.requestedBy,
    request.approvedBy,
    request.jobStatus
  );
  await jobRequest.insertJobRequest(req.session.personnelID);
  const jobRequestNo = await JobRequest.getJobRequestNumber();
  await jobRequest.sendEmailForJobRequest(request.requestedByName);
  await Misc.insertFiles(jobRequestNo[0].JobRequestNumber, null, req.files["file-jobRequest"]);
  
  return res.redirect("/jobs/job-requests");
};
