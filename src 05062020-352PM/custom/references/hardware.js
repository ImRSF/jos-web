import { loadHardwareTable } from "./table-hardware.js";
  $(document).ready(function() {
    loadHardwareTable();
  });

  $("#btn-syncHardware").on("click", () => {
    $("#txt-syncHardware").text("Syncing...")
    $.ajax({
      url: "/misc/sync/dbHIS",
      method: "GET",
      data: { syncHISItem: "hardware" },
      success: function () {
        alert("Data successfully synced.");
        $("#txt-syncHardware").text("Sync with HIS");
        $("#table-hardware").DataTable().ajax.reload();
      }
    });
  });

