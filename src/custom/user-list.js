$(document).on("show.bs.modal", ".modal", function () {
  var zIndex = 1040 + 10 * $(".modal:visible").length;
  $(this).css("z-index", zIndex);
  $(this).css("overflow", "scroll")
  setTimeout(function () {
    $(".modal-backdrop")
      .not(".modal-stack")
      .css("z-index", zIndex - 1)
      .addClass("modal-stack");
  }, 0);
});

let user;

const loadUsers = (personnelID, userGroup) => {
  return $("#table-get-user").DataTable({
    retrieve: true,
    destroy: true,
    ajax: {
      url: "/misc/user-list",
      data: { personnelID, userGroup },
      method: "GET"
    },
    columnDefs: [
      { "targets": [0], "visible": false },
      { "targets": [1], "visible": false },
      { "title": "<strong>First Name</strong>", "targets": 2 },
      { "title": "<strong>Middle Name</strong>", "targets": 3 },
      { "title": "<strong>Last Name</strong>", "targets": 4 },
      { "title": "<strong>Position</strong>", "targets": 5 },
    ],
    columns: [
      {
        orderable: false,
        data: null,
        defaultContent: ""
      },
      { data: "PersonnelID" },
      { data: "PersonnelFname" },
      { data: "PersonnelMname" },
      { data: "PersonnelLname" },
      { data: "PersonnelPosition" }
    ]
  });
};

$(document).on("show.bs.modal", "#modal-user-list", function () {
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: data => {
      user = data.data[0];
    }
  });
  let userTable = loadUsers(user.PersonnelID, $("#personnelList").val());

  $("#table-get-user tbody").on("click", "tr", function () {
    const getPersonnelDetails = userTable.row(this).data();
    getPersonnel($("#personnelList").val(), getPersonnelDetails);
    $("#modal-user-list").modal("hide");
  });
});

$(document).on("hide.bs.modal", "#modal-user-list", function () {
  $("#table-get-user").DataTable().off("click", "tr").destroy();
  $("#table-get-user").empty();
});

let getPersonnel = (listName, data) => {
  const getPersonnelName = data.PersonnelLname + ", " + data.PersonnelFname;
  switch (listName) {
    case "ISS":
      $("#inpt-assignedTo").val(getPersonnelName);
      $("#inph-assignedTo").val(data.PersonnelID);
      if (data.PersonnelID !== user.PersonnelID) {
        $('#txt-actions').attr("readonly", "readonly");
      } else { 
        $('#txt-actions').removeAttr("readonly");
      }
      break;
    case "Approver":
      $("#ApprovedByName").val(getPersonnelName);
      $("#ApprovedBy").val(data.PersonnelID);
      break;
    case "Requestor":
      $("#inpt-requestedBy").val(getPersonnelName + "--" + data.PersonnelPosition);
      $("#inph-requestedBy").val(data.PersonnelID);
      $("#inph-company").val(data.CompanyID);
      $("#inph-department").val(data.DepartmentID);
      $("#inph-section").val(data.SectionID);
      $("#inpt-company").val(data.CompanyInitial);
      $("#inpt-department").val(data.DepartmentName);
      $("#inpt-section").val(data.SectionDescription);
      break;
    case "SQA":
      $("#inpt-reviewedBy").val(getPersonnelName);
      $("#inph-reviewedBy").val(data.PersonnelID);
      break;
  }
};

