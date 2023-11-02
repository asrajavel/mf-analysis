indexRadio = document.getElementById("indexRadio");

for (var indexName in raw_indexData) {
    var option = document.createElement("option");
    option.value = indexName;
    option.text = indexName;
    indexRadio.appendChild(option);
}

indexRadio.addEventListener("change", function () {
    var selectedValue = indexRadio.value;
    if (selectedValue !== "Select an Index") {
        performActions(selectedValue);
        indexRadio.selectedIndex = 0;
    }
});

function performActions(selectedValue) {
    var selectedMutualFundsDiv = document.getElementById("selectedMutualFunds");
    var schemeCode = "index";
    var schemeName = selectedValue;

    var mutualFundDiv = createMutualFundDiv(schemeCode, schemeName);
    selectedMutualFundsDiv.appendChild(mutualFundDiv);

    main();
}