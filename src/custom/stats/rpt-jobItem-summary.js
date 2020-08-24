import { displayJODetailReport } from "../misc.js";

export const getJISummaryTable = (paramsArr = []) => {
  return $("#table-jobItem-summary").DataTable({
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
    columnDefs: [
      // {
      //   targets: [0],
      //   visible: false
      // }
    ],
    ajax: {
      url: "/stat/jiSummary",
      method: "GET",
      dataSrc: "data",
      data: { filters: { ...paramsArr } }
    },
    columns: [
      { data: "JobItemName" },
      { data: "JobItemDescription" },
      { data: "JobItemRemarks" },
      { data: "JobItemCompany" },
      { data: "RequestedByName"},
      { data: "AssignedToName" },
      {
        data: "JobNumber",
        render: function (joNumber) {
          return displayJODetailReport(joNumber);
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