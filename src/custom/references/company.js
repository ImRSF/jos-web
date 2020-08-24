import { loadCompanyTable } from "./table-company.js";
  $(document).ready(function () {
    loadCompanyTable();
  });

  $("#btn-syncCompany").on("click", () => {
    $("#txt-syncCompany").text("Syncing...")
    $.ajax({
      url: "/misc/sync/RMS",
      method: "GET",
      data: { syncRMSItem: "company" }, 
      success: function () {
        alert("Data successfully synced.");
        $("#txt-syncCompany").text("Sync with RMS");
        $("#table-company").DataTable().ajax.reload();
      },
      error: function(err) {
        console.log(err)
      }
    });
  });
