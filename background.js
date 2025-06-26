let isTracking = false;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "START_TRACKING") {
    isTracking = true;
    chrome.storage.local.set({ actions: [] });
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {type: "ENABLE_TRACKING"});
    });
    sendResponse({ok: true});
  }
  else if (msg.type === "STOP_TRACKING") {
    isTracking = false;
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {type: "DISABLE_TRACKING"});
    });
    sendResponse({ok: true});
  }
  else if (msg.type === "GET_STATUS") {
    sendResponse({ isTracking });
  }
});
