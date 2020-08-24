export function loadJITable(columnName, searchVal) {
  return $("#table-job-items").DataTable({
    retrieve: true,
    destroy: true,
    responsive: {
      details: false
    },
    columnDefs: [
      { "targets": [0], "visible": false },
      { "title": "<strong>Name</strong>", "targets": 1 },
      { "title": "<strong>Description</strong>", "targets": 2 },
      { "title": "<strong>Remarks</strong>", "targets": 3 },
      { "title": "<strong>Company</strong>", "targets": 4 },
      { "title": "<strong>Actions</strong>", "targets": 5 }
    ],
    ajax: {
      url: "/jobs/job-items",
      method: "GET",
      data: { columnName: columnName, searchVal: searchVal },
      dataSrc: "data"
    },
    columns: [
      { data: "JobItemID" },
      { data: "JobItemName" },
      { data: "JobItemDescription", responsivePriority: 1 },
      { data: "JobItemRemarks" },
      { data: "JobItemCompany" },
      {
        data: null, render: function () {
          return '<a href="#" class="tbljobItem-deleteRow" style="color: #E34724; margin: 0 3px;" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'
        }
      }
    ]
  });
};
