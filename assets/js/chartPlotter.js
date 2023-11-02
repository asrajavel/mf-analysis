var chart = Highcharts.stockChart('container', {
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
    series: []
});

function plotInChart(dataToPlot) {
    while (chart.series.length > 0) {
        chart.series[0].remove();
    }

    var seriesData = dataToPlot.map(function (item) {
        item.sipRollingReturnsData.sort((a, b) => a[0] - b[0]);
        let series = {
            name: item.schemeName,
            data: item.sipRollingReturnsData,
            tooltip: {
                valueDecimals: 2
            },
            showInNavigator: true
        };
        chart.addSeries(series);
        return series
    });

    // console.log("plotted: ", seriesData);

    chart.hideLoading();
}

function showLoading() {
    if (chart) {
        chart.showLoading('Loading data...');
    }
}