navCache = {}

async function fetchData(url) {
    try {
        if (navCache[url]) {
            return navCache[url];
        } else {
            const response = await fetch('https://api.mfapi.in/mf/' + url);
            var data = await response.json();
            data = await convertDatesToJsDates(data.data)
            navCache[url] = await data;
            return navCache[url];
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function convertDatesToJsDates(data) {
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
    return dataWithDateFormattedToJsDate;
}