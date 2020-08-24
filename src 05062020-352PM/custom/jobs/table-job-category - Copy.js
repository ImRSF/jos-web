export function loadJobCategory(subCategoryId, hardwareOption = "", employeeNo = "") {
  if (hardwareOption !== "") {
    return $("#table-job-category").DataTable({
      retrieve: true,
      destroy: true,
      columnDefs: [
        { "targets": [0], "visible": false }
      ],
      ajax: {
        url: "/misc/categoryItemForHardware",
        method: "GET",
        data: { hardwareOption: hardwareOption, employeeNo: employeeNo },
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
        }
      ]
    });
  } else {
    return $("#table-job-category").DataTable({
      retrieve: true,
      destroy: true,
      columnDefs: [
        { "targets": [0], "visible": false }
      ],
      ajax: {
        url: "/misc/categoryItem",
        method: "GET",
        data: { subCategoryID: subCategoryId },
        dataSrc: "data"
      },
      columns: [
        {
          data: "CategoryID"
        },
        {
          data: "CategoryItemName"
        },
        {
          data: "CategoryItemDescription"
        }
      ]
    });
  }
}



