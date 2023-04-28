const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "loadSettings") {
        storage.sync.get("userSettings", (data) => {
            sendResponse({ userSettings: data.userSettings });
        });
        return true;
    }
});
