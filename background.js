const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "loadSettings") {
        storage.sync.get("userSettings", (data) => {
            sendResponse({ userSettings: data.userSettings });
        });
        return true;
    }
});

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.previousVersion !== chrome.runtime.getManifest().version || details.reason == 'install') chrome.runtime.openOptionsPage();
});
