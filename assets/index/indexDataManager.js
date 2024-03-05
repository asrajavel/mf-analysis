var indexData = {}

var raw_indexData = {
    "Nifty 50 TRI": {data: index_raw_Nifty_50_TRI, dateAttribute: "Date", navAttribute: "TotalReturnsIndex"},
    "Nifty Next 50 TRI": {data: index_raw_Nifty_Next_50_TRI, dateAttribute: "Date", navAttribute: "TotalReturnsIndex"},
    "Nifty Midcap 150 TRI": {data: index_raw_Nifty_Midcap_150_TRI, dateAttribute: "Date", navAttribute: "TotalReturnsIndex"},
    "Nifty SmallCap 250 TRI": {data: index_raw_Nifty_SmallCap_250_TRI, dateAttribute: "Date", navAttribute: "TotalReturnsIndex"},
    "Nifty 500 TRI": {data: index_raw_Nifty_500_TRI, dateAttribute: "Date", navAttribute: "TotalReturnsIndex"},
    "Nifty LargeMidcap 250 TRI": {data: index_raw_Nifty_LargeMidcap_250_TRI, dateAttribute: "Date", navAttribute: "TotalReturnsIndex"},
}

for (const key in raw_indexData) {
    if (Object.prototype.hasOwnProperty.call(raw_indexData, key)) {
        const data = raw_indexData[key].data;

        navData = JSON.parse(data.d)
            .map(item => ({
                date: new Date(item[raw_indexData[key].dateAttribute]),
                nav: item[raw_indexData[key].navAttribute]
            }));

        indexData[key] = navData;

        console.log(`Key: ${key}, Value: ${data}`);
    }
}
