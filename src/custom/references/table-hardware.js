export function loadHardwareTable() {
  return $("#table-hardware").DataTable({
    dom: "Bfrtip",
    responsive: true,
    buttons: [
      "excel",
      "pdf",
      {
        extend: "print",
        autoPrint: false
      }
    ],
    ajax: {
      url: "/misc/hardware-list",
      method: "GET",
      dataSrc: "data"
    }, 
    columns: [
      { data: "HardwareItemName" },
      { data: "HardwareItemCategoryName" },
      { data: "HardwareItemTypeName" },
      { data: "AgeLimit" },
      {
        data: "HardwareStatus",
        render: data => {
          if (data === "Disabled" || data === "Inactive") {
            return `<h6 style="color: #E34724; text-align: center;">${data}</h6>`;
          } else if (data === "Active") {
            return `<h6 style="color: #02c40c; text-align: center;">${data}</h6>`;
          } else if (data === "Maintenance") {
            return `<h6 style="color: #FFC107; text-align: center;">${data}</h6>`;
          }
        }
      }
    ]
  });
}
