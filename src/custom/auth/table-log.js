$(document).ready(function () {
  return $("#table-log").DataTable({
    dom: "Bfrtip",
    buttons: [
      "excel",
      "pdf",
      {
        extend: "print",
        autoPrint: false
      }
    ],
    responsive: {
      details: false
    },
    columnDefs: [
      {
        visible: false
      },
      {
        targets: 3,
        responsivePriority: 1
      }
    ],
    ajax: {
      url: "/auth/logs",
      method: "GET",
      dataSrc: "data"
    },
    columns: [
      { data: "LogUser" },
      { data: "LogDateTime", render: function(dateTime) {
        const logDateTime = new Date(dateTime);
        return logDateTime.toUTCString()
      } },
      {
        data: "RecordAffected"
      },
      {
        data: "LogDescription"
      }
    ]
  });
});

