const crypto = require("crypto");

module.exports = class Globals {
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

  static generateFileName() {
    return this.getCurrentDate() + "-" + crypto.randomBytes(4).toString("hex");
  }

  static removeDuplicateObjectsInAnArray(array, objectPropertyName) {
    const filteredArray = array
      .map(e => e[objectPropertyName])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => array[e])
      .map(e => array[e]);

    return filteredArray;
  }

  static getSupportedFileTypes() {
    return [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/x-rpt"
    ]
  }
};
