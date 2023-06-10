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
    let optionsUrl = chrome.runtime.getURL('options.html')
    let tutorialUrl = chrome.runtime.getURL('tutoriel.html')

    if (details.reason == 'install') {
        chrome.storage.sync.set({processSettings: {statu: 'notStarted', step: 0}})
        chrome.tabs.create({ url: tutorialUrl })
    } else if (details.previousVersion !== chrome.runtime.getManifest().version) {
        chrome.tabs.create({ url: optionsUrl + `?reason=update&old=${details.previousVersion}&now=${chrome.runtime.getManifest().version}` })
    }
});
