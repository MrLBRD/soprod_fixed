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
    let optionsUrl = chrome.runtime.getURL('options.html');
    // if (details.previousVersion !== chrome.runtime.getManifest().version || details.reason == 'install') chrome.runtime.openOptionsPage();
    if (details.reason == 'install') {
        // L'extension a été installée
        chrome.tabs.create({ url: optionsUrl + '?reason=install' })
    } else if (details.previousVersion !== chrome.runtime.getManifest().version) {
        // L'extension a été mise à jour
        chrome.tabs.create({ url: optionsUrl + '?reason=update' })
    }
});
