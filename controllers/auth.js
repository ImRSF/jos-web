const User = require("../models/user");
const Misc = require("../models/misc");
const JobOrder = require("../models/jobOrder");
const { validationResult } = require("express-validator");

const getAllDashboardOptions = async (personnelID) => {
  // Not Added in Models due to Circular Dependency
  const getDashboardOptions = await User.getDashboardOptions(personnelID);
  const getUser = await User.getUser("PersonnelID", personnelID)
  let dashboardOptions = {};
  dashboardOptions.noOfAllJOs = getDashboardOptions[0].AllJobOrders;
  dashboardOptions.noOfAllReviews = getDashboardOptions[0].AllReviews;
  dashboardOptions.noOfAllJRs = getDashboardOptions[0].AllJobRequests;
  if (getUser[0].UserGroupName === "Admin" || getUser[0].UserGroupName === "SU") {
    dashboardOptions.PendingJobOrders = getDashboardOptions[0].PendingJobOrders;
    dashboardOptions.ServedJobOrders = getDashboardOptions[0].ServedJobOrders; 
    dashboardOptions.CancelledJobOrders = getDashboardOptions[0].CancelledJobOrders; 
  } else {
    dashboardOptions.PendingJobOrders = getDashboardOptions[0].PendingJobOrders;
    dashboardOptions.ReturnedJobOrders = getDashboardOptions[0].ReturnedJobOrders;
    dashboardOptions.SubmittedJobOrders = getDashboardOptions[0].SubmittedJobOrders;
  }
  return dashboardOptions; 
};

exports.getLogin = (req, res) => {
  return res.render("auth/login", {
    pageTitle: "Login",
    errorMessage: null
  });
};

exports.getIndex = async (req, res, next) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("auth/dashboard", {
    pageTitle: req.session.userGroupName + " Dashboard",
    path: "/references/dashboard",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    },
    dashboardOptions: await getAllDashboardOptions(req.session.personnelID)
  });
};

exports.getRegister = async (req, res) => {
  return res.render("auth/register", {
    pageTitle: "Register",
    companyList: await Misc.getCompany("CompanyID", ""),
    departmentList: await Misc.getDepartment(),
    sectionList: await Misc.getSection(),
    userGroupList: await User.getUserGroup(),
    validationErrors: [],
    oldInput: {
      fName: "",
      mName: "",
      lName: "",
      email: "",
      position: "",
      username: "",
      password: "",
      confirmPassword: req.body.password
    }
  });
};

exports.getAddAccount = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("auth/add-account", {
    oldInput: function () {
      if (req.session.oldInput) {
        return req.session.oldInput;
      } else {
        return {};
      }
    },
    pageTitle: "Add Account",
    userGroupList: await User.getUserGroup(),
    submittedFrom: req.query.from,
    validationErrors: function () {
      if (req.session.addValidationErrors) {
        return req.session.addValidationErrors;
      } else {
        return [];
      }
    },
    removeErrorMessages: function () {
      delete req.session.addValidationErrors;
      delete req.session.oldInput;
    },
    categoryList: await Misc.getCategoryOnly()
  });
};

exports.getEditAccount = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    return res.send(await Misc.getAssignedCategory(req.query.assignedCategory))
  }
  return res.render("auth/edit-account", {
    oldInput: function () {
      if (req.session.oldInput) {
        return req.session.oldInput;
      } else {
        return {};
      }
    },
    pageTitle: "Edit Account",
    user: await User.getUser("PersonnelID", req.query.personnelId),
    userGroupList: await User.getUserGroup(),
    submittedFrom: req.query.from,
    validationErrors: function () {
      if (req.session.editValidationErrors) {
        return req.session.editValidationErrors;
      } else {
        return [];
      }
    },
    removeErrorMessages: function () {
      delete req.session.editValidationErrors;
      delete req.session.oldInput;
    },
    jobCategories: await Misc.getAssignedCategory(req.query.assignedCategory),
  });
};

