import { getJRCategoryTable } from "./rpt-jobRequest-category.js";
import { loadJobCategory } from "../jobs/table-job-category.js";
import { getCategory, getSubCategory, viewJRDetailedReport } from "../misc.js";

let jrCategoryTable = {};
let categoryTable = {};
let filters = [];
$(document).ready(function() {
  jrCategoryTable = getJRCategoryTable();
});

$("#btn-getJRCategory").on("click", function() {
  $("#modal-job-category").modal("show");
  getCategory("sel-category", "CategoryName", null);
  getSubCategory(
    "sel-subCategory",
    "CategoryID",
    "B92F3091-F2F2-4E1F-B639-07B974268B20"
  );
  // reload table
});

$("#btn-filterCategory").on("click", () => {
  categoryTable.clear().draw();
  categoryTable.destroy();
  const getSubCategory = $("#sel-subCategory").val();
  categoryTable = loadJobCategory(getSubCategory);
  $("#btn-filterCategory").text("Reset Filter");
  $("#btn-filterCategory").removeClass("btn-secondary");
  $("#btn-filterCategory").addClass("btn-primary");
  // if ($("#btn-filterCategory").text() === "Search Filter") {
  //   const getSubCategory = $("#sel-subCategory").val();
  //   categoryTable = loadJobCategory(getSubCategory);
  //   $("#sel-category").attr("disabled", "disabled");
  //   $("#sel-subCategory").attr("disabled", "disabled");
  //   $("#btn-filterCategory").text("Reset Filter");
  //   $("#btn-filterCategory").removeClass("btn-secondary");
  //   $("#btn-filterCategory").addClass("btn-primary");
  // } else {
  //   $("#sel-category").removeAttr("disabled");
  //   $("#sel-subCategory").removeAttr("disabled");
  //   $("#btn-filterCategory").text("Search Filter");
  //   $("#btn-filterCategory").removeClass("btn-primary");
  //   $("#btn-filterCategory").addClass("btn-secondary");
  //   categoryTable.clear().draw();
  //   categoryTable.destroy();
  // }
});

$("#btn-filterSearch").on("click", () => {
  filters = [
    {
      name: "CategoryID",
      value: $("#sel-category").val()
    },
    {
      name: "SubCategoryID",
      value: $("#sel-subCategory").val()
    },
    {
      name: "CategoryItem",
      value: null
    }
  ];
  jrCategoryTable = getJRCategoryTable(filters);
  $("#modal-job-category").modal("hide");
});

$("#sel-category").on("click", function() {
  let getCategoryId = $(this).val();
  getSubCategory("sel-subCategory", "CategoryID", getCategoryId);
});

$(document).on("show.bs.modal", "#modal-job-category", function() {
  categoryTable = loadJobCategory("23BAE2BC-A019-4919-87FC-37E68D683349");
  categoryTable.on("click", "tr", function() {
    const getCatItemId = categoryTable.row(this).data().CategoryID;
    $("#inph-categoryItemId").val(getCatItemId);
    filters = [
      {
        name: "CategoryID",
        value: $("#sel-category").val()
      },
      {
        name: "SubCategoryID",
        value: $("#sel-subCategory").val()
      },
      {
        name: "CategoryItem",
        value: getCatItemId
      }
    ];
    jrCategoryTable = getJRCategoryTable(filters);
    $("#modal-job-category").modal("hide");
  });
});

$(document).on("click", ".tblJR-detailedReport", function () {
  let rowRequestNumber = jrCategoryTable.row($(this).closest("tr")).data()
    .RequestNumber;
  viewJRDetailedReport(rowRequestNumber);
});
