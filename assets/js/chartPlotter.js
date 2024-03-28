Highcharts.setOptions({
    time: {
        useUTC: false
    }
});

var chart = Highcharts.stockChart('container', {
    credits: {
        text: 'asrajavel.github.io/mf-analysis/',
        href: 'asrajavel.github.io/mf-analysis/'
    },
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
    exporting: getExportingOptions()
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
                return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b> - `;
            }
        };
    } else if (graphType === "percentage") {
        return {
            pointFormatter: function () {
                let formattedValue = this.y.toFixed(2) + " %";
                return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b> - `;
            }
        };
    } else {
        console.log("unknown graphType")
    }
}

function plotInChart(dataToPlot, graphType, refLineValue, years, graphName, sipAmount, lumpsumAmount) {
    while (chart.series.length > 0) {
        chart.series[0].remove();
    }

    let subtitleText = years + " years";
    if (sipAmount !== null) {
        subtitleText += " - SIP Amount: " + currencyFormat(sipAmount) + " per month"
            + " - Total Inv: " + currencyFormat(sipAmount * 12 * years);
    }
    if (lumpsumAmount !== null) {
        subtitleText += " - Lumpsum Amount: " + currencyFormat(lumpsumAmount);
    }

    chart.setTitle({ text: graphName }, { text: subtitleText });
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

    console.log("plotted: ", seriesData);

    chart.hideLoading();
}

function showLoading() {
    if (chart) {
        chart.showLoading('Loading data...');
    }
}

function getExportingOptions() {
    return {
        enabled: true,
        buttons: {
            contextButton: {
                menuItems: [
                    {
                        text: 'Copy to Clipboard',
                        onclick: function () {
                            var svg = unescape(encodeURIComponent(this.getSVG()));
                            var canvas = document.createElement('canvas');
                            var ctx = canvas.getContext('2d');
                            var img = new Image();
                            img.onload = function () {
                                // Set canvas dimensions to match image dimensions
                                canvas.width = img.width;
                                canvas.height = img.height;
                                // Draw the image onto the canvas
                                ctx.drawImage(img, 0, 0, img.width, img.height);
                                canvas.toBlob(function (blob) {
                                    navigator.clipboard.write([new ClipboardItem({'image/png': blob})]).then(function() {
                                        // Show toast notification when the image is successfully written to the clipboard
                                        showToast('Screenshot saved to your clipboard');
                                    });
                                });
                            };
                            img.src = 'data:image/svg+xml;base64,' + btoa(svg);
                        }
                    },
                    {
                        text: 'Download Image',
                        onclick: function () {
                            this.exportChart({
                                type: 'image/jpeg'
                            });
                        }
                    },
                    {
                        text: 'Download csv',
                        onclick: function () {
                            this.downloadCSV();
                        }
                    }
                ]
            }
        }
    };
}

function showToast(message, duration = 3000) {
    // Create a new div element for the toast
    var toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(0, 0, 0, 0.7)';
    toast.style.color = 'white';
    toast.style.padding = '10px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '10000';

    // Add the toast to the document
    document.body.appendChild(toast);

    // Remove the toast after `duration` milliseconds
    setTimeout(function() {
        document.body.removeChild(toast);
    }, duration);
}