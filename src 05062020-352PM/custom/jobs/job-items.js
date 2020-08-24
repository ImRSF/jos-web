import { removedJobItems } from "./job-order.js";

let jiTable = {};
const loadJITable = (columnVal, searchVal) => {
  return $("#table-get-job-items").DataTable({
    retrieve: true,
    destroy: true,
    ajax: {
      url: "/jobs/job-items",
      method: "GET",
      data: { columnName: columnVal, searchVal: searchVal },
      dataSrc: "data"
    },
    columnDefs: [
      {
        targets: [0, 2],
        visible: false
      }
    ],
    columns: [
      { data: "JobItemID" },
      { data: "JobItemName" },
      { data: "SubCategoryID" },
      { data: "JobItemDescription" },
      { data: "JobItemRemarks" },
      { data: "JobItemCompany"}
    ]
  })
}

$(document).on("show.bs.modal", ".modal", function () {
  var zIndex = 1040 + 10 * $(".modal:visible").length;
  $(this).css("z-index", zIndex);
  setTimeout(function () {
    $(".modal-backdrop")
      .not(".modal-stack")
      .css("z-index", zIndex - 1)
      .addClass("modal-stack");
  }, 0);
});

$(document).on("show.bs.modal", "#modal-job-items", function () {
  jiTable = loadJITable("SubCategoryID", $("#inph-subCategoryId").val());

  // 8F13B954-B380-418C-B1B9-B92F8B6B9EC5 => Hardware/Workstation
  if ($("#inph-subCategoryId").val() === "8F13B954-B380-418C-B1B9-B92F8B6B9EC5") {
    $(jiTable.column(2).header()).text('Item Description (BRAND--MODEL-SERIAL # [WORKSTATION])');
    $("#inpg-employee").removeAttr("hidden");
  } else {
    $(jiTable.column(2).header()).text('Item Description');
    $("#inpg-employee").attr("hidden", true);
  }

  $("#table-get-job-items tbody").on("click", "tr", function () {
    $(this).toggleClass("selected");
  });
});

$(document).on("show.bs.modal", "#modal-employee-list", function () {
  let getEmployeeTable = $("#table-employee").DataTable({
    retrieve: true,
    destroy: true,
    ajax: {
      url: "/misc/employeeWithWorkstation",
      method: "GET",
      dataSrc: "data"
    },
    columns: [
      { data: "FirstName" },
      { data: "MiddleName" },
      { data: "LastName" },
      { data: "PositionDescription" },
      { data: "SectionDescription" }
    ],
    columnDefs: [
      { "className": "dt-center", "targets": "_all" },
      { title: "<strong>First Name</strong>", targets: 0 },
      { title: "<strong>Middle Name</strong>", targets: 1 },
      { title: "<strong>Last Name</strong>", targets: 2 },
      { title: "<strong>Position</strong>", targets: 3 },
      { title: "<strong>Employee No</strong>", targets: 3 }
    ]
  });

  $("#table-employee tbody").on("click", "tr", function () {
    const getEmployee = getEmployeeTable.row(this).data();
    $("#inph-employeeNo").val(getEmployee.EmployeeNo);
    $("#inpt-employeeInitial").val(getEmployee.EmployeeInitial);
    $("#table-get-job-items").DataTable().off("click", "tr").destroy()
    jiTable = loadJITable("EmployeeNo", $("#inph-employeeNo").val());
    $("#table-get-job-items").DataTable().ajax.reload();
    $("#modal-employee-list").modal("hide");
  });
});

$("#btn-getEmployee").on("click", function () {
  $("#modal-employee-list").modal("show");
});

$("#btn-addJobItems").on("click", function () {
  removedJobItems.length = 0;
  let getJobItems = $.map(jiTable.rows(".selected").data(), function (item) {
    //TODO: temporarily skipped
    // console.log(item)
    // removedJobItems.filter(e => e.ItemName !== item.ItemName);
    return item;
  });
  // FIXME: Duplicate Records
  // Check link: https://stackoverflow.com/questions/2218999/remove-duplicates-from-an-array-of-objects-in-javascript

  // let existingJobItems = $.map($("#table-job-items").DataTable().data(), function (item) {
  //   delete item.JobNumber;
  //   return item;
  // });
  // const seen = [];
  // let removeDuplicates = existingJobItems.concat(getJobItems);
  getJobItems.filter(function (item, index) {
    if (item.JobItemID !== getJobItems[index - 1]) {
      return item;
    }
  })

  $("#table-job-items")
    .DataTable()
    .rows.add(getJobItems).draw();
  $("#modal-job-items").modal("hide");
});

$(document).on("shown.bs.modal", "#modal-job-items", function () {
  //jiTable.clear().draw();
  jiTable.rows.add(removedJobItems).draw();
});
// TODO: Find a way to not reload DataTables by ajax
$(document).on("hide.bs.modal", "#modal-job-items", function () {
  $("#table-get-job-items").empty();
  $("#table-get-job-items").DataTable().off("click", "tr").destroy()
});
