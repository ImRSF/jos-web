const DbControl = require("./dbControl");
const User = require("./user");
const JobRequest = require("./jobRequest");
const Misc = require("./misc");

module.exports = class JobOrder {
  constructor(
    id = null,
    accountId,
    joNum,
    jrNum,
    companyId,
    departmentId,
    sectionId,
    requestedBy,
    // requestor,
    assignedTo,
    reviewedBy,
    status,
    priority,
    details,
    actions,
    remarks,
    dateRequested,
    dateServed,
    deadline,
    categoryId,
    subCategoryId
  ) {
    this.joId = id;
    this.accountId = accountId;
    this.joNum = joNum;
    this.joReq = jrNum;
    this.joCompId = companyId;
    this.joDeptId = departmentId;
    this.joSectId = sectionId;
    this.joReqdBy = requestedBy;
    // this.joRequestor = requestor;
    this.joAssTo = assignedTo;
    this.joRevBy = reviewedBy;
    this.joStatus = status;
    this.joPriority = priority;
    this.joDetails = details;
    this.joActions = actions;
    this.joRemarks = remarks;
    this.joDateReqd = dateRequested;
    this.joDateServed = dateServed;
    this.joDeadline = deadline;
    this.categoryId = categoryId;
    this.subCategoryId = subCategoryId;
  }

  static async getJobOrder(columnName = null, searchVal = "") {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "devRef_spSelect_JobOrders"
    );
  }

  static async getSQAJobOrders(personnelID) {
    const sqaParamList = [{ name: "PersonnelID", value: personnelID }];
    return await DbControl.executeSP(
      "devRef_spSelect_JobOrdersForSQA",
      sqaParamList
    );
  }

  async insertJobOrder(personnelID) {
    try {
      if (parseInt(this.joStatus) == 2 && parseInt(this.joPriority) < 3) {
        this.joPriority = parseInt(this.joPriority) + 1;
      }
      const jobOrderParamList = [
        { name: "UserID", value: personnelID },
        { name: "JobID", value: this.joId },
        { name: "JobNumber", value: this.joNum },
        { name: "RequestNumber", value: this.joReq },
        { name: "CompanyID", value: this.joCompId },
        {
          name: "DepartmentID",
          value: this.joDeptId == "" ? null : this.joDeptId
        },
        {
          name: "SectionID",
          value: this.joSectId == "" ? null : this.joSectId
        },
        { name: "RequestedBy", value: this.joReqdBy },
        // { name: "Requestor", value: this.joRequestor },
        { name: "AssignedTo", value: this.joAssTo },
        { name: "ReviewedBy", value: this.joRevBy },
        { name: "StatusID", value: this.joStatus },
        { name: "PriorityID", value: this.joPriority },
        { name: "Details", value: this.joDetails },
        { name: "Actions", value: this.joActions },
        { name: "Remarks", value: this.joRemarks },
        { name: "DateRequested", value: this.joDateReqd },
        { name: "DateServed", value: this.joDateServed },
        { name: "Deadline", value: this.joDeadline },
        {
          name: "CategoryID",
          value: this.categoryId == "" ? null : this.categoryId
        },
        {
          name: "SubCategoryID",
          value: this.subCategoryId == "" ? null : this.subCategoryId
        }
      ];
      await DbControl.executeSP("spInsert_JobOrder", jobOrderParamList);
      // Temporarily disabled since there are no Users
      this.sendEmailForJobOrder(personnelID, this.joReqdBy);
    } catch (error) {
      console.log(error);
    }
  }

  static async insertJobItems(jiParams) {
    const parsedParams = JSON.parse(jiParams);
    parsedParams.forEach(async function (element) {
      await DbControl.executeSP("spInsert_JobItems", element);
    });
  } 

  static async getJobOrderNumber() {
    return await DbControl.executeSP("spGenerate_JONumber");
  }

  static async getPriority() {
    return await DbControl.getRecords(
      "PriorityID",
      "",
      "devRef_spSelect_Priority"
    );
  }

  static async getJobOrderByUser(personnelID) {
    let colName = "RequestedBy";
    let colValue = personnelID;
    let getUser = await User.getUser("PersonnelID", personnelID);
    switch (getUser[0].UserGroupName) {
      case "Admin":
        colName = "";
        colValue = "";
        break;
      case "SQA":
        // colName = "StatusID";
        // colValue = 1;
        return await this.getSQAJobOrders(getUser[0].PersonnelID);
      case "User":
        colName = "Requestor";
        colValue = personnelID;
        break;
      case "SU":
        colName = "";
        colValue = "";
        break;
      case "Approver":
        colName = "DepartmentID";
        colValue = getUser[0].DepartmentID;
        break;
      case "ISS":
        colName = "AssignedTo";
        colValue = getUser[0].PersonnelID;
        break;
    }
    return await this.getJobOrder(colName, colValue);
  }

  static async getJobItems(columnName = null, searchVal = "") {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "spGet_JobItems"
    );
  }

  static async getJobItemsFromCategories(categoryId, subCategoryId) {
    const jobItemParamList = [
      { name: "CategoryID", value: categoryId },
      { name: "SubCategoryID", value: subCategoryId }
    ];
    return await DbControl.executeSP(
      "spGet_JobItemsFromCategories",
      jobItemParamList
    );
  }

  static async getJobItemsFromJobOrder(columnName = null, searchVal = "") {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "spSelect_JobItems"
    );
  }

  static async deleteJobOrder(userId, joNum) {
    const deleteJobOrderParamList = [
      { name: "UserID", value: userId },
      { name: "JobNumber", value: joNum }
    ];
    return await DbControl.executeSP(
      "spDelete_JobOrder",
      deleteJobOrderParamList
    );
  }

  static async deleteJobItems(index, value) {
    const deleteJobItemParamList = [{ name: "Index", value: index }, { name: "Value", value: value }];
    return await DbControl.executeSP(
      "spDelete_JobItem",
      deleteJobItemParamList
    );
  }

  static async attachJobRequestToJobOrder(
    jrNumber = null,
    joNumber,
    attachedFiles = []
  ) {
    const getAttachedFile = await Misc.getAttachedFile("JobRequest", jrNumber);
    if (getAttachedFile.length) {
      getAttachedFile.forEach(async function (element) {
        let attachJobOrderParams = [
          { name: "JobRequest", value: element.JobRequest },
          { name: "JobOrder", value: joNumber }
        ];
        return await DbControl.executeSP(
          "devRef_spAttach_JobRequestToJobOrder",
          attachJobOrderParams
        );
      });
    } else {
      let attachJobOrderParams = [
        { name: "JobRequest", value: jrNumber },
        { name: "JobOrder", value: joNumber }
      ];
      await DbControl.executeSP(
        "devRef_spAttach_JobRequestToJobOrder",
        attachJobOrderParams
      );
      attachedFiles.forEach(async function (element) {
        let attachedFilesParams = [
          { name: "JobRequest", value: "None Attached." },
          { name: "JobOrder", value: joNumber },
          { name: "OriginalName", value: element.originalname },
          { name: "FileName", value: element.filename },
          { name: "MimeType", value: element.mimetype },
          { name: "FilePath", value: element.path }
        ];
        return await DbControl.executeSP(
          "devRef_spInsert_File",
          attachedFilesParams
        );
      });
    }
  }

  static async getJobReviews(joNumber) {
    return await DbControl.getRecords(
      "JobNumber",
      joNumber,
      "devRef_spSelect_Review"
    );
  }

  static async insertReview(joNumber, reviewDesc, reviewVal) {
    try {
      const reviewParamList = [
        { name: "JobOrder", value: joNumber },
        { name: "ReviewDescription", value: reviewDesc },
        { name: "ReviewValue", value: reviewVal }
      ];
      await DbControl.executeSP("devRef_spInsert_Review", reviewParamList);
    } catch (error) {
      console.log(error);
    }
  }

  static async getJobStatisticsByUser(personnelID) {
    const jobOrderStatisticsParamList = [
      { name: "PersonnelID", value: personnelID }
    ];
    return await DbControl.executeSP(
      "devRef_spGet_JobStatisticsOfUser",
      jobOrderStatisticsParamList
    );
  }

  static async getNumberOfJOByStatus(personnelID) {
    const jobOrderNumberByStatusList = [
      { name: "PersonnelID", value: personnelID }
    ];
    return await DbControl.executeSP(
      "spGet_NumberOfJOByStatus",
      jobOrderNumberByStatusList
    );
  }

  // Temporarily disabled since there are no Users
  static async getJobOrdersByUserAndStatus(personnelID, statusID) {
    const jobOrderParamList = [
      { name: "PersonnelID", value: personnelID },
      { name: "StatusID", value: statusID }
    ];
    return await DbControl.executeSP(
      "spSelect_JobOrdersByUserAndStatus",
      jobOrderParamList
    );
  }

  async sendEmailForJobOrder(personnelID, requestedBy) {
    const serverDefaults = await Misc.getServerDefaults("Production");
    const getRequestedBy = await Misc.getEmployee("EmployeeNo", requestedBy);
    const getAssignedTo = await User.getUser("PersonnelID", this.joAssTo);
    const getReviewedBy = await User.getUser("PersonnelID", this.joRevBy);
    const getUser = await User.getUser("PersonnelID", personnelID);
    const issJobOrderLink =
      `http://${serverDefaults[0].ServerIP}:${serverDefaults[0].PortNumber}/jobs/job-order?jobOrderNumber=` +
      this.joNum;
    const sqaJobOrderLink =
      `http://${serverDefaults[0].ServerIP}:${serverDefaults[0].PortNumber}/jobs/job-order?jobOrderNumber=` +
      this.joNum;
    const userJobOrderLink =
      `http://${serverDefaults[0].ServerIP}:${serverDefaults[0].PortNumber}/jobs/job-order?jobOrderNumber=` +
      this.joNum;
    switch (this.joStatus) {
      case "1": 
        await Misc.sendEmail(
          [getReviewedBy[0].PersonnelEmail],
          "A Job Order was submitted for verification by " +
          getAssignedTo[0].PersonnelName,
          `<p>Click on the link to view the attached Job Order.<br><a href=${sqaJobOrderLink}>${this.joNum}</a></p>`
        );
        break;
      case "2":
        await Misc.sendEmail(
          [getAssignedTo[0].PersonnelEmail],
          "A Job Order you submitted was returned by " +
          getUser[0].PersonnelName,
          `<p>Click on the link to view the attached Job Order.<br><a href=${issJobOrderLink}>${this.joNum}</a></p>`
        );
        break;
      // case "3":
      //   await Misc.sendEmail(
      //     [getRequestedBy[0].PersonnelEmail],
      //     "A Job Order you requested was served by " +
      //     getAssignedTo[0].PersonnelName,
      //     `<p>Click on the link to view the attached Job Order.<br><a href=${userJobOrderLink}>${this.joNum}</a></p>`
      //   );
      //   break;
      case "5":
        await Misc.sendEmail(
          [getAssignedTo[0].PersonnelEmail],
          "A Job Order from " +
          getRequestedBy[0].EmployeeName +
          " was assigned to you.",
          `<p>Click on the link to view the attached Job Order.<br><a href=${issJobOrderLink}>${this.joNum}</a></p>`
        );
        break;
    }

  }
};
