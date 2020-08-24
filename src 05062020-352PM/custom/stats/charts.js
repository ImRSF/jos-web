// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

const formatJRData = (chartData) => {
  let formattedData = [0, 0];
  chartData.forEach(e => {
    formattedData[e.MonthApproved - 1] = e.TotalNoOfJR;
  });
  return formattedData;
};

const formatJOData = (chartData, joStatus) => {
  let formattedData = [];
  chartData.forEach(e => {
    formattedData[e.MonthRequested - 1] = e[joStatus];
  });
  //console.log(formattedData)
  return formattedData;
};

const formatReviewData = (reviewData) => {
  return [
    reviewData[0].FiveStars,
    reviewData[0].FourStars,
    reviewData[0].ThreeStars,
    reviewData[0].TwoStars,
    reviewData[0].OneStar
  ]
};

const jrAreaChartOptions = (json) => {
  const optionsObj = {
    type: 'line',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Job Requests",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: formatJRData(json.jrChartData)
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            autoSkip: false
          }
          // ticks: {
          //   maxTicksLimit: 7
          // }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 5,
            padding: 10
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10
      }
    }
  };
  return optionsObj;
};

const joBarChartOptions = (json) => {
  const optionsObj = {
    type: 'bar',
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Served",
        backgroundColor: "#00C851",
        hoverBackgroundColor: "#00C851",
        borderColor: "#00C851",
        data: formatJOData(json.joChartData, "ServedJOs")
      },
      {
        label: "Pending",
        backgroundColor: "#89D8F8",
        hoverBackgroundColor: "#89D8F8",
        borderColor: "#89D8F8",
        data: formatJOData(json.joChartData, "PendingJOs")
      },
      {
        label: "Cancelled",
        backgroundColor: "#FF3547",
        hoverBackgroundColor: "#FF3547",
        borderColor: "#FF3547",
        data: formatJOData(json.joChartData, "CancelledJOs"),
      },
      {
        label: "Returned",
        backgroundColor: "#FFBB33",
        hoverBackgroundColor: "#FFBB33",
        borderColor: "#FFBB33",
        data: formatJOData(json.joChartData, "ReturnedJOs"),
      },
      {
        label: "Submitted",
        backgroundColor: "#AA66CC",
        hoverBackgroundColor: "#AA66CC",
        borderColor: "#AA66CC",
        data: formatJOData(json.joChartData, "SubmittedJOs"),
      },
      {
        label: "Total",
        backgroundColor: "#4285F4",
        hoverBackgroundColor: "#4285F4",
        borderColor: "#4285F4",
        data: formatJOData(json.joChartData, "TotalJOs"),
      },
      ],
    },
    options: {
      scaleShowValues: true,
      plugins: {
        labels: {
          render: function() {
            return "";
          }
        }
      },
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'month'
          },
          ticks: {
            autoSkip: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          // ticks: {
          //   maxTicksLimit: 7
          // },
          maxBarThickness: 25,
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 30,
            maxTicksLimit: 7,
            padding: 10
            //beginAtZero: true
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10
      },
    }
  };
  return optionsObj;
};

const reviewPieChartOptions = (data) => {
  const optionsObj = {
    type: 'doughnut',
    data: {
      labels: ["Excellent", "Good", "Average", "Bad", "Terrible"],
      datasets: [{
        data: formatReviewData(data),
        backgroundColor: ['#00C851', '#4285F4', '#AA66CC', "#FFBB33", "#FF3547"]
      }],
    },
    options: {
      plugins: {
        labels: {
          render: 'value',
          fontSize: 14,
          fontStyle: 'bold',
          fontColor: '#000',
        }
      },
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: false
      },
      cutoutPercentage: 80,
    },
  };
  return optionsObj;
};

export const generateAreaChart = (json, id) => {
  let ctx = document.getElementById(id);
  return new Chart(ctx, jrAreaChartOptions(json));
};

export const generateBarChart = (json, id) => {
  let ctx = document.getElementById(id);
  let barChart = new Chart(ctx, joBarChartOptions(json));
  barChart.update();
  return barChart;
};

export const generatePieChart = (data, id) => {
  let ctx = document.getElementById(id);
  return new Chart(ctx, reviewPieChartOptions(data));
};


