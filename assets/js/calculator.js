mfGraphCache = []

function precomputeForAlldurations(schemeName, navData) {
    preComputeForSingleDuration(schemeName, navData, 1);
    preComputeForSingleDuration(schemeName, navData, 3);
    preComputeForSingleDuration(schemeName, navData, 5);
    preComputeForSingleDuration(schemeName, navData, 10);
}

function getSipRolling(schemeName, data, years, type) {
    cacheKey = JSON.stringify({ schemeName, years, type });
    if (mfGraphCache[cacheKey]) return mfGraphCache[cacheKey];
}

function calculateMontlyReturns(getnthPreviousMonthDate, dateToNavDictionary) {
    monthlyReturns = []

    for (i = fullNavData.length - 1; i >= 0; i--) {
        currentDate = fullNavData[i].date
        firstDateForInvestment = getnthPreviousMonthDate(currentDate, 1);
        // console.log("firstDateForSip: ", firstDateForSip)
        if (firstDateForInvestment < navStartingDate) break;

        monthlyReturn = (dateToNavDictionary[currentDate] - dateToNavDictionary[firstDateForInvestment]) * 100 / dateToNavDictionary[firstDateForInvestment]
        monthlyReturns.unshift(monthlyReturn);
    }
    return monthlyReturns;
}

