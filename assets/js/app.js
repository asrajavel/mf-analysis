mutualFundsList = []


$(function () {
    searchText = null;
    $("#mfsearch").autocomplete({
        search: function (event, ui) {
            var textToSearch;
            if(document.getElementById("fundType").checked) textToSearch = document.getElementById("mfsearch").value + " growth direct"
            else textToSearch = document.getElementById("mfsearch").value
            searchText = encodeURIComponent(textToSearch);
        },
        source: function (req, res) {
            $.ajax({
                dataType: "json",
                type: 'GET',
                url: 'https://api.mfapi.in/mf/search?q=' + searchText,
                success: function (data) {
                    $('#mfsearch').removeClass('ui-autocomplete-loading');
                    // hide loading image
                    res(data);
                },
                error: function (data) {
                    $('#mfsearch').removeClass('ui-autocomplete-loading');
                }
            });

        },
        select: function (event, ui) {
            // document.getElementById("mfsearch").value = " " + ui.item.schemeName;

            // const div = document.createElement('div');
            // div.className = 'row';
            // div.innerHTML = `
            //     <div schemeCode="${ui.item.schemeCode}" schemeName="${ui.item.schemeName}">${ui.item.schemeName}</div>
            // `;
            // document.getElementById('selectedMutualFunds').appendChild(div);

            var selectedMutualFundsDiv = document.getElementById("selectedMutualFunds");
    var schemeCode = ui.item.schemeCode;
    var schemeName = ui.item.schemeName;

    // Create the div with the close button and add it to the selectedMutualFundsDiv
    var mutualFundDiv = createMutualFundDiv(schemeCode, schemeName);
    selectedMutualFundsDiv.appendChild(mutualFundDiv);

            main()
        }

    })
        .data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li>")
                .data("ui-autocomplete-item", item)
                .append(item.schemeName)
                .attr("schemeCode", item.schemeCode)
                .appendTo(ul);
        }
});


// Function to create a new div with a close button
function createMutualFundDiv(schemeCode, schemeName) {
    var div = document.createElement('div');
    div.className = 'row';

    // Create the inner content
    div.innerHTML = `
        <div schemeCode="${schemeCode}" schemeName="${schemeName}">
            ${schemeName}
            <button class="remove-button">x</button>
        `;

    // Add a click event listener to the button to remove the div
    div.querySelector('.remove-button').addEventListener('click', function () {
        div.parentNode.removeChild(div);
        main()
    });

    return div;
}

function addMutualFundToSelectedList(ui) {
    var selectedMutualFundsDiv = document.getElementById("selectedMutualFunds");
    var schemeCode = ui.item.schemeCode;
    var schemeName = ui.item.schemeName;

    // Create the div with the close button and add it to the selectedMutualFundsDiv
    var mutualFundDiv = createMutualFundDiv(schemeCode, schemeName);
    selectedMutualFundsDiv.appendChild(mutualFundDiv);
}

// Usage in your select function
// select: function (event, ui) {
//     addMutualFundToSelectedList(ui);
//     // Rest of your select function
// }
