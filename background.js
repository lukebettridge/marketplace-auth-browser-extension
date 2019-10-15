chrome.tabs.onUpdated.addListener((tabId, changeInfo, _) => {
    if (changeInfo.status == 'complete') {
        chrome.tabs.sendMessage(tabId, {action: 'set_event_listener'}, _ => { });
    };
});