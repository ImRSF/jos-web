import { jobRequestDetailedReport } from "../custom/stats/rpt-jobRequest-detailed.js";
import { jobOrderDetailed } from "../custom/stats/rpt-jobOrder-detailed.js";

export const displayEmptyFieldIfDateIsNull = (dateField) => {
  // Uses Vanilla JS
  const dateInput = document.getElementById(dateField)
  if (dateInput.value === "1900-01-01" || !dateInput.value) {
    dateInput.type = "text"
    dateInput.value = ""
  }
};

export const displayBlankIfValueIsNull = (value) => {
  if (value === undefined || value === null) {
    return ""
  } else {
    return value;
  }
};

export const getCompany = (compID = "") => {
  $("#sel-company").empty();
  $.ajax({
    url: "/misc/company",
    method: "GET",
    error: function (error) {
      console.log("AJAX Error: " + error);
    },
    success: function (response) {
      const comp = response.data;
      let obtainedData = "";
      let getComp = comp.map(element => {
        return {
          CompanyInitial: element.CompanyInitial,
          CompanyID: element.CompanyID
        };
      });
      getComp.filter(
        val => val.CompanyInitial !== null && val.CompanyInitial !== undefined
      );
      getComp.forEach(element => {
        obtainedData +=
          "<option value=" +
          element.CompanyID +
          ">" +
          element.CompanyInitial +
          "</option>";
      });
      $("#sel-company").append(obtainedData);
      $("select[id='sel-company'] option[value='" + compID + "']").attr(
        "selected",
        "selected"
      );
    }
  });
};

export const getUserGroup = (userGroupID = "", cb) => {
  $("#sel-userGroup").empty();
  $.ajax({
    url: "/auth/userGroup",
    method: "GET",
    error: function (error) {
      console.log("AJAX Error: " + error);
    },
    success: function (data) {
      let userGroup = data.userGroupList;
      let obtainedData = "";
      let getUserGroup = userGroup.map(element => {
        return {
          UserGroupName: element.UserGroupName,
          UserGroupID: element.UserGroupID
        };
      });
      getUserGroup.filter(
        val => val.UserGroupName !== null && val.UserGroupName !== undefined
      );
      getUserGroup.forEach(element => {
        obtainedData +=
          "<option value=" +
          element.UserGroupID +
          ">" +
          element.UserGroupName +
          "</option>";
      });
      $("#sel-userGroup").append(obtainedData);

      $("select[id='sel-userGroup'] option[value='" + userGroupID + "']").attr(
        "selected",
        "selected"
      );
      cb();
    }
  });
};

export const getAssignedApprover = (employeeNo, approverId = "") => {
  $("#sel-approver").empty();
  $.ajax({
    url: "/misc/getApprover",
    method: "GET",
    data: { employeeNo: employeeNo },
    success: function (data) {
      const approvers = data;
      let obtainedData = "";
      let getApprovers = approvers.map(element => {
        return {
          ApproverInitial: element.PersonnelInitial,
          ApproverID: element.PersonnelID
        };
      });
      getApprovers.filter(
        val =>
          val.ApproverInitial !== null &&
          val.ApproverInitial !== undefined &&
          val.ApproverInitial !== val.ApproverInitial
      );
      getApprovers.forEach(element => {
        obtainedData +=
          "<option value=" +
          element.ApproverID +
          ">" +
          element.ApproverInitial +
          "</option>";
      });
      $("#sel-approver").append(obtainedData);
      $("select[id='sel-approver'] option[value='" + approverId + "']").attr(
        "selected",
        "selected"
      );
    }
  });
};

export const getSubCategory = (
  selectId = "",
  colName,
  searchVal,
  subCategoryID
) => {
  const select = $("#" + selectId);
  select.empty();
  $.ajax({
    url: "/misc/category",
    method: "GET",
    data: { colName: colName, searchVal: searchVal },
    success: function (response) {
      const cat = response.data;
      let obtainedData = "";
      let getCategory = cat.map(element => {
        return {
          SubCategoryName: element.SubCategoryName,
          SubCategoryID: element.SubCategoryID
        };
      });
      getCategory.filter(
        val =>
          val.SubCategoryName !== null &&
          val.SubCategoryName !== undefined &&
          val.SubCategoryName !== val.SubCategoryName
      );
      getCategory.forEach(element => {
        obtainedData +=
          "<option value=" +
          element.SubCategoryID +
          ">" +
          element.SubCategoryName +
          "</option>";
      });
      select.append(obtainedData);
      $(
        "select[id='" + selectId + "'] option[value='" + subCategoryID + "']"
      ).attr("selected", "selected");
    }
  });
};

