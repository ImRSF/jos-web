export const getJOCategoryTable = (filters = []) => {
  return $("#table-jobOrder-category").DataTable({
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
      url: "/stat/joCategory",
      method: "GET",
      dataSrc: "data",
      data: { filters: { ...filters } }
    },
    columns: [
      {
        data: "JobNumber",
        render: function (val) {
          return `<a class='a-jobLink' target="_blank" href='/jobs/job-order?jobOrderNumber=${val}'>${val}</a>`
        }
      },
      { data: "AssignedToInitial" },
      { data: "StatusName" },
      {
        data: "DateRequested",
        render: function (getDate) {
          if (getDate) {
            return getDate.substring(0, 10);
          }
          return "";
        }
      }
    ]
  });
};
