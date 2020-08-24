export function loadJobCategory(columnName, searchVal) {
    return $("#table-job-category").DataTable({ 
      retrieve: true,
      destroy: true,
      columnDefs: [
        { "targets": [0, 2, 3], "visible": false }
      ], 
      ajax: {
        url: "/misc/category", 
        method: "GET", 
        data: { colName: columnName, searchVal: searchVal },
        dataSrc: "data"
      },
      columns: [
        {
          data: "CategoryID"
        },
        {
          data: "CategoryName"
        },
        {
          data: "CategoryDescription"
        },
        {
          data: "SubCategoryID"
        },
        {
          data: "SubCategoryName"
        },
        {
          data: "SubCategoryDescription"
        }
      ]
    });
  // }
}



