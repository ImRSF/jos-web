import {
  // getCompany,
  // getDepartment,
  // getSection,
  getUserGroup,
  getStatus
} from "../misc.js";
import { loadAccountTable } from "./table-account.js";

let accountTable = {};
$(document).ready(function() {
  accountTable = loadAccountTable();
});

$(document).on("click", ".tblaccount-status", function() {
  let rowId = accountTable.row($(this).closest("tr")).data().PersonnelID;
  let rowStatus = accountTable.row($(this).closest("tr")).data().IsActive;
  const deactivateModal = $("#modal-account-status");
  if (rowStatus === true) {
    $("#btn-activateAccount").hide();
    $("#btn-deactivateAccount").show();
  } else {
    $("#btn-activateAccount").show();
    $("#btn-deactivateAccount").hide();
  }
  $("#inph-accountId").val(rowId);
  deactivateModal.modal("show");
});

$(document).on("click", ".tblaccount-editRow", function() {
  let rowId = accountTable.row($(this).closest("tr")).data().PersonnelID;
  const accountModal = $("#modal-account-form");
  $.ajax({
    url: "/auth/account/" + "View/" + rowId,
    method: "GET",
    success: function(data) {
      const accountDetails = data.accountDetails[0];

      $("#inph-acctId").val(accountDetails.PersonnelID);
      $("#inph-acctMode").val("Update");
      $("#inph-accountImage").val(accountDetails.AccountImage);
      $("#inpt-fName").val(accountDetails.PersonnelFname);
      $("#inpt-mName").val(accountDetails.PersonnelMname);
      $("#inpt-lName").val(accountDetails.PersonnelLname);
      $("#inpd-dateAdded").val(accountDetails.DateAdded.slice(0, 10));
      $("#inpe-email").val(accountDetails.PersonnelEmail);
      getUserGroup(accountDetails.UserGroupID);
      $("#inpt-username").val(accountDetails.Username);
      $(
        "select[id='sel-gender'] option[value='" +
          accountDetails.PersonnelGender +
          "']"
      ).attr("selected", "selected");
      getStatus(accountDetails.IsActive);
      $("#inpp-password").val(accountDetails.WebPassword);
      $("#inpp-confirmPassword").val(accountDetails.WebPassword);
      $("#inpt-position").val(accountDetails.PersonnelPosition);
      $("#img-accountImage").attr("src", "/" + accountDetails.AccountImage);
      $("#txt-accountDescription").val(accountDetails.AccountDescription);
    }
  });
  accountModal.modal("show");
});

$(document).on("click", ".tblaccount-deleteRow", function() {
  let rowId = accountTable.row($(this).closest("tr")).data().PersonnelID;
  const confirmDeleteModal = $("#modal-confirm-deleteAccount");
  $("#inph-delAccountId").val(rowId);
  confirmDeleteModal.modal("show");
});

$(document).on("show.bs.modal", "#modal-account-form", function() {
  $("#inph-submittedFrom").val("Accounts");
  $.ajax({
    url: "/auth/userGroup",
    method: "GET",
    success: function(data) {
      switch (data.userGroup) {
        case "Admin":
          $("#sel-company").removeAttr("disabled");
          $("#sel-userGroup").removeAttr("disabled");
          $("#sel-accountStatus").removeAttr("disabled");
          break;
      }
    }
  });
});

$(document).on("hide.bs.modal", "#modal-account-form", function() {
  $("#table-account")
    .DataTable()
    .ajax.reload();
  $("#modal-account-form")
    .find("input,textarea")
    .val("");
});

$("#btn-addAccount").on("click", function() {
  $("#inph-acctMode").val("Create");
  getUserGroup();
  const accountModal = $("#modal-account-form");
  accountModal.modal("show");
});

$(document).on("change", "#inpf-accountImage", function() {
  var fileExtension = ["jpeg", "jpg", "png"];
  if (
    $.inArray(
      $(this)
        .val()
        .split(".")
        .pop()
        .toLowerCase(),
      fileExtension
    ) == -1
  ) {
    alert("Only formats are allowed : " + fileExtension.join(", "));
    $("#inpf-accountImage").val("");
  }
});
