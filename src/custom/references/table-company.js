export function loadCompanyTable() {
  return $("#table-company").DataTable({
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
      url: "/misc/company",
      method: "GET",
      dataSrc: "data"
    },
    columns: [
      { data: "CompanyName" },
      { data: "CompanyInitial" },
      { data: "CompanyAddress" },
      {
        data: "CompanyStatus",
        render: data => {
          if (data == 1) {
            return '<h6 style="color: #02c40c; text-align: center;">Active</h6>';
          } else {
            return '<h6 style="color: #E34724; text-align: center;">Inactive</h6>';
          }
        }
      },
    ]
  });
}
