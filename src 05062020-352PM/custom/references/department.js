import { loadDepartmentTable } from "./table-department.js";
  $(document).ready(function() {
    loadDepartmentTable();
  });

  $("#btn-syncDepartment").on("click", () => {
    $("#txt-syncDepartment").text("Syncing...")
    $.ajax({
      url: "/misc/sync/RMS",
      method: "GET",
      data: { syncRMSItem: "department" }, 
      success: function () {
        alert("Data successfully synced.");
        $("#txt-syncDepartment").text("Sync with RMS");
        $("#table-department").DataTable().ajax.reload();
      },
      error: function(err) {
        console.log(err)
      }
    });
  });

