export const getJOByWorkStationTable = (filters = []) => {
  return $("#table-jobOrder-workstation").DataTable({
    destroy: true,
    dom: "Bfrtip",
    buttons: [
      "excel",
      "pdf",
      {
        extend: "print",
        autoPrint: false
      }
    ],
    ajax: {
      url: "/stat/joHardwarebyWorkstation",
      method: "GET",
      dataSrc: "data",
      data: { filters: { ...filters } }
    },
    columns: [
      {
        data: "JobNumber"
      },
      {
        data: "RequestedByName",
        render: function (getInitial) {
          if (getInitial) {
            let getFirstName = getInitial.split(",").pop();
            let getLastName = getInitial.split(",").shift();
            return getFirstName.substring(0, 2) + getLastName;
          }
          return "";
        }
      },
      {
        data: "AssignedToName",
        render: function (getInitial) {
          if (getInitial) {
            let getFirstName = getInitial.split(",").pop();
            let getLastName = getInitial.split(",").shift();
            return getFirstName.substring(0, 2) + getLastName;
          }
          return "";
        }
      },
      { data: "StatusName" },
      { data: "PriorityName" },
      // {
      //   data: null, 
      //   render: function () {
      //     return `<button class="btn-success tblJO-detailedReport">Report Link</button>`;
      //   }
      // },
      {
        data: "DateServed",
        render: function (getDate) {
          if (getDate) {
            return getDate.substring(0, 10);
          } else if (getDate == "1900-01-01T00:00:00.000Z") {
            return "";
          }
        }
      }
    ]
  });
};
