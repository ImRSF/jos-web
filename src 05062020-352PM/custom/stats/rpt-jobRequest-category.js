export const getJRCategoryTable = (filters = []) => {
  return $("#table-jobRequest-category").DataTable({
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
      url: "/stat/jrCategory",
      method: "GET",
      dataSrc: "data",
      data: { filters: { ...filters } }
    },
    columns: [
      { data: "RequestNumber" },
      { data: "RequestedByName" },
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
      { data: "StatusName" },
      {
        data: null,
        render: function() {
          return `<button class="btn-success tblJR-detailedReport">Report Link</button>`;
        }
      }
    ]
  });
};
