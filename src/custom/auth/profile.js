import {
  getCompany,
  getDepartment,
  getSection,
  getUserGroup,
  getStatus,
  getUrlParameter
} from "../misc.js";

let rowId = getUrlParameter("personnelId");

$("#btn-editAccount").on("click", function() {
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
      getCompany(accountDetails.CompanyID);
      getDepartment(accountDetails.DepartmentID);
      getSection(accountDetails.SectionID);
      $("#inpd-dateAdded").val(accountDetails.DateAdded.slice(0, 10));
      $("#inpe-email").val(accountDetails.PersonnelEmail);
      getUserGroup(accountDetails.UserGroupID);
      $("#inpt-username").val(accountDetails.Username);
      $(
        "select[id='sel-gender'] option[value='" +
          accountDetails.PersonnelGender +
          "']"
      ).prop("selected", "selected");
      getStatus(accountDetails.IsActive);
      $("#inpp-password").val(accountDetails.WebPassword);
      $("#inpp-confirmPassword").val(accountDetails.WebPassword);
      $("#inpt-position").val(accountDetails.PersonnelPosition);
      $("#img-accountImage").attr("src", "/" + accountDetails.AccountImage);
      $("#txt-accountDescription").val(accountDetails.AccountDescription);
      $("#inph-submittedFrom").val("Profile");
    }
  });
  accountModal.modal("show");
});

$("#btn-submit-account").on("click", function() {
  $("#inph-submittedFrom").val("personnelId=" + rowId);
  const accountModal = $("#modal-account-form");
  accountModal.modal("hide");
});

$(document).on("show.bs.modal", "#modal-account-form", function() {
  $("#inph-submittedFrom").val("Profile");
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

$(document).on("change", "#inpf-accountImage", function() {
  let fileExtension = ["jpeg", "jpg", "png"];
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