exports.getForgotPassword = (req, res) => {
  return res.render("auth/forgot-password", {
    pageTitle: "Forgot Password",
    validationErrors: []
  });
};

exports.getResetPassword = async (req, res) => {
  const getUser = await User.getUser("ResetPasswordToken", req.query.resetPasswordToken);
  const currentDate = Date.now();
  if (getUser.length === 0 || parseInt(getUser[0].ResetPasswordTokenExpiration) < currentDate) {
    return res.render("auth/link-expired", {
      pageTitle: "Link Expired"
    });
  } else {
    return res.render("auth/reset-password", {
      validationErrors: function () { 
        if (req.session.updatePasswordValidationErrors) {
          return req.session.updatePasswordValidationErrors;
        } else {
          return [];
        }
      }, 
      removeErrorMessages: function () {
        delete req.session.updatePasswordValidationErrors;
        delete req.session.oldInput;
      },
      pageTitle: "Reset Password",
    });
  }
};

exports.getAccounts = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const accountList = {
      data: await User.getUser("PersonnelID", "")
    };
    return res.send(accountList);
  }
  return res.render("auth/account-list", {
    pageTitle: "Accounts List",
    path: "/auth/accounts",
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    user: await User.getUser("PersonnelID", req.session.personnelID),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getAccount = async (req, res) => {
  if (req.xhr) {
    const personnelID = req.params.rowAcctId;
    let accountDetails = await User.getUser("PersonnelID", personnelID);
    return res.send({ accountDetails });
  }
};

exports.getUserGroup = async (req, res) => {
  if (req.xhr) {
    const userGroupList = await User.getUserGroup("UserGroupID", "");
    const userGroup = req.session.userGroupName;
    res.send({ userGroupList, userGroup });
  }
};

exports.getTeam = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("auth/iss-department", {
    pageTitle: "ISS Department",
    path: "/references/our-team",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    users: await User.getUser(
      "SectionID",
      "27E6F3D8-7CCF-4BE5-8330-FE3B3170D1D6"
    ),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    personnelID: req.session.personnelID,
    userGroupName: req.session.userGroupName,
    personnelInitial: req.session.personnelInitial,
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getDashboard = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("auth/dashboard", {
    pageTitle: req.session.userGroupName + " Dashboard",
    path: "/references/dashboard",
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    // dashboardName: function (job, userGroupID, statusId) {
    //   const getUserGroupID = parseInt(userGroupID);
    //   let dashboardItemOptions = {};
    //   if (job === "request") {
    //     dashboardItemOptions = {
    //       name: "Approved",
    //       statusId: 6
    //     }
    //   }
    //   if (job === "order") {
    //     if (getUserGroupID == 1) {
    //       dashboardItemOptions = {
    //         name: "Pending",
    //         statusId: 5
    //       }
    //     }
    //   }
    // },
    user: await User.getUser("PersonnelID", req.session.personnelID),
    dashboardOptions: await getAllDashboardOptions(req.session.personnelID),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getProfile = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const noOfJobOrderByStatus = await JobOrder.getNumberOfJOByStatus(
      req.query.personnelID
    );
    return res.send({ noOfJobOrderByStatus });
  }
  return res.render("auth/profile", {
    user: await User.getUser("PersonnelID", req.session.personnelID),
    pageTitle: req.session.userGroupName + " Dashboard",
    jobStatistics: await JobOrder.getJobStatisticsByUser(
      req.session.personnelID
    ),
    pageTitle: "My Profile",
    path: "/auth/profile",
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    assignedCategoryID: req.session.assignedCategoryID,
    personnelID: req.session.personnelID,
    personnelInitial: req.session.personnelInitial,
    userGroupName: req.session.userGroupName,
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
};

exports.getLogs = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const logsList = {
      data: await User.getLogs()
    };
    return res.send(logsList);
  }
  return res.render("auth/log-list", {
    pageTitle: "Logs List",
    path: "/auth/logs",
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID),
    user: await User.getUser("PersonnelID", req.session.personnelID),
    profileImage:  (profileImage) => {
      if (!profileImage) {
        return "/img/user-default.png"
      } else {
        return profileImage;
      } 
    }
  });
}

exports.getEmployee = async (req, res) => {
  if (req.xhr) {
    const employeeList = {
      data: await User.getEmployeeList()
    };
    return res.send(employeeList);
  }
}

exports.postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg
    });
  }
  const getUser = await User.loginUser(req.body.username, req.body.password);
  try {
    if (getUser.accountDetails) {
      req.session.user = getUser.accountDetails;
      req.session.personnelID = getUser.accountDetails.PersonnelID;
      req.session.userGroupName = getUser.accountDetails.UserGroupName;
      req.session.email = getUser.accountDetails.PersonnelEmail;
      req.session.personnelInitial = getUser.accountDetails.PersonnelInitial;
      req.session.assignedCategoryID = getUser.accountDetails.Identity;
      req.session.serverOptions = await Misc.getServerDefaults();
      req.session.employeeNo = getUser.accountDetails.EmployeeNo
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postRegisterUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/register", {
      pageTitle: "Register",
      companyList: await Misc.getCompany("CompanyID", ""),
      departmentList: await Misc.getDepartment(),
      sectionList: await Misc.getSection(),
      userGroupList: await User.getUserGroup(),
      validationErrors: errors.array(),
      oldInput: {
        fName: req.body.fName,
        mName: req.body.mName,
        lName: req.body.lName,
        email: req.body.email,
        position: req.body.position,
        username: req.body.username,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
      }
    });
  }

  const request = req.body;
  let accountImage;
  if (req.files["file-accountImage"]) {
    const file = req.files["file-accountImage"][0];
    accountImage = file.filename;
  } else {
    accountImage = request.accountImage;
  }
  const user = new User(
    request.personnelId,
    request.fName,
    request.mName,
    request.lName,
    request.gender,
    request.email,
    request.position,
    request.username,
    request.password,
    request.company,
    request.department,
    request.section,
    request.userGroup,
    request.accountStatus,
    accountImage,
    request.accountDescription
  );

  await user.insertAccount(req.body.mode, req.session.personnelID);
  switch (request.submittedFrom) {
    case "Profile":
      return res.redirect(
        "/auth/profile?personnelId=" + req.session.personnelID
      );
    case "Accounts":
      return res.redirect("/auth/accounts");
    case "Register":
      return res.redirect("/auth/login");
  }
};

