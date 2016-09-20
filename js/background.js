chrome.runtime.onMessage.addListener(function (msg, sender) {
  // First, validate the message's structure
  if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
    // Enable the page-action for the requesting tab
    chrome.pageAction.show(sender.tab.id);
  }
  if((msg.from === 'content') && (msg.subject === 'showSeriesTrue') && null != msg.series) {
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    chrome.browserAction.setBadgeText({text: msg.series.season + ":" + msg.series.series});
  } else {
    chrome.browserAction.setBadgeText({text: ""});
  }
});
