import { getJRSummaryTable } from "./rpt-jobRequest-summary.js";

let jrSummaryTable = {};
let filters = [];

let personnelUserGroup;
let personnelCompany;
let personnelID;
$(document).ready(function () {
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: data => {
      personnelUserGroup = data.data[0].UserGroupName;
      personnelCompany = data.data[0].CompanyID;
      personnelID = data.data[0].PersonnelID;
    }
  });
  jrSummaryTable = getJRSummaryTable();
  if (personnelUserGroup === "User" || personnelUserGroup === "Approver") $("#sel-companyJR-filter").attr("disabled", "disabled");
  filters.push({
    name: "RequestedBy",
    value: personnelID
  });
});

$("#btn-generateJRSummary").on("click", function () {
  jrSummaryTable = getJRSummaryTable(filters);
  $.ajax({
    url: "/misc/getCurrentDate",
    method: "GET",
    success: function (currentDate) {
      $("#inpd-dateBeginJR-filter").val(currentDate);
      $("#inpd-dateEndJR-filter").val(currentDate);
    }
  }); 
  // reload table
});

$("#sel-companyJR-filter").on("change", function () {
  filters.push({
    name: $("#sel-companyJR-filter").data("filter"),
    value: $(this).val()
  });
});

$("#inpd-dateBeginJR-filter").on("change", function () {
  filters.push({
    name: $("#inpd-dateBeginJR-filter").data("filter"),
    value: $(this).val()
  });
});

$("#inpd-dateEndJR-filter").on("change", function () {
  filters.push({
    name: $("#inpd-dateEndJR-filter").data("filter"),
    value: $(this).val()
  });
});
