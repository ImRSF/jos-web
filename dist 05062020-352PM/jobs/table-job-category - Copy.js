"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadJobCategory = loadJobCategory;

function loadJobCategory(subCategoryId) {
  let hardwareOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  let employeeNo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  if (hardwareOption !== "") {
    return $("#table-job-category").DataTable({
      retrieve: true,
      destroy: true,
      columnDefs: [{
        "targets": [0],
        "visible": false
      }],
      ajax: {
        url: "/misc/categoryItemForHardware",
        method: "GET",
        data: {
          hardwareOption: hardwareOption,
          employeeNo: employeeNo
        },
        dataSrc: "data"
      },
      columns: [{
        data: "CategoryID"
      }, {
        data: "CategoryName"
      }, {
        data: "CategoryDescription"
      }]
    });
  } else {
    return $("#table-job-category").DataTable({
      retrieve: true,
      destroy: true,
      columnDefs: [{
        "targets": [0],
        "visible": false
      }],
      ajax: {
        url: "/misc/categoryItem",
        method: "GET",
        data: {
          subCategoryID: subCategoryId
        },
        dataSrc: "data"
      },
      columns: [{
        data: "CategoryID"
      }, {
        data: "CategoryItemName"
      }, {
        data: "CategoryItemDescription"
      }]
    });
  }
}