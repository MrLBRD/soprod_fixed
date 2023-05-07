const storage = chrome.storage;

const defaultSettings = {
    'fixViewKeywords': true,
    'schemaBtn': true,
    'autoCheckModif': true,
    'customDashboard': true,
    'copyForExcel': [
        'epj',
        'name',
        'date',
        'gamme',
        'statu',
        'origin',
        'request'
    ]
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

function displaySettings(settings) {
    const debugDisplay = document.getElementById("debugOptions");
    debugOptions.innerHTML = JSON.stringify(settings, null, "\t")
    
    for (const key in settings) {
        const setting = settings[key]
        const item = document.createElement("div")
        item.className = 'input-container'
        item.id = `item-${key}` // Ajout d'un identifiant unique
        if (typeof setting == "boolean") {
            item.innerHTML = `<input type="checkbox" ${setting ? 'checked' : ''} id="${key}">
                            <h3>${key}</h3>`
        } else {
            item.innerHTML = `<h3>${key}</h3>
                            <div>${setting}</div>`
        }
        debugDisplay.appendChild(item)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('loaded')
    loadSettings((settings) => {
        displaySettings(settings);
    });


    const saveSettings = document.getElementById("saveSettingsChange");

    saveSettings.addEventListener('click', (event) => {
        event.preventDefault()

        const inputsCheckbox = document.querySelectorAll('div.input-container > input[type="checkbox"]')
    })

    // form.addEventListener("submit", (event) => {
    //     event.preventDefault();

    //     const key = form.elements["key"].value;
    //     const message = form.elements["message"].value;
    //     const object = form.elements["object"].value;
    //     const headline = form.elements["headline"].value;
    //     const textBtn = form.elements["textBtn"].value;

    //     loadSettings((settings) => {
    //         if (!settings) {
    //             settings = {};
    //         }

    //         settings[key] = {
    //             message: message,
    //             object: object,
    //             headline: headline,
    //             textBtn: textBtn,
    //         };

    //         saveSettings(settings, () => {
    //             displaySettings(settings);
    //             form.reset();
    //         });
    //     });
    // });

});