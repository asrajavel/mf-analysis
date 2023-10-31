var chart;
var cachedNavData = {};

function calcXirr(data, years) {
    data.sort((a, b) => a.date - b.date);

    // console.log(data);

    // Function to calculate the next date
    function getNextDate(currentDate) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        return nextDate;
    }

    missingData = []

    // Fill missing dates with NAV values from the next available date
    for (let i = 0; i < data.length - 1; i++) {
        const currentDate = data[i].date;
        const nextDate = data[i + 1].date;
        const daysDiff = (nextDate - currentDate) / (1000 * 60 * 60 * 24);

        if (daysDiff > 1) {
            for (let j = getNextDate(currentDate); j < nextDate; j.setDate(j.getDate() + 1)) {
                // const missingDate = getNextDate(currentDate);
                // Create a new entry for the missing date with NAV from the next available date
                missingData.push({
                    date: new Date(j),
                    nav: data[i + 1].nav, // Set NAV to the next available date's NAV
                });
            }
        }
    }

    // console.log(data);
    // console.log(missingData);

    fullData = data.concat(missingData);
    fullData.sort((a, b) => a.date - b.date);
    // console.log(fullData)

    const dateToNavDictionary = {};

    for (const entry of fullData) {
        dateToNavDictionary[entry.date] = parseFloat(entry.nav);
    }

    // console.log(dateToNavDictionary)

    function getnthPreviousMonthDate(currentDate, months) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - months);
        return date;
    }

    months = 12 * years;
    navStartingDate = fullData[0].date;

    finalGraph = []

    for (i = fullData.length - 1; i >= 0; i--) {
        currentDate = fullData[i].date
        firstDateForSip = getnthPreviousMonthDate(currentDate, months - 1);
        // console.log("firstDateForSip: ", firstDateForSip)
        if (firstDateForSip < navStartingDate) break;

        invDates = []
        amounts = []
        units = 0
        for (j = months - 1; j >= 0; j--) {
            invDate = getnthPreviousMonthDate(currentDate, j);
            amount = 100;
            // console.log("nav: ", invDate, dateToNavDictionary[invDate])
            units = units + amount / dateToNavDictionary[invDate]

            invDates.push(invDate);
            amounts.push(amount * -1.0);
        }

        invDates.push(currentDate);
        amounts.push(units * dateToNavDictionary[currentDate])

        xirr = XIRR(amounts, invDates) * 100
        // console.log(invDates);
        // console.log(amounts);
        // console.log("XIRR ----------------------: ", xirr)
        finalGraph.push([currentDate.getTime(), xirr])

    }
    return finalGraph;
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        function parseDate(dateStr) {
            const parts = dateStr.split('-');
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
    
        // console.log(data)
        for (const entry of data.data) {
            entry.date = parseDate(entry.date);
        }

        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

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
        xAxis: {
            type: 'datetime'
        },
        series: seriesData
    });
    chart.hideLoading();
}

async function main() {
    showLoading()
    var selectedMutualFundsDiv = document.getElementById("selectedMutualFunds");
    var childDivs = selectedMutualFundsDiv.querySelectorAll("div.row > div");

    years = getYearsFromRadioButton()

    var dataToPlot = await Promise.all(Array.from(childDivs).map(async function (childDiv) {
        var schemeCode = childDiv.getAttribute("schemecode");
        var schemeName = childDiv.getAttribute("schemename");

        if(!cachedNavData[schemeCode] ) cachedNavData[schemeCode] = await fetchData('https://api.mfapi.in/mf/' + schemeCode);

        navData = cachedNavData[schemeCode]
        xirrData = calcXirr(navData.data, years)

        // console.log("xirr:")
        // console.log(xirrData)

        return {
            schemeName: schemeName,
            sipRollingReturnsData: xirrData
        };
    }));

    createChart(dataToPlot);
}

function getYearsFromRadioButton() {
    if(document.getElementById('radioButton1').checked) {
        return 1;
    } else if(document.getElementById('radioButton2').checked) {
        return 3;
    } else if(document.getElementById('radioButton3').checked) {
        return 5;
    } else if(document.getElementById('radioButton4').checked) {
        return 10;
    } else {
        return 1;
    }
}

document.getElementById('radioButton1').addEventListener("click", function () {
    main()
});
document.getElementById('radioButton2').addEventListener("click", function () {
    main()
});
document.getElementById('radioButton3').addEventListener("click", function () {
    main()
});
document.getElementById('radioButton4').addEventListener("click", function () {
    main()
});

function showLoading() {
    if (chart) {
        chart.showLoading('Loading data...');
    }
}