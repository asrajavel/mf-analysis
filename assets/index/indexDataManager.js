var indexData = {}
var indexNames = {};

const getIndexData = (indexName) => {
    return (async () => {
        if (indexData[indexName]) {
            // console.log("cache hit for index: ", indexName)
            return indexData[indexName];
        } else {
            // console.log("cache miss for index: ", indexName)
            try {
                const data = await fetchIndexData(indexName);
                const navData = JSON.parse(data.d)
                    .map(item => ({
                        date: new Date(item["Date"]),
                        nav: item["TotalReturnsIndex"]
                    }));

                indexData[indexName] = navData;
                return navData;
            } catch (error) {
                throw error;
            }
        }
    })();
};

async function getIndexNames() {
    const listOfIndexNames = await fetchListOfIndexNames();

    for (const index of listOfIndexNames.d) {
        indexNames[index.indextype] = {};
    }

    const correctedIndexNameToActualName = {};

    for (const indexName in indexNames) {
        const correctedIndexName = correctIndexName(indexName);
        correctedIndexNameToActualName[correctedIndexName] = indexName;
    }

    const sortedIndexNames = Object.keys(correctedIndexNameToActualName).sort();

    console.log("available indices : ", sortedIndexNames);

    for (const indexName in sortedIndexNames) {
        var option = document.createElement("option");
        option.value = correctedIndexNameToActualName[sortedIndexNames[indexName]];
        option.text = sortedIndexNames[indexName];
        indexRadio.appendChild(option);
    }
}

getIndexNames();

async function fetchIndexData(name) {
    const response = await fetch("https://raw.githubusercontent.com/asrajavel/mf-index-data/main/index%20data/" + name + ".json");
    return await response.json();
}

async function fetchListOfIndexNames(name) {
    const response = await fetch("https://raw.githubusercontent.com/asrajavel/mf-index-data/main/index%20list.json");
    return await response.json();
}

function correctIndexName(indexName) {
    // Add a space before each group of digits
    return indexName.replace(/(\d+)/g, ' $1').replace(/\s+/g, ' ');
}
