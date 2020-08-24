export function loadJobReviewTable(personnelID) {
  return $("#table-job-review").DataTable({
    dom: "Bfrtip",
    responsive: {
      details: false
    },
    buttons: [
      {
        extend: "print",
        autoPrint: false,
        exportOptions: { stripHtml: false, columns: [0, 1, 2, 3, 4, 5] }
      }
    ],
    columnDefs: [
      {
        targets: [0],
        visible: false
      },
      {
        targets: 6,
        responsivePriority: 1
      }
    ],
    ajax: {
      url: "/jobs/job-reviews",
      method: "GET",
      data: {personnelID: personnelID},
      dataSrc: "data"
    },
    columns: [
      { data: "ReviewID" },
      { data: "JobNumber" },
      {
        data: "ReviewDate",
        render: function(getDate) {
          if (getDate) {
            return getDate.substring(0, 10);
          }
          return "";
        }
      },
      { data: "AssignedToInitial" },
      { data: "ReviewedByInitial" },
      {
        data: "ReviewValue",
        render: function(data) {
          var markup = "";
          for (var i = 0; i < data; i++) {
            markup +=
              '<i class="fas fa-star py-2 px-1 rate-popover" id="rate1" style="color: #f3cb06;" data-index="0"' +
              'data-html="true" data-toggle="popover" data-placement="top"' +
              'title=""></i>';
          }
          return markup;
        }
      },
      {
        data: "ReviewerID",
        render: data => {
          let buttonMarkUp;
          // if (data === personnelID) {
          //   buttonMarkUp = '<div class="text-center"><button type="button" class="btn btn-sm btn-success tbljobReview-editRow">Edit Review</button></div>';
          // } else {
          buttonMarkUp =
            '<div class="text-center"><button type="button" class="btn btn-sm btn-success tbljobReview-viewRow">View Review</button></div>';
          // }
          return buttonMarkUp;
        }
      }
    ]
  });
}
  