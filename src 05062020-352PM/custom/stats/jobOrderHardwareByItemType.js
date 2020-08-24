import { loadHardwareItems } from "../references/table-hardwareItems.js";
import { getJOHardwareByItems } from "./rpt-jobOrder-hardwareItems.js";

let hardwareItemTable = {};
let joHardwareItemTable = {};
let filters = [];

$(document).ready(function () {
    filters = [
        { name: "ItemName", value: null }
    ];
    joHardwareItemTable = getJOHardwareByItems(filters);
});

$(document).on("show.bs.modal", "#modal-hardwareItems", function () {
    hardwareItemTable = loadHardwareItems();
    hardwareItemTable.on("click", "tr", function () {
        const hardwareItemData = hardwareItemTable.row(this).data();
        $("#inpt-hardwareItem").val(hardwareItemData.ItemName);
        $("#modal-hardwareItems").modal("hide");
    });
});

$(document).on("hide.bs.modal", "#modal-hardwareItems", function () {
    hardwareItemTable.off("click", "tr").destroy();
});

$("#btn-getHardwareItem").on("click", function() {
    $("#modal-hardwareItems").modal("show");
});

$("#btn-generateJOReport").on("click", function() {
    filters = [
        { name: "ItemName", value: $("#inpt-hardwareItem").val() }
    ];
    joHardwareItemTable = getJOHardwareByItems(filters);
});

