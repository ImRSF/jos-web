import {
  viewJRDetailedReport,
  getUrlParameter
} from "../misc.js";

$(document).ready(function () {
  viewJRDetailedReport(getUrlParameter("requestNumber"));
});

