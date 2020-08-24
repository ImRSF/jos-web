import { getReferenceStatus, getCompany, validateFieldByInputLength, validateForm } from "../misc.js";
import { loadMiscellaneousTable } from "./table-miscellaneous.js";

  let miscellaneousTable = {};
  $(document).ready(function () { 
    $.ajax({
      url: "/misc/user",
      method: "GET",
      success: function (data) {
        const userGroupName = data.data[0].UserGroupName;
        miscellaneousTable = loadMiscellaneousTable();
        // if (userGroupName !== "Admin") {
        //   // NOTICE: Dynamically Hide Columns in DataTables
        //   let getActionColumns = miscellaneousTable.column(4);
        //   getActionColumns.visible(false);
        // }
      }
    });
  });

  $("#btn-addMiscellaneous").on("click", () => {
    defaultValues();
    // getReferenceStatus();
    // getCompany();
    $("#modal-miscellaneous-form").modal("show");
  });

  $(document).on("click", ".tblmiscellaneous-editRow", function () {
    let itemId = miscellaneousTable.row($(this).closest("tr")).data().MiscItemID;
    $.ajax({
      url: "/misc/miscellaneous",
      method: "GET",
      data: { itemID: itemId },
      success: function (data) {
        $("#inph-itemId").val(data[0].MiscItemID);
        $("#inpt-itemName").val(data[0].MiscItemName);
        $("#txt-itemDescription").val(data[0].MiscItemDescription);
        // getReferenceStatus(data[0].MiscItemStatusID); 
        // getCompany(data[0].MiscItemCompanyID);
        $("#modal-miscellaneous-form").modal("show");
      }
    })
  });

  $(document).on("click", ".tblmiscellaneous-deleteRow", function () {
    let itemId = miscellaneousTable.row($(this).closest("tr")).data().MiscItemID;
    $("#inph-deleteMiscellaneous").val(itemId);
    $("#modal-confirmDeleteMiscellaneous").modal("show");
  });

  $("#btn-submit-miscellaneous").on("click", function(e) {
    // TODO: Refactor this validation
    validateMiscellaneous(e);
    validateFieldByInputLength("inpt-itemName", 50, "This field can only accept 50 characters or below.");
    validateFieldByInputLength("inpt-itemDescription", 50, "This field can only accept 50 characters or below.");
    validateForm(e);
  }); 

  const validateMiscellaneous = (event) => {
    $.ajax({
      url: "/misc/miscellaneous-list",
      method: "GET",
      async: false,
      success: function(data) {
        let isExist;
        const miscellaneousList = data.data;
        
        miscellaneousList.forEach(e => {
          if (
            e.MiscItemName === $("#inpt-itemName").val() &&
            e.MiscItemDescription === $("#inpt-itemDescription").val()
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
    $("#inph-itemId").val();
    $("#inpt-itemName").val("");
    $("#inpt-itemDescription").val("");
    $("#inpt-itemInitial").val("");
  }
