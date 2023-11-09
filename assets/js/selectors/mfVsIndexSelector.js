const mutualFundRadioButton = document.getElementById("typeOfFundRadioButton1");
const indexRadioButton = document.getElementById("typeOfFundRadioButton2");

const mfSelector = document.getElementById("mfSelector");
const indexSelector = document.getElementById("indexSelector");

// Initially, hide the indexSelector div
indexSelector.style.display = "none";

mutualFundRadioButton.addEventListener("change", function () {
    if (mutualFundRadioButton.checked) {
        mfSelector.style.display = "block";
        indexSelector.style.display = "none";
    }
});

indexRadioButton.addEventListener("change", function () {
    if (indexRadioButton.checked) {
        mfSelector.style.display = "none";
        indexSelector.style.display = "block";
    }
});