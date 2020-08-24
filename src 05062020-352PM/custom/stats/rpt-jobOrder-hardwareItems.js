export const getJOHardwareByItems = (filters = []) => {
  return $("#table-jobOrder-hardwareItems").DataTable({
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
      url: "/stat/joHardwarebyItemType",
      method: "GET",
      dataSrc: "data",
      data: { filters: { ...filters } }
    },
    columns: [
      { data: "JobNumber" },
      {
        data: "RequestedByName",
        render: function(getInitial) {
          if (getInitial) {
            let getFirstName = getInitial.split(",").pop();
            let getLastName = getInitial.split(",").shift();
            return getFirstName.substring(0, 2) + getLastName;
          }
          return "";
        }
      },
      { data: "AssignedToName", render: function(getInitial) {
          if (getInitial) {
            let getFirstName = getInitial.split(",").pop();
            let getLastName = getInitial.split(",").shift();
            return getFirstName.substring(0, 2) + getLastName;
          }
          return "";
        } },
      { data: "StatusName" },
      { data: "PriorityName" },
      {
        data: "DateRequested",
        render: function(getDate) {
          if (getDate) {
            return getDate.substring(0, 10);
          }
          return "";
        }
      }
    ]
  });
};
