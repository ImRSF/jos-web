export function approvedJobRequestsChild(d) {
  return `<div class="tab-content py-3 px-3 px-sm-0"> 
    <div class="tab-pane fade show active" role="tabpanel" id="tab-details"> 
    <div class="form-group row"> 
    <label for="cr-sel-joPriority" class="col-sm-2 col-form-label">Job Request</label> 
    <div class="col-sm-4"> 
    <input type="text" class="form-control" id="cr-sel-joPriority" readonly value=" ${d.RequestNumber}"></input>
    </div> 
    <label for="cr-sel-joStatus" class="col-sm-2 col-form-label">Last Job Order</label>
    <div class="col-sm-4">
    <input type="text" class="form-control" id="cr-sel-status" readonly value="${d.LastJOAttached || ""}"></input>
    </div>
    </div>
    <div class="form-group row"> 
    <label for="cr-sel-joPriority" class="col-sm-2 col-form-label">Requested By</label> 
    <div class="col-sm-4"> 
    <input type="text" class="form-control" id="cr-sel-joPriority" readonly value=" ${d.PersonnelName}"></input>
    </div> 
    <label for="cr-sel-joStatus" class="col-sm-2 col-form-label">Req'd By Position</label>
    <div class="col-sm-4">
    <input type="text" class="form-control" id="cr-sel-status" readonly value="${d.PersonnelPosition}"></input>
    </div>
    </div>
    <div class="form-group row">
    <label for="cr-txt-details" class="col-sm-2 col-form-label">Workgroup</label>
    <div class="col-sm-10">
    <input type="text" class="form-control" id="cr-sel-status" readonly value="${d.CompanyInitial}-${d.DepartmentInitial}--${d.SectionDesc || ""}"></input>
    </div>
    </div>
    <div class="form-group row">
    <label for="cr-txt-details" class="col-sm-2 col-form-label">Subject</label>
    <div class="col-sm-10">
    <input type="text" class="form-control" id="cr-sel-status" readonly value="${d.RequestSubject}"></input>
    </div>
    </div>
    <div class="form-group row">
    <label for="cr-txt-actions" class="col-sm-2 col-form-label">Description</label>
    <div class="col-sm-10">
    <textarea name="" class="form-control" id="cr-txt-actions" style="resize:vertical" readonly>${d.RequestDesc}</textarea>
    </div>
    </div>
    </div>`
}

export function approvedJobRequests() {
  return $("#table-get-job-requests").DataTable({
    ajax: {
      url: "/jobs/job-requests/Attachment",
      method: "GET",
      dataSrc: "data"
    },
    columnDefs: [
      {
        targets: [1],
        visible: false
      },
      { title: "<strong>Request Number</strong>", targets: 2 },
      { title: "<strong>Date Requested</strong>", targets: 3 },
      { title: "<strong>Requested By</strong>", targets: 4 },
      { title: "<strong>Last JO Attached</strong>", targets: 5 },
      {
        'targets': 6,
        'checkboxes': {
          'selectRow': true,
          'selectAll': false
        }
      }
    ],
    'select': {
      'style': 'single',
      'selector': 'td:last-child'
    },
    order: [[1, 'asc']],
    columns: [
      {
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: ""
      },
      { data: "RequestID" },
      { data: "RequestNumber" },
      {
        data: "DateRequested",
        render: function (date) {
          if (date) {
            return date.substring(0, 10);
          }
          return ""
        }
      },
      {
        data: "PersonnelName"
      },
      { data: "LastJOAttached" },
      {
        targets: 6,
        data: "RequestID",
        defaultContent: '',
        orderable: false
      }
    ]
  });
}

function removeUndefined(getData) {
  // Ternary Operator
  // if getData is null/undefined, return ""
  return getData == null ? "" : getData;
}