import {
  getJOStatus,
  getJOPriority,
  validateFieldByInputLength,
  validateFile,
  validateForm,
  getCategory,
  viewJRDetailedReport,
  viewJODetailedReport,
  getUrlParameter,
  attachCategory, ajaxCaller
} from "../misc.js";
import { loadJOTable, joTableChild } from "./table-job-order.js";
import { loadJITable } from "./table-job-item.js";
import { loadJobCategory } from "./table-job-category.js";
import { approvedJobRequests, approvedJobRequestsChild } from "./table-approvedJobRequests.js";

let joTable = {};
let categoryTable = {};
let joItemsTable = {};
let approvedJobRequestsTable = {};
let user;

export const removedJobItems = [];

// FIXME: SQA can edit returned JOs

// $("#frm-jobOrder").parsley({
//   successClass: 'has-success',
//   errorClass: 'is-invalid',
//   errorContainer: function(el) {
//     return el.$element.closest(".form-group");
//   },
//   classHandler: function(e) {
//     return e.$element.$(this);
//   },
//   errorsWrapper: '<ul class="parsley-errors-list"></ul>',
//   errorTemplate: '<li>This field is required.</li>', 
// });   

// Events
$(document).ready(function () {
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: data => {
      user = data.data[0];
      console.log(user)
    }
  });
    if (getUrlParameter("statusID")) {
    $.ajax({
      url: "/misc/user",
      method: "GET",
      async: false,
      success: data => {
        user = data.data[0];
      }
    });
    const statusID = parseInt(getUrlParameter("statusID"));
    const disableSort = getUrlParameter("disableSort");
    joTable = loadJOTable(user, statusID, disableSort);
  } else {
    joTable = loadJOTable(user, 0);
  }

  // Random value kay dili maka dugang ug Job Item kung dili ni maload
  // Load empty table
  joItemsTable = loadJITable();
  $("#table-job-order tbody").on("click", "td.details-control", function () {
    var tr = $(this).closest("tr");
    var row = joTable.row(tr);
    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass("shown");
    } else {
      // Open this row
      row.child(joTableChild(row.data())).show();
      tr.addClass("shown");
    }
  });
});

$("#btn-addJobOrder").on("click", function () {
  $("#btn-getJobRequest").show();
  $("#inph-joId").val(null)
  $("#jobItems").show();
  $.ajax({
    url: "/jobs/job-order/" + "Add/" + 0,
    method: "GET",
    success(data) {
      $("#inpt-joNumber").val(data.jobOrderNumber[0].JobOrderNumber);
      defaultValues(data.formDetails);
    }
  });
  $.ajax({
    url: "/misc/getCurrentDate",
    method: "GET",
    success: function (currentDate) {
      $("#inpd-dateRequested").val(currentDate);
      $("#inpd-deadline").val(currentDate);
      $("#inpd-dateServed").val(currentDate);
    }
  });
  //getJOStatus([], 5);
  $("#modal-job-order-form").modal("show");
});

$("#btn-attachJR").on("click", function () {
  approvedJobRequestsTable.clear().draw();
  approvedJobRequestsTable.destroy();
  const getJobRequest = approvedJobRequestsTable.row({ selected: true }).data()
  console.log(getJobRequest)
  if (getJobRequest) {
    $("#inpt-jrNumber").val(getJobRequest.RequestNumber);
    $.ajax({
      url: "/jobs/job-request",
      method: "GET",
      data: { requestNumber: getJobRequest.RequestNumber },
      success: function (data) {
        // Validation
        const getJODetails = data.jobRequestList[0];
        console.log(getJODetails)
        $("#btn-getRequestedBy").hide();
        // $("#inph-categoryId").val(data.jobRequestList[0].CategoryID);
        // $("#inph-subCategoryName").val(data.jobRequestList[0].SubCategoryName);
        // $("#inph-subCategoryId").val(data.jobRequestList[0].SubCategoryID);
        $("#inpd-dateRequested").attr("readonly", "readonly");
        $("#RequestedByName").val(getJODetails.RequestedByName);
        $("#inpt-requestedBy").val(getJODetails.RequestedByName + "--" + getJODetails.RequestedByPosition);
        $("#inph-requestedBy").val(getJODetails.RequestedBy);
        $("#inph-company").val(getJODetails.CompanyID);
        $("#inph-department").val(getJODetails.DepartmentID);
        $("#inph-section").val(getJODetails.SectionID);
        $("#inph-jrNumber").val(getJODetails.RequestNumber);
        $("#inpt-company").val(getJODetails.CompanyInitial);
        $("#inpt-department").val(getJODetails.DepartmentName);
        $("#inpt-section").val(getJODetails.SectionDescription);
        $("#inpt-requestor").val(getJODetails.RequestorName);
        $("#inph-requestor").val(getJODetails.Requestor);

        // NOTICE: Hide File Upload
        $("#f-jobOrder").empty();
        $("#inp-dateRequested").attr("type", "text");
        $("#inpd-dateRequested").val(
          getJODetails.DateApprovedOrCancelled.substring(0, 10)
        );
        $("#txt-details").val(getJODetails.RequestDescription);
        getAttachedFilesForJO(data.attachedFile);
        $("#modal-approved-job-requests").modal("hide");
      }
    });
  } else {
    alert("Please select a Job Request.")
    return;
  }
})

