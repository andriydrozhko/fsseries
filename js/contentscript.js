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
      processChangeSerie();
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
    var fileData = JSON.parse($($("iframe").contents().find("#f" + file)).attr("data-file")).fsData
    var currentSeries = {
      season : fileData.file_season,
      series : fileData.file_series,
      fileId : fileData.file_id,
      serialId : fileData.item_id
    }
    var savedSeries = JSON.parse(localStorage.getItem(fileData.item_id));
    if(null == savedSeries || undefined == savedSeries ||
    (null != savedSeries && (savedSeries.season != currentSeries.season || savedSeries.series != currentSeries.series))) {
      localStorage.setItem(fileData.item_id, JSON.stringify(currentSeries));

    }
}

function processChangeSerie() {
  var serieChangeButtons = $("iframe").contents().find(".b-aplayer__popup-series-episodes")
  console.log(serieChangeButtons)

}

function getSerialInfoForBadge() {
    var currentSerialSeries = getSerialInfoFromStorage();
    $(".b-tab-item__title-inner").css("display", "inline-block");
    $(".b-trailer-poster").css("top", "98px")
    // $(".l-header__wrap").append("<div class='fsseries-info' style='width:100px;height: 42px;'>TEXT</div>")
    if(null != currentSerialSeries && undefined != currentSerialSeries) {
      $(".b-tab-item__title").append(
        "<div style='display:inline-block;font-size: 12px;float:right;'> " +
          "<span style='display: block;'>Остановились: Сезон: " + currentSerialSeries.season +", серия: " + currentSerialSeries.series + "</span>" +
          "<a style='cursor:pointer;' href = 'http://fs.to/video/serials/view/i" + currentSerialSeries.serialId + "?play&file=" + currentSerialSeries.fileId + "'>Перейти к серии</a>" +
        "</div>");
      chrome.runtime.sendMessage({
        from:    'content',
        subject: 'seriesInfo',
        series : currentSerialSeries
      });
    } else {
      cleanSerialInfo();
      $(".b-tab-item__title").append(
        "<div style='display:inline-block;font-size: 12px;float:right;max-width: 120px;'> " +
          "<span style='display: block;'>Вы еще не смотрели этот сериал.</span>" +
        "</div>");
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
  var serialId;
  if(serialPage.test(url)) {
    serialId = url.substring(url.indexOf("serials/i") + 9, url.indexOf("-"));
  } else {
    serialId = url.substring(url.indexOf("view/i") + 6, url.indexOf("?"));
  }
  return JSON.parse(localStorage.getItem(serialId));
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'series')) {
      var currentSerialSeries = getSerialInfoFromStorage();
      if(null != currentSerialSeries && undefined != currentSerialSeries) {
        response(currentSerialSeries);
      }
  }
});
