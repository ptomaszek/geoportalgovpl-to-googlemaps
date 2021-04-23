// Google coordinates formats: https://support.google.com/maps/answer/18539?co=GENIE.Platform%3DDesktop&hl=en&oco=0

chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
    if (msg.action === 'extractWgs84InDmsFormatFromGeoportal') {
        console.info("Extracting coords from Geoportal")
        if (document.querySelectorAll(".infoStripe .iy em")[1] != null) {
            //fix the separator sign if Geoportal lang in Polish
            let lat = document.querySelectorAll(".infoStripe .ix em")[1].innerText.replace(',', '.');
            let lon = document.querySelectorAll(".infoStripe .iy em")[1].innerText.replace(',', '.');
            console.debug(`Found Geoportal coords to be lat: ${lat} and lon: ${lon}`)
            callback({
                lat: lat,
                lon: lon
            });
        }else {
            callback()
        }
    } else if (msg.action === 'extractWgs84InDdFormatFromGoogle') {
        console.info("Extracting coords from Google")
        let coordsElement = document.querySelectorAll("#action-menu div.action-menu-entry-text")[0]
        if (coordsElement !== undefined) {
            let [lat, lon] = coordsElement.textContent.split(', ')
            console.debug(`Found Google Maps coords to be lat: ${lat} and lon: ${lon}`)
            callback({
                lat: lat,
                lon: lon
            });
        } else {
            callback()
        }
    }
});
