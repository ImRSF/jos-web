const DbControl = require("./dbControl");
const User = require("./user");
const Global = require("../util/globals");
const Misc = require("./misc");

module.exports = class JobReview {
  constructor(id = null, joNum, subj, desc, reviewerId, ratingValue) {
    this.reviewId = id;
    this.reviewJobOrder = joNum;
    this.reviewSubject = subj;
    this.reviewDescription = desc;
    this.reviewReviewerId = reviewerId;
    this.reviewRating = ratingValue;
  }

  async insertJobReview() {
    const jobReviewParamList = [
      { name: "ReviewID", value: this.reviewId },
      { name: "JobOrder", value: this.reviewJobOrder },
      { name: "ReviewSubject", value: this.reviewSubject},
      { name: "ReviewDescription", value: this.reviewDescription },
      { name: "ReviewValue", value: this.reviewRating },
      { name: "ReviewerID", value: this.reviewReviewerId }
      // { name: "ReviewDate", value: Global.getCurrentDate() }
    ];
    await DbControl.executeSP(
      "spInsert_JobReview",
      jobReviewParamList
    ); 
  }

  static async getReviews(columnName = null, searchVal = "") {
    return await DbControl.getRecords(
      columnName,
      searchVal,
      "spSelect_JobReview"
    ); 
  }

  static async getReviewByUser(personnelID) {
    const jobReviewParamList = [
      { name: "PersonnelID", value: personnelID }
    ];
    return await DbControl.executeSP( 
      "spSelect_JobReviewsByUser",
      jobReviewParamList
    ); 
  }
 
  static async getJobOrderForReview(personnelID) {
    const jobReviewParamList = [
      { name: "PersonnelID", value: personnelID }
    ];
    return await DbControl.executeSP(
      "spSelect_JobOrdersForReview",
      jobReviewParamList
    ); 
  }

  static async getLastJOReviewed(requestedBy) {  
    const lastJOParamList = [
      {name: "RequestedBy", value: requestedBy}
    ]
    return await DbControl.executeSP(
      "spGet_JobOrderForReview", 
      lastJOParamList
    );
  }
};
