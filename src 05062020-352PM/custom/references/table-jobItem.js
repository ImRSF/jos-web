function loadJobItemTable() {
  return $("#table-jobItem").DataTable({
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
      {
        targets: [0],
        visible: false
      }
    ],
    ajax: {
      url: "/jobs/job-items",
      method: "GET",
      dataSrc: "data"
    },
    columnDefs: [
      { "targets": [0], "visible": false },
      { "targets": [1], "visible": false },
      { "title": "<strong>Type</strong>", "targets": 2 },
      { "title": "<strong>Initial</strong>", "targets": 3 },
      { "title": "<strong>Description</strong>", "targets": 4 },
      { "title": "<strong>Brand</strong>", "targets": 5 },
      { "title": "<strong>Status</strong>", "targets": 5 },
      { "title": "<strong>User/Workstation</strong>", "targets": 5 }
    ],
    columns: [
      {
        orderable: false,
        data: null,
        defaultContent: ""
      },
      { data: "ItemID" },
      { data: "ItemType" },
      { data: "ItemInitial" },
      { data: "ItemDescription" },
      { data: "Brand" },
      {
        data: "ItemStatus",
        render: getData => {
          if (getData == null) {
            return "";
          }
          return getData;
        }
      },
      {
        data: "UserOrWorkStation",
        render: getData => {
          if (getData == null) {
            return "";
          }
          return getData;
        }
      }
    ]
  });
}
