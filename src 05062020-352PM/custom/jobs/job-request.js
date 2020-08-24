// First Refactor (04/28/2020 - 9:00 ~ 10:36 PM) = [592 -> 557]
// Second Refactor (04/29/2020 - 9:30 ~ 11:45 PM) = [557 -> 449]

import {
  getUrlParameter,
  validateFieldByInputLength,
  displayEmptyFieldIfDateIsNull,
  viewJRDetailedReport,
  viewJODetailedReport,
  removeSpecialCharacters,
  getElementIds,
  bindDataToForm,
  setDefaultDate
} from "../misc.js";
import { Validate, validateFormElements, isFormValid } from "../validation.js";
import { loadJRTable } from "./table-job-request.js";
import { loadEmployeeTable } from "./table-employee.js";
import { isLastJOReviewed } from "./job-review.js";

// FIXME: Duplicate records for 'JR-20200427-010'

let jrTable = {};
let employeeTable = {};
let user;

const getFormValues = (jrNumber) => {
  $.ajax({
    url: "/jobs/job-request",
    method: "GET",
    data: { requestNumber: jrNumber },
    success: data => {
      const jobRequestDetails = data.jobRequestList[0];
      bindDataToForm(getElementIds("get-jobRequest-details"), jobRequestDetails);
      bindDataToForm(getElementIds("get-jobRequest-date"), jobRequestDetails, (date) => date.slice(0, 10));
      displayEmptyFieldIfDateIsNull("DateApprovedOrCancelled");
      $("#inph-lastStatus").val(getUrlParameter("statusID"));
      viewAttachedJO(jobRequestDetails.JobNumber);
      getAttachedFiles(data.attachedFile);
      $("#modal-job-request-form").modal("show");
    },
    error: error => {
      console.log("AJAX Error: " + error);
    }
  });
};

const setDefaultFormElements = (userGroupName) => {
  const userGroup = userGroupName.toLowerCase();
  $(`.default-${userGroup}-show`).show();
  $(`.default-${userGroup}-hide`).hide();
  $(`.default-${userGroup}-readonly`).attr("readonly", "readonly");
  // $(`.default-${userGroup}-readonly`).removeAttr("readonly");
  getDefaultApprover(userGroupName);
};

const setFormElementsByMode = (mode) => {
  $(`.${mode}-show`).show();
  $(`.${mode}-hide`).hide();
  $(`.${mode}-readonly`).attr("readonly", "readonly");
};

const getDefaultApprover = (userGroupName) => {
  if (userGroupName === "User") {
    $.ajax({
      url: "/misc/user-list",
      method: "GET",
      data: { personnelID: user.PersonnelID, userGroup: "Approver" },
      success: function (personnel) {
        const approverData = personnel.data[0];
        $("#RequestedByName").val("");
        $("#ApprovedByName").val(approverData.PersonnelName);
        $("#ApprovedBy").val(approverData.PersonnelID);
      }
    })
  } else {
    $("#RequestedBy").val(user.EmployeeNo);
    $("#RequestedByName").val(user.PersonnelName);
    $("#ApprovedByName").val(user.PersonnelName);
    $("#ApprovedBy").val(user.PersonnelID);
  }
};

const getAttachedFiles = (files = []) => {
  $(".jr-files").remove();
  if (files.length != 0) {
    files.forEach(element => {
      $("#jr-attachedFile").append(
        `<a href ="/${element.FileName}" target="_blank" class="badge badge-default jr-files ml-1">${element.OriginalName}</a>`
      );
    });
  }
};

const viewAttachedJO = (joNumber) => {
  if (joNumber) {
    $("#JobNumber").show();
  } else {
    $("#JobNumber").hide();
    $("#img-viewJODetailedReport").hide();
  }
};

const validateJobRequest = () => {
  const validationRules = [
    {
      id: "RequestedByName",
      rules: function () {
        const validate = new Validate($("#RequestedByName").val());
        return validate.isRequired().validationResult;
      }
    },
    {
      id: "ContactNo",
      rules: function () {
        const validate = new Validate($("#ContactNo").val());
        return validate.isContactNo().validationResult;
      }
    },
    {
      id: "RequestSubject",
      rules: function () {
        const validate = new Validate($("#RequestSubject").val());
        return validate.isRequired().isMaxLengthOf(50).validationResult;
      }
    },
    {
      id: "RequestDescription",
      rules: function () {
        const validate = new Validate($("#RequestDescription").val());
        return validate.isRequired().isMaxLengthOf(435).validationResult;
      }
    },
    {
      id: "inpf-jobRequest",
      rules: function () {
        const fileUploader = $("#inpf-jobRequest");
        const validate = new Validate(null, [...fileUploader[0].files]);
        return validate.isFileExtAccepted(fileUploader).isFileSizeAccepted(fileUploader).isMaxLengthOf(5, fileUploader).validationResult;
      }
    }
  ]
  if (isFormValid(validateFormElements(validationRules), () => {
    alert("There are fields that failed the validation rules. Please check the fields marked in red.");
  })) {
    return true;
  } else {
    return false;
  }
};

