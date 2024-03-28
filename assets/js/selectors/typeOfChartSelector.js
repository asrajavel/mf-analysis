const sipRollingReturnsButton = document.getElementById("radioButton1TypeOfChart");
const sipRollingAbsoluteButton = document.getElementById("radioButton2TypeOfChart");
const lumpsumRollingReturnsButton = document.getElementById("radioButton3TypeOfChart");
const lumpsumRollingAbsoluteButton = document.getElementById("radioButton4TypeOfChart");
const standardDeviationButton = document.getElementById("radioButton5TypeOfChart");

const sipAmountDiv = document.getElementById("sipAmountDiv");
const lumpsumAmountDiv = document.getElementById("lumpsumAmountDiv");

// Initially, hide the indexSelector div
// sipAmountDiv.style.display = "none";

sipRollingReturnsButton.addEventListener("change", function () {
    if (sipRollingReturnsButton.checked) {
        hideBothAmountDivs()
    }
    main()
})

lumpsumRollingReturnsButton.addEventListener("change", function () {
    if (lumpsumRollingReturnsButton.checked) {
        hideBothAmountDivs()
    }
    main()
})

sipRollingAbsoluteButton.addEventListener("change", function () {
    if (sipRollingAbsoluteButton.checked) {
        hideBothAmountDivs()
        sipAmountDiv.style.display = "block";
    }
    main()
})

lumpsumRollingAbsoluteButton.addEventListener("change", function () {
    if (lumpsumRollingAbsoluteButton.checked) {
        hideBothAmountDivs()
        lumpsumAmountDiv.style.display = "block";
    }
    main()
})

standardDeviationButton.addEventListener("change", function () {
    if (standardDeviationButton.checked) {
        hideBothAmountDivs()
    }
    main()
})

function hideBothAmountDivs() {
    sipAmountDiv.style.display = "none";
    lumpsumAmountDiv.style.display = "none";
}

const sipAmountTextBox = document.getElementById("sipAmountTextBox")
const lumpsumAmountTextBox = document.getElementById("lumpsumAmountTextBox")

sipAmountTextBox.addEventListener("change", function () {
    main()
})

lumpsumAmountTextBox.addEventListener("change", function () {
    main()
})