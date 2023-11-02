async function main() {
    showLoading();
    const selectedMutualFundsDiv = document.getElementById("selectedMutualFunds");
    const childDivs = selectedMutualFundsDiv.querySelectorAll("div.row > div");
    const years = getYearsFromRadioButton();

    const dataToPlot = [];

    for (const childDiv of childDivs) {
        const schemeCode = childDiv.getAttribute("schemecode");
        const schemeName = childDiv.getAttribute("schemename");

        try {
            if(schemeCode === "index") {
                navData = await indexData[schemeName];
            } else {
                navData = await fetchData(schemeCode);
            }

            precomputeForAlldurations(schemeName, navData);

            const xirrData = calcXirr(schemeName, navData, years);

            dataToPlot.push({
                schemeName: schemeName,
                sipRollingReturnsData: xirrData,
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    plotInChart(dataToPlot);
}

function getYearsFromRadioButton() {
    if (document.getElementById('radioButton1').checked) {
        return 1;
    } else if (document.getElementById('radioButton2').checked) {
        return 3;
    } else if (document.getElementById('radioButton3').checked) {
        return 5;
    } else if (document.getElementById('radioButton4').checked) {
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
