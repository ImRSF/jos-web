import { displayDateOnly, displayJRDetailReport, displayJODetailReport } from "../misc.js";

export const getJOSummaryTable = (paramsArr = []) => {
  return $("#table-jobOrder-summary").DataTable({
    destroy: true,
    dom: "Bfrtip",
    buttons: [
      "excel",
      "pdf",
      {
        extend: "print",
        autoPrint: false
      }
    ],
    ajax: {
      url: "/stat/joSummary",
      method: "GET",
      dataSrc: "data",
      data: { filters: { ...paramsArr } }
    },
    columns: [
      {
        data: "JobNumber",
        render: function (joNumber) {
          return displayJODetailReport(joNumber)
        }
      },
      { data: "RequestedByInitial" },
      { data: "PersonnelInitial" },
      { data: "StatusName" },
      {
        data: "DateRequested",
        render: function (date) {
          return displayDateOnly(date);
        }
      },
      {
        data: "Duration",
        render: function (dayDuration) {
          return removeParenthesis(dayDuration);
        }
      },
      {
        data: "RequestNumber",
        render: function (jrNumber) {
          return displayJRDetailReport(jrNumber);
        }
      }
    ]
  });
};

const removeParenthesis = str => {
  if (str) {
    return str.replace(/[{()}]/g, '')
  }
  return str;
}; 