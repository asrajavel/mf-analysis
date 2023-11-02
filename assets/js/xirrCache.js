// {1: {1: 0.0, 2: 0.1, 3: 0.1}}
// years to sellingPrice to xirr mapping
var sipRollingReturnXirrCacheTemp = {}

// This computation will take around 2 mins, browser freeze is expected
function preComputeSipRollingReturnXirrCache() {
    var durations = [1, 3, 5, 10];
    var durationsToSampleDates = {};
    var durationsToSellingPriceRanges = {
        1: {low: 400, high: 3500},
        3: {low: 2000, high: 10000},
        5: {low: 3000, high: 22000},
        10: {low: 10000, high: 72000},
    }
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

        durationsToSampleDates[years] = { dates: dates, trans: trans };
    }

    // console.log(durationsToSampleDates);

    for (var i = 0; i < durations.length; i++) {
        var years = durations[i];
        var months = years * 12;
        var sellingPriceToXirr = {}
        lowestSellingPrice = durationsToSellingPriceRanges[years].low;
        highestSellingPrice = durationsToSellingPriceRanges[years].high;
        for(var sellingPrice = lowestSellingPrice; sellingPrice <=highestSellingPrice; sellingPrice+=1) {
            var sampleTrans = durationsToSampleDates[years].trans
            sampleTrans[months] = sellingPrice;
            var invDates = durationsToSampleDates[years].dates
            var xirr = XIRR(sampleTrans, invDates) * 100
            sellingPriceToXirr[sellingPrice] = Math.round(xirr * 100) / 100
            // console.log(years, months, sellingPrice, xirr);
        }
        sipRollingReturnXirrCacheTemp[years] = sellingPriceToXirr
    }
}

// uncomment below to get precomputed sip rolling returns xirr values, print the same on console and paste it into sipXirrCache.js
// preComputeSipRollingReturnXirrCache();

function getnthPreviousMonthDate(currentDate, months) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - months);
    return date;
}