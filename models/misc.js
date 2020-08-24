const DbControl = require("./dbControl");
const NodeMailer = require("nodemailer");

module.exports = class Miscellaneous {
  static getCurrentDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }

  static async getJOTransactionYear() {
    return await DbControl.executeSP("spGet_JOTransactionYear");
  }

  static async getCompany(columnName = null, searchVal = "") {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "spSelect_Company"
    );
  }

  static async getDepartment(columnName = null, searchVal = "") {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "spSelect_Department"
    );
  }

  static async getSection() {
    return await DbControl.executeSP("spSelect_Section");
  }

  static async getWorkGroup(columnName = null, searchVal = "") {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "devRef_spSelect_WorkGroup"
    );
  }

  static async getCategory(columnName = null, searchVal = null) {
    return await DbControl.getRecords(columnName, searchVal, "spSelect_Category");
  }

  static async getCategoryOnly(columnName = null, searchVal = null) {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "devRef_spSelect_CategoryOnly"
    );
  }

  // static async getCategoryItem(subCategoryId, hardwareOption, employeeNo) {
  //   const categoryItemParamList = [
  //     { name: "SubCategoryID", value: subCategoryId },
  //     { name: "HardwareOption", value: hardwareOption },
  //     { name: "EmployeeNo", value: employeeNo}
  //   ];
  //   return await DbControl.executeSP("devRef_spSelect_CategoryItem", categoryItemParamList);
  // }

  static async getCategoryItemForHardware(hardwareOption, employeeNo) {
    const categoryItemParamList = [
      { name: "HardwareOption", value: hardwareOption },
      { name: "EmployeeNo", value: employeeNo }
    ];
    return await DbControl.executeSP("devRef_spSelect_CategoryItemForHardware", categoryItemParamList);
  }

  static async getStatus(personnelId, assignedTo, userGroupId) {
    const statusParamList = [
      { name: "PersonnelID", value: personnelId },
      { name: "AssignedTo", value: assignedTo },
      { name: "UserGroupID", value: userGroupId }
    ];
    return await DbControl.executeSP("spSelect_Status", statusParamList);
  }

  static async getReferenceStatus() {
    return await DbControl.executeSP("spSelect_ReferenceStatus");
  }

  static async getNetwork(columnName = null, searchVal = "") {
    return await DbControl.getRecords(columnName, searchVal, "spSelect_Network");
  }

  static async getSystem(columnName = null, searchVal = "") {
    return await DbControl.getRecords(columnName, searchVal, "spSelect_System");
  }

  static async getSoftware(columnName = null, searchVal = "") {
    return await DbControl.getRecords(columnName, searchVal, "spSelect_Software");
  }

  static async getHardware(columnName = null, searchVal = "") {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "spSelect_Hardware"
    );
  }

  static async getMiscellaneous(columnName = null, searchVal = "") {
    return await DbControl.getRecords(columnName, searchVal, "spSelect_MiscItem");
  }

  static async getEmployee(columnName = null, searchVal = "") {
    return await DbControl.getRecords(columnName, searchVal, "spSelect_Employee");
  }

  static async getEmployeeWithWorkstation() {
    return await DbControl.executeSP("spSelect_EmployeeWithWorkstation");
  }

  static async getAssignedCategory(categoryId = null) {
    let html = "";
    const getAssignedCategories = await DbControl.getRecords("AssignedUserID", categoryId, "devRef_spSelect_ISSCategories");
    if (categoryId) {
      html += `<span class="mr-3">Job Categories</span>`;
      for (let category in getAssignedCategories[0]) {
        if (getAssignedCategories[0][category]) {
          html += `<div class="form-check form-check-inline">
          <input class="form-check-input category-item" checked name="assignedCategory[${category.split("Is").pop().toUpperCase()}]" type="checkbox"
            value="1">
          <label class="form-check-label" for="inlineCheckbox1">${category.split("Is").pop().toUpperCase()}</label>
        </div>`
        } else {
          html += `<div class="form-check form-check-inline">
            <input class="form-check-input category-item" name="assignedCategory[${category.split("Is").pop().toUpperCase()}]" type="checkbox"
              value="1">
            <label class="form-check-label" for="inlineCheckbox1">${category.split("Is").pop().toUpperCase()}</label>
          </div>`
        }
      }
      return html
    } else {
      for (let category in getAssignedCategories[0]) {
        html += `<div class="form-check form-check-inline">
          <input class="form-check-input category-item" name="assignedCategory[${category.split("Is").pop().toUpperCase()}]" type="checkbox"
            value="1">
          <label class="form-check-label" for="inlineCheckbox1">${category.split("Is").pop().toUpperCase()}</label>
        </div>`
      }
      return html;
    }
  }

  static async getAssignedCategoriesLink(x) {
    const getAssignedCategories = await DbControl.getRecords("AssignedUserID", x, "devRef_spSelect_ISSCategories");
    let html = "";
    for (let category in getAssignedCategories[0]) {
      let categoryItem = category.split("Is").pop().toLowerCase();
      if (getAssignedCategories[0][category]) {
        html += `<a class="collapse-item" href="/misc/${categoryItem}-list">${categoryItem}</a>`;
      }
    }
    return html;
  }

  static async getAttachedFile(job, jobNumber) {
    return await DbControl.getRecords(job, jobNumber, "devRef_spSelect_File");
  }

  static async getHardwareItem(columnName = null, searchVal = "") {
    return await DbControl.getRecords(columnName, searchVal, "devRef_spSelect_HardwareItem");
  }

  static async insertFile(
    jobRequestNo,
    jobOrderNo = null,
    origName,
    fileName,
    mimeType,
    filePath
  ) {
    const fileParamList = [
      { name: "JobRequest", value: jobRequestNo },
      { name: "JobOrder", value: jobOrderNo },
      { name: "OriginalName", value: origName },
      { name: "FileName", value: fileName },
      { name: "MimeType", value: mimeType },
      { name: "FilePath", value: filePath }
    ];
    await DbControl.executeSP("devRef_spInsert_File", fileParamList);
  }

  static async insertFiles(jobRequestNo, jobOrderNo, files = []) {
    await files.forEach(async function (element) {
      const fileParamList = [
        { name: "JobRequest", value: jobRequestNo },
        { name: "JobOrder", value: jobOrderNo },
        { name: "OriginalName", value: element.originalname },
        { name: "FileName", value: element.filename },
        { name: "MimeType", value: element.mimetype },
        { name: "FilePath", value: element.path }
      ]; 
      await DbControl.executeSP("spInsert_File", fileParamList);
    });
  }

  static async insertISSCategory(personnelId = null, assignedCategory) {
    const categoryParamList = [];
    for (let category in assignedCategory) {
      const categoryParams = { name: category, value: assignedCategory[category] };
      categoryParamList.push(categoryParams);
    }
    const personnelIdParam = { name: "AssignedUser", value: personnelId };
    categoryParamList.push(personnelIdParam);
    await DbControl.executeSP("devRef_spInsert_ISSCategories", categoryParamList);
  }

  static async sendEmail(toEmail = [], subject, htmlContent = "") {
    const emailTransporter = NodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "rsflores@saranganibay.com.ph",
        pass: "rsflores2019"
      }
    });
    const mailOptions = {
      from: "Job Order System", // sender address
      to: toEmail.join(), // list of receivers
      text: "Sample Text",
      subject: subject, // Subject line
      html: `<p><strong>Dear User,</strong></p>
              ${htmlContent}
             <br><br>Thank you.<br><strong>ISS Department</strong>
             <br>
             <h4 style="color: #6767FF">This is a system generated email. Please do not reply to this message.</h4>
             ` // plain text body
    };
    emailTransporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      //else console.log(emailTransporter);
    });
  }

  static validateString(string = "") {
    const trimmedString = string.trim();
    if (trimmedString) {
      return trimmedString;
    }
    return null;
  }

  static async insertNetwork(userId, networkId = null, name, description, remarks, status, subCategory) {
    const networkParamList = [
      { name: "UserID", value: userId },
      { name: "NetworkID", value: networkId },
      { name: "NetworkName", value: name },
      { name: "NetworkDescription", value: description },
      { name: "NetworkRemarks", value: remarks },
      { name: "NetworkStatus", value: status },
      { name: "NetworkSubCategory", value: subCategory }
    ];
    return await DbControl.executeSP("spInsert_Network", networkParamList);
  }

  static async deleteNetwork(userId, networkId) {
    const networkParamList = [
      { name: "UserID", value: userId },
      { name: "NetworkID", value: networkId }
    ];
    return await DbControl.executeSP("spDelete_Network", networkParamList);
  }

  static async insertSoftware(userId, softwareId, name, description, remarks, status, subCategory) {
    const softwareParamList = [
      { name: "UserID", value: userId },
      { name: "SoftwareID", value: softwareId },
      { name: "SoftwareName", value: name },
      { name: "SoftwareDescription", value: description },
      { name: "SoftwareRemarks", value: remarks },
      { name: "SoftwareStatus", value: status },
      { name: "SoftwareSubCategory", value: subCategory }
    ];
    return await DbControl.executeSP("spInsert_Software", softwareParamList);
  }

  static async deleteSoftware(userId, softwareId) {
    const softwareParamList = [
      { name: "UserID", value: userId },
      { name: "SoftwareID", value: softwareId }
    ];
    return await DbControl.executeSP("spDelete_Software", softwareParamList);
  }

  static async insertSystem(userId, systemId = null, name, desc, remarks, company, status, subCategory) {
    const systemParamList = [
      { name: "UserID", value: userId },
      { name: "SystemID", value: systemId },
      { name: "SystemName", value: name },
      { name: "SystemDescription", value: desc },
      { name: "SystemRemarks", value: remarks },
      { name: "SystemCompany", value: company },
      { name: "SystemStatus", value: status },
      { name: "SystemSubCategory", value: subCategory }
    ];
    return await DbControl.executeSP("spInsert_System", systemParamList);
  }

  static async deleteSystem(userId, systemId) {
    const systemParamList = [
      { name: "UserID", value: userId },
      { name: "SystemID", value: systemId }
    ];
    return await DbControl.executeSP("spDelete_System", systemParamList);
  }

  static async insertMiscellaneous(userId, miscItemId = null, name, description) {
    const miscItemParamList = [
      { name: "UserID", value: userId },
      { name: "ItemID", value: miscItemId },
      { name: "ItemName", value: name },
      { name: "ItemDescription", value: description }
    ];
    return await DbControl.executeSP("spInsert_MiscItems", miscItemParamList);
  }

  static async deleteMiscellaneous(userId, miscItemId) {
    const miscItemParamList = [
      { name: "UserID", value: userId },
      { name: "MiscItemID", value: miscItemId }
    ];
    return await DbControl.executeSP("spDelete_MiscItem", miscItemParamList);
  }

  static async getServerDefaults(statusName) {
    const serverDefaultParamList = [
      { name: "StatusName", value: statusName }
    ];
    return await DbControl.executeSP("spGet_ServerDefaults", serverDefaultParamList);
  }

  static async syncToRMS(syncItem) {
    const syncItemParamList = [
      { name: "SyncItem", value: syncItem }
    ];
    return await DbControl.executeSP("spSync_JOSWtoRMS", syncItemParamList);
  }

  static async syncToHIS(syncItem) {
    const syncItemParamList = [
      { name: "SyncItem", value: syncItem }
    ];
    return await DbControl.executeSP("spSync_JOSWtoHIS", syncItemParamList);
  }

  static async syncToHRIS(syncItem) {
    const syncItemParamList = [
      { name: "SyncItem", value: syncItem }
    ];
    return await DbControl.executeSP("spSync_JOSWtoHRIS", syncItemParamList);
  }
}; 