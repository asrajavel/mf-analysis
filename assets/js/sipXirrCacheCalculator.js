// {1: {1: 0.0, 2: 0.1, 3: 0.1}}
// years to sellingPrice to xirr mapping
var sipCacheTemp = {}
var lumpsumCacheTemp = {}

var durations = [1, 3, 5, 10];
var sipDurationsToSampleDates = getSipDurationsToSampleDates()
var lumpsumDurationsToSampleDates = getLumpsumDurationsToSampleDates()

function getSipDurationsToSampleDates() {
    var sipDurationsToSampleDates = {};
    var sellingDate = new Date("2023-01-01");

    for (var i = 0; i < durations.length; i++) {
        var years = durations[i];
        var dates = [];
        var trans = [];

        var totalmonths = 12 * years;

        for (var month = totalmonths; month >= 0; month--) {
            var nthPreviousMonthDate = getnthPreviousMonthDate(sellingDate, month);
            dates.push(nthPreviousMonthDate);

            // Assuming a constant monthly investment of -100
            trans.push(-100);
        }

        sipDurationsToSampleDates[years] = {dates: dates, trans: trans};
    }
    return sipDurationsToSampleDates;
}

function getLumpsumDurationsToSampleDates() {
    var lumpsumDurationsToSampleDates = {};
    var sellingDate = new Date("2023-01-01");

    for (var i = 0; i < durations.length; i++) {
        var years = durations[i];
        var dates = [];
        var trans = [];

        var totalmonths = 12 * years;

        var nthPreviousMonthDate = getnthPreviousMonthDate(sellingDate, totalmonths);
        dates.push(nthPreviousMonthDate);
        trans.push(-100);

        dates.push(sellingDate);
        trans.push(-100);

        lumpsumDurationsToSampleDates[years] = {dates: dates, trans: trans};
    }
    return lumpsumDurationsToSampleDates;
}

function calcLumpsumXirr(years, sellingPrice) {
    // console.log(years, sellingPrice)
    stats(years, sellingPrice);


    var sampleTrans = lumpsumDurationsToSampleDates[years].trans
    sampleTrans[1] = sellingPrice;
    var invDates = lumpsumDurationsToSampleDates[years].dates
    // console.log(sampleTrans, invDates)
    var xirr = XIRR(sampleTrans, invDates) * 100
    return Math.round(xirr * 100) / 100;
}

function calcSipXirr(years, sellingPrice) {
    var months = years * 12;
    var sampleTrans = sipDurationsToSampleDates[years].trans
    sampleTrans[months] = sellingPrice;
    var invDates = sipDurationsToSampleDates[years].dates
    var xirr = XIRR(sampleTrans, invDates) * 100
    return Math.round(xirr * 100) / 100;
}

// This computation will take around 2 mins, browser freeze is expected
function preComputeLumpsumRollingReturnXirrCache() {
    console.log("started lumpsum xirr precompute", new Date());

    var durationsToSellingPriceRanges = {
        1: {low: 42.0, high: 350.0},
        3: {low: 58.0, high: 410.0},
        5: {low: 69.0, high: 660.0},
        10: {low: 86.0, high: 660.0},
    }

    for (var i = 0; i < durations.length; i++) {
        var years = durations[i];
        var lumpsumSellingPriceToXirr = {}
        lowestSellingPrice = parseFloat(durationsToSellingPriceRanges[years].low);
        highestSellingPrice = parseFloat(durationsToSellingPriceRanges[years].high);
        for (var sellingPrice = lowestSellingPrice; sellingPrice <= highestSellingPrice; sellingPrice += 0.1) {
            // sellingPrice = sellingPrice.toFixed(1)
            lumpsumSellingPriceToXirr[sellingPrice.toFixed(1)] = calcLumpsumXirr(years, sellingPrice)
            // console.log("starting xirr: ", years, sellingPrice, xirr);
        }
        lumpsumCacheTemp[years] = lumpsumSellingPriceToXirr
    }
    console.log("finished lumpsum xirr precompute", new Date());
}

function preComputeSipRollingReturnXirrCache() {
    console.log("started sip xirr precompute", new Date());

    var durationsToSellingPriceRanges = {
        1: {low: 400, high: 3500},
        3: {low: 2000, high: 10000},
        5: {low: 3000, high: 22000},
        10: {low: 10000, high: 72000},
    }

    for (var i = 0; i < durations.length; i++) {
        var years = durations[i];
        var sipSellingPriceToXirr = {}
        lowestSellingPrice = durationsToSellingPriceRanges[years].low;
        highestSellingPrice = durationsToSellingPriceRanges[years].high;
        for (var sellingPrice = lowestSellingPrice; sellingPrice <= highestSellingPrice; sellingPrice += 1) {
            sipSellingPriceToXirr[sellingPrice] = calcSipXirr(years, sellingPrice)
            // console.log("starting xirr: ", years, sellingPrice, xirr);
        }
        sipCacheTemp[years] = sipSellingPriceToXirr
    }
    console.log("finished sip xirr precompute", new Date());
}

// uncomment below to get precomputed sip rolling returns xirr values, print the same on console and paste it into sipXirrCache.js
// preComputeSipRollingReturnXirrCache();
// console.log(sipCacheTemp);
// preComputeLumpsumRollingReturnXirrCache();
// console.log(lumpsumCacheTemp);

function getnthPreviousMonthDate(currentDate, months) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - months);
    return date;
}