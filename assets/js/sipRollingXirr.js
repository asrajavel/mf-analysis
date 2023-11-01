sipRollingXirrCache = []

function precomputeForAlldurations(schemeName, navData) {
    calcXirr(schemeName, navData, 1);
    calcXirr(schemeName, navData, 3);
    calcXirr(schemeName, navData, 5);
    calcXirr(schemeName, navData, 10);
}

//data format: [{date: "31-12-2023", nav: 20.3}]
function calcXirr(schemeName, data, years) {
    cacheKey = JSON.stringify({ schemeName, years });
    if (sipRollingXirrCache[cacheKey]) return sipRollingXirrCache[cacheKey];

    function parseDate(dateStr) {
        const parts = dateStr.split('-');
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    // console.log(data)
    dataWithDateFormattedToJsDate = []
    for (const entry of data) {
        var jsDate = parseDate(entry.date);
        dataWithDateFormattedToJsDate.push({ date: jsDate, nav: entry.nav })
    }
    data = dataWithDateFormattedToJsDate

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
        for (j = months; j >= 1; j--) {
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
        // console.log("currentDate :", currentDate)
        // console.log(invDates);
        // console.log(amounts);
        // console.log("XIRR ----------------------: ", xirr)
        finalGraph.push([currentDate.getTime(), xirr])

    }
    sipRollingXirrCache[cacheKey] = finalGraph;
    return finalGraph;
}