$(document).on("click", ".tbljO-reportRow", function () {
  let rowJoNum = joTable.row($(this).closest("tr")).data()
    .JobNumber;
  viewJODetailedReport(rowJoNum);
});

$(document).on("click", ".tbljO-viewRow", function () {
  let rowJoNum = joTable.row($(this).closest("tr")).data()
    .JobNumber;
  $.ajax({
    url: "/jobs/job-order/" + "View/" + rowJoNum,
    method: "GET",
    success(response) {
      const joDetails = response.jobOrder.details[0]
      viewFormDetails(response);
      $("#inpt-jrNumber").val(joDetails.RequestNumber);
      $("#btn-getJobRequest").hide();
      $("#sel-joStatus option:selected").text(joDetails.StatusName);
      jobItemActionsByUserGroup(joDetails.AssignedTo, "read");
      $(".viewPersonnelList").hide();
      $("#f-jobOrder").hide();
      $("#sel-joPriority").attr("disabled", "disabled");
      $("#inpt-requestedBy").attr("readonly", "readonly");
      $("#inpt-assignedTo").attr("readonly", "readonly");
      $("#inpt-reviewedBy").attr("readonly", "readonly");
      $("#sel-joStatus").attr("disabled", "disabled");
      $("#sel-company").attr("disabled", "disabled");
      $("#sel-department").attr("disabled", "disabled");
      $("#sel-section").attr("disabled", "disabled");
      $("#inpd-dateRequested").attr("readonly", "readonly");
      $("#inpd-deadline").attr("readonly", "readonly");
      $("#inpd-dateServed").attr("readonly", "readonly");
      $("#txt-actions").attr("readonly", "readonly");
      $("#txt-details").attr("readonly", "readonly");
      $("#txt-remarks").attr("readonly", "readonly");
      $("#btn-joAddCategory").hide();
      // $("#btn-submit-addJobItems").hide();
      // $("#btn-submit-clearJobItems").hide();
      $("#smallButtons").hide();
      $("#bigButton").show();
      // if (response.jobOrder.details[0].StatusName === "Served") {
      //   $(".dateServed").show();
      // } else {
      //   $(".dateServed").hide();
      // }
      //joItemsTable.column(4).visible(false);
    }

  });
  $("#modal-job-order-form").modal("show");
});

