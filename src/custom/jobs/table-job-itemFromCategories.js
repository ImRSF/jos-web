export function loadJITableFromCategories(categoryId, subCategoryId) {
  return $("#table-job-itemsFromCategories").DataTable({
    retrieve: true,
    destroy: true,
    columnDefs: [
      { "targets": [0], "visible": false }, 
      { "title": "<strong>Name</strong>", "targets": 1 },
      { "title": "<strong>Description</strong>", "targets": 2 },
      { "title": "<strong>Remarks</strong>", "targets": 3 },
      { "title": "<strong>Company</strong>", "targets": 4 }
    ], 
    ajax: {
      url: "/jobs/job-itemsFromCategories",
      method: "GET",
      data: { categoryId: categoryId, subCategoryId: subCategoryId },
      dataSrc: "data"
    },
    columns: [
      { data: "JobItemID" },
      { data: "JobItemName" },
      { data: "JobItemDescription" },
      { data: "JobItemRemarks" },
      { data: "JobItemCompany"}
    ]
  });
};

export const reloadJITableFromCategories = (categoryId, subCategoryId) => {
  let jiTable = loadJITableFromCategories(categoryId, subCategoryId)
  $.ajax({
    url: "/jobs/job-itemsFromCategories",
    method: "GET",
    data: { categoryId: categoryId, subCategoryId: subCategoryId },
    success: function(json) {
      jiTable.clear();
      jiTable.rows.add(json.data).draw();
    }
  });
}
