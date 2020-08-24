(function() {
  let joTable = {};
  let joItemsTable = {};
  
  // TODO:
  // [] Validation
  // [] Spinner Icon
  // [] Confirmation Message
  // [] Using Files
  
  // Events
  $(document).ready(function () {
    let personnelUserGroup;
    $.ajax({
      url: "/misc/user",
      method: "GET",
      async: false, 
      success: (data) => {
        personnelUserGroup = data.data[0].UserGroupName;
      }
    })
    joTable = loadJOTable(personnelUserGroup);
    joItemsTable = loadJITable();
    $("#table-job-order tbody").on("click", "td.details-control", function() {
      var tr = $(this).closest("tr");
      var row = joTable.row(tr);
      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass("shown");
      } else {
        // Open this row
        row.child(joTableChild(row.data())).show();
        tr.addClass("shown");
      }
    });
  });
  
  $("#btn-addJobOrder").on("click", function () {
    const addModal = $("#modal-job-order-form");
    $.ajax({
      url: "/jobs/job-order/" + "Add/" + 0,
      method: "GET",
      success(data) {
        $("#inpt-joNumber").val(data.jobOrderNumber[0].JobOrderNumber)
        defaultValues(data.formDetails)
      }
    })
    addModal.modal("show");
  });
  
  $(document).on('click', '.tbljO-viewRow', function () {
    const editModal = $("#modal-job-order-form");
    let rowIndex = $(this).closest('tr').index();
    let rowJoNum = joTable.cell(rowIndex, 2).data();
    $("#sel-department").removeAttr("readonly");
    $("#sel-section").removeAttr("readonly");
    $.ajax({
      url: "/jobs/job-order/" + "View/" + rowJoNum,
      method: "GET",
      success(data) {
        let joDetails = data.jobOrder.details[0];
        let joItems = data.jobOrder.jobItems;
        let formDetails = data.formDetails;
        $("#inph-joId").val(joDetails.JobID);
        $("#lnk-jrNumber").text(joDetails.RequestNumber);
        $("#inpt-joNumber").val(joDetails.JobNumber);
        getPriority(formDetails.priority, joDetails.PriorityID);
        getStatus(formDetails.status, joDetails.StatusID);
        getAttachedFilesForJO(formDetails.attachedFile)
        $("#inpt-requestedBy").val(joDetails.RequestedByName); 
        $("#inph-requestedBy").val(joDetails.RequestedBy);
        $("#inpt-assignedTo").val(joDetails.AssignedToName);
        $("#inph-assignedTo").val(joDetails.AssignedTo);
        $("#inpt-reviewedBy").val(joDetails.ReviewedByName);
        $("#inph-reviewedBy").val(joDetails.ReviewedBy);
        getCompany(formDetails.company, joDetails.CompanyID)
        getDepartment(formDetails.department, joDetails.DepartmentID)
        getSection(formDetails.section, joDetails.SectionID)
        $("#inpd-dateRequested").val(joDetails.DateRequested.slice(0, 10));
        $("#inpd-deadline").val(joDetails.Deadline.slice(0, 10));
        $("#inpd-dateServed").val(joDetails.DateServed.slice(0, 10));
        $("#txt-details").val(joDetails.Details);
        $("#txt-actions").val(joDetails.Actions);
        $("#txt-remarks").val(joDetails.Remarks);
        joItemsTable.rows.add(getJobItems(joItems)).draw();
      }
    })
    editModal.modal("show");
  })

  $(document).on('click', '.tbljO-deleteRow', function () {
    let rowIndex = joTable.row(".selected").index();
    let rowJONum = joTable.cell(rowIndex, 2).data();
    const deleteModal = $("#modal-confirmDeleteJO");
    $("#inph-jobOrderNumber").val(rowJONum);
    deleteModal.modal("show");
  })

  
  $(".viewPersonnelList").on("click", function () {
    const childModal = $("#modal-user-list");
    $("#personnelList").val($(this).data("personnel"));
    childModal.modal("show");
  });
  
  $("#btn-submit-addJobItems").on("click", function () {
    const jobItemModal = $("#modal-job-items");
    jobItemModal.modal("show");
    $("#inpt-joNumber").val()
    defaultValues();
  });
  
  $("#btn-submit-clearJobItems").on("click", function () {
    joItemsTable.clear().draw();
  })
  
  $("#btn-submit-jobOrder").on("click", function () {
    const jobItemTable = $("#table-job-items").DataTable();
    let getJobItems = [];
    let jobItemParams = [];
  
    jobItemTable.rows().every(function () {
      const jobItems = Object.entries(this.data())
      jobItems.unshift(["JobNumber", $("#inpt-joNumber").val()])
      getJobItems = jobItems.map(element => {
        let objVal = { ...element }
        element = { name: objVal[0], value: objVal[1] };
        return element;
      })
      jobItemParams.push(getJobItems);
    })
    
    // $("#test1").val($("#table-job-items").data("jobItems", JSON.stringify(jobItemParams)))
    // console.log($("#test1").val())
    $.ajax({
      url: "/jobs/job-orders",
      method: "POST",
      data: {
        joId: $("#inph-joId").val(),
        jrNum: $("#lnk-jrNumber").text(),
        joNum: $("#inpt-joNumber").val(),
        joPriority: $("#sel-joPriority").val(),
        joStatus: $("#sel-joStatus").val(),
        joRequestedBy: $("#inph-requestedBy").val(), 
        joAssignedTo: $("#inph-assignedTo").val(),
        joReviewedBy: $("#inph-reviewedBy").val(),
        joCompany: $("#sel-company").val(), 
        joDepartment: $("#sel-department").val(),
        joSection: $("#sel-section").val(),
        joDateRequested: $("#inpd-dateRequested").val(),
        joDeadline: $("#inpd-deadline").val(),
        joDateServed: $("#inpd-dateServed").val(),
        joDetails: $("#txt-details").val(), 
        joActions: $("#txt-actions").val(),
        joRemarks: $("#txt-remarks").val(),  
        jobItems: JSON.stringify(jobItemParams)
      },
      success(data) {
        // TODO: 
        // - Validation 
        // - Spinner Icon
        // - Confirmation Message
        // - Using Files
        $("#modal-job-order-form").find('input[type="text"],input[type="hidden"],textarea,select').val('');
        $("#inpt-joNumber").val(data[0].JobOrderNumber); 
        $("#modal-job-order-form").modal("hide");
      }
    });
  });
  
  $("#lnk-jrNumber").on("click", function () {
    const jobRequestModal = $("#modal-job-requests");
    jobRequestModal.modal("show");
  }) 
  
  $(document).on("hide.bs.modal", "#modal-job-order-form", function () {
    $("#table-job-order").DataTable().ajax.reload();
    $("a.badge").empty();
  })
  
  $(document).on("show.bs.modal", "#modal-job-order-form", function () {
    $.ajax({
      url: "/jobs/job-order/" + "Authenticate/" + 0,
      method: "GET",
      success(data) {
        switch (data.jobOrder.userGroupName) {
          case "ISS":
            $(".viewPersonnelList").remove();
            $("#sel-joPriority").attr('disabled', 'disabled');
            $("#sel-joStatus").attr('disabled', 'disabled');
            $("#inpt-requestedBy").attr('readonly', 'readonly');
            $("#inpt-assignedTo").attr('readonly', 'readonly');
            $("#inpt-reviewedBy").attr('readonly', 'readonly');
            $("#sel-company").attr('disabled', 'disabled');
            $("#sel-department").attr('disabled', 'disabled');
            $("#sel-section").attr('disabled', 'disabled');
            $("#inpd-dateRequested").attr('readonly', 'readonly');
            $("#inpd-deadline").attr('readonly', 'readonly');
            $("#inpd-dateServed").attr('readonly', 'readonly');
            $("#txt-details").attr('readonly', 'readonly');
            $("#txt-remarks").attr('readonly', 'readonly');
            $("#btn-submit-addJobItems").remove();
            $("#btn-submit-clearJobItems").remove();
            break;
          case "SQA":
            $(".viewPersonnelList").remove();
            $("#sel-joPriority").attr('disabled', 'disabled');
            $("#inpt-requestedBy").attr('readonly', 'readonly');
            $("#inpt-assignedTo").attr('readonly', 'readonly');
            $("#inpt-reviewedBy").attr('readonly', 'readonly');
            $("#sel-company").attr('disabled', 'disabled');
            $("#sel-department").attr('disabled', 'disabled');
            $("#sel-section").attr('disabled', 'disabled');
            $("#inpd-dateRequested").attr('readonly', 'readonly');
            $("#inpd-deadline").attr('readonly', 'readonly');
            $("#inpd-dateServed").attr('readonly', 'readonly');
            $("#txt-details").attr('readonly', 'readonly');
            $("#txt-actions").attr('readonly', 'readonly');
            $("#btn-submit-addJobItems").remove()
            $("#btn-submit-clearJobItems").remove()
            // NOTICE: Guide For Job Review
            $(".rate-popover").css("pointer-events", "none");
            break;
          case "Admin":
            $("#txt-remarks").attr('readonly', 'readonly');
            $("#txt-actions").attr('readonly', 'readonly');
            break;
        }
      }
    })
  })
  
  // Functions
  const getJobItems = (item = []) => {
    $("#table-job-items").DataTable().clear().draw();
    let jobItems = $.map(item, function (item) {
      return item;
    })
    return jobItems
  }
  
  const getPriority = (priorityList = [], priorityID) => {
    $("#sel-joPriority").empty();
    let obtainedData = "";
    let getPriorityList = priorityList.map(element => {
      return {
        PriorityName: element.PriorityName,
        PriorityID: element.PriorityID
      };
    });
    getPriorityList
      .filter(
        val =>
          val.PriorityName !== null &&
          val.PriorityName !== undefined &&
          val.PriorityName !== val.PriorityName
      )
      getPriorityList.forEach(element => {
      obtainedData +=
        "<option value=" +
        element.PriorityID +
        ">" +
        element.PriorityName +
        "</option>";
    });
    $("#sel-joPriority").append(obtainedData);
    $("select[id='sel-joPriority'] option[value='" + priorityID + "']").attr('selected', 'selected');
  };
  
  const getStatus = (statusList = [], statusID) => {
    $("#sel-joStatus").empty();
    let obtainedData = "";
    let getStatusList = statusList.map(element => {
      return {
        StatusName: element.StatusName,
        StatusID: element.StatusID
      };
    });
    getStatusList
      .filter(
        val =>
          val.StatusName !== null &&
          val.StatusName !== undefined &&
          val.StatusName !== val.StatusName
      )
      getStatusList.forEach(element => {
      obtainedData +=
        "<option value=" +
        element.StatusID +
        ">" +
        element.StatusName +
        "</option>";
    });
    $("#sel-joStatus").append(obtainedData);
    $("select[id='sel-joStatus'] option[value='" + statusID + "']").attr('selected', 'selected');
  };
  
  const defaultValues = (formDetails) => {
    $("#txt-details").val("")
    // TODO: Refactor these 5 functions!
    // getCompany(formDetails.company, formDetails.company[0].CompanyID)
    // getDepartment(formDetails.department, formDetails.department[0].DepartmentID)
    // getSection(formDetails.section, formDetails.section[0].SectionID)
    // getPriority(formDetails.priority, formDetails.priority[0].PriorityID)
    // getStatus(formDetails.status, formDetails.status[0].StatusID)
    $("#inpt-requestedBy").val("")
    $("#inpt-assignedTo").val("")
    $("#inpt-reviewedBy").val("")
    $("#table-job-items").DataTable().clear().draw();
  }

  function getAttachedFilesForJO(files = []) {
    $(".jo-files").remove();
    if (files.length != 0) {
      files.forEach(element => {
        $("#jo-attachedFile").append('<a href="/'+element.FileName+'"target="_blank" class="badge badge-default jo-files ml-1">'+element.OriginalName+'</a>');
      });
    }
  }
})();

