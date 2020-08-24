import { loadSectionTable } from "./table-section.js";
  $(document).ready(function() {
    loadSectionTable();
  });

  $("#btn-syncSection").on("click", () => {
    $("#txt-syncSection").text("Syncing...")
    $.ajax({
      url: "/misc/sync/Alsons_HRIS",
      method: "GET",
      data: { syncHRISItem: "section" }, 
      success: function () {
        alert("Data successfully synced.");
        $("#txt-syncSection").text("Sync with HRIS");
        $("#table-section").DataTable().ajax.reload();
      },
      error: function(err) {
        console.log(err)
      }
    });
  });
