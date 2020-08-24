export function loadSystemTable() {

  return $("#table-system").DataTable({
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
        targets: 6,
        responsivePriority: 1 //NOTICE: Lower value = High Priority
      }
    ],
    ajax: {
      url: "/misc/system-list",
      method: "GET",
      dataSrc: "data"
    },
    columns: [
      { data: "SystemID" },
      { data: "SystemName" },
      { data: "SystemDescription" },
      { data: "SystemCompany" },
      { data: "SubCategoryName" },
      {
        data: "SystemStatusID",
        render: data => {
          if (data == "0") {
            return '<h6 style="color: #E34724; text-align: center;">Inactive</h6>';
          } else if (data == "1") {
            return '<h6 style="color: #02c40c; text-align: center;">Active</h6>';
          } else if (data == "2") {
            return '<h6 style="color: #FFC107; text-align: center;">Maintenance</h6>';
          } else {
            return '<h6 style="color: #E34724; text-align: center;">Disabled</h6>';
          }
        }
      },
      { 
        data: null,
        render: (data) => {
            return '<a href="#" class="tblsystem-editRow" style="color: #FFC107; margin: 0 3px;" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
            '<a href="#" class="tblsystem-deleteRow" style="color: #E34724; margin: 0 3px;" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'
        }
      }
    ]
  });
}
