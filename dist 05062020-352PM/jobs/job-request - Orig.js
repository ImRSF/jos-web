"use strict";

var _misc = require("../misc.js");

var _tableJobRequest = require("./table-job-request.js");

var _tableEmployee = require("./table-employee.js"); // FIXME: Duplicate records for 'JR-20200427-010'


let jrTable = {};
let employeeTable = {};
let user;

const defaultFormValues = function defaultFormValues() {
  $("#inph-requestedByCompany").val(null);
  $("#inph-requestedByDepartment").val(null);
  $("#inph-requestedBySection").val(null);
  $("#inpd-dateApproved").val("");
  $("#img-viewEmployeeList").show();
  $("#img-viewApproverList").show();
  $("#inpt-requestedBy").val("");
  $("#txt-toBeApproved").val("To be Approved By");
  $("#inpt-requestedByWorkplace").val("");
  $("#inpt-subject").val("");
  $("#txt-description").val("");
  $(".attachedCategory").remove();
  $("#inpt-category").val("");
  $("#btn-addCategory").show();
  $("#inpf-jobRequest").show();
  $("#inpf-jobRequest").val("");
  getDefaultApprover();
};

const displayFormFields = function displayFormFields(state) {
  if (state === "edit") {
    $("#inpt-category").removeAttr("readonly");
    $("#inpt-subject").removeAttr("readonly");
    $("#txt-description").removeAttr("readonly");
    $("#inpt-contactNo").attr("readonly", "readonly");
    $("#img-viewEmployeeList").show();
    $("#inpf-jobRequest").show();
    $("#btn-submit-jobRequest").show();
    $("#btn-smallExit").show();
    $("#btn-approve-jobRequest").hide();
    $("#btn-cancel-jobRequest").hide();
  } else if (state === "view") {
    fieldsForViewing();
    $("#btn-approve-jobRequest").hide();
    $("#btn-cancel-jobRequest").hide();
    $("#btn-smallExit").hide();
  }
};

const getDefaultApprover = function getDefaultApprover() {
  if (user.UserGroupName === "User") {
    $.ajax({
      url: "/misc/user-list",
      method: "GET",
      data: {
        personnelID: user.PersonnelID,
        userGroup: "Approver"
      },
      success: function success(personnel) {
        $("#inpt-approvedBy").val(personnel.data[0].PersonnelName);
        $("#inph-approvedBy").val(personnel.data[0].PersonnelID);
      }
    });
  } else {
    $("#inpt-approvedBy").val(user.PersonnelLname + ", " + user.PersonnelFname);
    $("#inph-approvedBy").val(user.PersonnelID);
  }
};

const getFormValues = function getFormValues(jrNumber) {
  $.ajax({
    url: "/jobs/job-request",
    method: "GET",
    data: {
      requestNumber: jrNumber
    },
    success: function success(data) {
      const jobRequestDetails = data.jobRequestList[0]; // Hidden Inputs

      $("#inph-requestId").val(jobRequestDetails.RequestID);
      $("#inph-requestorId").val(jobRequestDetails.Requestor);
      $("#inph-requestedByCompany").val(jobRequestDetails.CompanyID);
      $("#inph-requestedByDepartment").val(jobRequestDetails.DepartmentID);
      $("#inph-requestedBySection").val(jobRequestDetails.SectionID);
      $("#inph-lastStatus").val((0, _misc.getUrlParameter)("statusID"));
      $("#inph-requestedBy").val(jobRequestDetails.RequestedBy); // Input Fields 

      $("#inpt-requestNumber").val(jobRequestDetails.RequestNumber);
      $('#inpt-contactNo').val(jobRequestDetails.ContactNo);
      viewAttachedJO(jobRequestDetails.JobNumber); //$("#inpt-joNumber").val(jobRequestDetails.JobNumber);

      $("#inpd-dateSent").val(jobRequestDetails.DateSent.slice(0, 10));
      $("#inpd-dateApproved").val(jobRequestDetails.DateApprovedOrCancelled.slice(0, 10));
      $("#t-statusName").text(jobRequestDetails.StatusName);

      if (jobRequestDetails.StatusName === "Submitted") {
        $("#t-statusName").text("Approved");
        $("#txt-toBeApproved").text("To be Approved By");
      } else {
        $("#txt-toBeApproved").text("Approved By");
        $("#t-statusName").text(jobRequestDetails.StatusName);
      }

      $('#inpt-statusName').val(jobRequestDetails.StatusName);
      (0, _misc.displayEmptyFieldIfDateIsNull)("inpd-dateApproved");
      $("#inpt-requestor").val(jobRequestDetails.RequestorName);
      $("#inpt-requestedBy").val("".concat(jobRequestDetails.RequestedByLastName, ", ").concat(jobRequestDetails.RequestedByFirstName));
      $("#inpt-requestedByWorkplace").val("".concat(jobRequestDetails.CompanyInitial, "-").concat(jobRequestDetails.DepartmentInitial, "--").concat(jobRequestDetails.SectionDescription));
      $("#inpt-subject").val(jobRequestDetails.RequestSubject);
      $("#txt-description").val(jobRequestDetails.RequestDescription);
      getAttachedFiles(data.attachedFile);
      $("#modal-job-request-form").modal("show");
    },
    error: function error(_error) {
      console.log("AJAX Error: " + _error);
    }
  });
};

