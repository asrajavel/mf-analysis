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