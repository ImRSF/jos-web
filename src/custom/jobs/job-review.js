/* Formatting function for row details - modify as you need */
import { loadJobReviewTable } from "./table-job-review.js";
import {
  viewJRDetailedReport,
  viewJODetailedReport,
  getElementIds,
  bindDataToForm,
  ajaxCaller
} from "../misc.js";
import { Validate, validateFormElements, isFormValid } from "../validation.js";

let ratingValue;
let jobReviewTable = {};
let user;

export const isLastJOReviewed = async (employeeNo) => {
  let isReviewed = false;
  const AJAX_REQ_GET_LAST_JO_REVIEWED = {
    method: "GET",
    url: "/jobs/get-lastJOReviewed",
    data: { employeeNo: employeeNo },
    success: function (data) {
      if (data.length) {
        $(".close-jobReview").hide();
        $("#addReview").removeClass("col-sm-6");
        $("#addReview").addClass("col-sm-12");
        getRatingValue(5);
        $("#lbl-date").text("Date Served");
        // bindDataToForm is not used due to ID conflicts
        $(".reviewedBy").hide();
        $("#AssignedToName").val(data[0].AssignedToName);
        $("#ReviewJONumber").val(data[0].JobNumber);
        $("#ReviewDate").attr("type", "text");
        $("#ReviewDate").val(data[0].DateServed.substring(0, 10));
        $("#ReviewedTo").val(data[0].AssignedToName);
        $("#ReviewValue").val(5);
        $("#ReviewJRNumber").val(data[0].RequestNumber);
        $("#ReviewJONumber").val(data[0].JobNumber);
        $("#modal-job-review-form").modal("show");
        isReviewed = true;
      }
    }
  }
  await ajaxCaller(AJAX_REQ_GET_LAST_JO_REVIEWED);
  return isReviewed;
};

const validateJobReview = () => {
  const validationRules = [
    {
      id: "ReviewSubject",
      rules: function () {
        const validate = new Validate($("#ReviewSubject").val());
        return validate.isRequired().validationResult;
      }
    },
    {
      id: "ReviewDescription",
      rules: function () {
        const validate = new Validate($("#ReviewDescription").val());
        return validate.isRequired().validationResult;
      }
    }
  ]
  return isFormValid(validateFormElements(validationRules), () => {
    alert("There are fields that failed the validation rules. Please check the fields marked in red.");
  })
};

const addJobReview = () => {
  $.ajax({
    url: "/jobs/add-review",
    method: "POST",
    data: {
      reviewId: $("#ReviewID").val(),
      reviewJOnum: $("#ReviewJONumber").val(),
      reviewSubject: $("#ReviewSubject").val(),
      reviewDescription: $("#ReviewDescription").val(),
      reviewReviewerId: $("#ReviewerID").val(),
      reviewRatingValue: $("#ReviewValue").val()
    },
    success: function () {
      $("#modal-job-review-form").modal("hide");
    }
  })
  $("#modal-confirmJobRequest").modal("show");
};

const getRatingValue = ratingValue => {
  switch (ratingValue) {
    case 1:
      $("#oneStar").addClass("oneStar");
      break;
    case 2:
      $("#oneStar").addClass("oneStar twoStars");
      $("#twoStars").addClass("oneStar twoStars");
      break;
    case 3:
      $("#oneStar").addClass("oneStar twoStars threeStars");
      $("#twoStars").addClass("oneStar twoStars threeStars");
      $("#threeStars").addClass("oneStar twoStars threeStars");
      break;
    case 4:
      $("#oneStar").addClass("oneStar twoStars threeStars fourStars");
      $("#twoStars").addClass("oneStar twoStars threeStars fourStars");
      $("#threeStars").addClass("oneStar twoStars threeStars fourStars");
      $("#fourStars").addClass("oneStar twoStars threeStars fourStars");
      break;
    case 5:
      $("#oneStar").addClass("oneStar twoStars threeStars fourStars fiveStars");
      $("#twoStars").addClass(
        "oneStar twoStars threeStars fourStars fiveStars"
      );
      $("#threeStars").addClass(
        "oneStar twoStars threeStars fourStars fiveStars"
      );
      $("#fourStars").addClass(
        "oneStar twoStars threeStars fourStars fiveStars"
      );
      $("#fiveStars").addClass(
        "oneStar twoStars threeStars fourStars fiveStars"
      );
      break;
  }
};

const getReviewDetails = reviewId => {
  $.ajax({
    url: "/jobs/job-review",
    data: { reviewID: reviewId },
    method: "GET",
    success: function (data) {
      const jobReviewDetails = data.getJobReviews[0];
      bindDataToForm(getElementIds("get-jobReview-details"), jobReviewDetails);
      bindDataToForm(getElementIds("get-jobReview-date"), jobReviewDetails, (date) => date.slice(0, 10));
      getRatingValue(jobReviewDetails.ReviewValue);
      $("#ReviewJONumber").val(jobReviewDetails.JobNumber);
      $("#ReviewJRNumber").val(jobReviewDetails.RequestNumber);
      $("#modal-job-review-form").modal("show");
    }
  });
};

$(document).ready(function () {
  $.ajax({
    url: "/misc/user",
    method: "GET",
    async: false,
    success: data => {
      user = data.data[0];
    }
  });
  jobReviewTable = loadJobReviewTable(user.PersonnelID);
});

$(document).on("show.bs.modal", ".modal", function () {
  var zIndex = 1040 + 10 * $(".modal:visible").length;
  $(this).css("z-index", zIndex);
  $(this).css("overflow", "scroll");
  setTimeout(function () {
    $(".modal-backdrop")
      .not(".modal-stack")
      .css("z-index", zIndex - 1)
      .addClass("modal-stack");
  }, 0);
});

$(document).on("hide.bs.modal", "#modal-job-review-form", function () {
  getRatingValue(5);
  $("#modal-job-review-form")
    .find('input[type="text"],input[type="hidden"],textarea,select')
    .val("");
});

$(document).on("click", ".tbljobReview-viewRow", function () {
  $("#text-intro").hide();
  $("#btn-getJOforReview").hide();
  $("#btnCancel").removeClass("col-sm-6");
  $("#btnCancel").addClass("col-sm-12");
  $("#ReviewSubject").attr("readonly", "readonly");
  $("#ReviewDescription").attr("readonly", "readonly");
  let reviewId = jobReviewTable.row($(this).closest("tr")).data().ReviewID;
  getReviewDetails(reviewId);
  $(".rate-popover").css("pointer-events", "none");
  $("#btn-submit-jobReview").hide();
});

$(".rate-popover").on("click", function () {
  ratingValue = $(this).data("value");
  $("#ReviewValue").val(ratingValue);
});

$("#btn-getJRDetailReport").on("click", function () {
  const jrNumber = $("#ReviewJRNumber").val();
  viewJRDetailedReport(jrNumber);
});

$("#btn-getJODetailReport").on("click", function () {
  const joNumber = $("#ReviewJONumber").val();
  viewJODetailedReport(joNumber);
});

$("#btn-submit-jobReview").on("click", function () {
  if (validateJobReview()) {
    addJobReview();
  }
});


