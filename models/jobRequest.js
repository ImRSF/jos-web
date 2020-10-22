const DbControl = require("./dbControl");
const User = require("./user");
const Global = require("../util/globals");
const Misc = require("./misc");

module.exports = class JobRequest {
  constructor(
    id = null,
    number,
    contactNo,
    subject,
    desc,
    dateSent,
    dateApprovedOrCancelled,
    accountId,
    requestedBy,
    approvedBy,
    statusId
  ) {
    this.requestId = id;
    this.requestNumber = number;
    this.contactNo = contactNo;
    this.requestSubject = subject;
    this.requestDesc = desc;
    this.accountId = accountId;
    this.requestBy = requestedBy;
    this.requestApprovedBy = approvedBy;
    this.requestDateSent = dateSent;
    this.requestDateApprovedOrCancelled = dateApprovedOrCancelled;
    this.requestStatus = statusId;
  } 

  async insertJobRequest(personnelID) {
    try {
      let getUser = await User.getUser("PersonnelID", personnelID);
      switch (getUser[0].UserGroupName) {
        case "User":
          this.requestStatus = 1;
          this.accountId = getUser[0].PersonnelID;
          this.requestDateSent = Global.getCurrentDate();
          // this.requestApprovedBy = getUser[0].ApproverID;
          break;
        default:
          if (this.requestStatus == 6 || this.requestStatus == 4) this.requestDateApprovedOrCancelled = Global.getCurrentDate();
          this.requestApprovedBy = getUser[0].PersonnelID;
          break;
      }
      const jobRequestParamList = [
        { name: "RequestID", value: this.requestId },
        { name: "RequestNumber", value: this.requestNumber },
        { name: "RequestSubject", value: this.requestSubject },
        { name: "RequestDescription", value: this.requestDesc },
        { name: "UserID", value: personnelID },
        { name: "RequestedBy", value: this.requestBy },
        { name: "ContactNo", value: this.contactNo },
        { name: "ApprovedBy", value: this.requestApprovedBy },
        { name: "DateSent", value: this.requestDateSent },
        { name: "DateApprovedOrCancelled", value: this.requestDateApprovedOrCancelled },
        { name: "StatusID", value: this.requestStatus }
      ];
      await DbControl.executeSP(
        "spInsert_JobRequest",
        jobRequestParamList
      );
      // this.sendEmailForJobRequest(
      //   personnelID,
      //   this.requestNumber,
      //   this.requestApprovedBy
      // );
    } catch (error) {
      console.log(error);
    }
  }

  static async getJobRequestByUserAndStatus(personnelID, statusID = null) {
    const jobRequestParamList = [
      { name: "PersonnelID", value: personnelID },
      { name: "StatusID", value: statusID }
    ];
    return await DbControl.executeSP(
      "spSelect_JobRequestsByUserAndStatus",
      jobRequestParamList
    );
  }

  static async getJobRequest(columnName = null, searchVal = "") {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "spSelect_JobRequests"
    );
  }

  static async getJobRequestNumber() {
    return await DbControl.executeSP("spGenerate_JRNumber");
  }

  static async getJobRequestsForAttachment() {
    return await DbControl.executeSP(
      "spSelect_JobRequestsForAttachment"
    );
  }

  static async deleteJobRequest(id) {
    const deleteJobRequestParamList = [
      { name: "RequestID", value: parseInt(id) }
    ];
    return await DbControl.executeSP(
      "spDelete_JobRequest",
      deleteJobRequestParamList
    );
  }

  // async sendEmailForJobRequest(userId, requestNumber, approverId) {
  //   const serverDefaults = await Misc.getServerDefaults("Production");
  //   const getUser = await User.getUser("PersonnelID", userId);

  //   const jobRequestLink =
  //     `Please click the following link to view it in detail.<br>http://${serverDefaults[0].ServerIP}:${serverDefaults[0].PortNumber}/jobs/job-request?requestNumber=` +
  //     requestNumber + `<br><br>Click the following link to access the system: http://${serverDefaults[0].ServerIP}:${serverDefaults[0].PortNumber}`

  //   switch (this.requestStatus) {
  //     case 1:
  //       const approverDetails = await User.getUser("PersonnelID", approverId);
  //       await Misc.sendEmail(
  //         [approverDetails[0].PersonnelEmail],
  //         "A Job Request from " +
  //         getUser[0].PersonnelName +
  //         " is waiting for your approval",
  //         jobRequestLink
  //       );
  //       break;
  //     case 6:
  //       const adminList = await User.getUser("UserGroupID", 1);
  //       const adminEmails = adminList.map((e) => e.PersonnelEmail);

  //       await Misc.sendEmail(
  //         adminEmails,
  //         "A Job Request from " +
  //         getUser[0].PersonnelName +
  //         " is waiting to be assigned a Job Order",
  //         jobRequestLink 
  //       );
  //       break;
  //   }  
  // }

  async sendEmailForJobRequest(requestedByName) {
    const serverDefaults = await Misc.getServerDefaults("Production");

    const jobRequestLink =
      `Please click the following link to view it in detail.<br>http://${serverDefaults[0].ServerIP}:${serverDefaults[0].PortNumber}/jobs/job-request?requestNumber=` +
      this.requestNumber + `<br><br>Click the following link to access the system: http://${serverDefaults[0].ServerIP}:${serverDefaults[0].PortNumber}`
    switch (+this.requestStatus) {
      case 1:
        const approverDetails = await User.getUser("PersonnelID", this.requestApprovedBy);
        await Misc.sendEmail(
          [approverDetails[0].PersonnelEmail],
          "A Job Request from " +
          requestedByName +
          " is waiting for your approval",
          jobRequestLink
        );
        break;
      case 6:
        const adminList = await User.getUser("UserGroupID", 1);
        const adminEmails = adminList.map((e) => e.PersonnelEmail);
        await Misc.sendEmail(
          adminEmails,
          "A Job Request from " +
          requestedByName +
          " is waiting to be assigned a Job Order",
          jobRequestLink
        );
        break;
    }
  }

};