$(document).ready(function () {
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: data => {
      user = data.data[0];
    }
  });
  jrTable = loadJRTable(user, 0);
});

$(document).on("click", ".tbljR-reportRow", function () {
  let rowRequestNumber = jrTable.row($(this).closest("tr")).data()
    .RequestNumber;
  viewJRDetailedReport(rowRequestNumber);
});

$(document).on("click", ".tbljR-viewRow", function () {
  const selectedRow = jrTable.row($(this).closest("tr")).data();
  getFormValues(selectedRow.RequestNumber);
  setFormElementsByMode('view');
  $("#t-statusName").text(`${(selectedRow.StatusName === "Submitted") ? "Approved" : selectedRow.StatusName}`);
  $("#txt-toBeApproved").text(`${(selectedRow.StatusName === "Submitted") ? "To be Approved" : selectedRow.StatusName} By`);
});

$(document).on("click", ".tbljR-approveRow", function () {
  const selectedRow = jrTable.row($(this).closest("tr")).data();
  getFormValues(selectedRow.RequestNumber);
  setFormElementsByMode('approved');
  $("#t-statusName").text("Approved");
  $("#txt-toBeApproved").text("To be Cancelled By");
});

$(document).on("click", ".tbljR-cancelRow", function () {
  const selectedRow = jrTable.row($(this).closest("tr")).data();
  getFormValues(selectedRow.RequestNumber);
  setFormElementsByMode('cancelled');
  $("#t-statusName").text("Cancelled");
  $("#txt-toBeApproved").text("To be Cancelled By");
});

$(document).on("show.bs.modal", "#modal-employee-list", function () {
  employeeTable = loadEmployeeTable("DepartmentID", user.DepartmentID);
  employeeTable.columns([0, 4, 5]).visible(false);
  employeeTable.on("click", "tr", function () {
    const employeeData = employeeTable.row(this).data();
    $("#RequestedByName").val(employeeData.EmployeeName);
    $("#RequestedBy").val(employeeData.EmployeeNo);
    $("#ContactNo").val(removeSpecialCharacters(employeeData.ContactNo));
    $("#modal-employee-list").modal("hide");
  });
});

$(document).on("change", "#inpf-jobRequest", function () {
  const validationRules = [
    {
      id: "inpf-jobRequest",
      rules: function () {
        const fileUploader = $("#inpf-jobRequest");
        const validate = new Validate(null, [...fileUploader[0].files]);
        return validate.isFileExtAccepted(fileUploader).isFileSizeAccepted(fileUploader).isMaxLengthOf(5, fileUploader).validationResult;
      }
    }
  ];
  const validationErrors = validateFormElements(validationRules);
  isFormValid(validationErrors, () => {
    $("#inpf-jobRequest-error").val(validationErrors[0]);
  })
});

$(".viewPersonnelList").on("click", function () {
  $("#personnelList").val("Approver");
  $("#modal-user-list").modal("show");
});

$(".withConfirmation").on("click", function (e) {
  e.preventDefault();
  const buttonText = $(this).data("confirm-action");
  if (buttonText === "cancel") {
    $("#btn-confirm-approve").hide();
    $("#btn-confirm-cancel").show();
  } else if (buttonText === "approve") {
    $("#btn-confirm-approve").show();
    $("#btn-confirm-cancel").hide();
  }
  $(`#btn-confirm-${buttonText}`).removeAttr("hidden");
  
  if (validateJobRequest()) {
    isLastJOReviewed($("#RequestedBy").val()).then(isReviewed => {
      if (!isReviewed) {
        $("#modal-confirmJobRequest").modal("show");
      }
    })
  }
  
});

$(".confirmAction").on("click", function (e) {
  $(".withConfirmation").unbind("click");
  $("#modal-confirmJobRequest").modal("hide");
  const buttonText = $(this).data("confirm-button");
  $(`#btn-${buttonText}-jobRequest`).click();
});

$("#btn-addJobRequest").on("click", function () {
  $.ajax({
    url: "/jobs/get-requestNumber",
    method: "GET",
    success: function (data) {
      let requestNumber = data[0].JobRequestNumber;
      const defaultData = {
        RequestNumber: requestNumber,
        RequestedBy: "",
        ContactNo: ""
      };
      bindDataToForm(getElementIds("get-jobRequest-details"), defaultData);
      viewAttachedJO(null);
      setDefaultFormElements(user.UserGroupName);
      getAttachedFiles([]);
      $("#ContactNo").removeAttr("readonly");
      $("#RequestSubject").removeAttr("readonly");
      $("#RequestDescription").removeAttr("readonly");
      $("#f-jobRequest").show();
    }
  });
  $.ajax({
    url: "/misc/getCurrentDate",
    method: "GET",
    success: function (currentDate) {
      $("#DateSent").val(currentDate);
      if (user.UserGroupName === "Approver") {
        $("#DateApproved").val(currentDate);
      }
    }
  });
  $("#modal-job-request-form").modal("show");
});

$("#img-viewJODetailedReport").on("click", function () {
  viewJODetailedReport($("#JobNumber").val());
});

$("#img-viewEmployeeList").on("click", function () {
  $("#modal-employee-list").modal("show");
});

