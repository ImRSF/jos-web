import {
  getSubCategory,
  getReferenceStatus,
  getCompany,
  validateFieldByInputLength,
  validateForm
} from "../misc.js";
import { loadNetworkTable } from "./table-network.js";

let networkTable = {};
$(document).ready(function () {
  $.ajax({
    url: "/misc/user",
    method: "GET",
    success: function (data) {
      const userGroupName = data.data[0].UserGroupName;
      networkTable = loadNetworkTable();
      // if (userGroupName !== "Admin") {
      //   let getActionColumns = networkTable.column(5);
      //   getActionColumns.visible(false);
      // }
    }
  });
});

$("#btn-addNetwork").on("click", () => {
  $("#inpt-networkName").removeAttr("readonly");
  $("#txt-networkDescription").removeAttr("readonly");
  $("#txt-networkRemarks").removeAttr("readonly");
  $("#sel-subCategory").removeAttr("disabled");
  $("#sel-referenceStatus").removeAttr("disabled");
  $("#smallButtons").show();
  $("#bigButton").hide();
  defaultValues();
  getSubCategory("sel-subCategory", "CategoryName", "NETWORK");
  getReferenceStatus();
  //getCompany();
  $("#modal-network-form").modal("show");
});

$("#btn-syncNetwork").on("click", () => {
  $("#txt-syncNetwork").text("Syncing...")
  $.ajax({
    url: "/misc/sync/dbHIS",
    method: "GET",
    data: { syncHISItem: "network" }, 
    success: function () {
      alert("Data successfully synced.");
      $("#txt-syncNetwork").text("Sync with HIS");
      $("#table-network").DataTable().ajax.reload();
    },
    error: function(err) {
      console.log(err)
    }
  });
});

$(document).on("click", ".tblnetwork-viewRow", function () {
  $("#inpt-networkName").attr("readonly", "readonly");
  $("#txt-networkDescription").attr("readonly", "readonly");
  $("#txt-networkRemarks").attr("readonly", "readonly");
  $("#sel-subCategory").attr("disabled", "disabled");
  $("#sel-referenceStatus").attr("disabled", "disabled");
  $("#smallButtons").hide();
  $("#bigButton").show();

  let networkId = networkTable.row($(this).closest("tr")).data().NetworkID;
  networkDetails("NetworkID", networkId);
});

$(document).on("click", ".tblnetwork-editRow", function () {
  $("#inpt-networkName").removeAttr("readonly");
  $("#txt-networkDescription").removeAttr("readonly");
  $("#txt-networkRemarks").removeAttr("readonly");
  $("#sel-subCategory").removeAttr("disabled");
  $("#sel-referenceStatus").removeAttr("disabled");
  $("#smallButtons").show();
  $("#bigButton").hide();

  let networkId = networkTable.row($(this).closest("tr")).data().NetworkID;
  networkDetails("NetworkID", networkId);
});

$(document).on("click", ".tblnetwork-deleteRow", function () {
  let networkId = networkTable.row($(this).closest("tr")).data().NetworkID;
  $("#inph-deleteNetworkId").val(networkId);
  $("#modal-confirmDeleteNetwork").modal("show");
});

$("#btn-submit-network").on("click", function (e) {
  // TODO: Refactor this validation
  //validateNetwork(e);
  validateFieldByInputLength(
    "inpt-networkName",
    50,
    "This field can only accept 10 characters or below."
  );
  validateFieldByInputLength(
    "txt-networkDescription",
    100,
    "This field can only accept 100 characters or below."
  );
  validateForm(e);
});

const networkDetails = (colName, searchVal) => {
  $.ajax({
    url: "/misc/network",
    method: "GET",
    data: { colName: colName, searchVal: searchVal },
    success: function (data) {
      const networkModal = $("#modal-network-form");
      $("#inph-networkId").val(data[0].NetworkID);
      $("#inpt-networkName").val(data[0].NetworkName);
      $("#txt-networkDescription").text(data[0].NetworkDescription);
      $("#txt-networkRemarks").text(data[0].NetworkRemarks);
      getSubCategory(
        "sel-subCategory",
        "CategoryName",
        "NETWORK",
        data[0].NetworkSubCategoryID
      );
      getReferenceStatus(data[0].NetworkStatusID);
      // getCompany(data[0].NetworkCompanyID);
      networkModal.modal("show");
    }
  });
}

const validateNetwork = (event) => {
  $.ajax({
    url: "/misc/network-list",
    method: "GET",
    async: false,
    success: function (data) {
      let isExist;
      const networkList = data.data;

      networkList.forEach(e => {
        if (
          e.NetworkName === $("#inpt-networkName").val() &&
          e.NetworkDescription === $("#txt-networkDescription").val()
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
  $("#inph-networkId").val();
  $("#inpt-networkName").val("");
  $("#txt-networkDescription").val("");
};
