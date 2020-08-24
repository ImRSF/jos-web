import {
  getUrlParameter,
  getUserGroup,
  getAssignedApprover,
  getActionByUserGroup,
  validateFile,
  validateForm
} from "../misc.js";

let user;

$(document).ready(function () {
  $("#btn-getEmployee").hide();
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: data => {
      user = data.data[0];
    }
  });

  $.ajax({
    url: "/auth/account/Test/" + getUrlParameter("personnelId"),
    method: "GET",
    success: function (data) {
      const accountDetails = data.accountDetails[0];
      getAssignedApprover(
        accountDetails.EmployeeNo,
        accountDetails.ApproverForUser
      );

      getUserGroup(accountDetails.UserGroupID, () => {
        if (getUrlParameter("from") === "Profile") {
          $("#btn-getEmployee").hide();
          // NOTICE: Remove elements from HTML Select
          const userGroupSelect = $("#sel-userGroup option");
          for (let i = 0; i < userGroupSelect.length; i++) {
            if (
              parseInt(userGroupSelect[i].value) !== accountDetails.UserGroupID
            ) {
              userGroupSelect.remove(
                `#sel-userGroup option[value='${parseInt(
                  userGroupSelect[i].value
                )}']`
              );
            }
          }
        }
      });
      getActionByUserGroup(data.accountDetails[0].UserGroupID, () => {
        $(".category").show();
        $("#btn-searchApprover").hide();
        $("#sel-approver").hide();
      });
      hideAssignedApprover(user.UserGroupID);
    }
  });

  $("#btn-searchApprover").on("click", function () {
    getAssignedApprover(
      $("#inpt-employeeNo").val(),
      ""
    );
  });


  $("#sel-userGroup").on("click", function () {
    getActionByUserGroup(parseInt($("#sel-userGroup").val()), () => {
      $.ajax({
        url: "/auth/edit-account",
        data: { assignedCategory: getUrlParameter("assignedCategory") },
        method: "GET",
        success: function (data) {
          $("#btn-searchApprover").hide();
          $("#sel-approver").hide();
          $(".category").empty();
          $(".category").append(data);
          $(".category").show();
        }
      });
    });
  });
});

$(document).on("change", "#inpf-accountImage", function () {
  validateFile("inpf-accountImage", ["jpeg", "jpg", "png"]);
});

$("#btn-submit-account").on("click", function (e) {
  $("#sel-approver").next("sub.validation-error").remove();
  if ($("#sel-approver").is(":visible")) {
    if ($("#sel-approver option:selected").text() === "") {
      $("#sel-approver").addClass("is-invalid");
      $(
        `<sub class="text-danger validation-error">This field is required.</sub>`
      ).insertAfter($("#sel-approver"));
      validateForm(e);
    }
  }
});

$("#btn-getEmployee").on("click", function () {
  $("#modal-employee-list").modal("show");
});

$(document).on("show.bs.modal", "#modal-employee-list", function () {
  let getEmployeeTable = $("#table-employee").DataTable({
    retrieve: true,
    destroy: true,
    ajax: {
      url: "/misc/employee-list",
      method: "GET",
      dataSrc: "data"
    },
    columns: [
      { data: "FirstName" },
      { data: "MiddleName" },
      { data: "LastName" },
      { data: "PositionDescription" },
      { data: "EmployeeNo" }
    ],
    columnDefs: [
      { title: "<strong>First Name</strong>", targets: 0 },
      { title: "<strong>Middle Name</strong>", targets: 1 },
      { title: "<strong>Last Name</strong>", targets: 2 },
      { title: "<strong>Position</strong>", targets: 3 },
      { title: "<strong>Employee No</strong>", targets: 3 }
    ]
  });

  $("#table-employee tbody").on("click", "tr", function () {
    const getEmployee = getEmployeeTable.row(this).data();
    $("#inpt-firstName").val(getEmployee.FirstName)
    $("#inpt-middleName").val(getEmployee.MiddleName);
    $("#inpt-lastName").val(getEmployee.LastName);
    $("#inpt-position").val(getEmployee.PositionDescription);
    $("#inpt-employeeNo").val(getEmployee.EmployeeNo);
    $("#inph-company").val(getEmployee.CompanyID);
    $("#inpt-company").val(getEmployee.CompanyInitial);
    $("#inph-department").val(getEmployee.DepartmentID);
    $("#inpt-department").val(getEmployee.DepartmentName);
    $("#inph-section").val(getEmployee.SectionID);
    $("#inpt-section").val(getEmployee.SectionDescription);
    $("#modal-employee-list").modal("hide");
  })
});

$("#btn-goBack").on("click", function (e) {
  window.history.back();
});

const hideAssignedApprover = (userGroupId) => {
  if (parseInt(userGroupId) == 3) {
    $("#assignedApprover").hide();
  }
};


