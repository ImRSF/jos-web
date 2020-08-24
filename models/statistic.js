const DbControl = require("./dbControl");

module.exports = class Statistic {
  constructor(filters) {
    this.filters = filters;
  }

  async generateJOSummary() {
    return await DbControl.executeSP("spReport_JobOrderSummary", this.filters);
  }

  async generateJRSummary() {
    return await DbControl.executeSP("spReport_JobRequestSummary", this.filters);
  }

  async generateJISummary() {
    return await DbControl.executeSP("spReport_JobItemSummary", this.filters);
  }

  async generateJRByCategory() {
    return await DbControl.executeSP("devRef_spReport_JobRequestByCategory", this.filters);
  }

  async generateJOByCategory() {
    return await DbControl.executeSP("spReport_JobOrderByCategory", this.filters);
  }

  async generateJOByWorkStation() {
    return await DbControl.executeSP("devRef_spReport_JobOrderByWorkStation", this.filters);
  }

  async generateJOByHardwareItem() {
    return await DbControl.executeSP("devRef_spReport_JobOrderByHardwareItem", this.filters);
  }

  static async getJobCardValues(personnelID, requestedYear) {
    let cardParamsList = [
      { name: "PersonnelID", value: personnelID },
      { name: "RequestedYear", value: requestedYear }
    ];
    return await DbControl.executeSP("spSelect_JobOverview", cardParamsList);
  }

  static async generateJRStatistic(personnelID, requestedYear) {
    let jrStatisticParamList = [
      { name: "PersonnelID", value: personnelID },
      { name: "RequestedYear", value: requestedYear }
    ];
    return await DbControl.executeSP("spSelect_JRStatistic", jrStatisticParamList);
  } 

  static async generateJOStatistic(personnelID, requestedYear) {
    let joStatisticParamList = [
      { name: "PersonnelID", value: personnelID },
      { name: "RequestedYear", value: requestedYear }
    ];
    return await DbControl.executeSP("spSelect_JOStatistic", joStatisticParamList);
  };

  static async generateReviewStatistic(personnelID, requestedYear) {
    let reviewStatisticParamList = [
      { name: "PersonnelID", value: personnelID },
      { name: "RequestedYear", value: requestedYear }
    ];
    return await DbControl.executeSP("spSelect_ReviewStatistic", reviewStatisticParamList);
  }
};   