var serialPageRegex = /serials\/$/;
var serialPage = /serials\/.*?.html/;
var serialView = /serials\/view\/.*?/;


if(serialPageRegex.test(window.location.href)) {
  console.log("serials list")
}
if(serialPage.test(window.location.href)) {
  var url = window.location.href;
  var serialId = url.substring(url.indexOf("serials/i") + 9, url.indexOf("-"))
  var currentSerialSeries = JSON.parse(localStorage.getItem(serialId))
  if(null != currentSerialSeries && undefined != currentSerialSeries) {
    console.log("Вы остановились на " + currentSerialSeries.series + " серии, " + currentSerialSeries.season + " сезона")
    console.log("Link: http://fs.to/video/serials/view/i" + serialId + "?play&file=" + currentSerialSeries.fileId)
  }
}
window.onhashchange = function() {

}

var count = 0;
var interval = setInterval(function() {
  if(serialView.test(window.location.href)) {
    var url = window.location.href;
    var file = url.substring(url.indexOf("&file=") + 6, url.length)
    var iframe = document.getElementsByTagName("iframe");
    var fileData = JSON.parse(iframe[0].contentDocument.getElementById("f" + file).getAttribute("data-file")).fsData
    console.log(fileData)
    var currentSeries = {
      season : fileData.file_season,
      series : fileData.file_series,
      fileId : fileData.file_id
    }
    var savedSeries = JSON.parse(localStorage.getItem(fileData.item_id));
    if(null == savedSeries || undefined == savedSeries ||
      (savedSeries.season != currentSeries.season) || (savedSeries.series != currentSeries.series)) {
      localStorage.setItem(fileData.item_id, JSON.stringify(currentSeries));
    }
    clearInterval(interval)
  }
  if(count > 20) {
    count = 0;
    clearInterval(interval)
  }
}, 200);