const fieldsForViewing = function fieldsForViewing() {
  $("#inpt-category").attr("readonly", "readonly");
  $("#inpt-subject").attr("readonly", "readonly");
  $("#txt-description").attr("readonly", "readonly");
  $("#inpt-contactNo").attr("readonly", "readonly");
  $("#img-viewEmployeeList").hide();
  $("#img-viewApproverList").hide();
  $("#inpf-jobRequest").hide();
  $("#btn-submit-jobRequest").hide();
  $("#btn-bigExit").hide();
};

const getAttachedFiles = function getAttachedFiles() {
  let files = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  $(".jr-files").remove();

  if (files.length != 0) {
    files.forEach(function (element) {
      $("#jr-attachedFile").append("<a href =\"/".concat(element.FileName, "\" target=\"_blank\" class=\"badge badge-default jr-files ml-1\">").concat(element.OriginalName, "</a>")); // $("#jr-attachedFile").append(
      //   `<a href ="#" class="badge badge-default jr-files ml-1">${element.OriginalName}<i class="fas fa-times ml-2 sampleX"></i></a>`
      // );
    });
  }
};

const isLastJOReviewed = async function isLastJOReviewed(employeeNo) {
  const AJAX_REQ_GET_LAST_JO_REVIEWED = {
    method: "GET",
    url: "/jobs/get-lastJOReviewed",
    data: {
      employeeNo: employeeNo
    },
    success: function success(data) {
      if (data.length) {
        $(".close-jobReview").hide(); //$("#btn-jo-lookup").hide();

        $(".reviewedBy").hide();
        $("#addReview").removeClass("col-sm-6");
        $("#addReview").addClass("col-sm-12");
        $("#oneStar").addClass("oneStar twoStars threeStars fourStars fiveStars");
        $("#twoStars").addClass("oneStar twoStars threeStars fourStars fiveStars");
        $("#threeStars").addClass("oneStar twoStars threeStars fourStars fiveStars");
        $("#fourStars").addClass("oneStar twoStars threeStars fourStars fiveStars");
        $("#fiveStars").addClass("oneStar twoStars threeStars fourStars fiveStars");
        $("#lbl-date").text("Date Served");
        $("#btn-submit-jobReview").attr("type", "button");
        $("#inpd-dateReviewed").attr("type", "text");
        $("#inpd-dateReviewed").val(data[0].DateServed.substring(0, 10));
        $("#inpt-reviewedTo").val(data[0].AssignedToName);
        $("#inph-ratingValue").val(5);
        $("#inpt-jrNumberForReview").val(data[0].RequestNumber);
        $("#inpt-joNumberForReview").val(data[0].JobNumber);
        $("#modal-job-review-form").modal("show");
        $("#modal-confirmJobRequest").modal("hide");
      }
    }
  };
  return await (0, _misc.ajaxCaller)(AJAX_REQ_GET_LAST_JO_REVIEWED);
};

const addJobReview = function addJobReview(addReviewProps) {
  $.ajax({
    url: "/jobs/add-review",
    method: "POST",
    data: {
      reviewId: addReviewProps.id,
      reviewJOnum: addReviewProps.joNumber,
      reviewSubject: addReviewProps.subject,
      reviewDescription: addReviewProps.description,
      reviewReviewerId: addReviewProps.reviewerId,
      reviewRatingValue: addReviewProps.ratingValue
    },
    success: function success() {
      $("#modal-job-review-form").modal("hide");
    }
  });
  $("#modal-confirmJobRequest").modal("show");
};

