
function setSeriesInfo(series) {
  if(null != series && undefined != series) {
    document.getElementById("series-info").textContent  = "Вы остановились на " + series.series + " серии, " + series.season + " сезона";
    document.getElementById("link-to-series").href  = "http://fs.to/video/serials/view/i" + series.serialId + "?play&file=" + series.fileId;
  } else {
    //TODO add message 'you dont see this serial'
  }
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', function () {

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
      tabs[0].id, {from: 'popup', subject: 'series'}, setSeriesInfo);
    });
});
