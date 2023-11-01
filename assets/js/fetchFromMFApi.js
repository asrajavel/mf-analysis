navCache = {}

async function fetchData(url) {
    try {
        if (navCache[url]) {
            return navCache[url];
        } else {
            const response = await fetch('https://api.mfapi.in/mf/' + url);
            const data = await response.json();
            navCache[url] = await data;
            return navCache[url];
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}