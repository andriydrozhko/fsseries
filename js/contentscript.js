var serialPageRegex = /serials\/$/;
var serialPage = /serials\/.*?.html/;
var serialView = /serials\/view\/.*?/;
var viewPageInterval;
$(document).ready(function() {
  processPage();
});

function processPage() {
  cleanSerialInfo()
  if(serialPage.test(window.location.href)) {
    getSerialInfoForBadge();
  }
  var count = 0;
  interval = setInterval(function() {
    
    if(serialView.test(window.location.href)) {
      processViewPage();
      clearInterval(interval)
    }
    if(count > 20) {
      count = 0;
      clearInterval(interval)
    }
  }, 200);
}

function processViewPage() {
    var url = window.location.href;
    var file = url.substring(url.indexOf("&file=") + 6, url.length)
    var iframe = $("iframe");
    console.log(iframe)
    var fileData = JSON.parse(iframe[0].contentDocument.getElementById("f" + file).getAttribute("data-file")).fsData
    console.log(fileData)
    var currentSeries = {
      season : fileData.file_season,
      series : fileData.file_series,
      fileId : fileData.file_id
    }
    var savedSeries = JSON.parse(localStorage.getItem(fileData.item_id));
    if(null == savedSeries || undefined == savedSeries ||
    (null != savedSeries && (savedSeries.season != currentSeries.season || savedSeries.series != currentSeries.series))) {
      localStorage.setItem(fileData.item_id, JSON.stringify(currentSeries));
    }
}

function getSerialInfoForBadge() {
    var currentSerialSeries = getSerialInfoFromStorage();
    if(null != currentSerialSeries && undefined != currentSerialSeries) {
      currentSerialSeries.serialId = serialId;
      chrome.runtime.sendMessage({
        from:    'content',
        subject: 'seriesInfo',
        series : currentSerialSeries
      });
    } else {
      cleanSerialInfo();
    }
}


function cleanSerialInfo() {
  chrome.runtime.sendMessage({
    from:    'content',
    subject: 'seriesInfo',
    series : null
  });
}

function getSerialInfoFromStorage() {
  var url = window.location.href;
  var serialId = url.substring(url.indexOf("serials/i") + 9, url.indexOf("-"));
  return JSON.parse(localStorage.getItem(serialId));
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'series')) {
    if(serialPage.test(window.location.href)) {
      var currentSerialSeries = getSerialInfoFromStorage();
      if(null != currentSerialSeries && undefined != currentSerialSeries) {
        currentSerialSeries.serialId = serialId;
        response(currentSerialSeries);
      }
    }
  }
});
