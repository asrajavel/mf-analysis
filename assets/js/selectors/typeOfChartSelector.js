const sipRollingReturnsButton = document.getElementById("radioButton1TypeOfChart");
const sipRollingAbsoluteButton = document.getElementById("radioButton2TypeOfChart");
const lumpsumRollingReturnsButton = document.getElementById("radioButton3TypeOfChart");
const lumpsumRollingAbsoluteButton = document.getElementById("radioButton4TypeOfChart");
const standardDeviationButton = document.getElementById("radioButton5TypeOfChart");
const navButton = document.getElementById("radioButton6TypeOfChart");

const invDurationDiv = document.getElementById("invDurationDiv");

const sipAmountDiv = document.getElementById("sipAmountDiv");
const lumpsumAmountDiv = document.getElementById("lumpsumAmountDiv");

// Initially, hide the indexSelector div
// sipAmountDiv.style.display = "none";

sipRollingReturnsButton.addEventListener("change", function () {
    if (sipRollingReturnsButton.checked) {
        hideBothAmountDivs()
        showInvDurationDiv()
    }
    main()
})

lumpsumRollingReturnsButton.addEventListener("change", function () {
    if (lumpsumRollingReturnsButton.checked) {
        hideBothAmountDivs()
        showInvDurationDiv()
    }
    main()
})

sipRollingAbsoluteButton.addEventListener("change", function () {
    if (sipRollingAbsoluteButton.checked) {
        hideBothAmountDivs()
        sipAmountDiv.style.display = "block";
        showInvDurationDiv()
    }
    main()
})

lumpsumRollingAbsoluteButton.addEventListener("change", function () {
    if (lumpsumRollingAbsoluteButton.checked) {
        hideBothAmountDivs()
        lumpsumAmountDiv.style.display = "block";
        showInvDurationDiv()
    }
    main()
})

standardDeviationButton.addEventListener("change", function () {
    if (standardDeviationButton.checked) {
        hideBothAmountDivs()
        showInvDurationDiv()
    }
    main()
})

navButton.addEventListener("change", function () {
    if (navButton.checked) {
        hideBothAmountDivs()
        hideInvDurationDiv()
    }
    main()
})

function hideBothAmountDivs() {
    sipAmountDiv.style.display = "none";
    lumpsumAmountDiv.style.display = "none";
}

function hideInvDurationDiv() {
    invDurationDiv.style.display = "none";
}

function showInvDurationDiv() {
    invDurationDiv.style.display = "block";
}

const sipAmountTextBox = document.getElementById("sipAmountTextBox")
const lumpsumAmountTextBox = document.getElementById("lumpsumAmountTextBox")

sipAmountTextBox.addEventListener("change", function () {
    main()
})

lumpsumAmountTextBox.addEventListener("change", function () {
    main()
})