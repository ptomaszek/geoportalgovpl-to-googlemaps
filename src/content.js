// Google coordinates formats: https://support.google.com/maps/answer/18539?co=GENIE.Platform%3DDesktop&hl=en&oco=0

chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
    if (msg.action === 'extractWgs84InDmsFormatFromGeoportal') {
        console.info("Extracting coords from Geoportal")
        if (document.querySelectorAll(".infoStripe .iy em")[1] != null) {
            callback({
                //fix the separator sign if Geoportal lang in Polish
                lat: document.querySelectorAll(".infoStripe .ix em")[1].innerText.replace(',', '.'),
                lon: document.querySelectorAll(".infoStripe .iy em")[1].innerText.replace(',', '.')
            });
        }
    } else if (msg.action === 'extractWgs84InDdFormatFromGoogle') {
        console.info("Extracting coords from Google")
        let coordsElement = document.querySelectorAll("#action-menu div.action-menu-entry-text")[0]
        if (coordsElement !== undefined) {
            console.log(coordsElement.textContent)
            let [lat, lon] = coordsElement.textContent.split(', ')
            console.log(lat, lon)
            callback({
                lat: lat,
                lon: lon
            });
        }
    }
});
