export function loadAvailableJOForReview(personnelID) {
  return $("#table-get-jobOrdersForReview").DataTable({
    retrieve: true,
    destroy: true,
    ajax: {
      url: "/jobs/get-jobOrderForReview",
      method: "GET",
      data: {
        personnelID: personnelID
      },
      dataSrc: "data"
    },
    columnDefs: [
      { "className": "dt-center", "targets": "_all" },
      { title: "<strong>JO Number</strong>", targets: 0 },
      { title: "<strong>Requested By</strong>", targets: 1 },
      { title: "<strong>Assigned To</strong>", targets: 2 },
      { title: "<strong>Date Requested</strong>", targets: 3 },
      { title: "<strong>Job Request</strong>", targets: 4 },
      {
        'targets': 5,
        'checkboxes': {
          'selectRow': true,
          'selectAll': false
        }
      }
    ],
    'select': {
      'style': 'single',
      'selector': 'td:last-child'
    },
    order: [[1, 'asc']],
    columns: [
      {
        data: "JobNumber",
        render: function (val) {
          return `<a class='a-jobLink' target="_blank" href='/jobs/job-order?jobOrderNumber=${val}'>${val}</a>`
        }
      },
      {
        data: "RequestedByName"
      },
      {
        data: "AssignedToName"
      },
      {
        data: "DateRequested",
        render: function (getDate) {
          if (getDate) {
            return getDate.substring(0, 10);
          }
          return "";
        }
      },
      {
        data: "RequestNumber",
        render: function (val) {
          return `<a class='a-jobLink' target="_blank" href='/jobs/job-request?requestNumber=${val}'>${val || ""}</a>`
        }
      },
      {
        targets: 5,
        data: null,
        defaultContent: '',
        orderable: false
      }
    ]
  });
}
