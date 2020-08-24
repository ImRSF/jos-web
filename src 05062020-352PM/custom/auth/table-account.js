export function loadAccountTable() {
  return $("#table-account").DataTable({
    responsive: {
      details: false
    },
    columnDefs: [
      {
        targets: [0, 4],
        visible: false
      },
      {
        targets: 6,
        responsivePriority: 1
      }
    ],
    ajax: {
      url: "/auth/accounts",
      method: "GET",
      dataSrc: "data"
      // data: { colName: "", searchVal: "" }
    },
    columns: [
      { data: "PersonnelID" },
      { data: "PersonnelInitial" },
      {
        data: "DateAdded",
        render: function(getDate) {
          if (getDate) {
            return getDate.substring(0, 10);
          }
          return "";
        }
      },
      {
        data: "UserGroupName",
        render: getData => {
          if (getData == null) {
            return "";
          }
          return getData;
        }
      },
      { data: "PersonnelPosition" },
      {
        data: "IsActive",
        render: (data) => {
          if (data === true) {
            return '<h6 style="color: #02c40c; text-align: center;">Active</h6>';
          } else {
            return '<h6 style="color: #E34724; text-align: center;">Inactive</h6>';
          }
        }
      },
      { 
        data: null,
        render: (data) => { 
          // alert(data)
          let actionsControl = ""; 
          if (data.IsActive === true) {
            actionsControl = '<a href="#" class="tblaccount-status" style="color: #E34724; margin: 0 3px;" title="Dectivate" data-toggle="tooltip"><i class="material-icons">clear</i></a>';
          } else {
            actionsControl = '<a href="#" class="tblaccount-status" style="color: #02c40c; margin: 0 3px;" title="Activate" data-toggle="tooltip"><i class="material-icons">done</i></a>'
          }
          actionsControl += '<a href="/auth/edit-account?personnelId='+data.PersonnelID+'&from=Accounts&assignedCategory='+data.Identity+'" class="" style="color: #035efc; margin: 0 3px;" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>' +
          '<a href="#" class="tblaccount-deleteRow" style="color: #FFC107; margin: 0 3px;" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>';
          return actionsControl; 
        }
      }
    ]
  });
}
