import { loadEmployeeTable } from "../jobs/table-employee.js";
import { getJOByWorkStationTable } from "./rpt-jobOrder-workstation.js";
import { viewJODetailedReport } from "../misc.js";

let employeeTable = {};
let joWorkStationTable = {};
let filters = [];

$(document).ready(function () {
    filters = [
        { name: "EmployeeNo", value: null },
        { name: "HardwareType", value: "" },
        { name: "HardwareID", value: "" }
    ];
    joWorkStationTable = getJOByWorkStationTable(filters);
});

$("#btn-generateJOByWorkStation").on("click", function () {
    filters = [
        { name: "EmployeeNo", value: $("#inph-employeeNo").val() },
        { name: "HardwareType", value: $("#lbl-hardwareType").text() },
        { name: "HardwareID", value: $("#inph-hardwareId").val() }
    ];
    joWorkStationTable = getJOByWorkStationTable(filters);
});

$("#btn-clearFilter").on("click", function () {
    $("#lbl-hardwareType").text("Hardware Type");
    $("#inpt-hardwareType").val("");
    $("#inph-hardwareId").val("");
    $("#table-get-job-items");
    $("#inph-employeeNo").val("");
    $("#inpt-personnel").val("");
    $("#inpt-item").val("");
    $("#table-get-job-items").DataTable().clear().draw();
});

$("#btn-getEmployee").on("click", function () {
    $("#modal-employee-list").modal("show");
});

$("#btn-getItem").on("click", function () {
    $("#modal-job-items").modal("show");
});

$("#btn-addSelectedWorkStation").on("click", function () {
    const z = $("#table-get-job-items").DataTable().row('.selected').data();
    const hardwareOptions = {
        "value": z.WorkstationName,
        "id": z.WorkStatID
    }
    x("WorkStation", hardwareOptions);
    $("#inpt-item").val(`${z.ItemName}-${z.WorkstationName}--${z.ItemDescription}`);
    $("#modal-job-items").modal("hide");
});

$("#btn-addSelectedPeripheral").on("click", function () {
    const z = $("#table-get-job-items").DataTable().row('.selected').data();
    const hardwareOptions = {
        "value": z.ItemDescription,
        "id": z.ItemMasterID
    }
    x("Peripheral", hardwareOptions);
    $("#inpt-item").val(`${z.ItemName}-${z.WorkstationName}--${z.ItemDescription}`);
    $("#modal-job-items").modal("hide");
});

$(document).on("click", ".tblJO-detailedReport", function () {
    let rowJobNumber = joWorkStationTable.row($(this).closest("tr")).data()
      .JobNumber;
    viewJODetailedReport(rowJobNumber);
    // alert(rowJobNumber) 
  });

$(document).on("show.bs.modal", "#modal-employee-list", function () {
    employeeTable = loadEmployeeTable();
    employeeTable.columns([4, 5, 6]).visible(false);
    employeeTable.on("click", "tr", function () {
        const employeeData = employeeTable.row(this).data();
        $("#inph-employeeNo").val(employeeData.EmployeeNo);
        $("#inpt-personnel").val(
            `${employeeData.LastName}, ${employeeData.FirstName} ${employeeData.MiddleName}`
        );
        $("#modal-employee-list").modal("hide");
    });
});

$(document).on("hide.bs.modal", "#modal-employee-list", function () {
    employeeTable.off("click", "tr").destroy();
});

$(document).on("show.bs.modal", "#modal-job-items", function () {
    $("#btn-addJobItems").hide();
    $("#btn-addSelectedPeripheral").removeAttr("hidden");
    $("#btn-addSelectedWorkStation").removeAttr("hidden");
    $("#table-get-job-items").DataTable({
        retrieve: true,
        destroy: true,
        ajax: {
            url: "/jobs/job-items",
            method: "GET",
            data: { columnName: "EmployeeNo", searchVal: $("#inph-employeeNo").val() }
        },
        columnDefs: [
            {
                targets: [0, 1, 2],
                visible: false
            }
        ],
        columns: [
            {
                orderable: false,
                data: null,
                defaultContent: ""
            },
            { data: "ItemMasterID" },
            { data: "WorkStatID" },
            { data: "ItemName" },
            { data: "WorkstationName" },
            { data: "ItemDescription" },
            {
                data: "SerialNumber",
                render: getData => {
                    if (getData == null) {
                        return "";
                    }
                    return getData;
                }
            },
            {
                data: "DateAcquired",
                render: function (getDate) {
                    if (getDate) {
                        return getDate.substring(0, 10);
                    }
                    return ""
                }
            },
            {
                data: "GeneralStatus",
                render: getData => {
                    if (getData == null) {
                        return "";
                    }
                    return getData;
                }
            }
        ]
    });

    $("#table-get-job-items tbody").on("click", "tr", function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            $("#table-get-job-items").DataTable().$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
});

$(document).on("hide.bs.modal", "#modal-job-items", function () {
    $("#table-get-job-items").empty();
    $("#table-get-job-items").DataTable().off("click", "tr").destroy()
});

const x = (txt, options) => {
    $("#lbl-hardwareType").text(txt);
    $("#inpt-hardwareType").val(options.value);
    $("#inph-hardwareId").val(options.id);
}