exports.postAddAccount = async (req, res) => {
  const errors = validationResult(req);
  let file, accountImage;
  if (!errors.isEmpty()) {
    req.session.addValidationErrors = errors.array();
    req.session.oldInput = {
      fName: req.body.fName,
      mName: req.body.mName,
      lName: req.body.lName,
      employeeNo: req.body.employeeNo,
      position: req.body.position,
      userGroup: req.body.userGroup,
      company: req.body.companyId,
      companyName: req.body.companyName,
      department: req.body.departmentId,
      departmentName: req.body.departmentName,
      section: req.body.sectionId,
      sectionName: req.body.sectionName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      accountDescription: req.body.accountDescription
    }
    return res.redirect("../auth/add-account");
  }
  const request = req.body;
  if (req.files["file-accountImage"]) {
    file = req.files["file-accountImage"][0];
    accountImage = file.filename;
  } else {
    accountImage = "";
  }
  const user = new User(
    request.personnelId || null,
    req.session.personnelID,
    request.fName,
    request.mName,
    request.lName,
    request.employeeNo,
    request.email,
    request.position,
    request.username,
    request.password,
    request.companyId,
    request.departmentId,
    request.sectionId || null,
    request.userGroup,
    request.accountStatus,
    accountImage,
    request.accountDescription,
    request.assignedApprover
  );
  await user.insertAccount(req.session.personnelID, request.personnelId);
  if (request.userGroup === '5' || request.userGroup === '3') {
    await User.assignApprover(request.employeeNo, request.userGroup, request.assignedApprover || null);
  }
  await Misc.insertISSCategory(null, request.assignedCategory);
  return res.redirect("../auth/accounts");
};