$(document).on("click", ".tbljO-editRow", function () {
  let rowJoNum = joTable.row($(this).closest("tr")).data()
    .JobNumber;
  const authenticateByUser = (userGroup, data) => {
    const joDetails = data.jobOrder.details[0]
    $("#smallButtons").show();
    $("#bigButton").hide();
    $("#inpt-jrNumber").val(joDetails.RequestNumber);
    $("#inph-joStatus").val($("#sel-joStatus").val());
    jobItemActionsByUserGroup(joDetails.AssignedTo, "write");
    getJOStatusPerUser(joDetails.AssignedTo);
    switch (userGroup) {
      case "ISS":
        $("select[id='sel-joStatus'] option[value='" + 1 + "']").attr(
          "selected",
          "selected"
        );
        setDateServed(1);
        $("#btn-submit-jobOrder").text("Submit Job Order");
        $("#btn-getJobRequest").hide();
        //if (data.jobOrder.details[0].StatusName === "Returned") $("#inph-joStatus").val(1);
        $("#inph-joStatus").val(1);
        $(".viewPersonnelList").hide();
        $("#f-jobOrder").empty();
        $("#sel-joStatus").removeAttr("disabled");
        $("#txt-actions").removeAttr("readonly");
        $("#sel-joPriority").attr("disabled", "disabled");
        $("#inpd-dateRequested").attr("readonly", "readonly");
        $("#inpd-deadline").attr("readonly", "readonly");
        // $("#inpd-dateServed").attr("readonly", "readonly");
        $("#txt-details").attr("readonly", "readonly");
        $("#txt-remarks").attr("readonly", "readonly");
        $("#btn-joAddCategory").hide();
        break;

      case "SQA":
        $("select[id='sel-joStatus'] option[value='" + 3 + "']").attr(
          "selected",
          "selected"
        );
        setDateServed(3);
        $("#btn-submit-jobOrder").text("Verify Job Order");
        $("#btn-getJobRequest").hide();
        $(".viewPersonnelList").hide();
        $("#f-jobOrder").empty();
        $("#sel-joStatus").removeAttr("disabled");
        $("#txt-actions").removeAttr("readonly");
        $("#txt-remarks").removeAttr("readonly");
        $("#sel-joPriority").attr("disabled", "disabled");
        $("#inph-joStatus").val(3);
        $("#inpd-dateRequested").attr("readonly", "readonly");
        $("#inpd-deadline").attr("readonly", "readonly");
        $("#inpd-dateServed").attr("readonly", "readonly");
        $("#txt-details").attr("readonly", "readonly");
        $("#btn-joAddCategory").hide();
        if (joDetails.AssignedTo !== user.PersonnelID) {
          $('#txt-actions').attr("readonly", "readonly");
        } else {
          $('#txt-actions').removeAttr("readonly");
        }
        // NOTICE: Guide For Job Review
        break;

      default:
        $("#btn-submit-jobOrder").text("Submit Job Order");
        $("#inph-joStatus").val(joDetails.StatusID);
        $("select[id='sel-joStatus'] option[value='" + 5 + "']").attr(
          "selected",
          "selected"
        );
        if (joDetails.StatusName !== "Pending") $("#btn-getJobRequest").hide();
        $("#sel-joPriority").removeAttr("disabled");
        $(".viewPersonnelList").show();
        $("#sel-joStatus").removeAttr("disabled");
        $("#txt-actions").removeAttr("readonly");
        $("#inpd-dateRequested").removeAttr("readonly");
        $("#inpd-deadline").removeAttr("readonly");
        $("#txt-details").removeAttr("readonly");
        $("#txt-remarks").attr("readonly", "readonly");
        $("#f-jobOrder").show();
        $("#btn-joAddCategory").show();
        $("#btn-submit-addJobItems").show();
        $("#btn-submit-clearJobItems").show();
        if (joDetails.AssignedTo !== user.PersonnelID) {
          $('#txt-actions').attr("readonly", "readonly");
        } else {
          $('#txt-actions').removeAttr("readonly");
        }
        break;
    }
  }

  $.ajax({
    url: "/jobs/job-order/" + "View/" + rowJoNum,
    method: "GET",
    success(response) {
      viewFormDetails(response);
      authenticateByUser(user.UserGroupName, response);
    }
  });
  $("#modal-job-order-form").modal("show");
});

$(document).on("click", ".tbljO-deleteRow", function () {
  let rowJONum = joTable.row($(this).closest("tr")).data()
    .JobNumber;
  $("#inph-jobOrderNumber").val(rowJONum);
  $("#modal-confirmDeleteJO").modal("show");
});

$(document).on("click", ".tbljobItem-deleteRow", function () {
  let selectedRow = joItemsTable.row($(this).parents("tr"));
  // console.log(selectedRow.data().JobItemID)
  removedJobItems.push(selectedRow.data());
  $.ajax({
    url: "/jobs/delete/job-item",
    method: "POST",
    data: { jobItemID: selectedRow.data().JobItemID }
  })
  selectedRow.remove();
  joItemsTable.draw();
});

