import { getJOCategoryTable } from "./rpt-jobOrder-category.js";
import { loadJITableFromCategories, reloadJITableFromCategories } from "../jobs/table-job-itemFromCategories.js";
import { getCategory, getSubCategory } from "../misc.js";

let joCategoryTable = {};
let jiTable = {};
let filters = [];
let user;
let categoryId = 'B92F3091-F2F2-4E1F-B639-07B974268B20';
let subCategoryId = '4C9E3957-B4B8-4D21-B2AF-42BC0760F5F7';

$(document).ready(function () {
  joCategoryTable = getJOCategoryTable([]);
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: json => {
      user = json.data[0];
    }
  });
  $("#sel-subCategory").val("4C9E3957-B4B8-4D21-B2AF-42BC0760F5F7")
  jiTable = loadJITableFromCategories(categoryId, subCategoryId);
});

$("#btn-getJOCategory").on("click", function () {
  $("#modal-job-category").modal("show");
  getCategory("sel-category", "CategoryName", null);
  // $("#sel-category").find('option[value=FF87FA1B-AE8D-41DC-87ED-8D6B0F8EBFA8]').remove()
  // $("#sel-category option[value='FF87FA1B-AE8D-41DC-87ED-8D6B0F8EBFA8']").remove();
  getSubCategory("sel-subCategory", "SubCategoryID", "4C9E3957-B4B8-4D21-B2AF-42BC0760F5F7");
});

$("#sel-category").on("click", function () {
  categoryId = $(this).val();
  getSubCategory("sel-subCategory", "CategoryID", $(this).val());
  reloadJITableFromCategories(categoryId, subCategoryId);
});

$("#sel-subCategory").on("click", function () {
  subCategoryId = $(this).val();
  reloadJITableFromCategories(categoryId, subCategoryId);
});

$(document).on("show.bs.modal", "#modal-job-category", function () {
  jiTable.on("click", "tr", function () {
    const rowData = jiTable.row($(this).closest("tr")).data();
    filters = [
      { name: "PersonnelID", value: user.PersonnelID },
      { name: "CategoryID", value: categoryId},
      { name: "SubCategoryID", value: subCategoryId},
      { name: "JobItemID", value: rowData.JobItemID}
    ]
    getJOCategoryTable(filters)
    $("#modal-job-category").modal("hide");
  });
});
