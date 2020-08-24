export function loadNetworkTable() {

  return $("#table-network").DataTable({
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
        targets: 5,
        responsivePriority: 1
      }
    ],
    ajax: {
      url: "/misc/network-list",
      method: "GET", 
      dataSrc: "data"
    },
    columns: [
      { data: "NetworkID" },
      { data: "NetworkName" },
      { data: "NetworkDescription" },
      { data: "NetworkRemarks" },
      { data: "SubCategoryName" },
      {
        data: "NetworkStatus",
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
          const viewButton = '<a href="#" class="tblnetwork-viewRow" style="color: #03A9F4; margin: 0 3px;" title="View" data-toggle="tooltip"><i class="material-icons">&#xE417;</i></a>';
          const editButton = '<a href="#" class="tblnetwork-editRow" style="color: #FFC107; margin: 0 3px;" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>'
          const deleteButton = '<a href="#" class="tblnetwork-deleteRow" style="color: #E34724; margin: 0 3px;" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>'
          let actionButtons;

          if (data.dbHISSyncID) {
            actionButtons = viewButton;
          } else {
            actionButtons = viewButton + editButton + deleteButton;
          }
          return actionButtons;
        }
      }
    ]
  });
}