$(document).on("show.bs.modal", "#modal-approved-job-requests", function () {
  approvedJobRequestsTable = approvedJobRequests();
  $("#table-get-job-requests tbody").on("click", "td.details-control", function () {
    var tr = $(this).closest("tr");
    var row = approvedJobRequestsTable.row(tr);
    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass("shown");
    } else {
      // Open this row
      row.child(approvedJobRequestsChild(row.data())).show();
      tr.addClass("shown");
    }
  });
});

$(document).on("hide.bs.modal", "#modal-approved-job-requests", function () {
  $("#table-get-job-requests")
    .DataTable()
    .off("click", "tr")
    .destroy();
  $("#table-get-job-requests").empty();
});

$(".viewPersonnelList").on("click", function () {
  $("#personnelList").val($(this).data("personnel"));
  $("#modal-user-list").modal("show");
});

$("#btn-submit-addJobItems").on("click", function () {
  if (!$("#inph-categoryId").val()) {
    alert("Please attach categories before proceeding.");
    return;
  }
  $("#modal-job-items").modal("show");
});

$("#btn-submit-clearJobItems").on("click", function () {
  joItemsTable.clear().draw();
});

$("#btn-submit-jobOrder").on("click", function (e) {
  const jobItemTable = $("#table-job-items").DataTable();
  let getJobItems = [];
  let jobItemParams = [];
  jobItemTable.rows().every(function () {
    const jobItems = Object.entries(this.data());
    jobItems.unshift(["JobNumber", $("#inpt-joNumber").val()]);
    getJobItems = jobItems.map(element => {
      let objVal = { ...element };
      element = { name: objVal[0], value: objVal[1] };
      return element;
    });
    jobItemParams.push(getJobItems);
  });
  $.ajax({
    url: "/jobs/job-orders",
    method: "POST",
    data: {
      jobItems: JSON.stringify(jobItemParams),
      jobNumber: $("#inpt-joNumber").val()
    }
  });
  validateRequired("isRequired");
  validateFieldByInputLength(
    "txt-details",
    435,
    "This field can only accept 435 characters."
  );
  validateFieldByInputLength(
    "txt-actions",
    435,
    "This field can only accept 435 characters."
  );
  validateFieldByInputLength(
    "txt-remarks",
    435,
    "This field can only accept 435 characters."
  );
  validateForm(e);
});

$("#btn-getJobRequest").on("click", function () {
  $("#modal-approved-job-requests").modal("show");
});

$("#btn-viewJobRequestDetailedReport").on("click", function () {
  viewJRDetailedReport($("#inpt-jrNumber").val());
});

$("#sel-joPriority").on("change", function () {
  $("#inph-joPriority").val($(this).val());
});

$("#sel-joStatus").on("change", function () {
  $("#inph-joStatus").val(parseInt($(this).val()));
  let statusID = parseInt($(this)
    .children("option:selected")
    .val())
  setDateServed(statusID);
});

$("#btn-joAddCategory").on("click", function () {
  $("#modal-job-category").modal("show");
  getCategory("sel-category", "CategoryName", null);
});

$("#sel-category").on("click", function () {
  categoryTable.clear().draw();
  categoryTable.destroy();
  categoryTable = loadJobCategory("CategoryID", $("#sel-category").val());
}); 

$(document).on("show.bs.modal", "#modal-job-category", function () {
  categoryTable = loadJobCategory("CategoryID", "B92F3091-F2F2-4E1F-B639-07B974268B20")
  categoryTable.on("click", "tr", function () {
    const rowData = categoryTable.row($(this).closest("tr")).data();
    attachCategory(rowData)
    $("#modal-job-category").modal("hide");
  });
});

$(document).on("change", "#inpf-jobOrder", function () { 
  validateFile("inpf-jobOrder", [
    "jpeg",
    "jpg",
    "png",
    "pptx",
    "xlsx",
    "pdf",
    "docx",
    "doc",
    "rpt"
  ]);
});

$(document).on("change", "#inpd-deadline", function () {
  validDatesForJO();
});

$(document).on("change", "#inpd-dateServed", function () {
  validDatesForJO();
});

// Functions
const getJobItems = (item = []) => {
  $("#table-job-items")
    .DataTable()
    .clear()
    .draw();
  let jobItems = $.map(item, function (item) {
    return item;
  });
  return jobItems;
};

