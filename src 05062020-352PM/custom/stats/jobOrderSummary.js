import { getJOSummaryTable } from "./rpt-jobOrder-summary.js";
import { setDefaultDate, viewJRDetailedReport, viewJODetailedReport } from "../misc.js";

let joSummaryTable = {};
let user;

$(document).ready(function () {
  joSummaryTable = getJOSummaryTable();
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: data => {
      user = data.data[0];
    }
  });

  setDefaultDate(["inpd-dateBeginJO-filter", "inpd-dateEndJO-filter"]);

  if (user.UserGroupName === "User" || user.UserGroupName === "Approver" || user.UserGroupName === "ISS") {
    $(".personnel--filter").hide();
  }
});

$(document).on("click", ".jr-detail", function () {
  let rowJrNum = joSummaryTable.row($(this).closest("tr")).data()
    .RequestNumber;
  viewJRDetailedReport(rowJrNum);
});

$(document).on("click", ".jo-detail", function () {
  let rowJoNum = joSummaryTable.row($(this).closest("tr")).data()
    .JobNumber;
  viewJODetailedReport(rowJoNum);
});

$("#btn-generateJOSummary").on("click", function () {
  let paramsArr = [
    {name: "PersonnelID", value: user.PersonnelID},
    {name: "ISSEmployee", value: $("#sel-personnel-filter").val()},
    {name: "CompanyID", value: $("#sel-company-filter").val()},
    {name: "DateBegin", value: $("#inpd-dateBeginJO-filter").val()},
    {name: "DateEnd", value: $("#inpd-dateEndJO-filter").val()}
  ]
  
  joSummaryTable = getJOSummaryTable(paramsArr); 
});

$("#btn-resetFilter").on("click", function() {
  $("#inpd-dateBeginJO-filter").val("");
  $("#inpd-dateEndJO-filter").val("");
  $("#sel-personnel-filter").val("").change();
  $("#sel-company-filter").val("").change();
});