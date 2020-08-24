import { getSubCategory, getReferenceStatus, validateFieldByInputLength, validateForm } from "../misc.js";
import { loadSoftwareTable } from "./table-software.js";

let softwareTable = {};
$(document).ready(function () {
  $.ajax({
    url: "/misc/user",
    method: "GET",
    success: function (data) {
      const userGroupName = data.data[0].UserGroupName; 
      softwareTable = loadSoftwareTable();
      // if (userGroupName !== "Admin") { 
      //   let getActionColumns = softwareTable.column(5);
      //   getActionColumns.visible(false);
      // }
    }
  });
});

$("#btn-addSoftware").on("click", () => {
  defaultValues();
  $("#inpt-softwareName").removeAttr("readonly");
  $("#inpt-softwareDescription").removeAttr("readonly");
  $("#inpt-softwareRemarks").removeAttr("readonly");
  $("#sel-subCategory").removeAttr("disabled");
  $("#sel-referenceStatus").removeAttr("disabled");
  $("#smallButtons").show();
  $("#bigButton").hide();
  getSubCategory("sel-subCategory", "CategoryName", "SOFTWARE");
  getReferenceStatus();
  $("#modal-software-form").modal("show");
});

$("#btn-syncSoftware").on("click", () => {
  $("#txt-syncSoftware").text("Syncing...");
  $.ajax({
    url: "/misc/sync/dbHIS",
    method: "GET",
    data: { syncHISItem: "software" },
    success: function () {
      alert("Data successfully synced.");
      $("#txt-syncSoftware").text("Sync with HIS");
      $("#table-software").DataTable().ajax.reload();
    }
  });
});

$(document).on("click", ".tblsoftware-viewRow", function () {
  const softwareName = softwareTable.row($(this).closest("tr")).data().SoftwareName;

  $("#inpt-softwareName").attr("readonly", "readonly");
  $("#inpt-softwareDescription").attr("readonly", "readonly");
  $("#inpt-softwareRemarks").attr("readonly", "readonly");
  $("#sel-subCategory").attr("disabled", "disabled");
  $("#sel-referenceStatus").attr("disabled", "disabled");
  $("#smallButtons").hide();
  $("#bigButton").show();
  softwareDetails("SoftwareName", softwareName);
});

$(document).on("click", ".tblsoftware-editRow", function () {
  $("#inpt-softwareName").removeAttr("readonly");
  $("#inpt-softwareDescription").removeAttr("readonly");
  $("#inpt-softwareRemarks").removeAttr("readonly");
  $("#sel-subCategory").removeAttr("disabled");
  $("#sel-referenceStatus").removeAttr("disabled");
  $("#smallButtons").show();
  $("#bigButton").hide();

  const softwareId = softwareTable.row($(this).closest("tr")).data().SoftwareID;
  softwareDetails("SoftwareID", softwareId);
});

$(document).on("click", ".tblsoftware-deleteRow", function () {
  let softwareId = softwareTable.row($(this).closest("tr")).data().SoftwareID;
  const deleteModal = $("#modal-confirmDeleteSoftware");
  $("#inph-deleteSoftwareId").val(softwareId);
  deleteModal.modal("show");
});

$("#btn-submit-software").on("click", function (e) {
  // TODO: Refactor this validation
  //validateSoftware(e)
  validateFieldByInputLength("inpt-softwareName", 50, "This field can only accept 50 characters or below.");
  validateFieldByInputLength("inpt-softwareDescription", 100, "This field can only accept 100 characters or below.");
  validateFieldByInputLength("inpt-softwareRemarks", 100, "This field can only accept 100 characters or below.");
  validateForm(e)
});

const softwareDetails = (colName, searchVal) => {
  $.ajax({
    url: "/misc/software",
    method: "GET",
    data: { colName: colName, searchVal: searchVal },
    success: function (data) {
      $("#inph-softwareId").val(data[0].SoftwareID);
      $("#inpt-softwareName").val(data[0].SoftwareName);
      $("#inpt-softwareDescription").val(data[0].SoftwareDescription);
      $("#inpt-softwareRemarks").val(data[0].SoftwareRemarks);
      console.log(data)
      getSubCategory("sel-subCategory", "CategoryName", "SOFTWARE", data[0].SoftwareSubCategoryID)
      getReferenceStatus(data[0].SoftwareStatus);
      //getCompany(data[0].SoftwareCompanyID);
      $("#modal-software-form").modal("show");
    }
  })
}

const validateSoftware = (event) => {
  $.ajax({
    url: "/misc/software-list",
    method: "GET",
    async: false,
    success: function (data) {
      let isExist;
      const softwareList = data.data;

      softwareList.forEach(e => {
        if (
          e.SoftwareName === $("#inpt-softwareName").val() &&
          e.SoftwareDescription === $("#inpt-softwareDescription").val() &&
          e.SoftwareRemarks === $("#inpt-softwareRemarks").val()
        ) {
          isExist = true;
        }
      });
      if (isExist) {
        event.preventDefault();
        alert('Record already exist');
      }
    }
  });
};

const defaultValues = () => {
  $("#inph-softwareId").val();
  $("#inpt-softwareName").val("");
  $("#inpt-softwareDescription").val("");
  $("#inpt-softwareRemarks").val("");
}

