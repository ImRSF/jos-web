export function loadMiscellaneousTable() {
  return $("#table-miscellaneous").DataTable({
    dom: "Bfrtip",
    responsive: {
      details: false
    },
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
      },
      {
        targets: 3,
        responsivePriority: 1
      }
    ],
    ajax: {
      url: "/misc/miscellaneous-list",
      method: "GET",
      dataSrc: "data"
    },
    columns: [
      { data: "MiscItemID" },
      { data: "MiscItemName" },
      { data: "MiscItemDescription" },
      { 
        data: null,
        render: (data) => {
            return '<a href="#" class="tblmiscellaneous-editRow" style="color: #FFC107; margin: 0 3px;" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
            '<a href="#" class="tblmiscellaneous-deleteRow" style="color: #E34724; margin: 0 3px;" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'
        }
      }
    ]
  });
}
