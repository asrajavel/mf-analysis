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
        verticalAlign: 'bottom'
    },
    yAxis: {
        plotLines: [{
            value: 0,
            width: 1,
            color: '#aaa',
            zIndex: 10
        }]
    },
    series: [],
    chart: {
        zooming: {
            mouseWheel: {
                enabled: false
            }
        },
    },
});


function getRefLine(graphType, refLineValue) {
    if (graphType === "percentage") {
        return [{
            value: 0,
            width: 2,
            color: '#aaa',
            zIndex: 10
        }];
    } else if(graphType === "currency") {
        return [{
            value: refLineValue,
            width: 2,
            color: '#aaa',
            zIndex: 10,
            label: {
                text: '<b>Total Inv: ' + currencyFormat(refLineValue) + '</b>',
                align: 'left'
            }
        }];
    } else {
        console.log("unknown graph type")
    }
}

function currencyFormat(value) {
    let formattedLabel;
    if (value >= 10000000) {
        formattedLabel = (value / 10000000).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) + ' crores';
    } else if (value >= 100000) {
        formattedLabel = (value / 100000).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) + ' lakhs';
    } else if (value >= 1000) {
        formattedLabel = (value / 1000).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 3 }) + 'k';
    } else {
        formattedLabel = value;
    }
    return "₹ " + formattedLabel;
}

function getYaxisLabels(graphType) {
    return {
        formatter: function () {
            let value = this.value;
            if (graphType === "currency") {
                return currencyFormat(value);
            } else if (graphType === "percentage") {
                return value + ' %';
            } else {
                console.log("unknown graphType")
            }
        }
    };
}

function getTooltipFormatter(graphType) {
    if (graphType === "currency") {
        return {
            pointFormatter: function () {
                let formattedValue = "₹ " + this.y.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0});
                return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b><br/>`;
            }
        };
    } else if (graphType === "percentage") {
        return {
            pointFormatter: function () {
                let formattedValue = this.y.toFixed(1) + " %";
                return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b><br/>`;
            }
        };
    } else {
        console.log("unknown graphType")
    }
}

function plotInChart(dataToPlot, graphType, refLineValue) {
    while (chart.series.length > 0) {
        chart.series[0].remove();
    }

    var seriesData = dataToPlot.map(function (item) {
        item.sipRollingReturnsData.sort((a, b) => a[0] - b[0]);
        let series = {
            name: item.schemeName,
            data: item.sipRollingReturnsData,
            tooltip: getTooltipFormatter(graphType),
            showInNavigator: true
        };
        chart.addSeries(series);
        return series;
    });

    chart.yAxis[0].update({
        plotLines: getRefLine(graphType, refLineValue),
        labels: getYaxisLabels(graphType)
    });

    // console.log("plotted: ", seriesData);

    chart.hideLoading();
}

function showLoading() {
    if (chart) {
        chart.showLoading('Loading data...');
    }
}