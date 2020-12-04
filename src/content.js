chrome.runtime.onMessage.addListener(function (msg, sender, callback) {
    if (msg.action === 'getGpsCoords') {
        if ($('.infoStripe').length > 0) {
            callback({
                lat: $(".ix").last().find('em').text(),
                lon: $(".iy").last().find('em').text()
            });
        }
    }
});
