// disable or enable button
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.getCurrent(tab => {
        // const {hostname} = new URL(tab.url);
        if (tab === undefined) {
        } else if (tab.url.indexOf("geoportal.gov.pl") >= 0) { //limit to geoportal
            chrome.browserAction.enable(tab.id);
        } else if (tab.url.indexOf("google.") >= 0) { //limit to google maps; TODO improve
            chrome.browserAction.enable(tab.id);
        } else {
            chrome.browserAction.disable(tab.id);
        }
    });
});

//invoke action after shortcut is fired (simulates button click)
chrome.browserAction.onClicked.addListener(function (tab) {
    const {hostname} = new URL(tab.url);
    //from geoportal to google maps
    if (hostname.indexOf("geoportal.gov.pl") >= 0) {
        chrome.tabs.sendMessage(tab.id, {action: 'extractWgs84InDmsFormatFromGeoportal'},
            function (response) {
                let gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${response.lat},${response.lon}`;
                chrome.tabs.create({url: gmapsUrl});
            });
    }
    //from google maps to geoportal; uses mygeodata.cloud to convert Google's WGS 84 (EPSG:4326) to Geoportal's ETRS89 / Poland CS92 (EPSG:2180)
    else if (hostname.indexOf("google.") >= 0) {
        chrome.tabs.sendMessage(tab.id, {action: 'extractWgs84InDdFormatFromGoogle'},
            function (response) {
                //todo convert with a js (proj, proj4js) rather than mygeodata
                let lonWgs84 = response.lon
                let latWgs84 = response.lat
                let requestBody = `incrs=%2Bproj%3Dlonglat+%2Bdatum%3DWGS84+%2Bno_defs+&outcrs=%2Bproj%3Dtmerc+%2Blat_0%3D0+%2Blon_0%3D19+%2Bk%3D0.9993+%2Bx_0%3D500000+%2By_0%3D-5300000+%2Bellps%3DGRS80+%2Btowgs84%3D0%2C0%2C0%2C0%2C0%2C0%2C0+%2Bunits%3Dm+%2Bno_defs+&coords=${lonWgs84}+${latWgs84}%0A%0A&addinput=false&switch=false`

                fetch("https://mygeodata.cloud/data/cs2cs", {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "accept-language": "en-US,en;q=0.9,pl;q=0.8",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "body": requestBody,
                    "method": "POST",
                })
                .then(response => response.json())
                .then(json => {
                        console.log(json.data)
                        let [lon, lat] = json.data.split(";").map(coord => coord.replace('\n', '').trim());
                        let geoportalUrl = `https://mapy.geoportal.gov.pl/imap/Imgp_2.html?bbox=${lon},${lat},${lon},${lat}`;
                        chrome.tabs.create({url: geoportalUrl});
                    }
                );
            });
    }
});
