chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
    if (msg.action === 'getGpsCoords') {
        if (document.querySelectorAll(".infoStripe .iy em")[1] != null) {
            callback({
                //fix the separator sign if Geoportal lang in Polish
                lat: document.querySelectorAll(".infoStripe .ix em")[1].innerText.replace(',', '.'),
                lon: document.querySelectorAll(".infoStripe .iy em")[1].innerText.replace(',', '.')
            });
        }
    }
});
