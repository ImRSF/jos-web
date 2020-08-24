import { getJRSummaryTable } from "./rpt-jobRequest-summary.js";
import { loadEmployeeTable } from "../jobs/table-employee.js";
import { setDefaultDate, viewJRDetailedReport, viewJODetailedReport } from "../misc.js";

let jrSummaryTable = {};
let employeeTable = loadEmployeeTable();
let user;

$(document).ready(function () {
  jrSummaryTable = getJRSummaryTable();
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: json => {
      user = json.data[0];
    }
  });

  //jrSummaryTable = getJRSummaryTable();
  if (user.UserGroupName === "User" || user.UserGroupName === "Approver" || user.UserGroupName === "ISS") {
    $(".company-personnel--filter").hide();
  }

  setDefaultDate(["inpd-dateBeginJR-filter", "inpd-dateEndJR-filter"]);
});

$(document).on("click", ".jr-detail", function () {
  let rowJrNum = jrSummaryTable.row($(this).closest("tr")).data()
    .RequestNumber;
  viewJRDetailedReport(rowJrNum);
});

$(document).on("click", ".jo-detail", function () {
  let rowJoNum = jrSummaryTable.row($(this).closest("tr")).data()
    .JobNumber;
  viewJODetailedReport(rowJoNum);
});

$(document).on("show.bs.modal", ".modal", function () {
  var zIndex = 1040 + 10 * $(".modal:visible").length;
  $(this).css("z-index", zIndex);
  $(this).css("overflow", "scroll");
  setTimeout(function () {
    $(".modal-backdrop")
      .not(".modal-stack")
      .css("z-index", zIndex - 1)
      .addClass("modal-stack");
  }, 0);
});

$(document).on("show.bs.modal", "#modal-employee-list", function () {
  employeeTable.columns([0]).visible(false);
  employeeTable.on("click", "tr", function () {
    const employeeData = employeeTable.row(this).data();
    $("#inpt-personnel").val(employeeData.LastName + ", " + employeeData.FirstName)
    $("#modal-employee-list").modal("hide");
  });
});

$("#btn-getPersonnel-filter").on("click", function () {
  $("#modal-employee-list").modal("show");
});

$("#btn-generateJRSummary").on("click", function () {
  const paramsArr = [
    { name: "PersonnelID", value: user.PersonnelID },
    { name: "CompanyID", value: $("#sel-companyJR-filter").val() },
    { name: "RequestedBy", value: user.RequestedBy },
    { name: "DateBegin", value: $("#inpd-dateBeginJR-filter").val() },
    { name: "DateEnd", value: $("#inpd-dateEndJR-filter").val() },
  ]
  jrSummaryTable = getJRSummaryTable(paramsArr);
  // $.ajax({
  //   url: "/misc/getCurrentDate", 
  //   method: "GET",
  //   success: function (currentDate) {
  //     $("#inpd-dateBeginJR-filter").val(currentDate);
  //     $("#inpd-dateEndJR-filter").val(currentDate);
  //   }
  // }); 
  // reload table
});

$("#btn-resetFilter").on("click", function () {
  $('#sel-companyJR-filter').val('').change();
  $("#inpt-personnel").val("All Employees");
  $("#inph-personnel").val("");
  $("#inpd-dateBeginJR-filter").val("");
  $("#inpd-dateEndJR-filter").val("");
});

$("#sel-companyJR-filter").on("change", function () {
  $("#inpt-personnel").val("All Employees");
  $("#inph-personnel").val("");
  $.ajax({
    url: "/misc/employee-list",
    method: "GET",
    data: { colName: "CompanyID", searchVal: $(this).val() },
    success: function (json) {
      employeeTable.clear();
      employeeTable.rows.add(json.data).draw();
    }
  });
});

