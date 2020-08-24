const User = require("../models/user");
const Misc = require("../models/misc");

exports.getCompanyList = async (req, res) => {
  if (req.xhr) {
    const companyList = {
      data: await Misc.getCompany()
    };
    return res.send(companyList);
  }
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("references/company-list", {
    pageTitle: "Company",
    path: "/references/company-list",
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

exports.getDepartmentList = async (req, res) => {
  if (req.xhr) {
    const departmentList = {};
    departmentList.data = await Misc.getDepartment(
      req.query.colName,
      req.query.colValue
    );
    return res.send(departmentList);
  }
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("references/department-list", {
    pageTitle: "Department",
    path: "/references/department-list",
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

exports.getSectionList = async (req, res) => {
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  if (req.xhr) {
    const sectionList = {
      data: await Misc.getSection()
    };
    return res.send(sectionList);
  }
  return res.render("references/section-list", {
    pageTitle: "Section",
    path: "/references/section-list",
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

exports.getUserList = async (req, res) => {
  if (req.xhr) {
    const userList = {
      data: await User.getAvailableUsers(req.query.personnelID, req.query.userGroup)
    };
    return res.send(userList);
  }
};

exports.getCategoryList = async (req, res) => {
  if (req.xhr) {
    const categoryList = {
      data: await Misc.getCategory(
        req.query.colName,
        req.query.searchVal
      )
    };
    return res.send(categoryList);
  }
};

exports.getCategoryOnly = async (req, res) => {
  if (req.xhr) {
    const categoryOnlyList = {
      data: await Misc.getCategoryOnly(
        req.query.colName,
        req.query.searchVal
      )
    };
    return res.send(categoryOnlyList);
  }
};

exports.getCategoryItem = async (req, res) => {
  console.log(req.query)
  if (req.xhr) {
    console.log(req.query)
    const categoryItemList = {
      data: await Misc.getCategoryItem(req.query.colName, req.query.searchVal)
    };
    return res.send(categoryItemList);
  }
};

exports.getCategoryItemListForHardware = async (req, res) => {
  if (req.xhr) {
    const categoryItemList = {
      data: await Misc.getCategoryItemForHardware(
        req.query.hardwareOption,
        req.query.employeeNo
      )
    };
    return res.send(categoryItemList);
  }
}

exports.getReferenceStatusList = async (req, res) => {
  if (req.xhr) {
    const referenceStatusList = await Misc.getReferenceStatus();
    return res.send(referenceStatusList);
  }
};

exports.getNetworkList = async (req, res) => {
  if (req.xhr) {
    const networkList = {
      data: await Misc.getNetwork()
    };
    return res.send(networkList);
  }
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("references/network-list", {
    pageTitle: "Network",
    path: "/references/network-list",
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

exports.getNetwork = async (req, res) => {
  if (req.xhr) {
    const networkList = await Misc.getNetwork(
      req.query.colName,
      req.query.searchVal
    );
    return res.send(networkList);
  }
};

exports.getSystemList = async (req, res) => {
  if (req.xhr) {
    const systemList = {
      data: await Misc.getSystem()
    };
    return res.send(systemList);
  }
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("references/system-list", {
    pageTitle: "System",
    path: "/references/system-list",
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

exports.getSystem = async (req, res) => {
  if (req.xhr) {
    const systemList = await Misc.getSystem("SystemID", req.query.systemID);
    return res.send(systemList);
  }
};

exports.getSoftwareList = async (req, res) => {
  if (req.xhr) {
    const softwareList = {
      data: await Misc.getSoftware()
    };
    return res.json(softwareList);
  }
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("references/software-list", {
    pageTitle: "Software",
    path: "/references/software-list",
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

exports.getSoftware = async (req, res) => {
  if (req.xhr) {
    const softwareList = await Misc.getSoftware(
      req.query.colName,
      req.query.searchVal
    );
    return res.send(softwareList);
  }
};

exports.getHardwareList = async (req, res) => {
  if (req.xhr) {
    const hardwareList = {
      data: await Misc.getHardware()
    };
    return res.send(hardwareList);
  }
  // if (!req.session.personnelID) {
  //   return res.redirect("/auth/login");
  // }
  return res.render("references/hardware-list", {
    pageTitle: "Hardware",
    path: "/references/hardware-list",
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

exports.getMiscellaneousList = async (req, res) => {
  if (req.xhr) {
    const miscellaneousList = {
      data: await Misc.getMiscellaneous()
    };
    return res.send(miscellaneousList);
  }
  if (!req.session.personnelID) {
    return res.redirect("/auth/login");
  }
  return res.render("references/miscellaneous-list", {
    pageTitle: "Miscellaneous",
    path: "/references/miscellaneous-list",
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

exports.getMiscellaneous = async (req, res) => {
  if (req.xhr) {
    const miscellaneousList = await Misc.getMiscellaneous("MiscItemID", req.query.itemID);
    return res.send(miscellaneousList);
  }
};

exports.getEmployeeList = async (req, res) => {
  if (req.xhr) {
    const employeeList = { data: await Misc.getEmployee(req.query.colName, req.query.searchVal) };
    return res.send(employeeList);
  }
};

exports.getEmployeeWithWorkstation = async (req, res) => {
  if (req.xhr) {
    const employeeList = { data: await Misc.getEmployeeWithWorkstation() };
    return res.send(employeeList);
  }
};

exports.getCurrentDate = (req, res) => {
  if (req.xhr) {
    const getCurrentDate = Misc.getCurrentDate();
    return res.send(getCurrentDate);
  }
};

exports.getUser = async (req, res) => {
  if (req.xhr) {
    let user;
    if (req.query.personnelID) {
      user = {
        data: await User.getUser("PersonnelID", req.query.personnelID)
      };
    } else {
      user = {
        data: await User.getUser("PersonnelID", req.session.personnelID)
      };
    }
    return res.send(user);
  }
  //return res.send(x)
};

exports.getUserById = async (req, res) => {
  if (req.xhr) {
    const user = await User.getUser("PersonnelID", req.query.personnelID);
    return res.send(user);
  }
}

exports.getApprover = async (req, res) => {
  const getApprover = await User.getAssignedApprover(
    req.query.employeeNo
  );
  return res.send(getApprover);
};

exports.getFileSizeLimit = async (req, res) => {
  return res.send(await Misc.getFileSizeLimit());
};

exports.getServerDefaults = async (req, res) => {
  return res.send(await Misc.getServerDefaults("Development"));
};

exports.getHardwareItemType = async (req, res) => {
  if (req.xhr) {
    const hardwareItemList = {
      data: await Misc.getHardwareItem(req.query.columnValue, req.query.searchVal)
    };
    return res.send(hardwareItemList);
  }
};

exports.syncRMS = async (req, res) => {
  try {
    if (req.xhr) {
      const syncItemList = {
        data: await Misc.syncToRMS(req.query.syncRMSItem)
      };
      return res.send(syncItemList)
    };
  } catch (error) {
    return res.send()
  }
};

exports.syncHIS = async (req, res) => {
  try {
    if (req.xhr) {
      const syncItemList = {
        data: await Misc.syncToHIS(req.query.syncHISItem)
      };
      return res.send(syncItemList)
    };
  } catch (error) {
    return res.send()
  }
};

exports.syncHRIS = async (req, res) => {
  try {
    if (req.xhr) {
      const syncItemList = {
        data: await Misc.syncToHRIS(req.query.syncHRISItem)
      };
      return res.send(syncItemList)
    };
  } catch (error) {
    return res.send()
  }
};

exports.postNetwork = async (req, res) => {
  const request = req.body;
  await Misc.insertNetwork(
    req.session.personnelID,
    request.networkId || null,
    request.networkName,
    request.networkDescription,
    request.networkRemarks,
    request.networkStatus,
    request.networkCategory
  );
  return res.redirect("/misc/network-list");
};

exports.postDeleteNetwork = async (req, res) => {
  await Misc.deleteNetwork(req.session.personnelID, req.body.networkId);
  return res.redirect("/misc/network-list");
};

exports.postSoftware = async (req, res) => {
  const request = req.body;
  await Misc.insertSoftware(
    req.session.personnelID,
    request.softwareId || null,
    request.softwareDescription,
    request.softwareName,
    request.softwareRemarks,
    request.softwareStatus,
    request.softwareCategory
  );
  return res.redirect("/misc/software-list");
};

exports.postDeleteSoftware = async (req, res) => {
  await Misc.deleteSoftware(req.session.personnelID, req.body.softwareId);
  return res.redirect("/misc/software-list");
};

exports.postSystem = async (req, res) => {
  const request = req.body;
  await Misc.insertSystem(
    req.session.personnelID,
    request.systemId || null,
    request.systemName,
    request.systemDescription,
    request.systemRemarks,
    request.systemCompany,
    request.systemStatus,
    request.systemCategory
  );
  return res.redirect("/misc/system-list");
};

exports.postDeleteSystem = async (req, res) => {
  await Misc.deleteSystem(req.session.personnelID, req.body.systemId);
  return res.redirect("/misc/system-list");
};

exports.postMiscellaneous = async (req, res) => {
  const request = req.body;
  await Misc.insertMiscellaneous(
    req.session.personnelID,
    request.itemId || null,
    request.itemName,
    request.itemDescription
  );
  return res.redirect("/misc/miscellaneous-list");
};

exports.postDeleteMiscellaneous = async (req, res) => {
  await Misc.deleteMiscellaneous(req.session.personnelID, req.body.itemId);
  return res.redirect("/misc/miscellaneous-list");
};

exports.getTestPage = async (req, res) => {
  return res.render("jobs/sample", {
    pageTitle: "Sample",
    path: "/misc/test",
    user: await User.getUser("PersonnelID", req.session.personnelID),
    assignedCategoriesLink: await Misc.getAssignedCategoriesLink(req.session.assignedCategoryID)
  });
};
