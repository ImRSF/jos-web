const DbControl = require("./dbControl");
const Secure = require("./security");
const Global = require("../util/globals");
const Misc = require("./misc");

module.exports = class User {
  constructor(id = null, accountId, fName, mName, lName, employeeNo, email, position, username, password, compId, deptId, sectId, userGroupId, userStatus, accountImage = null, accountDesc) {
    this.personnelId = id;
    this.accountId = accountId
    this.personnelFname = fName;
    this.personnelMname = mName;
    this.personnelLname = lName;
    this.employeeNo = employeeNo;
    this.email = email;
    this.position = position;
    this.username = username;
    this.password = password;
    this.compId = compId;
    this.deptId = deptId;
    this.sectId = sectId;
    this.userGroupId = userGroupId;
    this.userStatus = userStatus;
    this.accountImage = accountImage;
    this.accountDesc = accountDesc;
  }
 
  async insertAccount(userID, personnelID) {
    try { 
      // NOTICE: Use static functions in parent class 
      const getUser = await this.constructor.getUser("PersonnelID", personnelID);
      let userPassword;
      if (getUser[0].WebPassword !== this.password) {
        userPassword = Secure.encryptPassword(Misc.validateString(this.password)); 
      } else {
        userPassword = this.password
      }
      const accountParamList = [
        { name: "UserID", value: userID },
        { name: "PersonnelID", value: this.personnelId },
        { name: "PersonnelFName", value: this.personnelFname },
        { name: "PersonnelMName", value: this.personnelMname },
        { name: "PersonnelLName", value: this.personnelLname },
        { name: "EmployeeNo", value: this.employeeNo },
        { name: "DateAdded", value: Global.getCurrentDate() },
        { name: "PersonnelEmail", value: this.email },
        { name: "PersonnelPosition", value: this.position },
        { name: "Username", value: this.username },
        { name: "WebPassword", value: userPassword }, 
        { name: "CompanyID", value: this.compId },
        { name: "DepartmentID", value: this.deptId },
        { name: "SectionID", value: this.sectId },
        { name: "UserGroupID", value: this.userGroupId },
        { name: "UserStatus", value: this.userStatus },
        { name: "AccountImage", value: this.accountImage },
        { name: "AccountDescription", value: this.accountDesc },
        { name: "ApproverForUser", value: null }
      ];
      await DbControl.executeSP("spInsert_Personnel", accountParamList);
    } catch (error) { 
      console.log(error);
    }
  }

  static async checkUsername(userName) {
    const getUser = await DbControl.getRecords("UserName", userName, "devRef_spSelect_Personnel");
    getUser.forEach(getValue => {
      if (getValue.Username === userName) {
        throw "Username has already been used. Please try a new one.";
      }
    })
    return userName;
  }

  static async loginUser(username, password) {
    try {
      const accountParamList = [
        { name: "Username", value: username },
      ]; 
      const getAccount = await DbControl.executeSP(
        "spLogin_Personnel",
        accountParamList
      ); 
      const decryptPassword = Secure.decryptPassword( 
        getAccount[0].WebPassword,
        password
      ); 
 
      // if (!getAccount[0].isActive) {
      //   return {"isActive": false, "allowAccess": false}
      // }

      if (decryptPassword === password) {
        if (getAccount[0].IsActive) {
          return { "isPresent": true, "isActive": true, "accountDetails": getAccount[0] }
        } else {
          return { "isPresent": true, "isActive": false };
        }
      } else {
        return { "isPresent": false };
      }
    } catch (error) {
      //console.log(error);
    }
  }

  static async getUser(columnName = null, searchVal = "") {
    return await DbControl.getRecords(columnName, searchVal, "spSelect_Personnel")
  }
 
  // static async getAvailableUsers(columnName = null, searchVal = "", userOptions, filters = null) {
  //   let userParamList;
  //   if (filters) {
  //     userParamList = [
  //       { name: "ColumnName", value: columnName },
  //       { name: "SearchValue", value: searchVal },
  //       { name: "UserOptions", value: userOptions },
  //       { name: "PersonnelID", value: filters.PersonnelID}
  //     ]; 
  //   } else {
  //     userParamList = [
  //       { name: "ColumnName", value: columnName },
  //       { name: "SearchValue", value: searchVal },
  //       { name: "UserOptions", value: userOptions }
  //     ]; 
  //   } 
  //   return await DbControl.executeSP("spSelect_AvailableUsers", userParamList);
  // }

  static async getAvailableUsers(personnelID, userGroup) { 
      const userParamList = [
        { name: "PersonnelID", value: personnelID },
        { name: "UserGroup", value: userGroup }
      ]; 
    return await DbControl.executeSP("spSelect_AvailableUsers", userParamList);
  }

  static async getUserGroup(columnName = null, searchVal = "") {
    return await DbControl.getRecords(columnName, searchVal, "spSelect_UserGroup")
  }

  static async getAssignedApprover(employeeNo) {
    const assignApproverParamList = [
      { name: "EmployeeNo", value: employeeNo }
    ];
    return await DbControl.executeSP("spSelect_Approver", assignApproverParamList);
  }

  static async getLogs() {
    return await DbControl.executeSP("spSelect_TransactionLogs");
  }

  static async insertEmail(personnelID, personnelEmail) {
    const emailParamList = [
      { name: "PersonnelID", value: personnelID },
      { name: "PersonnelEmail", value: personnelEmail }
    ];
    return await DbControl.executeSP("spInsert_Email", emailParamList);
  }

  static async assignApprover(employeeNo, userGroupId, approverId = null) {
    const assignApproverParamList = [
      { name: "EmployeeNo", value: employeeNo },
      { name: "UserGroupID", value: userGroupId },
      { name: "SelectedApprover", value: approverId }
    ];
    return await DbControl.executeSP("spAssign_Approver", assignApproverParamList);
  }

  static async deactivateAccount(userID, personnelID) {
    const accountParamList = [
      { name: "UserID", value: userID },
      { name: "PersonnelID", value: personnelID }
    ];
    return await DbControl.executeSP("spDeactivate_Account", accountParamList);
  }

  static async deleteAccount(userID, personnelID) {
    const accountParamList = [
      { name: "UserID", value: userID },
      { name: "PersonnelID", value: personnelID }
    ];
    return await DbControl.executeSP("spDelete_Account", accountParamList);
  }

  static async changePassword(accountDetails) {
    const personnelID = accountDetails.PersonnelID
    const newEncryptedPassword = Secure.encryptPassword(
      accountDetails.NewPassword
    );
    const username = accountDetails.Username;
    const passwordResetParamList = [
      { name: "UserID", value: personnelID },
      { name: "Username", value: username },
      { name: "NewPassword", value: newEncryptedPassword },
      { name: "PersonnelID", value: personnelID },
    ];
    return await DbControl.executeSP("spUpdate_Password", passwordResetParamList);
  }

  async confirmPassword() {
    const getAccount = await DbControl.getRecords(
      "WebPassword",
      this.password,
      "devRef_spSelect_Personnel"
    );
    if (!getAccount.length) {
      return Secure.encryptPassword(this.password);
    } else if (getAccount[0].WebPassword === this.password) {
      return this.password;
    }
  }

  static async updateUserToken(personnelID, token = {}) {
    const userTokenParamList = [
      { name: "PersonnelID", value: personnelID },
      { name: "NewTokenValue", value: token.value },
      { name: "ExpirationDate", value: token.expirationDate }
    ];
    return await DbControl.executeSP("spReset_PasswordToken", userTokenParamList);
  }

  static async verifyEmailForPasswordReset(personnelEmail) {
    try {
      const serverDefaults = await Misc.getServerDefaults("Production");
      const getUser = await this.getUser("PersonnelEmail", personnelEmail); 
      const getToken = await Secure.generateToken(); 
      if (getUser[0].PersonnelID) {
        const passwordResetContent = `Please click the following link to reset your password. This link will expire in 10 minutes.<br>
        http://${serverDefaults[0].ServerIP}:${serverDefaults[0].PortNumber}/auth/reset-password?resetPasswordToken=${getToken.value}&personnelID=${getUser[0].PersonnelID}`;
        Misc.sendEmail([personnelEmail], "Link For Password Reset", passwordResetContent);
        return await this.updateUserToken(getUser[0].PersonnelID, getToken);
      } else {
        throw "Email does not exist in the system."
      }
    } catch (error) {
      console.log(error)
    }
  } 
 
  static async getDashboardOptions(personnelID) {
    const dashboardOptionParamList = [
      { name: "PersonnelID", value: personnelID}
    ];
    return await DbControl.executeSP("spSelect_PersonnelDashboardOptions", dashboardOptionParamList);
  } 
};