export const getCategory = (selectId = "", colName, searchVal, categoryID) => {
  const select = $("#" + selectId);
  select.empty();
  $.ajax({
    url: "/misc/categoryOnly",
    method: "GET",
    data: { colName: colName, searchVal: searchVal },
    success: function (response) {
      const cat = response.data;
      let obtainedData = "";
      let getCategory = cat.map(element => {
        return {
          CategoryName: element.CategoryName,
          CategoryID: element.CategoryID
        };
      });
      getCategory.filter(
        val =>
          val.CategoryName !== null &&
          val.CategoryName !== undefined &&
          val.CategoryName !== val.CategoryName
      );
      getCategory.forEach(element => {
        obtainedData +=
          "<option value=" +
          element.CategoryID +
          ">" +
          element.CategoryName +
          "</option>";
      });
      select.append(obtainedData);
      $(
        "select[id='" + selectId + "'] option[value='" + categoryID + "']"
      ).attr("selected", "selected");
    }
  });
};

export const getStatus = isActive => {
  if (isActive === true) {
    $("#sel-accountStatus option:contains('Active')").attr(
      "selected",
      "selected"
    );
  } else {
    $("#sel-accountStatus option:contains('Inactive')").attr(
      "selected",
      "selected"
    );
  }
};

export const getReferenceStatus = referenceStatusID => {
  $("#sel-referenceStatus").empty();
  $.ajax({
    url: "/misc/referenceStatus",
    method: "GET",
    error: function (error) {
      console.log("AJAX Error: " + error);
    },
    success: function (data) {
      let getReferenceStatus = data;
      let obtainedData = "";
      getReferenceStatus.forEach(element => {
        obtainedData +=
          "<option value=" +
          element.ReferenceStatusID +
          ">" +
          element.ReferenceStatusName +
          "</option>";
      });
      $("#sel-referenceStatus").append(obtainedData);
      $(
        "select[id='sel-referenceStatus'] option[value='" +
        referenceStatusID +
        "']"
      ).attr("selected", "selected");
    }
  });
};

export const getJOPriority = (priorityList = [], priorityID) => {
  $("#sel-joPriority").empty();
  let obtainedData = "";
  let getPriorityList = priorityList.map(element => {
    return {
      PriorityName: element.PriorityName,
      PriorityID: element.PriorityID
    };
  });
  getPriorityList.filter(
    val =>
      val.PriorityName !== null &&
      val.PriorityName !== undefined &&
      val.PriorityName !== val.PriorityName
  );
  getPriorityList.forEach(element => {
    obtainedData +=
      "<option value=" +
      element.PriorityID +
      ">" +
      element.PriorityName +
      "</option>";
  });
  $("#sel-joPriority").append(obtainedData);
  $("select[id='sel-joPriority'] option[value='" + priorityID + "']").attr(
    "selected",
    "selected"
  );
};

export const getJOStatus = (statusList = [], statusID) => {
  $("#sel-joStatus").empty();
  let obtainedData = "";
  let getStatusList = statusList.map(element => {
    return {
      StatusName: element.StatusName,
      StatusID: element.StatusID
    };
  });
  getStatusList.filter(
    val =>
      val.StatusName !== null &&
      val.StatusName !== undefined &&
      val.StatusName !== val.StatusName
  );
  getStatusList.forEach(element => {
    obtainedData +=
      "<option value=" +
      element.StatusID +
      ">" +
      element.StatusName +
      "</option>";
  });
  $("#sel-joStatus").append(obtainedData);
  $("select[id='sel-joStatus'] option[value='" + statusID + "']").attr(
    "selected",
    "selected"
  );
};

