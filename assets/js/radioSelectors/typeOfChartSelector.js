const sipRollingReturnsButton = document.getElementById("radioButton1TypeOfChart");
const sipRollingAbsoluteButton = document.getElementById("radioButton2TypeOfChart");

const sipAmountDiv = document.getElementById("sipAmountDiv");

// Initially, hide the indexSelector div
// sipAmountDiv.style.display = "none";

sipRollingReturnsButton.addEventListener("change", function () {
    if (sipRollingReturnsButton.checked) {
        sipAmountDiv.style.display = "none";
    }
    main()
})

sipRollingAbsoluteButton.addEventListener("change", function () {
    if (sipRollingAbsoluteButton.checked) {
        sipAmountDiv.style.display = "block";
    }
    main()
})

const sipAmountTextBox = document.getElementById("sipAmountTextBox")

sipAmountTextBox.addEventListener("change", function () {
    main()
})