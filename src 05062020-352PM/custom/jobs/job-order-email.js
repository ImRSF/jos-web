import {
  viewJODetailedReport,
  getUrlParameter
} from "../misc.js";

$(document).ready(function () {
    viewJODetailedReport(getUrlParameter("jobOrderNumber"));
})
