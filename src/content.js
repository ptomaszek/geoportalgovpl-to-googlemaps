chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
    if (msg.action === 'getGpsCoords') {
        if (document.querySelectorAll(".infoStripe .iy em")[1] != null) {
            callback({
                lat: document.querySelectorAll(".infoStripe .ix em")[1].innerText,
                lon: document.querySelectorAll(".infoStripe .iy em")[1].innerText
            });
        }
    }
});
