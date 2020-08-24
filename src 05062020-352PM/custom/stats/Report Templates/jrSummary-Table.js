export const getJRSummaryTable = (filters = []) => {
  $("#table-jobRequest-summary").DataTable({
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
      url: "/stat/jrSummary",
      method: "GET",
      dataSrc: "data",
      data: { filters: { ...filters } }
    },
    columns: [
      { data: "RequestNumber" },
      {
        data: "RequestedByName"
      },
      {
        data: "ApprovedByName"
      },
      {
        data: "DateSent",
        render: function(getDate) {
          if (getDate) {
            return getDate.substring(0, 10);
          }
          return "";
        }
      },
      {
        data: "DateApproved",
        render: function(getDate) {
          if (getDate) {
            return getDate.substring(0, 10);
          }
          return "";
        }
      },
      { data: "StatusName" }
    ]
  });
};
