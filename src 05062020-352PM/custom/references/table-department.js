export function loadDepartmentTable() {
    return $("#table-department").DataTable({
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
        url: "/misc/department",
        method: "GET",
        dataSrc: "data"
      },
      columns: [
        { data: "CompanyInitial" },
        { data: "DepartmentName" },
        { data: "DepartmentInitial" },
        {
          data: "DepartmentStatus",
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
  