$(function () {
    searchText = null;
    $("#mfsearch").autocomplete({
        search: function (event, ui) {
            var textToSearch;
            if (document.getElementById("fundType").checked) textToSearch = document.getElementById("mfsearch").value + " growth direct"
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
                    res(data);
                },
                error: function (data) {
                    $('#mfsearch').removeClass('ui-autocomplete-loading');
                }
            });

        },
        select: function (event, ui) {
            var selectedMutualFundsDiv = document.getElementById("selectedMutualFunds");
            var schemeCode = ui.item.schemeCode;
            var schemeName = ui.item.schemeName;

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

    div.innerHTML = `
        <div schemeCode="${schemeCode}" schemeName="${schemeName}">
            ${schemeName}
            <button class="remove-button">x</button>
        `;

    div.querySelector('.remove-button').addEventListener('click', function () {
        div.parentNode.removeChild(div);
        main()
    });

    return div;
}
