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
    console.debug("Journey started!");
    if (tab === undefined) {
        console.log("Tab undefined. Do nothing");
        return;
    }
    const {hostname} = new URL(tab.url);
    console.debug(`Hostname: ${hostname}`);

    //from geoportal to google maps
    if (hostname.indexOf("geoportal.gov.pl") >= 0) {
        console.debug(`From GEOPL to GMAPS...`);
        chrome.tabs.sendMessage(tab.id, {action: 'extractWgs84InDmsFormatFromGeoportal'},
            function (response) {
                console.debug(`From GEOPL to GMAPS... Got response: ${response}`);
                if (response == null) {
                    return
                }
                let gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${response.lat},${response.lon}`;
                chrome.tabs.create({url: gmapsUrl});
            });
    }
    //from google maps to geoportal; uses mygeodata.cloud to convert Google's WGS 84 (EPSG:4326) to Geoportal's ETRS89 / Poland CS92 (EPSG:2180)
    else if (hostname.indexOf("google.") >= 0) {
        console.debug(`From GMAPS to GEOPL...`);
        chrome.tabs.sendMessage(tab.id, {action: 'extractWgs84InDdFormatFromGoogle'},
            function (response) {
                console.debug(`From GMAPS to GEOPL... Got response: ${response}`);
                if (response == null) {
                    return
                }
                proj4.defs('GOOGLE_MAPS', "+proj=longlat +datum=WGS84 +no_defs");
                proj4.defs('GEOPORTAL', "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ");

                let geopCoords = proj4('GOOGLE_MAPS', 'GEOPORTAL', [parseFloat(response.lon), parseFloat(response.lat)]);
                let geopLon = geopCoords[0]
                let geopLat = geopCoords[1]                
                console.debug(`Mapped to Geoportal coords of lat: ${geopLat} and lon: ${geopLon}`)

                let geoportalUrl = `https://mapy.geoportal.gov.pl/imap/Imgp_2.html?bbox=${geopLon},${geopLat},${geopLon},${geopLat}`;
                chrome.tabs.create({url: geoportalUrl});
            });
    }
});