export const getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined
        ? true
        : decodeURIComponent(sParameterName[1]);
    }
  }
};

export const getActionByUserGroup = (userGroupID, callback) => {
  switch (userGroupID) {
    case 3:
      $(".category").hide();
      $(".category-item").each(function () {
        $(this).val(0);
      });
      $("#btn-searchApprover").show();
      $("#sel-approver").show();
      break;
    case 5:
      $(".category").hide();
      $(".category-item").each(function () {
        $(this).val(0);
      });
      $("#btn-searchApprover").hide();
      $("#sel-approver").hide();
      break;
    default:
      $("#btn-searchApprover").hide();
      $("#sel-approver").hide();
      callback();
      break;
  }
};

export const selectCategory = (categoryData) => {
  $("#category-error").remove();
  attachCategory(
    categoryData
  );
  $("#inph-categoryId").val(
    categoryData.CategoryID
  );
  $("#inph-subCategoryId").val(
    categoryData.SubCategoryID
  );
  $("#inph-categoryItemId").val(categoryData.CategoryItemID);
  $("#modal-job-category").modal("hide");
}

export const viewJRDetailedReport = (requestNumber) => {
  if (!requestNumber) {
    return;
  } else {
    $.ajax({
      url: "/jobs/job-request",
      method: "GET",
      data: { requestNumber: requestNumber },
      success: data => {
        const doc = new jsPDF({
          orientation: "p",
          unit: "mm",
          format: "letter",
          putOnlyUsedFonts: true
        });
        jobRequestDetailedReport(doc, data.jobRequestList[0]);
      },
      error: error => {
        console.log("AJAX Error: " + error);
      }
    });
  }
}

export const viewJODetailedReport = (joNumber) => {
  if (!joNumber) {
    return;
  } else {
    $.ajax({
      url: "/jobs/job-order/" + "View/" + joNumber,
      method: "GET",
      success(data) {
        let joDetails = data.jobOrder.details[0];
        let jobItems = data.jobOrder.jobItems;
        const doc = new jsPDF({
          orientation: "p",
          unit: "mm",
          format: "letter",
          putOnlyUsedFonts: true
        });
        jobOrderDetailed(doc, joDetails, jobItems);
      }
    });
  }
}

export const attachCategory = (categoryData) => {
  const categories = `${categoryData
    .CategoryName}-${categoryData.SubCategoryName}`;
  $("#inph-categoryId").val(
    categoryData.CategoryID
  );
  $("#inph-subCategoryId").val(
    categoryData.SubCategoryID
  );
  $("#inpt-attachedCategory").val("");
  $("#inpt-attachedCategory").val(categories);
};

export const validateFile = (fileUploader, fileExtension = []) => {
  let uploader = $("#" + `${fileUploader}`);
  uploader.next(".file-validation--error").remove();
  const getFiles = [...uploader[0].files];
  if (getFiles.length <= 5) {
    const serverDefaults = getServerDefaults("Production");
    uploader.next(".file-validation--error").remove();
    if (uploader.get(0).files.length == 0) {
      uploader.removeClass("is-invalid");
      uploader.next(".file-validation--error").remove();
    } else if (
      $.inArray(
        uploader
          .val()
          .split(".")
          .pop()
          .toLowerCase(),
        fileExtension
      ) == -1
    ) {
      const errorMessage =
        "Only formats are allowed : " + fileExtension.join(", ");
      uploader.addClass("is-invalid");
      $(
        `<sub class="text-danger file-validation--error">${errorMessage}</sub>`
      ).insertAfter(uploader);
      uploader.val("");
    } else if (getFiles.find((e) => e.size > serverDefaults[0].FileSizeLimit)) {
      uploader.addClass("is-invalid");
      $(
        `<sub class="text-danger file-validation--error">Only files less than ${serverDefaults[0].FileSizeLimit / Math.pow(1024, 2)} MB is allowed</sub>`
      ).insertAfter(uploader);
      uploader.val("");
    }
    else {
      uploader.removeClass("is-invalid");
      uploader.next(".file-validation--error").remove();
    }
  } else {
    const errorMessage = "Only a maximum of 5 files are allowed to be uploaded."
    $(
      `<sub class="text-danger file-validation--error">${errorMessage}</sub>`
    ).insertAfter(uploader);
    uploader.val("");
  }
};

