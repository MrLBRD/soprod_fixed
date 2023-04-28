const storage = chrome.storage;

const defaultSettings = {
    'fixViewKeywords': true,
    'schemaBtn': true,
    'copyForExcel': [
        'epj',
        'name',
        'date',
        'gamme',
        'statu',
        'origin',
        'request'
    ],
    'autoCheckModif': true,
    'customDashboard': true
}

function saveSettings(settings, callback) {
    storage.sync.set({ userSettings: settings }, callback);
}

function loadSettings(callback) {
    storage.sync.get("userSettings", (data) => {
        if (data.userSettings) {
            callback(data.userSettings);
        } else {
            saveSettings(defaultSettings, () => {
                callback(defaultSettings);
            });
        }
    });
}