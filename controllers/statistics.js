const User = require("../models/user");
const Misc = require("../models/misc");
const JobRequest = require("../models/jobRequest");
const JobOrder = require("../models/jobOrder");
const JobReview = require("../models/jobReview");
const Statistic = require("../models/statistic");

exports.getOverview = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("statistic/overview", {
    pageTitle: "Overview",
    path: "statistic/overview",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    yearList: await Misc.getJOTransactionYear(),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getJRSummary = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const jrSummaryReport = new Statistic(req.query.filters)
    const jrSummaryList = { data: await jrSummaryReport.generateJRSummary() }
    return res.send(jrSummaryList)
  }
  return res.render("statistic/JRSummary", {
    pageTitle: "Job Request Summary",
    path: "statistic/jrSummary",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    companyList: await Misc.getCompany(),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getJOSummary = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const joSummaryReport = new Statistic(req.query.filters)
    const joSummaryList = { data: await joSummaryReport.generateJOSummary() }
    return res.send(joSummaryList)
  }
  return res.render("statistic/JOSummary", {
    pageTitle: "Job Order Summary",
    path: "statistic/joSummary",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    personnelList: await User.getUser("SectionID", "27E6F3D8-7CCF-4BE5-8330-FE3B3170D1D6"),
    companyList: await Misc.getCompany(),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getJISummary = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const jiSummaryReport = new Statistic(req.query.filters)
    const jiSummaryList = { data: await jiSummaryReport.generateJISummary() }
    return res.send(jiSummaryList)
  } 
  return res.render("statistic/JISummary", {
    pageTitle: "Job Item Summary",
    path: "statistic/JISummary",
    personnelList: await User.getUser("SectionID", "27E6F3D8-7CCF-4BE5-8330-FE3B3170D1D6"),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    user: await User.getUser("PersonnelID", req.session.personnelID),
    companyList: await Misc.getCompany(),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getJOCategory = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const joByCategoryReport = new Statistic(req.query.filters)
    const joByCategoryList = { data: await joByCategoryReport.generateJOByCategory() }
    return res.send(joByCategoryList)
  }
  return res.render("statistic/JOCategory", {
    pageTitle: "Job Order By Category",
    path: "statistic/joCategory",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getJRStatistic = async (req, res) => { 
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const jrChartData = await Statistic.generateJRStatistic(req.query.personnelId, req.query.requestedYear)
    return res.send({ jrChartData })
  }
};

exports.getJOStatistic = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const joChartData = await Statistic.generateJOStatistic(req.query.personnelId, req.query.requestedYear);
    return res.send({ joChartData })
  }
};

exports.getJobCardValues = async (req, res) => {
  if (req.xhr) {
    const cardValues = await Statistic.getJobCardValues(req.query.personnelId, req.query.requestedYear);
    return res.send({ cardValues })
  }
};

exports.getReviewStatistic = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const reviewChartData = await Statistic.generateReviewStatistic(req.query.personnelId, req.query.requestedYear)
    return res.send({ reviewChartData })
  }
};

exports.postJRSummary = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("statistic/JRSummary", {
    pageTitle: "Job Request Summary",
    path: "statistic/jrSummary",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID)
  });
};

exports.postJOSummary = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("statistic/JOSummary", {
    pageTitle: "Job Order Summary",
    path: "statistic/joSummary",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID)
  });
};