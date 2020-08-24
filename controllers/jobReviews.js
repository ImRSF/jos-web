// FIXME: Client Error when theres no Job Reviews

const User = require("../models/user");
const JobReview = require("../models/jobReview");
const JobOrder = require("../models/jobOrder");
const Misc = require("../models/misc");

exports.getJobReviews = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    // const getUser = await User.getUser("PersonnelID", req.session.personnelID);
    const jobReviewList = {
      data: await JobReview.getReviewByUser(req.session.personnelID)
    }
    if (req.query.test === "1") {
      //const jo = await JobReview.getJobOrderForReview(req.session.personnelID, getUser[0].DepartmentID);
      const jo = await JobOrder.getJobOrder();
      return res.send(jo);
    }
    return res.send(jobReviewList);
  }
  return res.render("jobs/job-reviews", {
    pageTitle: "Job Reviews",
    path: "/jobs/job-reviews",
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    user: await User.getUser("PersonnelID", req.session.personnelID),
    profileImage: (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      }
    }
  });
};

exports.getJOforReview = async (req, res) => {
  if (req.xhr) {
    const jobReviewList = {
      data: await JobReview.getJobOrderForReview(req.query.personnelID)
    }
    return res.send(jobReviewList)
  }
}

exports.getLastJOReviewed = async (req, res) => {
  if (req.xhr) {
    const lastJOList = await JobReview.getLastJOReviewed(req.query.employeeNo);
    return res.send(lastJOList);
  }
}

exports.getJobReview = async (req, res) => {
  if (req.xhr) {
    const getJobReviews = await JobReview.getReviews("ReviewID", req.query.reviewID);
    const getUser = await User.getUser("PersonnelID", req.session.personnelID);
    const getJobOrders = await JobReview.getJobOrderForReview(req.session.personnelID);
    return res.send({ getJobReviews, getJobOrders });
  }
};

exports.postDeleteJobReview = async (req, res) => { };

exports.postJobReview = async (req, res) => {
  const submitJobReview = async () => {
    const request = req.body;
    const jobReviewInstance = new JobReview(
      request.reviewId,
      request.reviewJOnum,
      request.reviewSubject,
      request.reviewDescription,
      request.reviewReviewerId,
      request.reviewRatingValue
    );
    await jobReviewInstance.insertJobReview(req.session.personnelID);
  }

  if (req.xhr) {
    await submitJobReview();
    return res.send("Success!");
  } else {
    await submitJobReview();
    return res.redirect("/jobs/job-reviews");
  }
};