const defaultValues = formDetails => {
  $("#btn-joAddCategory").show();
  $(".attachedCategory").remove();
  $(".jo-files").remove();
  // TODO: Refactor these 5 functions!
  getJOPriority(formDetails.priority, formDetails.priority[0].PriorityID);
  getJOStatusPerUser(user.PersonnelID)
  //getJOStatus(formDetails.status, formDetails.status[0].StatusID);
  hideDateServed($("#sel-joStatus").val());
  //getAttachedFilesForJO([]);
  $("#inpt-jrNumber").val("");
  $("#inpt-requestedBy").val("");
  $("#inpt-assignedTo").val("");
  $("#inpt-reviewedBy").val("");
  $("#inpt-company").val("");
  $("#inpt-department").val("");
  $("#inpt-section").val("");
  $("#inpt-requestor").val("");
  $("#txt-actions").val("");
  $("#txt-details").val("");
  $("#txt-remarks").val("");
  //$(".dateServed").hide();
  // $("#inpd-dateServed").val(null);
  // $('#inpd-dateServed').attr("readonly", "readonly");
  $(".viewPersonnelList").show();
  //getAttachedFilesForJO([]);
  $("#f-jobOrder").show();
  $("#sel-joPriority").removeAttr("disabled");
  $("#sel-joStatus").removeAttr("disabled");
  //$("#sel-joStatus").children("option:selected").text("Pending");
  $("#inpd-dateRequested").removeAttr("readonly");
  $("#inpd-deadline").removeAttr("readonly");
  $("#inpd-dateServed").attr("disabled", "disabled");
  $("#txt-actions").removeAttr("readonly");
  $("#txt-details").removeAttr("readonly");
  $("#txt-remarks").attr("readonly", "readonly");
  $("#btn-submit-addJobItems").show();
  $("#btn-submit-clearJobItems").show();
  $("#smallButtons").show();
  $("#bigButton").hide();
  $("#btn-cancel-jobOrder").show();
  $("#table-job-items")
    .DataTable()
    .clear()
    .draw();
  $("#inpf-jobOrder").show();
  $("select[id='sel-joStatus'] option[value='" + 5 + "']").attr(
    "selected",
    "selected"
  );
};

const getAttachedFilesForJO = (files = []) => {
  $(".jo-files").remove();
  if (files.length != 0) {
    files.forEach(element => {
      $("#jo-attachedFile").append(
        '<a href="/' +
        element.FileName +
        '"target="_blank" class="badge badge-default jo-files ml-1">' +
        element.OriginalName +
        "</a>"
      );
    });
  }
};

const viewFormDetails = (data) => {
  let joDetails = data.jobOrder.details[0];
  let joItems = data.jobOrder.jobItems;
  let formDetails = data.formDetails;
  $("#inph-joId").val(joDetails.JobID);
  $("#inpt-jrNumber").val(joDetails.RequestNumber);
  $("#inpt-joNumber").val(joDetails.JobNumber);
  getJOPriority(formDetails.priority, joDetails.PriorityID);
  getJOStatus(formDetails.status, formDetails.status[0].StatusID);
  $("#inph-joPriority").val(joDetails.PriorityID);
  getAttachedFilesForJO(formDetails.attachedFile);
  $("#inpt-requestedBy").val(joDetails.RequestedByName);
  $("#inph-requestedBy").val(joDetails.RequestedBy);
  $("#inpt-assignedTo").val(joDetails.AssignedToName);
  $("#inph-assignedTo").val(joDetails.AssignedTo);
  $("#inpt-reviewedBy").val(joDetails.ReviewedByName);
  $("#inph-reviewedBy").val(joDetails.ReviewedBy);
  $("#inpt-requestor").val(joDetails.RequestorName);
  $("#inph-requestor").val(joDetails.Requestor);
  $("#inph-company").val(joDetails.CompanyID);
  $("#inph-department").val(joDetails.DepartmentID);
  $("#inph-section").val(joDetails.SectionID);
  $("#inpt-company").val(joDetails.CompanyInitial);
  $("#inpt-department").val(joDetails.DepartmentName);
  $("#inpt-section").val(joDetails.SectionDescription);
  $("#inph-categoryId").val(joDetails.CategoryID);
  $("#inph-subCategoryId").val(joDetails.SubCategoryID);
  console.log(joDetails)
  $("#inpd-dateRequested").val(parseDate(joDetails.DateRequested));
  $("#inpd-deadline").val(parseDate(joDetails.Deadline));
  $("#inpd-dateServed").val(parseDate(joDetails.DateServed));
  $("#txt-details").val(joDetails.Details);
  $("#txt-actions").val(joDetails.Actions);
  $("#txt-remarks").val(joDetails.Remarks);
  joItemsTable.rows.add(getJobItems(joItems)).draw();
  viewCategoryAttached(
    $("#inpt-attachedCategory"),
    joDetails
  );
};