const viewAttachedJO = function viewAttachedJO(joNumber) {
  if (joNumber) {
    $("#joNumber").show();
    $("#inpt-joNumber").val(joNumber);
  } else {
    $("#joNumber").hide();
  }
};

$(document).ready(function () {
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: function success(data) {
      user = data.data[0];
    }
  });
  jrTable = (0, _tableJobRequest.loadJRTable)(user, 0);
  $("#table-job-request tbody").on("click", "td.details-control", function () {
    var tr = $(this).closest("tr");
    var row = jrTable.row(tr);

    if (row.child.isShown()) {
      row.child.hide();
      tr.removeClass("shown");
    } else {
      row.child((0, _tableJobRequest.jrTableChild)(row.data())).show();
      tr.addClass("shown");
    }
  }); //isLastJOReviewed(user.EmployeeNo);
});
$(document).on("show.bs.modal", ".modal", function () {
  var zIndex = 1040 + 10 * $(".modal:visible").length;
  $(this).css("z-index", zIndex);
  $(this).css("overflow", "scroll");
  setTimeout(function () {
    $(".modal-backdrop").not(".modal-stack").css("z-index", zIndex - 1).addClass("modal-stack");
  }, 0);
});
$(document).on("click", ".viewForm", function () {
  let rowRequestNumber = jrTable.row($(this).closest("tr")).data().RequestNumber;
  $.ajax({
    url: "/jobs/job-request",
    method: "GET",
    data: {
      requestNumber: rowRequestNumber
    },
    success: function success(data) {
      const jobRequestDetails = data.jobRequestList[0];
      console.log(jobRequestDetails); // Hidden Inputs

      $("#inph-requestId").val(jobRequestDetails.RequestID);
      $("#inph-requestorId").val(jobRequestDetails.Requestor);
      $("#inph-requestedByCompany").val(jobRequestDetails.CompanyID);
      $("#inph-requestedByDepartment").val(jobRequestDetails.DepartmentID);
      $("#inph-requestedBySection").val(jobRequestDetails.SectionID);
      $("#inph-lastStatus").val((0, _misc.getUrlParameter)("statusID"));
      $("#inph-requestedBy").val(jobRequestDetails.RequestedBy); // Input Fields 

      $("#inpt-requestNumber").val(jobRequestDetails.RequestNumber);
      $('#inpt-contactNo').val(jobRequestDetails.ContactNo);
      viewAttachedJO(jobRequestDetails.JobNumber); //$("#inpt-joNumber").val(jobRequestDetails.JobNumber);

      $("#inpd-dateSent").val(jobRequestDetails.DateSent.slice(0, 10));
      $("#inpd-dateApproved").val(jobRequestDetails.DateApprovedOrCancelled.slice(0, 10));
      $("#t-statusName").text(jobRequestDetails.StatusName);

      if (jobRequestDetails.StatusName === "Submitted") {
        $("#t-statusName").text("Approved");
        $("#txt-toBeApproved").text("To be Approved By");
      } else if (jobRequestDetails.StatusName === "Cancelled") {
        $("#txt-toBeApproved").val("Cancelled By");
      } else {
        $("#t-statusName").text(jobRequestDetails.StatusName);
        $("#txt-toBeApproved").text("Approved By");
      }

      $("#inph-approvedBy").val(jobRequestDetails.ApprovedBy);
      $("#inpt-approvedBy").val(jobRequestDetails.ApprovedByName);
      $('#inpt-statusName').val(jobRequestDetails.StatusName);
      (0, _misc.displayEmptyFieldIfDateIsNull)("inpd-dateApproved");
      $("#inpt-requestor").val(jobRequestDetails.RequestorName);
      $("#inpt-requestedBy").val("".concat(jobRequestDetails.RequestedByLastName, ", ").concat(jobRequestDetails.RequestedByFirstName));
      $("#inpt-requestedByWorkplace").val("".concat(jobRequestDetails.CompanyInitial, "-").concat(jobRequestDetails.DepartmentInitial, "--").concat(jobRequestDetails.SectionDescription));
      $("#inpt-subject").val(jobRequestDetails.RequestSubject);
      $("#txt-description").val(jobRequestDetails.RequestDescription);
      getAttachedFiles(data.attachedFile);
      $("#modal-job-request-form").modal("show");
    },
    error: function error(_error2) {
      console.log("AJAX Error: " + _error2);
    }
  });
});
$(document).on("click", ".tbljR-deleteRow", function () {
  let rowId = jrTable.row($(this).closest("tr")).data().RequestID;
  const deleteModal = $("#modal-confirmDelete");
  $.ajax({
    url: "/jobs/delete/job-requests",
    method: "POST",
    data: {
      requestId: rowId
    },
    success: function success() {
      $("#inph-deleteJobRequest").val(rowId);
      deleteModal.modal("show");
    },
    error: function error(_error3) {
      console.log("AJAX Error: " + _error3);
    }
  });
});
$(document).on("click", ".tbljR-reportRow", function () {
  let rowRequestNumber = jrTable.row($(this).closest("tr")).data().RequestNumber;
  (0, _misc.viewJRDetailedReport)(rowRequestNumber);
});
$(document).on("click", ".tbljR-editRow", function () {
  displayFormFields("edit");
});
$(document).on("click", ".tbljR-viewRow", function () {
  displayFormFields("view");
  $("#btn-bigExit").show();
});
$(document).on("click", ".tbljR-approveRow", function () {
  fieldsForViewing();
  $("#txt-toBeApproved").val("To be Approved By");
  $("#btn-approve-jobRequest").show();
  $("#btn-cancel-jobRequest").hide();
});
$(document).on("click", ".tbljR-cancelRow", function () {
  fieldsForViewing();
  $("#txt-toBeApproved").text("To be Cancelled By");
  $("#t-statusName").text("Cancelled");
  $("#btn-approve-jobRequest").hide();
  $("#btn-cancel-jobRequest").show();
});
$(document).on("show.bs.modal", "#modal-employee-list", function () {
  employeeTable = (0, _tableEmployee.loadEmployeeTable)("SectionID", user.SectionID);
  employeeTable.columns([0, 4, 5]).visible(false);
  employeeTable.on("click", "tr", function () {
    const employeeData = employeeTable.row(this).data();
    console.log(employeeData);
    $("#inph-requestedByCompany").val(employeeData.CompanyID);
    $("#inph-requestedByDepartment").val(employeeData.DepartmentID);
    $("#inph-requestedBySection").val(employeeData.SectionID);
    $("#inpt-requestedBy").val(employeeData.EmployeeName);
    $("#inph-requestedBy").val(employeeData.EmployeeNo);
    $("#inph-requestedByEmail").val(employeeData.CompanyEmail);
    $("#inpt-contactNo").val((0, _misc.removeSpecialCharacters)(employeeData.ContactNo));
    $("#inpt-requestedByWorkplace").val("".concat(employeeData.CompanyInitial, "-").concat(employeeData.DepartmentInitial, "--").concat(employeeData.SectionDescription));
    $("#modal-employee-list").modal("hide");
  });
});
$(".viewPersonnelList").on("click", function () {
  $("#personnelList").val("Approver");
  $("#modal-user-list").modal("show");
});
$(document).on("change", "#inpf-jobRequest", function () {
  (0, _misc.validateFile)("inpf-jobRequest", ["jpeg", "jpg", "png", "pptx", "xlsx", "pdf", "docx", "doc", "rpt"]);
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

  $("#btn-confirm-".concat(buttonText)).removeAttr("hidden");
  isLastJOReviewed($("#inph-requestedBy").val());
  $("#modal-confirmJobRequest").modal("show");
}); // $("#frm-jobRequest").parsley({
//   errorsContainer: function (pEle) {
//     // var x = pEle.$element.parent().closest(".test");
//     var x = $("#inpt-requestedBy").closest(".do-validation").next()
//     console.log(x)
//     return x;
//   }
// });

