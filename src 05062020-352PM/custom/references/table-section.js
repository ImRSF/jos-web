import { displayDateOnly } from "../misc.js";

export function loadSectionTable() {
  return $("#table-section").DataTable({
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
      url: "/misc/section",
      method: "GET",
      dataSrc: "data"
    },
    columns: [
      { data: "SectionDescription" },
      { data: "SectionCode" },
      {
        data: "DateCreated",
        render: function(dateValue) {
          return displayDateOnly(dateValue);
        }
      },
      {
        data: "DateModified",
        render: function(dateValue) {
          return displayDateOnly(dateValue);
        }
      }
    ]
  });
}