const viewCategoryAttached = (categoryInput, joDetails) => {
  if (joDetails.CategoryName) {
    categoryInput.val("");
    const categories = `${joDetails.CategoryName}-${joDetails.SubCategoryName}`;
    categoryInput.val(categories);
    $("#inph-categoryId").val(
      joDetails.CategoryID
    );
    $("#inph-subCategoryId").val(
      joDetails.SubCategoryID
    );
  }
  return;
};

const jobItemActionsByUserGroup = (assignedTo, state) => {
  const getUserGroupName = user.UserGroupName;
  const getPersonnelID = user.PersonnelID;

  if (state === "read") {
    hideJobItemActions();
  }

  if (state === "write") {
    if (getUserGroupName === "SQA") {
      if (getPersonnelID === assignedTo) {
        // $("#sel-joStatus option[value='2']").remove();
        // $("#inph-joStatus").val(3)
        viewJobItemActions();
      } else {
        hideJobItemActions();
      }
    } else {
      viewJobItemActions();
    }
  }
};

const viewJobItemActions = () => {
  $("#btn-submit-addJobItems").show();
  $("#btn-submit-clearJobItems").show();
  joItemsTable.column(5).visible(true);
};

const hideJobItemActions = () => {
  $("#btn-submit-addJobItems").hide();
  $("#btn-submit-clearJobItems").hide();
  joItemsTable.column(5).visible(false);
};

const hideDateServed = (joStatus) => {
  const getJOStatus = parseInt(joStatus);
  if (getJOStatus == 3) {
    $(".dateServed").show();
  } else {
    $(".dateServed").hide();
  }
}

const validateRequired = className => {
  let fields = $("." + `${className}`);
  fields.each(function () {
    if ($(this).val() === "") {
      $(this).addClass("is-invalid validation-error");
    } else {
      $(this).removeClass("is-invalid validation-error");
    }
  });
};

const validDatesForJO = () => {
  let datesToValidate = $(".validDatesForJO");
  const getDateRequested = new Date($("#inpd-dateRequested").val());
  datesToValidate.each(function () {
    const dateToValidate = new Date($(this).val());
    if (dateToValidate < getDateRequested) {
      $(this).next(".validation-error").remove();
      $(this).addClass("is-invalid");
      $(
        `<sub class="text-danger validation-error">This date must not be sooner than it is requested!</sub>`
      ).insertAfter($(this));
    } else {
      $(this).removeClass("is-invalid");
      $(this).next(".validation-error").remove();
    }
  })
};

const parseDate = (date) => {
  if (!date) {
    return "";
  } else {
    return date.slice(0, 10);
  }
}

const getJOStatusPerUser = (assignedTo) => {
  const getPersonnelID = user.PersonnelID;
  const getUserGroupID = parseInt(user.UserGroupID);
  const AJAX_REQ_GET_JO_STATUS_PER_USER = {
    method: "GET",
    url: "/jobs/JOStatusPerUser",
    data: {
      personnelId: getPersonnelID,
      assignedTo: assignedTo,
      userGroupId: getUserGroupID
    },
    success: function (json) {
      getJOStatus(json)
    }
  }
  ajaxCaller(AJAX_REQ_GET_JO_STATUS_PER_USER);
};

const setDateServed = (statusID) => {
  $.ajax({
    url: "/misc/getCurrentDate",
    method: "GET",
    success: function (currentDate) {
      if (statusID == 3 || statusID == 4) {
        $("#inpd-dateServed").removeAttr("disabled");
        $(".dateServed").show();
      } else {
        $("#inpd-dateServed").attr("disabled", "disabled");
        $(".dateServed").hide();
      }
      $("#inpd-dateServed").val(currentDate);
    }
  });
}
