import { generateBarChart, generateAreaChart, generatePieChart } from "./charts.js";

let user;
let jrAreaChart;
let joBarChart;
let reviewPieChart;

$(document).ready(function () {
    let selectedYear = $("#sel-year-filter").val();
    $.ajax({
        url: "/misc/user",
        method: "GET",
        async: false,
        success: json => {
            user = json.data[0];
        }
    });
    loadJRAreaChart(user.PersonnelID, selectedYear);
    loadCardValues(user.PersonnelID, selectedYear);
    loadJOBarChart(user.PersonnelID, selectedYear);
    loadReviewPieChart(user.PersonnelID, selectedYear);
});

$("#btn-generateCharts").on("click", function () {
    let selectedYear = $("#sel-year-filter").val();
    loadCardValues(user.PersonnelID, selectedYear);
    loadJRAreaChart(user.PersonnelID, selectedYear);
    loadJOBarChart(user.PersonnelID, selectedYear);
    loadReviewPieChart(user.PersonnelID, selectedYear);
});

$("#btn-exportCharts").on("click", function () {
    exportCharts();
});

const exportCharts = () => {
    // get size of report page
    var reportPageHeight = $('#reportPage').innerHeight();
    var reportPageWidth = $('#reportPage').innerWidth();

    // create a new canvas object that we will populate with all other canvas objects
    var pdfCanvas = $('<canvas />').attr({
        id: "canvaspdf",
        width: reportPageWidth,
        height: reportPageHeight
    });

    // keep track canvas position
    var pdfctx = $(pdfCanvas)[0].getContext('2d');
    var pdfctxX = 0;
    var pdfctxY = 0;
    var buffer = 100;

    // for each chart.js chart
    $("canvas").each(function (index) {
        // get the chart height/width
        var canvasHeight = $(this).innerHeight();
        var canvasWidth = $(this).innerWidth();

        // draw the chart into the new canvas
        pdfctx.drawImage($(this)[0], pdfctxX, pdfctxY, canvasWidth, canvasHeight);
        pdfctxX += canvasWidth + buffer;

        // our report page is in a grid pattern so replicate that in the new canvas
        if (index % 2 === 1) {
            pdfctxX = 0;
            pdfctxY += canvasHeight + buffer;
        }
    });

    // create new pdf and add our new canvas as an image
    var pdf = new jsPDF('l', 'pt', [reportPageWidth, reportPageHeight]);
    pdf.addImage($(pdfCanvas)[0], 'PNG', 0, 0);

    // download the pdf
    pdf.save('filename.pdf');
};

const loadCardValues = (personnelId, requestedYear) => {
    $.ajax({
        url: "/stat/jobsCards",
        method: "GET",
        data: { personnelId: personnelId, requestedYear: requestedYear },
        success: json => {
            const cardValue = json.cardValues[0];
            $("#yearly-all-jos").text(cardValue.TotalJO);
            $("#yearly-served-jos").text(cardValue.ServedJO);
            $("#yearly-pending-jos").text(cardValue.PendingJO);
            $("#yearly-approved-jrs").text(cardValue.ApprovedJRs);
            $("#yearly-total-reviews").text(cardValue.TotalReviews);
        }
    })
};

const loadJRAreaChart = (personnelId, selectedYear) => {
    $.ajax({
        url: "/stat/jrStatistic",
        method: "GET",
        data: { personnelId: personnelId, requestedYear: selectedYear },
        success: json => {
            jrAreaChart = generateAreaChart(json, "myAreaChart");
            jrAreaChart.update();
        }
    })
};

const loadJOBarChart = (personnelId, selectedYear) => {
    // FIXME: Job Order charts has the same total per month
    $.ajax({
        url: "/stat/joStatistic",
        method: "GET",
        data: { personnelId: personnelId, requestedYear: selectedYear },
        success: json => {
            joBarChart = generateBarChart(json, "myBarChart");
            joBarChart.options.scales.yAxes[0].ticks.max = json.joChartData[0].TotalJOs;
            joBarChart.update();
        }
    })
};

const loadReviewPieChart = (personnelId, selectedYear) => {
    $.ajax({
        url: "/stat/reviewStatistic",
        method: "GET",
        data: { personnelId: personnelId, requestedYear: selectedYear },
        success: json => {
            reviewPieChart = generatePieChart(json.reviewChartData, "myPieChart");
            reviewPieChart.update();
        }
    })
};



