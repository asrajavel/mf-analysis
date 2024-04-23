async function main() {
    showLoading();
    const selectedMutualFundsDiv = document.getElementById("selectedMutualFunds");
    const childDivs = selectedMutualFundsDiv.querySelectorAll("div.row > div");
    let years = getYearsFromRadioButton();

    const dataToPlot = [];
    let sipAmount = null;
    let lumpsumAmount = null;

    for (const childDiv of childDivs) {
        const schemeCode = childDiv.getAttribute("schemecode");
        const schemeName = childDiv.getAttribute("schemename");

        try {
            if (schemeCode === "index") {
                navData = await getIndexData(schemeName);
            } else {
                navData = await fetchData(schemeCode);
            }

            precomputeForAlldurations(schemeName, navData);
            if (sipRollingReturnsButton.checked) {
                dataSeriesForGraph = getSipRolling(schemeName, navData, years, "Sip Rolling Returns");
                refLineValue = 0
                graphType = "percentage"
                graphName = "Sip Rolling Returns (XIRR %)"
            } else if (sipRollingAbsoluteButton.checked) {
                dataSeriesForGraph = getSipRolling(schemeName, navData, years, "Sip Absolute Value");
                sipAmount = sipAmountTextBox.value.replace(/,/g, '');
                dataSeriesForGraph = dataSeriesForGraph.map(item => {
                    return [item[0], item[1] * (sipAmount / 100)];
                })
                refLineValue = sipAmount * 12 * years
                graphType = "currency"
                graphName = "Sip Rolling Absolute Value (₹)"
            } else if (lumpsumRollingReturnsButton.checked) {
                dataSeriesForGraph = getSipRolling(schemeName, navData, years, "Lumpsum Rolling Returns");
                refLineValue = 0
                graphType = "percentage"
                graphName = "Lumpsum Rolling Returns (CAGR %)"
            } else if(lumpsumRollingAbsoluteButton.checked) {
                dataSeriesForGraph = getSipRolling(schemeName, navData, years, "Lumpsum Absolute Value");
                lumpsumAmount = lumpsumAmountTextBox.value.replace(/,/g, '');
                dataSeriesForGraph = dataSeriesForGraph.map(item => {
                    return [item[0], item[1] * (lumpsumAmount / 100)];
                })
                refLineValue = lumpsumAmount
                graphType = "currency"
                graphName = "Lumpsum Rolling Absolute Value (₹)"
            } else if (standardDeviationButton.checked) {
                dataSeriesForGraph = getSipRolling(schemeName, navData, years, "Standard Deviation");
                refLineValue = 0
                graphType = "percentage"
                graphName = "Standard Deviation Rolling Annualized Monthly (Risk) (%)"
            } else if (navButton.checked) {
                dataSeriesForGraph = navData.map(item => {
                    return [item.date.getTime(), parseFloat(item.nav)];
                });
                refLineValue = null
                graphType = "percentage"
                graphName = "NAV or Index Value"
                years = null
            }
            else {
                console.log("unknown graphType")
            }

            dataToPlot.push({
                schemeName: schemeName,
                sipRollingReturnsData: dataSeriesForGraph,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    plotInChart(dataToPlot, graphType, refLineValue, years, graphName, sipAmount, lumpsumAmount, true);
}

