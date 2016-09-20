
function setSeriesInfo(series) {
  if(null != series && undefined != series) {
    document.getElementById("series-info").textContent  = "Вы остановились на " + series.series + " серии, " + series.season + " сезона";
    document.getElementById("link-to-series").href  = "http://fs.to/video/serials/view/i" + series.serialId + "?play&file=" + series.fileId;
    // chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    // chrome.browserAction.setBadgeText({text: series.season + ":" + series.series});
  }
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'series'},
        // ...also specifying a callback to be called
        //    from the receiving end (content script)
        setSeriesInfo);
  });
});
