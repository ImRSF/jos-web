export function loadHardwareItems() {
    return $("#table-hardwareItems").DataTable({
        dom: "Bfrtip",
        responsive: true,
        buttons: [
            "excel",
            "pdf",
            {
                extend: "print",
                autoPrint: false
            }
        ],
        ajax: {
            url: "/misc/getHardwareItemType" ,
            method: "GET",
            data: {colName: "", colValue: ""},
            dataSrc: "data"
        },
        columns: [
            { data: "ItemName" },
            { data: "ItemDesc" }
        ]
    });
}
