export const loadJRTable = (user, statusID) => {
  const jrTable = $("#table-job-request").DataTable({
    dom: "Bfrtip",
    retrieve: true,
    destroy: true,
    responsive: {
      details: false
    },
    buttons: getStatusOptions(user),
    ajax: {
      url: "/jobs/job-requests",
      method: "GET",
      data: { personnelID: user.PersonnelID, statusID: statusID },
      dataSrc: "data"
    },
    columns: [
      { data: "RequestID", visible: false },
      { data: "RequestNumber", responsivePriority: 2 },
      { data: "RequestedByInitial" },
      {
        data: "StatusName",
        render: getData => {
          if (getData == null) {
            return "";
          }
          return getData;
        }
      },
      {
        data: "DateSent",
        render: function (getDate) {
          if (getDate) {
            return getDate.substring(0, 10);
          }
          return ""
        }
      },
      {
        data: null,
        render: data => {
          let actionsControl =
            '<a href="#" class="tbljR-viewRow" style="color: #03A9F4; margin: 0 3px;" title="View" data-toggle="tooltip"><i class="material-icons">&#xE417;</i></a>' +
            '<a href="#" class="tbljR-reportRow" style="color: #5FF502; margin: 0 3px;" title="Report" data-toggle="tooltip"><i class="material-icons">description</i></a>';
          switch (user.UserGroupName) {
            case "Approver":
              if (data.StatusName === "Submitted") {
                actionsControl +=
                  '<a href="#" class="tbljR-approveRow" style="color: #02C40C; margin: 0 3px;" title="Approve" data-toggle="tooltip"><i class="material-icons">done</i></a>' +
                  '<a href="#" class="tbljR-cancelRow" style="color: #E34724; margin: 0 3px;" title="Cancel" data-toggle="tooltip"><i class="material-icons">clear</i></a>';
              }
              break;
          }
          return actionsControl;
        },
        responsivePriority: 1
      }
    ]
  });

  return jrTable;
}

const getStatusOptions = user => {
  let buttonsArray;
  if (parseInt(user.UserGroupID) === 3 || parseInt(user.UserGroupID) === 5) {
    buttonsArray = [
      {
        extend: 'collection',
        text: 'Sort By Status',
        autoClose: true,
        buttons: [
          {
            text: 'All',
            action: function (e, dt, node, config) {
              reloadJRTable(user, 0)
            }
          },
          {
            text: 'Approved',
            action: function (e, dt, node, config) {
              reloadJRTable(user, 6)
            }
          },
          {
            text: 'Submitted',
            action: function (e, dt, node, config) {
              reloadJRTable(user, 1)
            }
          },
          {
            text: 'Cancelled',
            action: function (e, dt, node, config) {
              reloadJRTable(user, 4)
            }
          }
        ]
      },
      {
        extend: 'collection',
        text: 'Export Options',
        buttons: ['excel', 'pdf', {
          extend: "print",
          autoPrint: false,
          exportOptions: { stripHtml: false, columns: [2, 3, 4, 5, 6] }
        }]
      }
    ]
  }
  else {
    buttonsArray = [{
      extend: 'collection',
      text: 'Export Options',
      buttons: ['excel', 'pdf', {
        extend: "print",
        autoPrint: false,
        exportOptions: { stripHtml: false, columns: [2, 3, 4, 5, 6] }
      }]
    }]
  }
  return buttonsArray;
};

const reloadJRTable = (user, statusID) => {
  let jrTable = loadJRTable(user, statusID);
  $.ajax({
    url: "/jobs/job-requests",
    method: "GET",
    data: { personnelID: user.PersonnelID, statusID: statusID },
    success: function (json) {
      jrTable.clear();
      jrTable.rows.add(json.data).draw();
    }
  });
}