exports.postEditAccount = async (req, res) => { 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.editValidationErrors = errors.array();
    req.session.oldInput = {
      fName: req.body.fName,
      mName: req.body.mName,
      lName: req.body.lName,
      employeeNo: req.body.employeeNo,
      position: req.body.position,
      userGroup: req.body.userGroup,
      company: req.body.company,
      companyName: req.body.companyName,
      department: req.body.department,
      departmentName: req.body.departmentName,
      section: req.body.section,
      sectionName: req.body.sectionName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      accountDescription: req.body.accountDescription
    }
    return res.redirect(
      "../auth/edit-account?personnelId=" +
      req.body.personnelId +
      "&from=" +
      req.body.submittedFrom
    );
  }

  const request = req.body;
  let accountImage;
  if (req.files["file-accountImage"]) {
    const file = req.files["file-accountImage"][0];
    accountImage = file.filename;
  } else {
    const getAccountImage = await User.getUser(
      "PersonnelID",
      req.body.personnelId
    );
    accountImage = getAccountImage[0].AccountImage;
  }

  const user = new User(
    request.personnelId,
    req.session.personnelID,
    request.fName,
    request.mName,
    request.lName,
    request.employeeNo,
    request.email,
    request.position,
    request.username,
    request.password,
    request.companyId,
    request.departmentId,
    request.sectionId || null,
    request.userGroup,
    request.accountStatus,
    accountImage,
    request.accountDescription,
    request.assignedApprover
  );
  await user.insertAccount(req.session.personnelID, request.personnelId);
  if (request.userGroup === '5' || request.userGroup === '3') {
    await User.assignApprover(request.employeeNo, request.userGroup, request.assignedApprover || null);
  }
  await Misc.insertISSCategory(request.assignedCategoryId, request.assignedCategory)
  switch (req.body.submittedFrom) {
    case "Accounts":
      return res.redirect("../auth/accounts");
    case "Profile":
      return res.redirect("../auth/profile?personnelId=" + request.personnelId);
  }
};

exports.postLogout = async (req, res) => {
  await req.session.destroy();
  return res.redirect("/");
};

exports.postForgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/forgot-password", {
      pageTitle: "Forgot Password",
      validationErrors: errors.array(),
      oldInput: { email: req.body.emailForPasswordReset }
    });
  }
  await User.verifyEmailForPasswordReset(req.body.emailForPasswordReset);
  return res.redirect("/auth/login");
};

exports.postResetPassword = async (req, res) => {
  const errors = validationResult(req);
  const headerReferer = req.headers.referer
  // Get PersonnelID from link
  const personnelID = headerReferer.substring(headerReferer.lastIndexOf("personnelId=") + 12);
  if (!errors.isEmpty()) {
    req.session.updatePasswordValidationErrors = errors.array();
    return res.redirect(
      `../auth/reset-password?personnelId=${personnelID}`
    );
  }
  const accountDetails = {
    "PersonnelID": req.body.personnelId,
    "Username": req.body.username,
    "NewPassword": req.body.password
  }
  await User.changePassword(accountDetails);
  await req.session.destroy();
  return res.redirect("/auth/login");
};

exports.postEmail = async (req, res) => {
  await User.insertEmail(req.body.personnelID, req.body.personnelEmail);
  return res.send("Success!");
};

exports.postDeactivateAccount = async (req, res) => {
  await User.deactivateAccount(req.session.personnelID, req.body.accountId);
  return res.redirect("/auth/accounts");
};

exports.postDeleteAccount = async (req, res) => {
  await User.deleteAccount(req.session.personnelID, req.body.accountId);
  return res.redirect("/auth/accounts");
};
