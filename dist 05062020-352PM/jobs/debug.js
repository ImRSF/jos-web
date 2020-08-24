"use strict";

$(document).on("show.bs.modal", ".modal", function () {
  var zIndex = 1040 + 10 * $(".modal:visible").length;
  $(this).css("z-index", zIndex);
  setTimeout(function () {
    $(".modal-backdrop").not(".modal-stack").css("z-index", zIndex - 1).addClass("modal-stack");
  }, 0);
});
$(document).on("show.bs.modal", "#modal-child", function () {
  // if ($("#list-table").DataTable().destroy()) {
  if ($.fn.dataTable.isDataTable("#list-table")) {
    let table = $("#list-table").DataTable({
      retrieve: true,
      ajax: {
        url: "/jobs/job-order/" + $("#personnelList").val(),
        method: "GET"
      },
      columns: [{
        orderable: false,
        data: null,
        defaultContent: ""
      }, {
        data: "PersonnelFname"
      }, {
        data: "PersonnelMname"
      }, {
        data: "PersonnelLname"
      }, {
        data: "PersonnelPosition"
      }]
    });
    $("#list-table tbody").on("click", "tr", function () {
      const getPersonnelName = table.row(this).data().PersonnelLname + ", " + table.row(this).data().PersonnelFname;
      getPersonnel($("#personnelList").val(), getPersonnelName); // $("#inpt-assignedTo").val(getPersonnelName);

      $("#list-table").DataTable().clear().off("click", "tr").destroy();
      $("#modal-child").modal("hide");
    });
  }

  let getPersonnel = function getPersonnel(listName, value) {
    switch (listName) {
      case "ISS Personnel":
        $("#inpt-assignedTo").val(value);
        break;

      case "User":
        $("#inpt-requestedBy").val(value);
        break;

      case "Approver":
        $("#inpt-reviewedBy").val(value);
        break;
    }
  };
});