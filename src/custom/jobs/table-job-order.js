//import { getUrlParameter } from "../misc.js";

export const joTableChild = (d) => {
  return '<div class="tab-content py-3 px-3 px-sm-0">' +
    '<div class="tab-pane fade show active" role="tabpanel" id="tab-details">' +
    '<div class="form-group row">' +
    '<label for="cr-sel-joPriority" class="col-sm-1 col-form-label">Priority</label>' +
    '<div class="col-sm-5">' +
    '<input type="hidden" name="priorityID" value="' + d.PriorityID + '"></input>' +
    '<input type="text" class="form-control" id="cr-sel-joPriority" readonly value="' + d.PriorityName + '"></input>' +
    '</div>' +
    '<label for="cr-sel-joStatus" class="col-sm-1 col-form-label">Status</label>' +
    '<div class="col-sm-5">' +
    '<input type="hidden" name="statusID" value="' + d.StatusID + '"></input>' +
    '<input type="text" class="form-control" id="cr-sel-status" readonly value="' + d.StatusName + '"></input>' +
    '</div>' +
    '</div>' +
    '<div class="form-group row">' +
    '<label for="cr-txt-details" class="col-sm-1 col-form-label">Details</label>' +
    '<div class="col-sm-11">' +
    '<textarea name="" class="form-control" id="cr-txt-details" style="resize:vertical" readonly>' + removeUndefined(d.Details) + '</textarea>' +
    '</div>' +
    '</div>' +
    '<div class="form-group row">' +
    '<label for="cr-txt-actions" class="col-sm-1 col-form-label">Actions</label>' +
    '<div class="col-sm-11">' +
    '<textarea name="" class="form-control" id="cr-txt-actions" style="resize:vertical" readonly>' + removeUndefined(d.Actions) + '</textarea>' +
    '</div>' +
    '</div>' +
    '<div class="form-group row">' +
    '<label for="cr-txt-remarks" class="col-sm-1 col-form-label">Remarks</label>' +
    '<div class="col-sm-11">' +
    '<textarea name="" class="form-control" id="cr-txt-remarks" style="resize:vertical" readonly>' + removeUndefined(d.Remarks) + '</textarea>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
};

export const loadJOTable = (user, statusID, disableSort) => {
  return $("#table-job-order").DataTable({
    dom: "Bfrtip",
    retrieve: true,
    destroy: true,
    responsive: {
      details: false
    },
    buttons: getStatusButtons(user, disableSort),
    columnDefs: [
      {
        targets: [1],
        visible: false
      },
      {
        targets: 7,
        responsivePriority: 1
      }
    ],
    ajax: {
      url: "/jobs/job-orders?personnelId=" + user.PersonnelID + "&statusID=" + statusID,
      method: "GET",
      dataSrc: "data"
    },
    columns: [
      {
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: ""
      },
      { data: "JobID" },
      { data: "JobNumber" },
      { data: "RequestedByInitial" },
      { data: "StatusAfterDeadline" },
      { data: "PriorityName" },
      { data: "PersonnelInitial" },
      {
        data: null,
        render: (data) => {
          let actionsControl = '<a href="#" class="tbljO-reportRow" style="color: #5FF502; margin: 0 3px;" title="Report" data-toggle="tooltip"><i class="material-icons">description</i></a>' +
            '<a href="#" class="tbljO-viewRow" style="color: #03A9F4; margin: 0 3px;" title="View" data-toggle="tooltip"><i class="material-icons">&#xE417;</i></a>';
          switch (user.UserGroupName) {
            case "Admin":
              if (data.AssignedTo === user.PersonnelID && data.StatusName === "Returned" || ((data.AssignedTo === user.PersonnelID && data.StatusName !== "Served") || data.StatusName === "Pending")) {
                actionsControl += '<a href="#" class="tbljO-editRow" style="color: #FFC107; margin: 0 3px;" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>';
              }
              actionsControl += '<a href="#" class="tbljO-deleteRow" style="color: #E34724; margin: 0 3px;" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>';
              // actionsControl += '<a href="#" class="tbljO-deleteRow" style="color: #E34724; margin: 0 3px;" title="Delete" data-toggle="tooltip"><i class="material-icons">&#xE872;</i></a>' + '<a href="#" class="tbljO-editRow" style="color: #FFC107; margin: 0 3px;" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>';
              break;
            case "SQA":
              if (data.AssignedTo === user.PersonnelID && data.StatusName === "Pending" || data.StatusName === "Submitted" || data.StatusName === "Returned") {
                actionsControl += '<a href="#" class="tbljO-editRow" style="color: #FFC107; margin: 0 3px;" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>'
              }
              break;
            case "ISS":
              if (data.StatusName === "Pending" || data.StatusName === "Returned") {
                actionsControl += '<a href="#" class="tbljO-editRow" style="color: #FFC107; margin: 0 3px;" title="Edit" data-toggle="tooltip"><i class="material-icons">&#xE254;</i></a>'
              }
              break;
          }
          return actionsControl;
        },
        responsivePriority: 1
      }
    ]
  });
};

const getStatusButtons = (user, disableSort) => {
  let buttonsArray = [{
    extend: 'collection',
    text: 'Export Options',
    buttons: ['excel', 'pdf', {
      extend: "print",
      autoPrint: false,
      exportOptions: { stripHtml: false, columns: [2, 3, 4, 5, 6] }
    }]
  }];
  if (disableSort !== "true") {
    buttonsArray = [
      {
        extend: 'collection',
        text: 'Sort By Status',
        autoClose: true,
        buttons: [
          {
            text: 'All',
            action: function (e, dt, node, config) {
              reloadJOTable(user, 0)
            }
          },
          {
            text: 'Pending',
            action: function (e, dt, node, config) {
              reloadJOTable(user, 5)
            }
          },
          {
            text: 'Submitted',
            action: function (e, dt, node, config) {
              reloadJOTable(user, 1)
            }
          },
          {
            text: 'Returned',
            action: function (e, dt, node, config) {
              reloadJOTable(user, 2)
            }
          },
          {
            text: 'Served',
            action: function (e, dt, node, config) {
              reloadJOTable(user, 3)
            }
          },
          {
            text: 'Cancelled',
            action: function (e, dt, node, config) {
              reloadJOTable(user, 4)
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
    ];
  }
  return buttonsArray;
};

const reloadJOTable = (user, statusID) => {
  let joTable = loadJOTable(user, statusID)
  $.ajax({
    url: "/jobs/job-orders?personnelId=" + user.PersonnelID + "&statusID=" + statusID,
    method: "GET",
    success: function (json) {
      joTable.clear();
      joTable.rows.add(json.data).draw();
    }
  });
};

const removeUndefined = getData => {
  // Ternary Operator
  // if getData is null/undefined, return ""
  return getData == null ? "" : getData;
};