$(".confirmAction").on("click", function (e) {
  $(".withConfirmation").unbind("click");
  $("#modal-confirmJobRequest").modal("hide");
  (0, _misc.validateFieldByInputLength)("inpt-subject", 50, "This field can only support 50 characters and below.");
  (0, _misc.validateFieldByInputLength)("txt-description", 435, "This field can only support 435 characters and below."); //validateCategory();

  if ($(".validation-error").length != 0) {
    alert("There are fields that failed the validation rules. Please check the fields marked in red.");
    return;
  } else {
    const buttonText = $(this).data("confirm-button");
    $("#btn-".concat(buttonText, "-jobRequest")).click();
  } // const buttonText = $(this).data("confirm-button");
  // $(`#btn-${buttonText}-jobRequest`).click();

});
$("#btn-addJobRequest").on("click", function () {
  defaultFormValues();

  if (user.UserGroupName === "Approver") {
    $("#btn-submit-jobRequest").hide();
    $("#btn-approve-jobRequest").show();
    $("#inph-lastStatus").val(6);
    $("#img-viewEmployeeList").hide();
    $("#img-viewApproverList").hide();
  } else {
    $("#btn-submit-jobRequest").show();
    $("#btn-approve-jobRequest").hide();
    $("#inph-lastStatus").val(1);
    $("#img-viewEmployeeList").show();
    $("#img-viewApproverList").show();
  }

  viewAttachedJO("");
  $("#inph-requestorId").val(user.PersonnelID);
  $("#inph-requestedByCompany").val(user.CompanyID);
  $("#inph-requestedByDepartment").val(user.DepartmentID);
  $("#inph-requestedBySection").val(user.SectionId);
  $("#inpt-requestor").val(user.PersonnelLname + ", " + user.PersonnelFname);
  $("#inpt-requestedBy").val(user.PersonnelLname + ", " + user.PersonnelFname);
  $("#inph-requestedBy").val(user.EmployeeNo);
  $("#inpt-requestedByWorkplace").val("".concat(user.CompanyInitial, "-").concat(user.DepartmentInitial, "--").concat(user.SectionDescription));
  $("#inpt-contactNo").val((0, _misc.removeSpecialCharacters)(user.ContactNo));
  $("#inpt-statusName").val("");
  $("#t-statusName").text("Approved");
  $("#inpt-category").removeAttr("readonly");
  $("#inpt-subject").removeAttr("readonly");
  $("#txt-description").removeAttr("readonly");
  $("#btn-smallExit").show();
  $("#btn-bigExit").hide();
  $("#btn-cancel-jobRequest").hide(); //$(".dateApproved").hide();

  getAttachedFiles([]);
  $("#f-jobRequest").show();
  $.ajax({
    url: "/jobs/get-requestNumber",
    method: "GET",
    success: function success(data) {
      let reqNumber = data[0].JobRequestNumber;
      $("#inpt-requestNumber").val(reqNumber);
      $("#inpt-category").val("");
      $("#inpt-subject").val("");
      $("#txt-description").val("");
      $("#inph-requestId").attr("disabled", "disabled");
      $("#btn-deleteJobRequest").hide();
      $("#btn-cancel-jobRequest").hide();
      $("#modal-job-request-form").modal("show");
    }
  });
  $.ajax({
    url: "/misc/getCurrentDate",
    method: "GET",
    success: function success(currentDate) {
      $("#inpd-dateSent").val(currentDate);

      if (user.UserGroupName === "Approver") {
        $("#inpd-dateApproved").val(currentDate);
      }
    }
  }); //displayEmptyFieldIfDateIsNull("inpd-dateApproved");
});
$("#img-viewJODetailedReport").on("click", function () {
  (0, _misc.viewJODetailedReport)($("#inpt-joNumber").val());
});
$("#img-viewEmployeeList").on("click", function () {
  $("#modal-employee-list").modal("show");
});
$("#inpt-subject").on("input", function () {
  const charLimit = 50;
  $("#text-counter").remove();

  if ($(this).val().length >= charLimit) {
    $("<sub id=\"text-counter\" class=\"text-danger validation-error\">This field can only accept 50 characters or less</sub>").insertAfter($(this));
    $(this).val($(this).val().slice(0, charLimit));
  } else {
    $("<sub id=\"text-counter\" class=\"text-success\">You only have ".concat($(this).val().length, "/").concat(charLimit, " characters left.</sub>")).insertAfter($(this));
  }
});
$("#txt-description").on("input", function () {
  const charLimit = 430;
  $("#text-counter").remove();

  if ($(this).val().length >= charLimit) {
    $("<sub id=\"text-counter\" class=\"text-danger validation-error\">This field can only accept 430 characters or less</sub>").insertAfter($(this));
    $(this).val($(this).val().slice(0, charLimit));
  } else {
    $("<sub id=\"text-counter\" class=\"text-success\">You only have ".concat($(this).val().length, "/").concat(charLimit, " characters left.</sub>")).insertAfter($(this));
  }
});
$("#btn-submit-jobReview").on("click", function () {
  if ($(this).attr("type") === "button") {
    const reviewProps = {
      id: $("#inph-reviewId").val(),
      joNumber: $("#inpt-joNumberForReview").val(),
      subject: $("#inpt-reviewSubject").val(),
      description: $("#txt-reviewDescription").text(),
      reviewerId: $("#inph-reviewerId").val(),
      ratingValue: $("#inph-ratingValue").val()
    };
    addJobReview(reviewProps);
  }
});