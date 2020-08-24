import { displayDateOnly, displayJRDetailReport, displayJODetailReport } from "../misc.js";

export const getJRSummaryTable = (params = []) => {
  $("#table-jobRequest-summary").DataTable().clear();
  return $("#table-jobRequest-summary").DataTable({
    destroy: true,
    dom: "Bfrtip",
    responsive: {
      details: false
    },
    buttons: [
      {
        extend: 'collection',
        text: 'Export Options',
        buttons: ['excel', 'pdf', {
          extend: "print",
          autoPrint: false,
          exportOptions: { stripHtml: false, columns: [2, 3, 4, 5, 6] }
        }]
      },
      // {
      //   extend: 'colvis',
      //   collectionLayout: 'fixed two-column'
      // }
    ],
    ajax: {
      url: "/stat/jrSummary",
      method: "GET",
      dataSrc: "data",
      data: { filters: { ...params } }
    },
    columns: [
      {
        data: "RequestNumber",
        render: function (jrNumber) {
          return displayJRDetailReport(jrNumber);
        },
        responsivePriority: 1
      },
      {
        data: "RequestedByName"
      },
      {
        data: "DateSent",
        render: function (date) {
          return displayDateOnly(date);
        }
      },
      {
        data: "DateApprovedOrCancelled",
        render: function (date) {
          return displayDateOnly(date);
        }
      },
      {
        data: "JobNumber",
        render: function (joNumber) {
          return displayJODetailReport(joNumber);
        }
      }
    ]
  });
};



