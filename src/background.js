// disable or enable button
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        if (url.indexOf("geoportal.gov.pl") >= 0) {
            chrome.browserAction.enable(tabs[0].id);
        } else {
            chrome.browserAction.disable(tabs[0].id);
        }
    });
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {action: 'getGpsCoords'},
        function (response) {
            let gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${response.lat},${response.lon}`;
            chrome.tabs.create({url: gmapsUrl});
        });
});
