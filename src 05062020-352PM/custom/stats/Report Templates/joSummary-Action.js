import { getJOSummaryTable } from "./rpt-jobOrder-summary.js";
let joSummaryTable = {};
let filters = [];
$(document).ready(function() {
  joSummaryTable = getJOSummaryTable();
  $.ajax({
    url: "/misc/getCurrentDate",
    method: "GET",
    success: function(currentDate) {
      // $("#inpd-dateBeginJO-filter").val(currentDate);
      // $("#inpd-dateEndJO-filter").val(currentDate);
    }
  });
});

$("#btn-generateJOSummary").on("click", function() {
  joSummaryTable = getJOSummaryTable(filters);
});

$("#sel-companyJO-filter").on("change", function() {
  filters.push({
    name: $("#sel-companyJO-filter").data("filter"),
    value: $(this).val()
  });
});

$("#inpd-dateBeginJO-filter").on("change", function() {
  filters.push({
    name: $("#inpd-dateBeginJO-filter").data("filter"),
    value: $(this).val()
  });
});

$("#inpd-dateEndJO-filter").on("change", function() {
  filters.push({
    name: $("#inpd-dateEndJO-filter").data("filter"),
    value: $(this).val()
  });
});
