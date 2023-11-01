var chart;

createChart([])

function createChart(dataToPlot) {
    var seriesData = dataToPlot.map(function (item) {
        item.sipRollingReturnsData.sort((a, b) => a[0] - b[0]);
        return {
            name: item.schemeName,
            data: item.sipRollingReturnsData,
            tooltip: {
                valueDecimals: 1
            }
        };
    });

    // console.log(seriesData)

    // Create the chart
    chart = Highcharts.stockChart('container', {
        rangeSelector: {
            enabled: false
        },
        plotOptions: {
            series: {
              animation: false
            }
        },
        xAxis: {
            type: 'datetime'
        },
        legend: {
            enabled: true,
            // layout: 'horizontal',
            // align: 'bottom',
            verticalAlign: 'bottom'
            // itemMarginTop: 20,
            // itemMarginBottom: 0
        },
        yAxis: {
            plotLines: [{
              value: 0,
              width: 1,
              color: '#aaa',
              zIndex: 10
            }]
          },
        series: seriesData
    });
    chart.hideLoading();
}

function showLoading() {
    if (chart) {
        chart.showLoading('Loading data...');
    }
}