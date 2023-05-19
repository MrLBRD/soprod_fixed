const storage = chrome.storage;

const defaultSettings = {
    'fixViewKeywords': true,
    'schemaBtn': true,
    'autoCheckModif': true,
    'customDashboard': true,
    'copyForExcel': [
        'epj',
        'companyName',
        'receptionDate',
        'productRange',
        '',
        'requestOrigin',
        'requestComment'
    ]
}

const settingsInfos = {
    'fixViewKeywords': 'Correction de l’affichage des mots-clés',
    'schemaBtn': 'Ajout schémas de commentaire',
    'autoCheckModif': 'Semi-auto check modif traitée',
    'customDashboard': 'Dashboard modifié',
    'copyForExcel': 'Copie des informations pour Excel'
}

const allInfosAvailable = [
    '',
    'epj',
    'companyName',
    'receptionDate',
    'productRange',
    'requestId',
    'requestDate',
    'requestOrigin',
    'requestComment',
    'jetlag'
]

let activeSettings
let timeAtLastAction

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

function customInputFill(elements, key) {
    const customInput = document.querySelector(`div[id^="item"] div[id="customInput-${key}"]`)
    console.log(customInput)
    customInput.innerHTML = ''
    for (const [id, value] of elements.entries()) {
        const element = document.createElement("div")
        element.className = 'element-custominput'
        element.innerHTML = `<div class="id-elementcustom">${ id }</div><div class="content-elementcustom">${ value }</div><div id="deleteElement-${ id }">${ deleteIcon }</div>`
        customInput.appendChild(element)
    }
    const addElementBtn = document.createElement("div")
    addElementBtn.id = "addElementBtn"
    addElementBtn.className = ""
    addElementBtn.innerHTML = `<select class="active" id="toAddElement"></select>${ validIcon }<svg id="plusElementSelect" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg"><path d="M7.30148 16.5V9.64286H0.444336V7.35714H7.30148V0.5H9.58719V7.35714H16.4443V9.64286H9.58719V16.5H7.30148Z" fill="#4581A6"/></svg>`
    customInput.appendChild(addElementBtn)

    
    const deleteElementBtns = document.querySelectorAll('div.custom-input > div.element-custominput > div[id^="deleteElement-"]')
    console.log(deleteElementBtns)
    deleteElementBtns.forEach((el) => {
        el.addEventListener('click', () => {
            let idForRemove = parseInt((el.id).substring(14))
            const elementsUpdate = (elements.slice(0, idForRemove)).concat(elements.slice(idForRemove+1))
            console.log(elementsUpdate, key)
            customInputFill(elementsUpdate, key)
            activeSettings.copyForExcel = elementsUpdate
        })
    })
    const btnAddElement = document.querySelector('div#addElementBtn')
    btnAddElement.addEventListener('click', () => {
        btnAddElement.className = "active"
    })
    const selectNewElement = document.querySelector('div#addElementBtn select#toAddElement')
    for (const [id, infoAvailable] of allInfosAvailable.entries()) {
        const optionElement = document.createElement('option')
        optionElement.value = infoAvailable
        optionElement.text = infoAvailable
        selectNewElement.add(optionElement, null)
    }
    const validElementSelect = document.querySelector('div#addElementBtn svg#validElementSelect')
    validElementSelect.addEventListener('click', () => {
        const elementsUpdate = elements
        elementsUpdate.push(selectNewElement.value)
        customInputFill(elementsUpdate, key)
        activeSettings.copyForExcel = elementsUpdate
    })
}