export const displayDateOnly = getDate => {
  if (getDate) {
    const validDate = getDate.substring(0, 10);
    if (validDate === "1900-01-01") {
      return "";
    }
    return validDate;
  }
  return "";
};

export const displayJRDetailReport = (jrNumber) => {
  return `<a href='#' class='a-jobLink jr-detail'>${jrNumber || ""}</a>`;
};

export const displayJODetailReport = (joNumber) => {
  return `<a href='#' class='a-jobLink jo-detail'>${joNumber || ""}</a>`;
};

export const setDefaultDate = (dateFieldArr) => {
  $.ajax({
    url: "/misc/getCurrentDate",
    method: "GET",
    success: function (currentDate) {
      dateFieldArr.forEach(dateField => $(`#${dateField}`).val(currentDate));
    }
  });
};

export const getServerDefaults = () => {
  let serverDefaults;
  $.ajax({
    url: "/misc/getServerDefaults",
    async: false,
    success: function (data) {
      serverDefaults = data
    }
  });
  return serverDefaults;
};

export const validateFieldByInputLength = (
  inputField,
  inputLength,
  errorMessage
) => {
  let field = $("#" + `${inputField}`);
  field.next(".validation-error").remove();
  if (field.val().length >= inputLength) {
    field.addClass("is-invalid");
    $(
      `<sub class="text-danger validation-error">${errorMessage}</sub>`
    ).insertAfter(field);
  } else {
    field.removeClass("is-invalid");
    field.next(".validation-error").remove();
  }
};

export const validateForm = (event) => {
  if ($(".validation-error").length != 0) {
    event.preventDefault();
    alert("There are fields that failed the validation rules. Please check the fields marked in red.");
  }
};

export const removeSpecialCharacters = str => {
  if (!str) {
    return "";
  }
  return str.replace(/[^0-9 ]/g, "");
};

export const displayValidDate = (date) => {
  return date === "1900-01-01" ? null : date;
};

export const ajaxCaller = async (props, cb) => {
  return await $.ajax(props);
};

export const getElementIds = (className, cb = (data) => data) => {
  const elements = $("." + className);
  const id = [];
  elements.each((index, element) => {
    cb(id.push(element.id));
  })
  return id;
};

export const bindDataToForm = (elementIds, data, cb = (data) => data) => {
  elementIds.forEach((e) => {
    const elementId = $('#' + e);
    elementId.val(cb(data[e]));
  })
};
 
// export const displayCharacterCounter = (charLimit, element) => {
//   const successMessage = $("#" + element.attr("id") + "-success");
//   const errorMessage = $("#" + element.attr("id") + "-error");
//   // $(".char-counter").remove();
//   errorMessage.remove();
//   if (element.val().length > charLimit) {
//     errorMessage.text(`This field can only accept ${charLimit} characters or less`);
//     // $(
//     //   `<sub class="text-danger char-counter validation-error">This field can only accept ${charLimit} characters or less</sub>`
//     // ).insertAfter(element);
//     element.val(
//       element
//         .val()
//         .slice(0, charLimit)
//     );
//   } else {
//     successMessage.text(`You only have ${
//       element.val().length
//       }/${charLimit} characters left.`)
//     // $(
//     //   `<sub class="text-success char-counter">You only have ${
//     //   element.val().length
//     //   }/${charLimit} characters left.</sub>`
//     // ).insertAfter(element);
//   }
// };


// export const fetchRequest = (url) => {
//   return new Promise((resolve, reject) => {
//     resolve(fetch(`${url}`, {
//       credentials: "same-origin",
//       headers: { "Content-Type": "application/json/", "isFetchRequest": true }
//     }))
//   }) 
  // user = fetch("/misc/user", {
  //     credentials: "same-origin",
  //     headers: { "Content-Type": "application/json/", "isFetchRequest": true }
  //   })
  //   .then(res => res.json())
  //   .then(val => val)
// }


