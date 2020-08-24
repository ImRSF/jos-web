export function loadEmployeeTable(columnName = "", searchVal = "") {
    return $("#table-employee").DataTable({
      retrieve: true,
      destroy: true,
      ajax: { 
        url: "/misc/employee-list",
        method: "GET",
        data: { colName: columnName, searchVal: searchVal },
        dataSrc: "data"
      },
      columns: [ 
        { data: "EmployeeNo" },
        { data: "FirstName" },
        { data: "MiddleName" },
        { data: "LastName" },
        { data: "CompanyInitial" },
        {
          data: "DepartmentInitial",
          render: getData => {
            if (getData == null) {
              return "";
            }
            return getData;
          }
        },
        {
          data: "SectionDescription",
          render: getData => {
            if (getData == null) {
              return "";
            }
            return getData;
          }
        }
      ]
    });
  }
  