//data format: [{date: "31-12-2023", nav: 20.3}]
function preComputeForSingleDuration(schemeName, navData, years) {
    cacheKeyForSipXirr = JSON.stringify({ schemeName, years, type: "Sip Rolling Returns" });
    cacheKeyForSipAbsolute = JSON.stringify({ schemeName, years, type: "Sip Absolute Value" });
    cacheKeyForLumpsumXirr = JSON.stringify({ schemeName, years, type: "Lumpsum Rolling Returns" });
    cacheKeyForLumpsumAbsolute = JSON.stringify({ schemeName, years, type: "Lumpsum Absolute Value" });
    cacheKeyForStandardDeviation = JSON.stringify({ schemeName, years, type: "Standard Deviation" });

    // if already computed once do not compute again
    if (mfGraphCache[cacheKeyForSipXirr]) return;

    navData.sort((a, b) => a.date - b.date);

    // console.log(data);

    // Function to calculate the next date
    function getNextDate(currentDate) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + 1);
        return nextDate;
    }

    missingData = []

    // Fill missing dates with NAV values from the next available date
    for (let i = 0; i < navData.length - 1; i++) {
        const currentDate = navData[i].date;
        const nextDate = navData[i + 1].date;
        const daysDiff = (nextDate - currentDate) / (1000 * 60 * 60 * 24);

        if (daysDiff > 1) {
            for (let j = getNextDate(currentDate); j < nextDate; j.setDate(j.getDate() + 1)) {
                // const missingDate = getNextDate(currentDate);
                // Create a new entry for the missing date with NAV from the next available date
                missingData.push({
                    date: new Date(j),
                    nav: navData[i + 1].nav, // Set NAV to the next available date's NAV
                });
            }
        }
    }

    // console.log(data);
    // console.log(missingData);

    fullNavData = navData.concat(missingData);
    fullNavData.sort((a, b) => a.date - b.date);
    // console.log(fullData)

    const dateToNavDictionary = {};

    for (const entry of fullNavData) {
        dateToNavDictionary[entry.date] = parseFloat(entry.nav);
    }

    // console.log(dateToNavDictionary)

    function getnthPreviousMonthDate(currentDate, months) {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - months);
        return date;
    }

    months = 12 * years;
    navStartingDate = fullNavData[0].date;

    sipXirrData = []
    sipAbsoluteData = []
    lumpsumXirrData = []
    lumpsumAbsoluteData = []
    standardDeviationData = []
    const monthlyReturns = calculateMontlyReturns(getnthPreviousMonthDate, dateToNavDictionary);

    for (i = fullNavData.length - 1; i >= 0; i--) {
        currentDate = fullNavData[i].date
        firstDateForInvestment = getnthPreviousMonthDate(currentDate, months);
        // console.log("firstDateForSip: ", firstDateForSip)
        if (firstDateForInvestment < navStartingDate) break;

        invDates = []
        amounts = []
        totalUnitsPurchasedBySip = 0
        totalUnitsPurchasedByLumpSum = 100 / dateToNavDictionary[firstDateForInvestment]
        for (j = months; j >= 1; j--) {
            invDate = getnthPreviousMonthDate(currentDate, j);
            amount = 100;
            totalUnitsPurchasedBySip += amount / dateToNavDictionary[invDate]
        }

        allNavsForSDCalculation = []
        for (j = i; j >= 0; j--) {
            if (fullNavData[j].date < firstDateForInvestment) {
                // console.log("breaking at j: ", j, " date: ", fullNavData[j].date, " firstDateForInvestment: ", firstDateForInvestment)
                break;
            }
            allNavsForSDCalculation.push(monthlyReturns[j])
        }

        // console.log("allNavsForSDCalculation: ", allNavsForSDCalculation)

        let standardDeviation = getStandardDeviation(allNavsForSDCalculation)
        standardDeviationData.push([currentDate.getTime(), Math.round(standardDeviation * 100) / 100])

        let sipSellingPriceUnrounded = totalUnitsPurchasedBySip * dateToNavDictionary[currentDate]
        let lumpsumSellingPriceUnrounded = totalUnitsPurchasedByLumpSum * dateToNavDictionary[currentDate]

        let sipSellingPrice = Math.round(sipSellingPriceUnrounded);
        let lumpsumSellingPrice = (Math.round(lumpsumSellingPriceUnrounded * 10) / 10).toFixed(1);
        sipXirr = sipXirrCache[years][sipSellingPrice]
        lumpsumXirr = lumpsumXirrCache[years][lumpsumSellingPrice]

        // if the xirr is not found in the cache, calculate it on demand and add it back to the cache
        if(sipXirr === undefined) {
            sipXirr = calcSipXirr(years, sipSellingPrice)
            sipXirrCache[years][sipSellingPrice] = sipXirr
            // console.log("running on demand sip xirr for extreme value, years: ", years, " price: ", sipSellingPrice, " date: ", currentDate, "xirr: ", sipXirr)
        }
        if(lumpsumXirr === undefined) {
            lumpsumXirr = calcLumpsumXirr(years, lumpsumSellingPrice)
            lumpsumXirrCache[years][lumpsumSellingPrice] = lumpsumXirr
            // console.log("running on demand lumpsum xirr for extreme value, years: ", years, " price: ", lumpsumSellingPrice, " date: ", currentDate, "xirr: ", lumpsumXirr)
        }

        // xirr = XIRR(amounts, invDates) * 100

        // console.log("currentDate :", currentDate)
        // console.log(invDates);
        // console.log(amounts);
        // console.log("XIRR ----------------------: ", xirr)

        sipXirrData.push([currentDate.getTime(), sipXirr])
        sipAbsoluteData.push([currentDate.getTime(), sipSellingPriceUnrounded])

        lumpsumXirrData.push([currentDate.getTime(), lumpsumXirr])
        lumpsumAbsoluteData.push([currentDate.getTime(), lumpsumSellingPriceUnrounded])
    }

    mfGraphCache[cacheKeyForSipXirr] = sipXirrData;
    mfGraphCache[cacheKeyForSipAbsolute] = sipAbsoluteData;

    mfGraphCache[cacheKeyForLumpsumXirr] = lumpsumXirrData;
    mfGraphCache[cacheKeyForLumpsumAbsolute] = lumpsumAbsoluteData;

    mfGraphCache[cacheKeyForStandardDeviation] = standardDeviationData;
}

function calculateStandardDeviation(allNavs) {
    returns = []
    const n = allNavs.length
    for (let i = 0; i < n-1; i++) {
        returns.push((allNavs[i+1] - allNavs[i]) * 100 / allNavs[i])
    }
    let standardDeviation = getStandardDeviation(returns);
    return standardDeviation;
}

function getStandardDeviation(arr) {
    // Step 1: Calculate the mean (average) of the array
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;

    // Step 2: Calculate the squared differences from the mean
    const squaredDifferences = arr.map(val => Math.pow(val - mean, 2));

    // Step 3: Calculate the mean of the squared differences
    const squaredDifferencesMean = squaredDifferences.reduce((acc, val) => acc + val, 0) / squaredDifferences.length;

    // Step 4: Calculate the square root of the mean of the squared differences
    const standardDeviation = Math.sqrt(squaredDifferencesMean);

    return standardDeviation;
}
