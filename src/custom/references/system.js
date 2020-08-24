import { getSubCategory, getReferenceStatus, getCompany, validateForm, validateFieldByInputLength } from "../misc.js";
import { loadSystemTable } from "./table-system.js";

  let systemTable = {};
  $(document).ready(function() {
    $.ajax({
      url: "/misc/user",
      method: "GET",
      success: function(data) {
        const userGroupName = data.data[0].UserGroupName;
        systemTable = loadSystemTable();
      }
    });
  });

  $("#btn-addSystem").on("click", () => { 
    const systemModal = $("#modal-system-form");
    defaultValues();
    getSubCategory("sel-subCategory", "CategoryName", "SYSTEM");
    getReferenceStatus();
    getCompany();
    systemModal.modal("show");
  });

  $(document).on("click", ".tblsystem-editRow", function() {
    let systemId = systemTable.row($(this).closest("tr")).data().SystemID;
    $.ajax({
      url: "/misc/system",
      method: "GET",
      data: { systemID: systemId },
      success: function(data) {
        const systemModal = $("#modal-system-form");
        $("#inph-systemId").val(data[0].SystemID);
        $("#inpt-systemName").val(data[0].SystemName);
        $("#txt-systemDescription").val(data[0].SystemDescription);
        $("#txt-systemRemarks").val(data[0].SystemRemarks);
        getSubCategory(
          "sel-subCategory",
          "CategoryName",
          "SYSTEM",
          data[0].SystemSubCategoryID
        );
        getReferenceStatus(data[0].SystemStatusID);
        getCompany(data[0].SystemCompanyID);
        systemModal.modal("show");
      }
    });
  });

  $(document).on("click", ".tblsystem-deleteRow", function() {
    let systemId = systemTable.row($(this).closest("tr")).data().SystemID;
    const deleteModal = $("#modal-confirmDeleteSystem");
    $("#inph-deleteSystemId").val(systemId);
    deleteModal.modal("show");
  });

  $("#btn-submit-system").on("click", function(e) {
    // TODO: Refactor this validation
    //validateSystem(e);
    validateFieldByInputLength("inpt-systemName", 10, "This field can only accept 10 characters or below.");
    validateFieldByInputLength("txt-systemDescription", 50, "This field can only accept 50 characters or below.");
    validateFieldByInputLength("txt-systemRemarks", 50, "This field can only accept 50 characters or below.");
    validateForm(e)
  }); 

  const validateSystem = (event) => {
    $.ajax({
      url: "/misc/system-list",
      method: "GET",
      async: false,
      success: function(data) {
        let isExist;
        const systemList = data.data;
        
        systemList.forEach(e => {
          if (
            e.SystemName === $("#inpt-systemName").val() &&
            e.SystemDescription === $("#txt-systemDescription").val() &&
            e.SystemRemarks === $("#txt-systemRemarks").val()
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
    $("#inph-systemId").val();
    $("#inpt-systemName").val("");
    $("#txt-systemDescription").val("");
    $("#inpt-systemRemarks").val("");
  };

    