function displaySettings(settings) {
    const debugDisplay = document.getElementById("debugOptions");
    debugOptions.innerHTML = ''
    
    for (const key in settings) {
        const setting = settings[key]
        const item = document.createElement("div")
        item.className = 'input-container'
        item.id = `item-${key}` // Ajout d'un identifiant unique
        if (typeof setting == "boolean") {
            item.innerHTML = `<input type="checkbox" ${setting ? 'checked' : ''} id="${key}">
                            <p>${ settingsInfos[key] }</p>`

            debugDisplay.appendChild(item)

            const itemCheckbox = document.querySelector(`div#item-${key} input#${key}`)
            itemCheckbox.addEventListener('change', () => {
                activeSettings[key] = itemCheckbox.checked
                console.log(activeSettings)
            })
        } else {
            item.className = 'otherinput-container'
            const headline = document.createElement("div")
            headline.className = 'input-container'
            headline.innerHTML = `<input type="checkbox" ${setting ? 'checked' : ''} id="${key}">
                                <p>${ settingsInfos[key] }</p>`
            item.appendChild(headline)
            const customInput = document.createElement("div")
            customInput.className = 'custom-input'
            customInput.id = `customInput-${ key }`
            item.appendChild(customInput)

            debugDisplay.appendChild(item)

            customInputFill(setting, key)
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('loaded')
    loadSettings((settings) => {
        activeSettings = settings
        displaySettings(settings);
    });


    const saveSettings = document.getElementById("saveSettingsChange")
    const imgageBeeContainer = saveSettings.querySelector('#imageBee > img')
    const debugDisplay = document.getElementById("debugOptions")

    saveSettings.addEventListener('click', (event) => {
        event.preventDefault()
        timeAtLastAction = (new Date()).getTime()
        saveSettings.classList.add('clicked')
        debugDisplay.classList.add('onSaved')

        storage.sync.set({ userSettings: activeSettings }, () => {
            setTimeout(() => {
                imgageBeeContainer.src = "icons/SoBee_static.svg"
                debugDisplay.classList.remove('onSaved')
                setTimeout(() => {
                    saveSettings.classList.remove('clicked')
                }, 500)
                loadSettings((settings) => {
                    activeSettings = settings
                    displaySettings(settings)
                });
            }, 1200 + ((new Date()).getTime() - timeAtLastAction))
        })
    })
    saveSettings.addEventListener('mouseenter', () => {
        imgageBeeContainer.src = "icons/SoBee_flight.svg"
    })
    saveSettings.addEventListener('mouseleave', () => {
        if (!saveSettings.classList.contains('clicked')) {
            imgageBeeContainer.src = "icons/SoBee_static.svg"
        }
    })

    const returnDefaultSettings = document.getElementById("returnDefaultSettings");
    returnDefaultSettings.addEventListener('click', (event) => {
        event.preventDefault();

        storage.sync.set({ userSettings: defaultSettings }, () => {
            loadSettings((settings) => {
                activeSettings = settings
                displaySettings(settings)
            });
        })
    })
});

const deleteIcon = `<svg viewBox="0 0 15 17" xmlns="http://www.w3.org/2000/svg"><path d="M2.66667 16.5C2.17778 16.5 1.75911 16.3258 1.41067 15.9773C1.06222 15.6289 0.888299 15.2105 0.888892 14.7222V3.16667C0.63704 3.16667 0.425781 3.08134 0.255114 2.91067C0.0844476 2.74 -0.000589517 2.52904 3.07573e-06 2.27778C3.07573e-06 2.02593 0.0853365 1.81467 0.256003 1.644C0.42667 1.47334 0.637632 1.3883 0.888892 1.38889H4.44445C4.44445 1.13704 4.52978 0.925781 4.70045 0.755114C4.87111 0.584447 5.08208 0.49941 5.33333 0.500003H8.88889C9.14074 0.500003 9.352 0.585336 9.52267 0.756003C9.69333 0.92667 9.77837 1.13763 9.77778 1.38889H13.3333C13.5852 1.38889 13.7964 1.47423 13.9671 1.64489C14.1378 1.81556 14.2228 2.02652 14.2222 2.27778C14.2222 2.52963 14.1369 2.74089 13.9662 2.91156C13.7956 3.08222 13.5846 3.16726 13.3333 3.16667V14.7222C13.3333 15.2111 13.1591 15.6298 12.8107 15.9782C12.4622 16.3267 12.0439 16.5006 11.5556 16.5H2.66667ZM2.66667 3.16667V14.7222H11.5556V3.16667H2.66667ZM4.44445 12.0556C4.44445 12.3074 4.52978 12.5187 4.70045 12.6893C4.87111 12.86 5.08208 12.945 5.33333 12.9444C5.58519 12.9444 5.79645 12.8591 5.96711 12.6884C6.13778 12.5178 6.22282 12.3068 6.22222 12.0556V5.83333C6.22222 5.58148 6.13689 5.37022 5.96622 5.19956C5.79556 5.02889 5.58459 4.94385 5.33333 4.94445C5.08148 4.94445 4.87022 5.02978 4.69956 5.20045C4.52889 5.37111 4.44385 5.58208 4.44445 5.83333V12.0556ZM8 12.0556C8 12.3074 8.08533 12.5187 8.256 12.6893C8.42667 12.86 8.63763 12.945 8.88889 12.9444C9.14074 12.9444 9.352 12.8591 9.52267 12.6884C9.69333 12.5178 9.77837 12.3068 9.77778 12.0556V5.83333C9.77778 5.58148 9.69244 5.37022 9.52178 5.19956C9.35111 5.02889 9.14015 4.94385 8.88889 4.94445C8.63704 4.94445 8.42578 5.02978 8.25511 5.20045C8.08444 5.37111 7.99941 5.58208 8 5.83333V12.0556Z" fill="#A6A15E"/></svg>`

const validIcon = `<svg id="validElementSelect" viewBox="0 0 21 17" xmlns="http://www.w3.org/2000/svg"><path d="M7.25285 16.5L0.444336 9.69149L2.82732 7.30851L7.25285 11.734L18.4869 0.5L20.8699 2.88298L7.25285 16.5Z" fill="#4581A6"/></svg>`