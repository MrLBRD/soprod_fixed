const storage = typeof chrome !== 'undefined' ? chrome.storage : browser.storage;

const Global = {
    processSettings: undefined,
    userSettings: undefined,
    dataStored: undefined,
}

function loadProcessSettings(callback) {
    storage.sync.get("processSettings", (data) => {
        callback(data.processSettings);
    });
}
function loadSettings(callback) {
    storage.sync.get("userSettings", (data) => {
        callback(data.userSettings);
    });
}

loadProcessSettings((data) => {
    Global.processSettings = data
})
loadSettings((data) => {
    Global.userSettings = data
})

async function getLocalStorage() {
    var pathArray = window.location.pathname.split('/');
    Global.dataStored = JSON.parse(window.localStorage.getItem('soprod-' + pathArray[3]))
}

async function setLocalStorage(rqtId, value) {
    window.localStorage.setItem('soprod-' + rqtId, JSON.stringify(value));
    return true
}

function windowOnload() {
    if (Global.processSettings) {
        if (Global.processSettings.statu !== 'finished' && Global.processSettings.statu !== 'oldUser' && Global.processSettings.statu !== 'defaultSetting') {
            addStyle(styles)
            addBeeBadge('settingsInProgress')
        } else {
            if (Global.userSettings) {
                const pathUrl = window.location.pathname.split('/');
                addStyle(styles)
                if ((pathUrl[1] == "Operator" && pathUrl[2] == "Record")) {
                    setTimeout(() => {
                        getLocalStorage().then(() => {
                            if (Global.dataStored.qualif === 'notStarted') {
                                Global.dataStored.qualif = 'encours'
                                window.localStorage.setItem('soprod-' + pathUrl[3], JSON.stringify(Global.dataStored));
                            }
                            if(Global.dataStored.qualif === 'doneModif') {
                                if (Global.userSettings.autoCheckModif) {
                                    const checkModifBtn = document.querySelector("a[id^='qualificationElement'][data-name='CHECK MODIF TRAITEE OK']")
                                    if (checkModifBtn) {
                                        checkModifBtn.click()
                                        ConfirmModif.getModalConfirmInfo()
                                    }
                                } else {
                                    window.window.localStorage.removeItem('soprod-' + pathUrl[3])
                                }
                            } else {
                                addBeeBadge('requestFile')

                                const navPageContent = document.querySelector('div#masterWebGroupPortlet div ul.nav')
                                let liActive
                                let lastActivated = null

                                if (((navPageContent.querySelector('li.active')).className).includes('dropdown')) {
                                    liActive = navPageContent.querySelector('li.active ul > li.active')
                                } else {
                                    liActive = navPageContent.querySelector('li.active')
                                }

                                const statuses = [
                                    'PRODUCTION MODIFS EN COURS',
                                    'PRODUCTION MODIF GRAPH EN COURS',
                                    'PRODUCTION MODIF CONTENU EN COURS'
                                ]

                                if (statuses.some(status => liActive.innerText.includes(status))) {
                                    changeElementsInProgressModified(liActive.innerText)
                                }
                                lastActivated = liActive.innerText
                                
                                navPageContent.addEventListener('click', () => {
                                    setTimeout(() => {
                                        if (((navPageContent.querySelector('li.active')).className).includes('dropdown')) {
                                            liActive = navPageContent.querySelector('li.active ul > li.active')
                                        } else {
                                            liActive = navPageContent.querySelector('li.active')
                                        }
                                        if (statuses.some(status => liActive.innerText.includes(status))) {
                                            setTimeout(() => {
                                                changeElementsInProgressModified(liActive.innerText)
                                            }, 500)
                                        }
                                        if (Global.dataStored.gamme === 'ESSENTIEL') {
                                            if ((liActive.innerText).includes('CLIENT_CONTACT_COMMERCIAL')) {
                                                const clockElement = document.querySelector('div#horloge')
                                                if (!clockElement) {
                                                    addClock()
                                                }
                                            }
                                        }
                                        lastActivated = liActive.innerText
                                    }, 500)
                                })

                                const testClock = document.querySelector('div#horloge')
                                if (!testClock) {
                                    addClock()
                                }
                            }
                        })
                    }, 800)
                } else if (pathUrl[1] == "Operator" && pathUrl[2] == "Dashboard") {
                    const elementsContextMenu = [
                        {
                            id: 'openInNewTab',
                            text: 'Ouvrir nouvel onglet'
                        }, {
                            id: 'copyInformationsForExcel',
                            text: 'Copier pour excel'
                        }, {
                            id: 'setNotStarted',
                            text: 'Définir Non commencé'
                        }
                    ]
                    let contextMenuContainer = document.createElement('div')
                    contextMenuContainer.id = "context-menu"
                    let listActionsContextMenu = document.createElement('ul')
                    listActionsContextMenu.className = "menu"
                    elementsContextMenu.forEach((el) => {
                        let elementListContextMenu = document.createElement('li')
                        elementListContextMenu.className = "menu-item"
                        elementListContextMenu.innerText = el.text
                        elementListContextMenu.id = el.id
                        listActionsContextMenu.appendChild(elementListContextMenu)
                    })
                    contextMenuContainer.appendChild(listActionsContextMenu)
                    document.body.appendChild(contextMenuContainer)
                    
                    const copyLi = document.querySelector('div#context-menu ul.menu li#copyInformationsForExcel')
                    copyLi.addEventListener('click', function(event) {
                        copyFolderInformations(event)
                    })
                    const openNewTab = document.querySelector('div#context-menu ul.menu li#openInNewTab')
                    openNewTab.addEventListener('click', function(event) {
                        openRequestInNewTab(event)
                    })
                    const setNotStarted = document.querySelector('div#context-menu ul.menu li#setNotStarted')
                    setNotStarted.addEventListener('click', function(event) {
                        defineQualifNotStarted(event)
                    })
                    
                    addBeeBadge('dashboard')

                    Dashboard.getFilterOfDashboard().then(filterDashboard => {
                        if (filterDashboard === "À moi") {
                            Dashboard.listenContainerRequestsTable().then((valueReturn) => {
                                if(valueReturn) clearLocalStorage()
                            })
                        }
                    })

                } else if (pathUrl[1] == "Consultation" && pathUrl[2] == "Record") {
                    // A voir comment procèder car si vue fiche en consultation, probable qu'elle ne soit pas dans les encours donc pas de storage
                    // Réaliser check if in storage
                    // Else faire sans
                } /* else if (pathUrl[1] == "Phone" && pathUrl[2] == "Dialer") {
                    const iframeDiabolo = document.querySelector('div.page-content iframe#diabolocomFrame').contentWindow
                    const callStatuContainer = iframeDiabolo.body.querySelector('div.agent-widget-container.voice-interaction-container div.cti-container > div.cti-container-header > div.cti-container-header__status > span.cti-container-header__conference-status')
                    const callTimeContainer = iframeDiabolo.body.querySelector('div.agent-widget-container.voice-interaction-container div.cti-container > div.cti-container-header > div.cti-container-header__status > span.cti-container-header__time-tag')
                    callStatuContainer.addEventListener('change', () => {
                        console.log(callStatuContainer.innerText.trim())
                        let intervalID = setInterval(function() {
                            console.log(callStatuContainer, callTimeContainer)
                            if (callStatuContainer.innerText.trim() === 'CONVERSATION') {
                                console.log(callTimeContainer.innerText.trim())
                                Calls.saveTimeCall(callTimeContainer.innerText.trim())
                            } else {
                                clearInterval(intervalID);
                            }
                        }, 1000);
                    })
                    const endCallBtn = document.querySelector('div.agent-widget-container.voice-interaction-buttons-container > div.call-interaction-buttons > button.btn.btn-danger')
                } */
            } else {
                setTimeout(() => {
                    windowOnload()
                }, 400)
            }
        }
    } else {
        setTimeout(() => {
            windowOnload()
        }, 400)
    }
}

window.onload = function () {
    if (!runWinOnLoad) {
        runWinOnLoad = true
        windowOnload()
        setTimeout(() => {
            runWinOnLoad = false
        }, 10000)
    }
};

function changeElementsInProgressModified(activTab) {
    if (Global.dataStored.gamme === 'PREMIUM' || activTab.includes('PRODUCTION MODIF CONTENU EN COURS') || (Global.dataStored.gamme).includes('PRIVILEGE')) {
        if (Global.userSettings.viewKeywords) Keywords.keywordsBetterView()
    }
    if (Global.userSettings.schemaBtn) Commentaries.addBtnSchema()

    if (Global.userSettings.togglePortletBlock) {
        let portletsToHidden = null
        switch (true) {
            case activTab.includes('PRODUCTION MODIFS EN COURS'):
                portletsToHidden = [
                    'Client',
                    'TYPE DE MODIFICATION / PROACTIVITE OU DEMANDE CLIENT'
                ]
                Portlets.createTogglePortlet(portletsToHidden)
                break;
            case activTab.includes('PRODUCTION MODIF GRAPH EN COURS'):
                portletsToHidden = [
                    'Client',
                    'MODIFICATION CONTENU SEO',
                    'TYPE MODIFICATION ET DIFFICULTÉ DE CELLE CI'
                ]
                Portlets.createTogglePortlet(portletsToHidden)
                break;
            case activTab.includes('PRODUCTION MODIF CONTENU EN COURS'):
                portletsToHidden = [
                    'Client',
                    'MODIFICATION CONTENU SEO',
                    'Liste des demandes',
                    'TYPE MODIFICATION ET DIFFICULTÉ DE CELLE CI'
                ]
                Portlets.createTogglePortlet(portletsToHidden)
                break;
        }
    }
}

const Calls = {
    saveTimeCall(time) {
        sessionStorage.setItem('lastCallDuration', time);
    }
}

const Portlets = {
    async getAllPortletsTitles() {
        let portletsTitles = document.querySelectorAll('div div.formGroupPortlet[id^="form_"] div.portlet-title div.caption')
        while (!portletsTitles || portletsTitles.length <= 0) {
            await new Promise(resolve => setTimeout(resolve, 400))
            portletsTitles = document.querySelectorAll('div div.formGroupPortlet[id^="form_"] div.portlet-title div.caption')
        }
        return portletsTitles
    },
    createTogglePortlet(portletsToHidden) {
        this.getAllPortletsTitles().then(portletsTitles => {
            for (const portletTitle of portletsTitles) {
                if (portletsToHidden.some(el => portletTitle.innerText === el)) {
                    let portletBody = (portletTitle.parentNode.parentNode).querySelector('div.portlet-body form')
                    portletBody.classList.add('hiddenPortletBody')
        
                    let containerBtn = document.createElement('div')
                    containerBtn.className = "containerBtnShowMore"
                    let btnShowMore = document.createElement('div')
                    btnShowMore.innerText = "VOIR PLUS"
                    btnShowMore.className = "btnShowMore"
        
                    btnShowMore.addEventListener('click', () => {
                        portletBody.classList.toggle('hiddenPortletBody')
                    })
        
                    containerBtn.appendChild(btnShowMore)
                    portletBody.parentNode.appendChild(containerBtn)
                }
            }
        })
    }
}

const Keywords = {
    async getAllKeywordsArea() {
        let keywordsGroupContainers = document.querySelectorAll('form[id^="formGroupKeywords"] div.KeywordsFormGroup')
        while (!keywordsGroupContainers || keywordsGroupContainers.length <= 0) {
            await new Promise(resolve => setTimeout(resolve, 400))
            keywordsGroupContainers = document.querySelectorAll('form[id^="formGroupKeywords"] div.KeywordsFormGroup')
        }
        return keywordsGroupContainers
    },
    async getAllKeywordsRows(keywordsGroupContainer) {
        let keywordsRow = keywordsGroupContainer.querySelectorAll("div.input-group:not(.hidden)")
        while (!keywordsRow || keywordsRow.length <= 0) {
            await new Promise(resolve => setTimeout(resolve, 400))
            keywordsRow = keywordsGroupContainer.querySelectorAll("div.input-group:not(.hidden)")
        }
        return keywordsRow
    },
    keywordsBetterView() {
        this.getAllKeywordsArea().then(keywordsGroupContainers => {
            const KeywordsArea = document.querySelector('div > div.portlet.box[id^="KeywordsArea_"]')
            if (KeywordsArea) {
                switch (Global.userSettings.viewKeywords) {
                    case 'fullWidth':
                        KeywordsArea.parentNode.classList.remove('col-md-6')
                        KeywordsArea.parentNode.className = 'col-md-12'
                        break;
                    case 'halfWidth':
                        KeywordsArea.parentNode.classList.remove('col-md-12')
                        KeywordsArea.parentNode.className = 'col-md-6'
                        break;
                }
            }

            for (const keywordsGroupContainer of keywordsGroupContainers) {
                this.getAllKeywordsRows(keywordsGroupContainer).then(keywordsRows => {
                    for (const keywordRow of keywordsRows) {
                        let keywordInput = keywordRow.querySelector('input.form-control.keywords')

                        let startX
                        let isResizing = false

                        keywordInput.addEventListener('mousemove', (event) => {
                            const rect = keywordInput.getBoundingClientRect()
                            const isNearEdge = event.clientX > rect.right - 10
                            keywordInput.style.cursor = isNearEdge ? 'ew-resize' : ''
                            isNearEdge ? keywordsGroupContainer.classList.add('hover-resize') : keywordsGroupContainer.classList.remove('hover-resize')
                        })
                        
                        keywordInput.addEventListener('mouseleave', () => {
                            keywordsGroupContainer.classList.remove('hover-resize')
                        })

                        keywordInput.addEventListener('mousedown', (event) => {
                            const rect = keywordInput.getBoundingClientRect()
                            const isNearEdge = event.clientX > rect.right - 10

                            if (isNearEdge) {
                                isResizing = true
                                startX = event.clientX
                            }
                        })

                        document.addEventListener('mousemove', (event) => {
                            if (!isResizing) return

                            const dx = event.clientX - startX

                            const newWidth = `${keywordInput.offsetWidth + dx}px`

                            let styleElement = document.getElementById('inputKeywords-style')
                            if (!styleElement) {
                                styleElement = document.createElement('style')
                                styleElement.id = 'inputKeywords-style'
                                document.head.appendChild(styleElement)
                            }
                            styleElement.textContent = `.DMSKeywordsPortlet .portlet-body .KeywordsFormGroup .input-group input.keywords { width: ${newWidth}; }`
                            
                            startX = event.clientX
                        })

                        document.addEventListener('mouseup', () => {
                            isResizing = false
                            Global.dataStored.modifier.inputKeywordsWidth = keywordInput.offsetWidth / keywordRow.offsetWidth * 100

                            const pathUrl = window.location.pathname.split('/');
                            setLocalStorage(pathUrl[3], Global.dataStored).then(() => {
                                let styleElement = document.getElementById('inputKeywords-style')
                                if (!styleElement) {
                                    styleElement = document.createElement('style')
                                    styleElement.id = 'inputKeywords-style'
                                    document.head.appendChild(styleElement)
                                }
                                styleElement.textContent = `.DMSKeywordsPortlet .portlet-body .KeywordsFormGroup .input-group input.keywords { width: ${Global.dataStored.modifier.inputKeywordsWidth}%; }`
                            })
                        })
                    }
                })
            }

            // ici si j'ai déjà une valeur enregistré alors on l'appliquera
            if (Global.dataStored.modifier.inputKeywordsWidth) {
                let styleElement = document.getElementById('inputKeywords-style')
                if (!styleElement) {
                    styleElement = document.createElement('style')
                    styleElement.id = 'inputKeywords-style'
                    document.head.appendChild(styleElement)
                }
                styleElement.textContent = `.DMSKeywordsPortlet .portlet-body .KeywordsFormGroup .input-group input.keywords { width: ${Global.dataStored.modifier.inputKeywordsWidth}%; }`
            }
        })
    }
}

const Commentaries = {
    schemaComments: [
        {
            gamme: 'premium',
            poste: 'cdp',
            btnsList: {
                'sendToControl': {
                    'text': 'Clôture schema',
                    'class': 'btn green',
                    'id': 'addCloseSchemaBtn',
                    'message': 'Appel ${contactTarget} : <div class="ynChoise" contenteditable="false"><button value="oui    →  Numéro de Tél :<br><br>Interlocuteur :<br><br>Durée de l\'appel :">oui</button> <button value="non">non</button> <button value="non, injoignable, message laissé sur le répondeur">injoignable</button></div><br><br>Modifications effectuées :<br><br>Modifications non effectuées :<br><br>Modifications supplémentaires :<br><br>Liens et erreurs 404 : OK 404<br><br>Note SoOptimo : XX > XX<br><br>Envoi mail : <div class="ynChoise" contenteditable="false"><button value="auto">auto</button> <button value="oui → client / ccial">oui</button> <button value="non">non</button></div><br><br>Fichiers dans le MI : <div class="ynChoise" contenteditable="false"><button value="oui">oui</button> <button value="non">non</button></div><br><br>Envoi demandes services tiers : <div class="ynChoise" contenteditable="false"><button value="oui → n° rqt : ">oui</button> <button value="non">non</button></div><br><br>N° ticket (Jira) :<br><br>Commentaire / Verbatim ${contactTarget} :<br><br><div class="ynChoise" contenteditable="false"><button value="- Envoi en contrôle final">Contrôle final</button> <button value="- Envoi en injoignable avec modif">Injoignable Avec modif</button> <button value="- Envoi en injoignable sans modif">Injoignable Sans modif</button></div>',
                    'height': '504px'
                },
                'unreachable': {
                    'text': 'Injoignable schema',
                    'class': 'btn yellow',
                    'id': 'addUnreachableSchemaBtn',
                    'message': 'Appel ${contactTarget} : non, injoignable, message laissé sur le répondeur<br><br>Relance <div class="nextRelaunch" contenteditable="false"><button value="1">24h</button><button value="2">48h</button><button value="auto">auto</button><div class="textEditable" contenteditable="true" spellchecked="false"></div></div>',
                    'height': '76px'
                },
                'basic': {
                    'text': 'Appel Basique schema',
                    'class': 'btn blue',
                    'id': 'addBasicSchemaBtn',
                    'message': 'Appel ${contactTarget} : oui    → Numéro de Tél :<br><br>Interlocuteur :<br><br>Durée de l\'appel :<br><br>Commentaire / Verbatim : <br><br>Envoi demandes services tiers : <div class="ynChoise" contenteditable="false"><button value="oui → n° rqt : ">oui</button> <button value="non">non</button></div><br><br>N° ticket (Jira) :<br><br>Relance/RDV <div class="nextRelaunch" contenteditable="false"><button value="1">24h</button><button value="2">48h</button><button value="auto">auto</button><button value="non">non</button><div class="textEditable" contenteditable="true" spellchecked="false"></div></div>',
                    'height': '272px'
                }
            },
        }, {
            gamme: 'privilege',
            poste: 'graph',
            btnsList: {
                'sendToControl': {
                    'text': 'Clôture schema',
                    'class': 'btn green',
                    'id': 'addCloseSchemaBtn',
                    'message': 'Appel ${contactTarget} : <div class="ynChoise" contenteditable="false"><button value="oui<br><br>Verbatim ${contactTarget} :">oui</button> <button value="non">non</button><button value="non, injoignable, message laissé sur le répondeur">injoignable</button></div><br><br>Modifications effectuées :<br><br>Envoi mail : <div class="ynChoise" contenteditable="false"><button value="auto">auto</button> <button value="oui, manuel → <div class=\'ynChoise\' contenteditable=\'false\'><button value=\'client\'>client</button> <button value=\'ccial\'>ccial</button> <button value=\'client & ccial\'>les deux</button></div>">oui</button></div><br><br><div class="ynChoise" contenteditable="false"><button value="Modif Graph faite - Envoi en contrôle final">Contrôle final</button> <button value="Modif Graph faite - Envoi en injoignable avec modif">Injoignable Avec modif</button> <button value="- Envoi en injoignable sans modif">Injoignable Sans modif</button></div>',
                    'height': '166px'
                },
                'unreachable': {
                    'text': 'Injoignable schema',
                    'class': 'btn yellow',
                    'id': 'addUnreachableSchemaBtn',
                    'message': 'Appel ${contactTarget} : non, injoignable, message laissé sur le répondeur<br><br>Relance <div class="nextRelaunch" contenteditable="false"><button value="1">24h</button><button value="2">48h</button><button value="auto">auto</button><div class="textEditable" contenteditable="true" spellchecked="false"></div></div>',
                    'height': '76px'
                },
                'basic': {
                    'text': 'Appel Basique schema',
                    'class': 'btn blue',
                    'id': 'addBasicSchemaBtn',
                    'message': 'Appel ${contactTarget} : oui<br><br>Verbatim : <br><br>Relance/RDV <div class="nextRelaunch" contenteditable="false"><button value="1">24h</button><button value="2">48h</button><button value="auto">auto</button><button value="non">non</button><div class="textEditable" contenteditable="true" spellchecked="false"></div></div>',
                    'height': '114px'
                },
                'sendViewLink': {
                    'text': 'Envoi lien',
                    'class': 'btn purple',
                    'id' : 'addSendViewLinkSchemaBtn',
                    'message': 'Envoi lien de prévisualisation',
                    'height': '36px'
                }
            },
        }
    ],
    async getAllCommentsArea() {
        let commentsAreaDivs = document.querySelectorAll('.portlet.box.commentsAreaDiv')
        while (!commentsAreaDivs || commentsAreaDivs.length <= 0) {
            await new Promise(resolve => setTimeout(resolve, 400))
            commentsAreaDivs = document.querySelectorAll('.portlet.box.commentsAreaDiv')
        }
        return commentsAreaDivs
    },
    addBtnSchema() {
        var pathArray = window.location.pathname.split('/');
        let idPath = pathArray.reverse()[0]
    
        this.getAllCommentsArea().then(commentsAreaDivs => {
            commentsAreaDivs.forEach((commentsAreaDiv) => {
                let portletBody = commentsAreaDiv.querySelector('.portlet-body.chats')
    
                let addCommentMessage = document.querySelector('.form-control.addCommentMessage')
    
                if (portletBody) {
                    const containersBtns = portletBody.querySelectorAll('.ext--btns-container')
                    if (containersBtns.length === 0) {
                        let newBtnsContainer = document.createElement('div')
                        newBtnsContainer.className = 'ext--btns-container'
    
                        let btnsListToUse = this.schemaComments.find(item => item.gamme === Global.userSettings.userJob.gamme && item.poste === Global.userSettings.userJob.poste)?.btnsList;
    
                        for (const [key, value] of Object.entries(btnsListToUse)) {
                            // Création d'une nouvelle div avec la classe 'btn'
                            var newBtnDiv = document.createElement('div')
                            newBtnDiv.className = value.class
                            newBtnDiv.id = value.id
    
                            // Ajout du texte 'Add text' à la nouvelle div
                            var textNode = document.createTextNode(value.text)
                            newBtnDiv.appendChild(textNode)
    
                            newBtnDiv.addEventListener('click', () => {
                                let valueIsDeletable = false
                                if (addCommentMessage.value == '') {
                                    valueIsDeletable = true
                                } else {
                                    let writeComment = (addCommentMessage.value).replaceAll(/client|ccial/g, '${contactTarget}').trim().replace(/\b\d{2}\/\d{2}\b/g, '').trim().replace(/[\r\n]/g, '').trim()
                                    for (var [idBtn, btnInfo] of Object.entries(btnsListToUse)) {
                                        let btnInfoComment = (btnInfo.message).trim().replace(/[\r\n]/g, '').trim()
                                        if (writeComment == btnInfoComment) {
                                            valueIsDeletable = true
                                            break;
                                        }
                                    }
                                }
                                if (valueIsDeletable) {                              
                                    let divEditable = document.createElement('div')
                                    divEditable.className = "form-control addCommentMessage input ui-autocomplete-input"
                                    divEditable.style = "overflow-y: hidden; height: auto; background-color: transparent; position: absolute; top: 0;"
                                    divEditable.setAttribute("contenteditable", "true")

                                    let contentDiv = []

                                    let htmlValue = (value.message).replaceAll('${contactTarget}', Global.dataStored.contact)
                                    divEditable.innerHTML = htmlValue
                                    contentDiv.push(htmlValue)

                                    
                                    addCommentMessage.value = divEditable.innerText
                                    addCommentMessage.style.visibility = "hidden"
                                    addCommentMessage.style.height = divEditable.offsetHeight + "px"


                                    function divAction() {
                                        if ((divEditable.innerText).trim() === '') {
                                            divEditable.parentNode.removeChild(divEditable)
                                            addCommentMessage.value = ""
                                            addCommentMessage.style.visibility = ""
                                            addCommentMessage.style.height = '32px'
                                            addCommentMessage.focus()
                                        } else {
                                            addCommentMessage.style.height = divEditable.clientHeight + "px"
                                            addCommentMessage.value = divEditable.innerText
                                            addCommentMessage.dispatchEvent(new Event('change'))
                                            Global.dataStored.lastComment.text = addCommentMessage.value
                                            Global.dataStored.lastComment.height = addCommentMessage.clientHeight + 'px'
                                            localStorage.setItem('soprod-' + idPath, JSON.stringify(Global.dataStored))

                                            if (contentDiv[0] !== divEditable.innerHTML) contentDiv.unshift(divEditable.innerHTML)
                                        }
                                    }

                                    divEditable.addEventListener('input', () =>  {
                                        divAction()
                                    })
                                    
                                    divEditable.addEventListener('click', () =>  {
                                        divAction()
                                    })
                                    
                                    let keysActivOnDiv = {
                                        'Enter': false,
                                        'Control': false,
                                        'Z': false,
                                        'z': false
                                    }

                                    const sendCommentBtn = portletBody.querySelector('div.chat-form div.btn-cont a.addComment.btn')

                                    divEditable.addEventListener("keydown", (e) => {
                                        if (!e.repeat) {
                                            if (e.key == 'Enter' || e.key == 'Control' || e.key == 'z' || e.key == 'Z') {
                                                keysActivOnDiv[e.key] = true
                                                if (keysActivOnDiv.Enter && keysActivOnDiv.Control) {
                                                    if (addCommentMessage.value !== '') {
                                                        Global.dataStored.lastComment.text = addCommentMessage.value
                                                        Global.dataStored.lastComment.height = addCommentMessage.clientHeight + 'px'
                                                        localStorage.setItem('soprod-' + idPath, JSON.stringify(Global.dataStored))
                                                        addCommentMessage.style.height = '32px'
                                                        addCommentMessage.style.visibility = ''
                                                        
                                                        sendCommentBtn.click()
                                                        
                                                        divEditable.parentNode.removeChild(divEditable)
                                                    }
                                                } else if (keysActivOnDiv.Control && (keysActivOnDiv.z || keysActivOnDiv.Z)) {
                                                    contentDiv.shift()
                                                    divEditable.innerHTML = contentDiv[0]
                                                    addCommentMessage.style.height = divEditable.clientHeight + "px"
                                                    addCommentMessage.value = divEditable.innerText
                                                    addCommentMessage.dispatchEvent(new Event('change'))
                                                    Global.dataStored.lastComment.text = addCommentMessage.value
                                                    Global.dataStored.lastComment.height = addCommentMessage.clientHeight + 'px'
                                                    localStorage.setItem('soprod-' + idPath, JSON.stringify(Global.dataStored))
                                                    actionsBtnsInlineText()
                                                }
                                            }
                                        }
                                    })
                                    divEditable.addEventListener("keyup", (e) => {
                                        if (e.key == 'Enter' || e.key == 'Control' || e.key == 'z' || e.key == 'Z') {
                                            keysActivOnDiv[e.key] = false
                                        }
                                    })

                                    sendCommentBtn.addEventListener('click', () => {
                                        if (addCommentMessage.value !== '') {
                                            Global.dataStored.lastComment.text = addCommentMessage.value
                                            Global.dataStored.lastComment.height = addCommentMessage.clientHeight + 'px'
                                            localStorage.setItem('soprod-' + idPath, JSON.stringify(Global.dataStored))
                                            addCommentMessage.style.height = '32px'
                                            addCommentMessage.style.visibility = ''
                                                                                            
                                            divEditable.parentNode.removeChild(divEditable)
                                        }
                                    })

                                    function actionsBtnsInlineText() {
                                        let ynChoises = divEditable.querySelectorAll('div.ynChoise')
                                        ynChoises.forEach(ynContainer => {
                                            let btns = ynContainer.querySelectorAll('button')
                                            btns.forEach(btn => {
                                                btn.addEventListener('click', () => {
                                                    ynContainer.outerHTML = btn.value
                                                    divEditable.focus()
                                                    actionsBtnsInlineText()
                                                })
                                            })
                                        })
                                        
                                        let nextCalls = divEditable.querySelectorAll('div.nextRelaunch')
                                        nextCalls.forEach(nextCall => {
                                            let btns = nextCall.querySelectorAll('button')
                                            btns.forEach(btn => {
                                                btn.addEventListener('click', () => {
                                                    if (btn.value === "auto") {
                                                        nextCall.outerHTML = Commentaries.howNextDayToCall()
                                                    } else if (btn.value === "non") {
                                                        let commentContent = divEditable.innerHTML
                                                        let positionRelaunch = commentContent.indexOf("Relance")

                                                        if (positionRelaunch !== -1) {
                                                            let nouveauContenu = commentContent.substring(0, positionRelaunch)
                                                            
                                                            while (nouveauContenu.endsWith('<br>')) {
                                                                nouveauContenu = nouveauContenu.substring(0, nouveauContenu.length - 4)
                                                            }

                                                            divEditable.innerHTML = nouveauContenu
                                                        }
                                                    } else {
                                                        nextCall.outerHTML = Commentaries.setupNextDayToCall(btn.value)
                                                    }
                                                    divEditable.focus()
                                                })
                                            })
                                            let divFakeInput = nextCall.querySelector('div.textEditable')
                                            if(divFakeInput.innerText !== '') {
                                                divFakeInput.innerText = ''
                                            }
                                            divFakeInput.addEventListener('focus', () => {
                                                divFakeInput.classList.add("onEditing")
                                                divFakeInput.addEventListener("keyup", (e) => {
                                                    if (e.key == 'Enter' || e.key == 'Control' || e.key == 'z' || e.key == 'Z') {
                                                        keysActivOnDiv[e.key] = false
                                                    }
                                                    let textToCheck = divFakeInput.innerText.trim()
                                                    switch (textToCheck) {
                                                        case 'auto':
                                                            nextCall.outerHTML = Commentaries.howNextDayToCall()
                                                            divEditable.focus()
                                                            break;
                                                        case '24h':
                                                            nextCall.outerHTML = Commentaries.setupNextDayToCall(1)
                                                            divEditable.focus()
                                                            break;
                                                        case '48h':
                                                        case 48:
                                                        case '48':
                                                            nextCall.outerHTML = Commentaries.setupNextDayToCall(2)
                                                            divEditable.focus()
                                                            break;
                                                        default:
                                                            if (Commentaries.isDatePatternValid(textToCheck)) {
                                                                nextCall.outerHTML = textToCheck
                                                                divEditable.focus()
                                                            }
                                                    }
                                                })
                                            })
                                            divFakeInput.addEventListener('blur', () => {
                                                divFakeInput.classList.remove("onEditing")
                                            })
                                        })
                                    }

                                    actionsBtnsInlineText()
                                    

                                    addCommentMessage.insertAdjacentElement("afterend", divEditable);
                                    
                                    addCommentMessage.style.height = value.height
                                    addCommentMessage.dispatchEvent(new Event('change'))
                                }
                            })
    
                            // Ajout de la nouvelle div à l'intérieur de la div 'portletBody'
                            newBtnsContainer.appendChild(newBtnDiv)
                        }
    
                        if (Global.dataStored.lastComment.text) {
                            var newBtnDiv = document.createElement('div');
                            newBtnDiv.className = 'btn btn-outline icon-custombtn';
                            newBtnDiv.id = 'getAddStoredMessage';
                            newBtnDiv.title = "Récupérer le mesage que vous étiez en train d'écrire."
                            newBtnDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>'
    
                            newBtnDiv.addEventListener('click', () => {
                                if (addCommentMessage.value == '') {
                                    addCommentMessage.value = Global.dataStored.lastComment.text
                                    addCommentMessage.style.height = Global.dataStored.lastComment.height
                                }
                            })
    
                            newBtnsContainer.appendChild(newBtnDiv);
                        }
    
                        portletBody.appendChild(newBtnsContainer)
    
                        let keysActiv = {
                            'Enter': false,
                            'Control': false
                        }
    
                        addCommentMessage.addEventListener("keydown", (e) => {
                            if (!e.repeat) {
                                if (e.key == 'Enter' || e.key == 'Control') {
                                    keysActiv[e.key] = true
                                    if (keysActiv.Enter && keysActiv.Control) {
                                        if (addCommentMessage.value !== '') {
                                            Global.dataStored.lastComment.text = addCommentMessage.value
                                            Global.dataStored.lastComment.height = addCommentMessage.clientHeight + 'px'
                                            localStorage.setItem('soprod-' + idPath, JSON.stringify(Global.dataStored))
                                            addCommentMessage.style.height = '32px'
                                        }
                                    }
                                }
                            }
                        })
                        addCommentMessage.addEventListener("keyup", (e) => {
                            if (e.key == 'Enter' || e.key == 'Control') {
                                keysActiv[e.key] = false
                            }
                        })
                        let storage = Global.dataStored.lastComment.text
                        addCommentMessage.addEventListener("input", (e) => {
                            if ((addCommentMessage.value).length - storage.length > 2 || (addCommentMessage.value).length - storage.length < -2) {
                                storage = addCommentMessage.value
                                Global.dataStored.lastComment.text = addCommentMessage.value
                                Global.dataStored.lastComment.height = addCommentMessage.clientHeight + 'px'
                                localStorage.setItem('soprod-' + idPath, JSON.stringify(Global.dataStored))
                            }
                        });
                        addCommentMessage.addEventListener("focusout", (e) => {
                            if (addCommentMessage.value !== '') {
                                Global.dataStored.lastComment.text = addCommentMessage.value
                                Global.dataStored.lastComment.height = addCommentMessage.clientHeight + 'px'
                                localStorage.setItem('soprod-' + idPath, JSON.stringify(Global.dataStored));
                            }
                        });
                    }
                }
            })
        })
    },
    howNextDayToCall() {
        let choosenDate = new Date()
        let dayDelay
        switch (Global.dataStored.qualif) {
            case 'afterRdvModif':
            case 'encours':
                dayDelay = 1
                break;
            case 'relaunchModif':
            case 'lastRelaunchModif':
            case 'rdvModif':
                dayDelay = 2
                break;
        }
        let newDate = this.AddDaTor.calcul(choosenDate, dayDelay);
        return newDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
    },
    setupNextDayToCall(dayDelay) {
        let choosenDate = new Date()
        let newDate = this.AddDaTor.calcul(choosenDate, dayDelay);
        return newDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
    },
    AddDaTor: {
        calcul(choosenDate, jours) {
            var date = choosenDate.getTime(),
                now = new Date(),
                feries = this.joursFeries(choosenDate.getFullYear()),
                i = 1,
                cpt = 0,
                tmp;
            while (cpt < jours) {
                tmp = new Date(date + i * 24 * 60 * 60 * 1000);
                var day = tmp.getDay();
                if (day != 0) { // dimanche
                    // jours ferié
                    var found = false;
                    for (var f = feries.length - 1; f >= 0; f--) {
                        if (
                            parseInt(feries[f].getDate()) == parseInt(tmp.getDate())
                            && parseInt(feries[f].getMonth()) == parseInt(tmp.getMonth())
                            && parseInt(feries[f].getFullYear()) == parseInt(tmp.getFullYear())
                        ) {
                            found = true;
                        }
                    };
                    if (!found) {
                        cpt++;
                    }
                }
                i++;
            };
            // S'assurer que la date retournée est un jour ouvrable (hors samedi)
            var isWorkingDay;
            do {
                isWorkingDay = true;
                if (tmp.getDay() === 6 || tmp.getDay() === 0) { // Si c'est un samedi
                    tmp.setDate(tmp.getDate() + 1); // Ajouter un jour supplémentaire pour éviter le samedi
                    isWorkingDay = false;
                } else {
                    for (var f = feries.length - 1; f >= 0; f--) {
                        if (
                            parseInt(feries[f].getDate()) == parseInt(tmp.getDate())
                            && parseInt(feries[f].getMonth()) == parseInt(tmp.getMonth())
                            && parseInt(feries[f].getFullYear()) == parseInt(tmp.getFullYear())
                        ) {
                            tmp.setDate(tmp.getDate() + 1); // Ajouter un jour supplémentaire pour éviter le jour férié
                            isWorkingDay = false;
                            break;
                        }
                    }
                }
            } while (!isWorkingDay);
    
            return tmp;
        },
        joursFeries(an) {
            var JourAn = new Date(an, "00", "01"),
                FeteTravail = new Date(an, "04", "01"),
                Victoire1945 = new Date(an, "04", "08"),
                FeteNationale = new Date(an, "06", "14"),
                Assomption = new Date(an, "07", "15"),
                Toussaint = new Date(an, "10", "01"),
                Armistice = new Date(an, "10", "11"),
                Noel = new Date(an, "11", "25"),
                SaintEtienne = new Date(an, "11", "26"),
                G = an % 19,
                C = Math.floor(an / 100),
                H = (C - Math.floor(C / 4) - Math.floor((8 * C + 13) / 25) + 19 * G + 15) % 30,
                I = H - Math.floor(H / 28) * (1 - Math.floor(H / 28) * Math.floor(29 / (H + 1)) * Math.floor((21 - G) / 11)),
                J = (an * 1 + Math.floor(an / 4) + I + 2 - C + Math.floor(C / 4)) % 7,
                L = I - J,
                MoisPaques = 3 + Math.floor((L + 40) / 44),
                JourPaques = L + 28 - 31 * Math.floor(MoisPaques / 4),
                Paques = new Date(an, MoisPaques - 1, JourPaques),
                VendrediSaint = new Date(an, MoisPaques - 1, JourPaques - 2),
                LundiPaques = new Date(an, MoisPaques - 1, JourPaques + 1),
                Ascension = new Date(an, MoisPaques - 1, JourPaques + 39),
                Pentecote = new Date(an, MoisPaques - 1, JourPaques + 49),
                LundiPentecote = new Date(an, MoisPaques - 1, JourPaques + 50);
            return [JourAn, VendrediSaint, Paques, LundiPaques, FeteTravail, Victoire1945, Ascension, Pentecote, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel, SaintEtienne];
        }
    },
    isDatePatternValid(dateString) {
        const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])$/;
        return regex.test(dateString);
    }
      
}


function clearLocalStorage() {
    console.log(localStorage)
    const today = new Date()
    for (const [key, value] of Object.entries(localStorage)) {
        if (key.startsWith('soprod-')) {
            let valueParse = JSON.parse(value)
            if (valueParse.lastDate) {
                let lastDateCheck = new Date(valueParse.lastDate)
                if (today.getTime() - lastDateCheck.getTime() > (5 * 24 * 60 * 60 * 1000)) {
                    localStorage.removeItem(key)
                }
            } else {
                console.log([key, valueParse])
            }
        } else if (key.startsWith('comment-')) {
            localStorage.removeItem(key)
        }
    }
    Alerts.displayAlert('success', 'Localstorage analysé avec succés. Les données sont à jour.')
}

var styles = [
    {
        modif: 'importFont',
        configurable: false,
        css: "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap')"
    }, {
        modif: 'schemaBtn',
        configurable: true,
        css: '.ext--btns-container { width: 100%; display: flex; gap: 8px; margin-top: 8px; } .btn-outline {border-width: 0.25rem; border-color: #545454; } #getAddStoredMessage svg { height: 16px; } .icon-custombtn { padding: 7px 12px } div.commentsAreaDiv div.portlet-body.scrollable-content { max-height: none; } div.ynChoise, div.nextRelaunch, div.nextRelaunch div { display: inline-block; } div.nextRelaunch > div.textEditable { min-width: 3rem; outline: none; text-align: center; } div.nextRelaunch > div.textEditable.onEditing { background-color: rgba(240, 20, 20, .6); } div.nextRelaunch > div.textEditable:hover { background-color: rgba(240, 20, 20, .6); min-width: 5rem; }',
    }, {
        modif: 'horloge',
        configurable: false,
        css: '.clockActive #beeBadge { padding: 8px 16px 8px 10px; } div#horloge { font-size: 36px; font-family: "Space Grotesk", sans-serif; font-weight: 500; letter-spacing: 0.05em; color: #1E1E1E; line-height: 1em; } #beeMenuContainer.clockActive { min-width: 180px; } #beeMenuContainer.clockActive:hover { min-width: 180px; }'
    }, {
        modif: 'autoCheckModif',
        configurable: true,
        css: 'div.modifOk-comment { margin-top: 16px;} div.modifOk-comment div.message { background: #eee; text-align: left; border-left: 4px solid #f9b03f; padding: 5px 8px;} div.modifOk-comment div.message .name { color: #f9b03f; font-weight: 600; font-size: 14px; } div.modifOk-comment div.message .body { white-space: pre-line; word-break: break-word; display: block; }'
    }, {
        modif: 'contextMenu',
        configurable: false,
        css: '#context-menu { position: absolute !important; border: 1px solid #d3d3d3; background-color: #e3e3e3; padding: 0; z-index: 100000 !important; display: none; } #context-menu.active { display: initial; } .menu { list-style: none !important; padding: 0; margin: 0; } .menu-item { padding: 8px 10px; cursor: pointer; } .menu-item:hover { background-color: #d3d3d3; } .menu-separator{ height: 1px; background-color: grey; margin: 5px 0; }'
    }, {
        modif: 'customDashboard',
        configurable: true,
        css: '#tableRecordsList table tr.unreachable>td { background-color: rgba(219, 178, 130, .65); }'
    }, {
        modif: 'smallCalendar',
        configurable: false,
        css: '@media screen and (max-width: 1380px) { div.userCalendarLayout { width: 45%; height: calc(100% - 45px - 35px); overflow: hidden; } div.userCalendarLayout > #userCalendarWrapper { height: 100%; display: flex; flex-direction: column; } div.userCalendarLayout > #userCalendarWrapper div.portlet-body { flex-grow: 1; align-self: stretch; } #userCalendarWrapper div.portlet-body > div.row { height: 100%; } #userCalendarWrapper div.portlet-body div.row > div { height: 100%; } #userCalendarWrapper div.portlet-body div#userCalendar { height: 100%; display: flex; flex-direction: column; } div#userCalendar > div.fc-toolbar { margin-bottom: 0; } div#userCalendar > div.fc-view-container { flex-grow: 1; align-self: stretch; max-height: calc(100% - 46px); } div#userCalendar > div.fc-view-container > div { height: 100%; } div#userCalendar > div.fc-view-container > div > table { height: 100%; display: flex; flex-direction: column; } div#userCalendar > div.fc-view-container > div > table > tbody { flex-grow: 1; align-self: stretch; max-height: calc(100% - 19px); overflow: hidden auto; } div#userCalendar > div.fc-view-container > div > table > tbody > tr > td.fc-widget-content div.fc-time-grid-container { height: auto !important; } }'
    }, {
        modif: 'beeFloatMenu',
        configurable: false,
        css: '#beeElementsContainer { position: fixed; z-index: 9999; left: 32px; bottom: 24px; display: flex; flex-direction: column-reverse; gap: 1rem; transition: all 0.3s ease-out; } #beeMenuContainer { min-height: 64px; min-width: 64px; width: fit-content; transition: all 0.3s ease-out; } #beeMenuContainer:hover { min-height: 135px; min-width: 150px; } #beeBadge { bottom: 0; left: 0; position: absolute; display: flex; flex-direction: row; align-items: center; padding: 4px; width: fit-content; height: 64px; gap: 8px; min-width: 64px; justify-content: center; background: #F1D4F3; border-radius: 248px !important; cursor: pointer !important; z-index: 3; } #beeMenuContainer:hover #beeBadge { background: #BDA7BF; } #beeBadge img { height: 48px; } div#bee-errorFlag { position: absolute; z-index: 1; right: 0; top: 0; transform: translate(10px, -2px); } div#bee-errorFlag svg { height: 32px; }'
    }, {
        modif: 'btnsBeeMenu',
        configurable: false,
        css: '.btn-badge { position: absolute; display: flex; flex-direction: row; align-items: center; width: 16px; height: 16px; bottom: calc(32px - 8px); left: calc(32px - 8px); cursor: pointer; border-radius: 248px !important; transition: all 0.3s ease-out; } .btn-badge img { height: 100%; } #autoNextRelaunch { background: #87E86B; } #copyForExcel { background: #FFF790; } #switchContact { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 0; background: #6AC6FF; } #exportLocalStorage { background: #F69421; } #importLocalStorage { background: #6AC6FF; } #beeMenuContainer:hover .btn-badge { width: 48px; height: 48px; } #beeMenuContainer:hover div:nth-child(2) { left: 10px; bottom: 85px; } #beeMenuContainer:hover div:nth-child(3) { left: 65px; bottom: 61px; } #beeMenuContainer:hover div:nth-child(4) { left: 89px; bottom: 7px; } #beeMenuContainer.clockActive:hover div:nth-child(2) { left: 10px; bottom: 85px; } #beeMenuContainer.clockActive:hover div:nth-child(3) { left: 70px; bottom: 85px; } #beeMenuContainer.clockActive:hover div:nth-child(4) { left: 130px; bottom: 85px; } #autoNextRelaunch:hover { background: #6dbf56; } #copyForExcel:hover { background: #ccc672; } #switchContact:hover { background: #5ba9d9; } #exportLocalStorage:hover { background: #CC7B1B; } #importLocalStorage:hover { background: #5ba9d9; } #beeMenuContainer:hover #switchContact.clicked { width: 16px; height: 16px; bottom: calc(32px - 8px); left: calc(32px - 8px); } .btn-badge#switchContact img { margin-top: -6px; height: 90%; } .btn-badge#switchContact #textSwitchContact { margin-top: -9px; text-transform: uppercase; font-size: 9px; font-weight: 800; }'
    }, {
        modif: 'alerts',
        configurable: false,
        css: '@property --border-angle { syntax: "<angle>"; inherits: true; initial-value: 1turn; } div#alertBoxContainer { position: relative; min-width: 180px; max-width: 240px; width: fit-content; display: flex; flex-direction: column; align-items: flex-start; padding: 10px 16px; background: rgba(180, 254, 192, 0.4); border: 2px solid #B4FEC0; border-radius: 8px !important; --border-angle: 1turn; } div#alertBoxContainer::after { content: ""; position: absolute; inset: -2.5px; border-radius: 8px; padding: 3px; background: conic-gradient(from 0.19turn, transparent var(--border-angle), #223A12 var(--border-angle), #223A12); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; animation: bg-spin 5s linear forwards; } @keyframes bg-spin { to { --border-angle: 0turn; } } div#alertBoxContainer:hover::after { animation-play-state: paused; } #alertBoxContainer #closeAlertBox { position: absolute; z-index: 1; width: 1.1rem; align-self: flex-end; cursor: pointer; } #alertBoxContainer #alertTitle { font-weight: 700; font-size: 1.3rem; margin: 0.25rem 0 1rem; } #alertBoxContainer #alertMessage { font-weight: 400; font-size: 1.1rem; margin: 0; } ',
    }, {
        modif: 'togglePortlet',
        configurable: false,
        css: 'form.hiddenPortletBody { display: none; } .containerBtnShowMore { width: 100%; display: flex; justify-content: center; align-items: center; min-height: 50px; } .btnShowMore { width: fit-content; padding: 8px 16px; background-color: rgba(85, 107, 47, .8); display: flex; align-content: center; justify-content: center; color: whitesmoke; font-size: 16px; font-family: "Space Grotesk"; border-radius: 4px !important; cursor: pointer; }'
    }, {
        modif: 'keywordsArea',
        configurable: false,
        css: '.KeywordsFormGroup.form-group .input-group { display: flex; } .input-group .input-group-btn { width: 36px; } .DMSKeywordsPortlet .portlet-body .KeywordsFormGroup .input-group input.localities { width: auto; flex-grow: 1; align-items: stretch; } .DMSKeywordsPortlet .portlet-body .KeywordsFormGroup .input-group input.keywords { min-width: 128px; } div.KeywordsFormGroup.hover-resize .input-group input.keywords.form-control { border-right: 4px double #49476b; }',
    }
];

function addStyle(styles) {
    styles.forEach((el) => {
        if (Global.processSettings.statu !== 'finished' && Global.processSettings.statu !== 'oldUser' && Global.processSettings.statu !== 'defaultSetting') {
            if (el.modif === 'beeFloatMenu') {
                /* Create style document */
                var css = document.createElement('style');
                css.type = 'text/css';
            
                if (css.styleSheet)
                    css.styleSheet.cssText = el.css;
                else
                    css.appendChild(document.createTextNode(el.css));
            
                /* Append style to the tag name */
                document.getElementsByTagName("head")[0].appendChild(css);
            }
        } else {
            if (!el.configurable || Global.userSettings[el.modif]) {
                /* Create style document */
                var css = document.createElement('style');
                css.type = 'text/css';
            
                if (css.styleSheet)
                    css.styleSheet.cssText = el.css;
                else
                    css.appendChild(document.createTextNode(el.css));
            
                /* Append style to the tag name */
                document.getElementsByTagName("head")[0].appendChild(css);
            }
        }
    })
}

const ConfirmModif = {
    async getConfirmModal() {
        let confirmModal = document.querySelector('body > div.bootbox.modal.fade.bootbox-preview.in > div.modal-dialog > div.modal-content')
        while (!confirmModal) {
            await new Promise(resolve => setTimeout(resolve, 300))
            confirmModal = document.querySelector('body > div.bootbox.modal.fade.bootbox-preview.in > div.modal-dialog > div.modal-content')
        }
        while (confirmModal.querySelector('div.modal-body > div.bootbox-body').innerText !== 'La fiche sera qualifié en « CHECK MODIF TRAITEE OK »') {
            await new Promise(resolve => setTimeout(resolve, 200))
            confirmModal = document.querySelector('body > div.bootbox.modal.fade.bootbox-preview.in > div.modal-dialog > div.modal-content')
        }
        return confirmModal
    },
    displayConfirmOkModal(lastComment) {
        let newDiv = document.createElement('div')
        newDiv.className = "modifOk-comment"
        newDiv.appendChild(lastComment)
        setTimeout(() => {
            const pathUrl = window.location.pathname.split('/');
            this.getConfirmModal().then(confirmModal => {
                const bodyConfirmModal = confirmModal.querySelector('div.modal-body')
                bodyConfirmModal.appendChild(newDiv)
                const okBtnConfirmModal = confirmModal.querySelector('div.modal-footer button.btn[type="button"][data-bb-handler="Ok"]')
                okBtnConfirmModal.addEventListener('click', () => {
                    window.localStorage.removeItem('soprod-' + pathUrl[3])
                    window.location.replace(
                        "https://soprod.solocalms.fr/Operator/Dashboard"
                    );
                })
            })
        }, 500)
    },
    async getAllComments() {
        let lastAllComments = document.querySelectorAll("div.commentsAreaDiv[id^='comments'] div.portlet-body>div.getComments>div.row ul.chats>li.in")[0]
        while (!lastAllComments) {
            await new Promise(resolve => setTimeout(resolve, 300))
            lastAllComments = document.querySelectorAll("div.commentsAreaDiv[id^='comments'] div.portlet-body>div.getComments>div.row ul.chats>li.in")[0]
        }
        return lastAllComments
    },
    async getUserTag() {
        let userTag = document.querySelector("div.page-header.navbar.navbar-fixed-top > div > div.top-menu > ul > li.dropdown.dropdown-user > a > span")
        while (!userTag) {
            await new Promise(resolve => setTimeout(resolve, 200))
            userTag = document.querySelector("div.page-header.navbar div.top-menu > ul > li.dropdown.dropdown-user > a > span.username")
        }
        return userTag.innerText.trim().replace('SOL\\', '')
    },
    getModalConfirmInfo() {
        this.getAllComments().then(lastAllComments => {
            let lastComment = lastAllComments.querySelector('div').cloneNode(true)
            if (lastComment) {
                this.getUserTag().then(userTag => {
                    let nameSplit = lastComment.querySelector('a.name').innerText.trim().toLowerCase().split(' ')

                    if (userTag == (nameSplit[0].substring(0,1) + nameSplit[nameSplit.length-1])) {
                        let divMessage = document.createElement('div')
                        divMessage.className = 'message'
                        divMessage.innerHTML = '<div class="body">PAS DE MESSAGE DE CONTRÔLE</div>'

                        this.displayConfirmOkModal(divMessage)
                    } else {
                        this.displayConfirmOkModal(lastComment)
                    }

                })
            } else {
                setTimeout(() => {
                    this.getModalConfirmInfo()
                }, 300)
            }
        })
    }
}

function getTabContent() {
    const tabContent = document.querySelector('div.tab-content');
    if (tabContent) {
        return tabContent
    } else {
        setTimeout(() => {
            getTabContent()
        }, 300)
    }
}

let runWinOnLoad = false


window.addEventListener('message', function (event) {
    // Vérifier l'origine du message pour des raisons de sécurité
    if (event.origin !== 'https://soprod.solocalms.fr') return;
    
    // Vérifier que le message est de type 'textFromFirstPage'
    if (event.data.type === 'copyDataForExcel') {
        // const textOfElementTargetFirstPage = event.data.text;
        openCustomerRelationTab('closeAfterCopy')
    }
});

function generateCopyClipboard(event = null) {
    let contentForClipboard = ''
    for (const [id, element] of (Global.userSettings.copyForExcel).entries()) {
        switch (element) {
            case 'epj':
                contentForClipboard += `${ Global.dataStored.epj }\t`
                break
            case 'companyName':
                contentForClipboard += `${ Global.dataStored.name }\t`
                break
            case 'receptionDate':
                let today = new Date()
                let dateOfToday = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
                contentForClipboard += `${ dateOfToday }\t`
                break
            case 'productRange':
                contentForClipboard += `${ Global.dataStored.gamme }\t`
                break
            case 'requestId':
                const pathUrl = window.location.pathname.split('/');
                contentForClipboard += `${ pathUrl[3] }\t`
                break
            case 'requestDate':
                contentForClipboard += `${ Global.dataStored.request.date }\t`
                break
            case 'requestOrigin':
                contentForClipboard += `${ Global.dataStored.request.origin }\t`
                break
            case 'requestComment':
                contentForClipboard += `"${ Global.dataStored.request.comment }"\t`
                break
            case 'jetlag':
                contentForClipboard += `"${ Global.dataStored.jetlag.statu ? Global.dataStored.jetlag.diff : Global.dataStored.jetlag.statu }"\t`
                break
            default:
                contentForClipboard += `\t`
                break;
        }
    }
    navigator.clipboard.writeText(contentForClipboard)
    Alerts.displayAlert('success', 'Les informations ont été formaté et copié. Vous pouvez les coller sur votre tableur.')
    if (event === 'closeAfterCopy') window.close()
}

function getRequestComment(event = null) {
    const customerRelationTab = document.querySelectorAll('div.portlet[id^="requestArea_"]>div.portlet-body>div.row>div>div[id^="getRequest_"] table.table>tbody>tr')[0]
    if (customerRelationTab) {
        let originRequest = (customerRelationTab.dataset.origin).includes('bilan') ? "BILAN" : (customerRelationTab.querySelectorAll('td')[4].innerText).includes('COMMERCIAL') ? "COMMERCIAL" : "CLIENT"
        let dateRequest = customerRelationTab.querySelectorAll('td')[0].innerText
        let commentRequest = (customerRelationTab.dataset.comment).replace(/"/g, '\'\'')

        const pathUrl = window.location.pathname.split('/');
        
        Global.dataStored.request.date = dateRequest
        Global.dataStored.request.origin = originRequest
        Global.dataStored.request.comment = commentRequest
        Global.dataStored.contact = originRequest === 'COMMERCIAL' ? 'ccial' : 'client'
        localStorage.setItem('soprod-'+pathUrl[3], JSON.stringify(Global.dataStored))
        
        generateCopyClipboard(event)
    } else {
        setTimeout(() => {
            getRequestComment()
        }, 300)
    }
}

function openCustomerRelationTab(event = null) {
    const tabs = document.querySelectorAll('div#masterWebGroupPortlet>div.portlet-body>div.tabbable.tabbable-custom>ul.nav.nav-tabs>li>a')
    const pageContainer = document.querySelector('div#masterWebGroupPortlet>div.portlet-body>div.tabbable.tabbable-custom>div.tab-content')
    tabs.forEach((el) => {
        if (el.innerText == 'RELATION CLIENT') {
            el.click()

            let finishLoadTimeout;
            
            const containerPageContentFinishLoad = () => {
                if (finishLoadTimeout) {
                    clearTimeout(finishLoadTimeout);
                }
                finishLoadTimeout = setTimeout(() => {
                    getRequestComment(event)
                }, 500);
            };

            var observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        containerPageContentFinishLoad()
                    }
                });
            });

            // Configuration de l'observation
            var config = {
                attributes: true,
                childList: true,
                subtree: true,
            };

            // Lancement de l'observation
            observer.observe(pageContainer, config);
        }
    })
}

const timeZoneOffsets = {
    971: -4,
    972: -4,
    973: -3,
    974: 4,
    975: -2,
    976: 3,
    984: 5,
    986: 12,
    987: -10,
    988: 11
};

function displayCurrentTime(horlogeContainer, offset) {
    const currentDate = new Date();
    const localOffset = currentDate.getTimezoneOffset() / 60;
    const targetOffset = localOffset + offset;
    const targetDate = new Date(currentDate.getTime() + targetOffset * 60 * 60 * 1000);

    horlogeContainer.innerText = (targetDate.toLocaleTimeString().substr(0, 5))
}

function updateClock(horlogeContainer, offset) {
    displayCurrentTime(horlogeContainer, offset);
    setTimeout(() => {
        updateClock(horlogeContainer, offset);
    }, 30000); // Met à jour l'horloge toutes les 30 secondes
}

function getValueInputPostalCode(parentElement) {
    if (parentElement) { 
        return parentElement.querySelector('input').value
    } else {
        return null
    }
}

function addClock() {
    const pathUrl = window.location.pathname.split('/');

    if (Global.dataStored.jetlag.statu) {
        let horlogeDiv = document.createElement('div')
        horlogeDiv.id = "horloge";

        const beeContainer = document.querySelector("div#beeBadge")

        beeContainer.appendChild(horlogeDiv)

        const horlogeContainer = document.querySelector('div#beeBadge div#horloge')

        const beeMenuContainer = document.querySelector("div#beeMenuContainer")
        beeMenuContainer.classList.add('clockActive')

        updateClock(horlogeContainer, Global.dataStored.jetlag.diff);
    } else if (Global.dataStored.jetlag.statu === false) {
        console.log('no jet lag')
    } else {
        const labels = document.querySelectorAll('label.control-label');
        const label = Array.from(labels).find(l => l.textContent.trim() === 'CodePostal');
        const parentElement = label && label.parentNode;
        const inputValue = getValueInputPostalCode(parentElement)
        
        if (inputValue) {
            const x = inputValue.substr(0, 3);

            if (x) {
                if (timeZoneOffsets.hasOwnProperty(x)) {
                    let horlogeDiv = document.createElement('div');
                    horlogeDiv.id = "horloge";
            
                    const beeContainer = document.querySelector("div#beeBadge");

                    beeContainer.appendChild(horlogeDiv)
            
                    const horlogeContainer = document.querySelector('div#beeBadge div#horloge')
        
                    Global.dataStored.jetlag.statu = true
                    Global.dataStored.jetlag.diff = timeZoneOffsets[x]
                    localStorage.setItem('soprod-' + pathUrl[3], JSON.stringify(Global.dataStored));
                    
                    const beeMenuContainer = document.querySelector("div#beeMenuContainer")
                    beeMenuContainer.classList.add('clockActive')
            
                    updateClock(horlogeContainer, timeZoneOffsets[x]);
                } else {
                    Global.dataStored.jetlag.statu = false
                    localStorage.setItem('soprod-' + pathUrl[3], JSON.stringify(Global.dataStored));
                }
            }
        }
    }
}

function qualifInfo(qualCell, trTarget, qualInfo) {
    if (qualInfo === "notStarted" && qualCell.innerText !== "MODIFICATION TRAITEE") {
        if (Global.userSettings.customDashboard) trTarget.style.border = "solid #EC2B3B"
        return 'notStarted'
    } else {
        switch (qualCell.innerText) {
            case 'RDV POUR MODIF':
                labelEvent = trTarget.querySelector('td span.eventType')
                if (labelEvent) {
                    // labelEvent.style.backgroundColor = "#824ac9"
                    return 'rdvModif'
                } else {
                    return 'afterRdvModif'
                }
            case 'RELANCE POUR MODIFICATION':
                labelEvent = trTarget.querySelector('td span.eventType')
                if (labelEvent) {
                    if (Global.userSettings.customDashboard) labelEvent.style.backgroundColor = "#824ac9"
                    return 'relaunchModif'
                } else {
                    return 'encours'
                }
            case 'RELANCE INJOIGNABLE MODIF':
                labelEvent = trTarget.querySelector('td span.eventType')
                if (Global.userSettings.customDashboard) labelEvent.style.backgroundColor = "#a49cc7"
                return 'lastRelaunchModif'
            case 'MODIFICATION TRAITEE':
                if (Global.userSettings.customDashboard) {
                    let allTdChildren = trTarget.querySelectorAll('td')
                    let lastChild = allTdChildren[allTdChildren.length - 1]
                    lastChild.style.backgroundColor = "#e96c1b"
                    lastChild.style.color = "#ffffff"
                    lastChild.style.textAlign = "center"
                    lastChild.style.fontSize = "16px"
                    lastChild.style.lineHeight = (lastChild.clientHeight - 16) + "px"
                    lastChild.style.fontWeight = "700"
                    lastChild.innerText = "A CLOTURER"
                }
                return 'doneModif'
            case 'MODIF FAITE ENVOI EN CONTROLE FINAL':
                if (Global.userSettings.customDashboard) trTarget.style.opacity = 0.2
                return 'controlInProgress'
            case 'INJOIGNABLE AVEC MODIF':
                if (Global.userSettings.customDashboard) {
                    trTarget.style.opacity = 0.2
                    trTarget.classList.add('unreachable')
                }
                return 'controlInProgress'
            case 'RETOUR EN MODIFICATION':
            case 'RETOUR EN MODIF GRAPHIQUE':
            case 'RETOUR EN MODIF CONTENU':
                if (Global.userSettings.customDashboard) trTarget.style.border = 'solid #9f65eb'
                return 'modifReturn'
            default:
                return 'encours'
        }
    }
}

const Dashboard = {
    async getFilterOfDashboard() {
        let elementOfList = document.querySelectorAll("div.recordsPortlet div.portlet div.portlet-body div.divFilterOthers > div > ul > li")
        while (!elementOfList || elementOfList.length <= 0) {
            await new Promise(resolve => setTimeout(resolve, 400))
            elementOfList = document.querySelectorAll("div.recordsPortlet div.portlet div.portlet-body div.divFilterOthers > div > ul > li")
        }
        return elementOfList[0].innerText
    },
    async getQueryContainerTableRequests() {
        let containerTableRqts =  document.querySelector('div.page-content-wrapper>div.page-content>div.recordsPortlet div.portlet.box')
        while (!containerTableRqts) {
            await new Promise(resolve => setTimeout(resolve, 200))
            containerTableRqts =  document.querySelector('div.page-content-wrapper>div.page-content>div.recordsPortlet div.portlet.box')
        }
        containerTableRqts.addEventListener('click', () => {
            let menu = document.querySelector("div#context-menu");
            menu.classList.remove("active");
        })
        return containerTableRqts
    },
    async listenContainerRequestsTable() {
        this.getQueryContainerTableRequests().then(containerTableRqts => {
            let finishLoadTimeout;
        
            const containerTabRqtsFinishLoad = () => {
                if (finishLoadTimeout) {
                    clearTimeout(finishLoadTimeout);
                }
                finishLoadTimeout = setTimeout(() => {
                    this.checkTableRequests().then((valueReturn) => {
                        return valueReturn
                    })
                }, 500);
            };
        
            var observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        containerTabRqtsFinishLoad()
                    }
                });
            });
        
            // Configuration de l'observation
            var config = {
                attributes: true,
                childList: true,
                subtree: true,
            };
        
            // Lancement de l'observation
            observer.observe(containerTableRqts, config);
        })
    },
    async getQueryTableRequests() {
        let tableRqtContainer =  document.querySelector('div#tableRecordsList>div#recordsList_wrapper table#recordsList tbody')
        while (!tableRqtContainer) {
            await new Promise(resolve => setTimeout(resolve, 200))
            tableRqtContainer =  document.querySelector('div#tableRecordsList>div#recordsList_wrapper table#recordsList tbody')
        }
        return tableRqtContainer
    },
    async checkTableRequests() {
        if (Global.userSettings.customDashboard) {
            this.addRefreshCustomTableRequests()
        }

        this.getQueryTableRequests().then(tableRqtContainer => {
            let finishLoadTimeout;
    
            const tableRqtsFinishLoad = () => {
                if (finishLoadTimeout) {
                    clearTimeout(finishLoadTimeout);
                }
                finishLoadTimeout = setTimeout(() => {
                    this.changeEventTagDashboard().then((valueReturn) => {
                        return valueReturn
                    })
                }, 500);
            };
        
            var observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        tableRqtsFinishLoad()
                    }
                });
            });
            var config = {
                attributes: true,
                childList: true,
                subtree: true,
            };

            observer.observe(tableRqtContainer, config)
        })
    },
    async changeEventTagDashboard() {
        try {
            const tableRqtContainer = document.querySelector('div#tableRecordsList>div#recordsList_wrapper table#recordsList tbody')
    
            const allTrTableRqts = tableRqtContainer.querySelectorAll('tr')
            allTrTableRqts.forEach((tr) => {
                const tdInTrTableRqts = tr.querySelectorAll('td')
                
                let itemStored = JSON.parse(window.localStorage.getItem('soprod-' + tdInTrTableRqts[0].innerText))
    
                const rqtInformations = {
                    epj: tdInTrTableRqts[1].innerText.substr(tdInTrTableRqts[1].innerText.length - 8),
                    gamme: tdInTrTableRqts[5].innerText.substr(6),
                    name: tdInTrTableRqts[2].innerText,
                    lastComment: {
                        text: !itemStored ? null : itemStored.lastComment.text,
                        height: !itemStored ? undefined : itemStored.lastComment.height
                    },
                    jetlag: {
                        statu: itemStored ? itemStored.jetlag.statu : null,
                        diff: itemStored ? itemStored.jetlag.diff : undefined
                    },
                    qualif: qualifInfo(tdInTrTableRqts[7], tr, itemStored ? itemStored.qualif : 'notStarted'),
                    request: {
                        date: itemStored ? itemStored.request ? itemStored.request.date ? itemStored.request.date : null : null : null,
                        origin: itemStored ? itemStored.request ? itemStored.request.origin ? itemStored.request.origin : null : null : null,
                        comment: itemStored ? itemStored.request ? itemStored.request.comment ? itemStored.request.comment : null : null : null
                    },
                    contact: itemStored ? itemStored.contact ? itemStored.contact : 'client' : 'client',
                    modifier: {
                        inputKeywordsWidth: itemStored ? itemStored.modifier ? itemStored.modifier.inputKeywordsWidth ? itemStored.modifier.inputKeywordsWidth : null : null : null,
                    },
                    lastDate: new Date()
                }
                localStorage.setItem('soprod-' + tdInTrTableRqts[0].innerText, JSON.stringify(rqtInformations));
    
                tr.addEventListener("contextmenu", function(event) {
                    addListenerDisplayContextMenu(event)
                })
            })
            return true
        } catch (error) {
            Alerts.createAlert('error', 'Nous avons rencontré une erreur dans l\'analyse des requêtes et leur mise en forme.')
            return 'error'
        }
    },
    async getTopBarTableRqts() {
        let topBarTableRqtsContainer = document.querySelector('div.page-content-wrapper>div.page-content div.recordsPortlet div.portlet.box>div.portlet-title')
        while (!topBarTableRqtsContainer) {
            await new Promise(resolve => setTimeout(resolve, 200))
            topBarTableRqtsContainer = document.querySelector('div.page-content-wrapper>div.page-content div.recordsPortlet div.portlet.box>div.portlet-title')
        }
        return topBarTableRqtsContainer
    },
    addRefreshCustomTableRequests() {
        this.getTopBarTableRqts().then(topBarTableRqtsContainer => {
            const btnRefreshExist = topBarTableRqtsContainer.querySelector('div#refreshCustomTable')
            if (!btnRefreshExist) {
                let refreshBtn = document.createElement('div')
                refreshBtn.innerHTML = '<i class="fa fa-repeat"></i>'
                refreshBtn.id = "refreshCustomTable"
                topBarTableRqtsContainer.appendChild(refreshBtn)
                const refreshBtnToExecute = document.getElementById('refreshCustomTable')
                setTimeout(() => {
                    refreshBtnToExecute.addEventListener('click', () => {
                        this.changeEventTagDashboard()
                    })
                }, 2000)
            }
        })
    }
}

let activRequestTrForContextMenu = null

function addListenerDisplayContextMenu(event) {
    event.preventDefault();

    activRequestTrForContextMenu = (event.srcElement.parentElement).querySelectorAll('td')[0].innerText

    // On récupère le menu
    let menu = document.querySelector("#context-menu");
    
    // On met ou retire la classe active
    menu.classList.add("active");

    // On ouvre le menu là où se trouve la souris
    // On récupère les coordonnées de la souris
    let posX = event.clientX;
    let posY = event.clientY;

    // On calcule la position du menu pour éviter qu'il dépasse
    // Position la plus à droite "largeur fenêtre - largeur menu - 25"
    let maxX = window.innerWidth - menu.clientWidth - 25;

    // Position la plus basse "hauteur fenêtre - hauteur menu - 25"
    let maxY = window.innerHeight - menu.clientHeight - 25;

    // On vérifie si on dépasse
    if(posX > maxX){
        posX = maxX;
    }
    if(posY > maxY){
        posY = maxY;
    }
    posY += window.scrollY

    // On positionne le menu
    menu.style.top = posY + "px";
    menu.style.left = posX + "px";
}

function copyFolderInformations(event) {
    event.preventDefault()
    
    let menu = document.querySelector("div#context-menu");
    menu.classList.remove("active");
        
    // Ouvrir la nouvelle fenêtre et stocker la référence
    const newWindow = window.open('https://soprod.solocalms.fr/Operator/Record/'+activRequestTrForContextMenu);
    
    // Attendre que la seconde page soit prête à recevoir des messages
    newWindow.addEventListener('load', function () {
        // Envoyer le texte récupéré à la seconde page
        newWindow.postMessage({ type: 'copyDataForExcel', text: 'copyRuntime' }, 'https://soprod.solocalms.fr/Operator/Dashboard');
    });
}

function openRequestInNewTab(event) {
    event.preventDefault()
    
    let menu = document.querySelector("div#context-menu");
    menu.classList.remove("active");
    
    window.open("https://soprod.solocalms.fr/Operator/Record/"+activRequestTrForContextMenu, '_blank')
}

function defineQualifNotStarted(event) {
    event.preventDefault()
    
    let menu = document.querySelector("div#context-menu");
    menu.classList.remove("active");
    
    let storageValue = JSON.parse(window.localStorage.getItem('soprod-' + activRequestTrForContextMenu))
    storageValue.qualif = 'notStarted'

    setLocalStorage(activRequestTrForContextMenu, storageValue).then(() => {
        windowOnload()
    })
}

function addBeeBadge(type) {

    const svgUrl = chrome.runtime.getURL("icons/SoBee-512.svg");
    const svgUrlCopyExcel = chrome.runtime.getURL("icons/CopyForExcel-64.svg");
    const svgUrlSwitchContact = chrome.runtime.getURL("icons/SwitchContact-64.svg");
    const svgUrlAutoRelaunch = chrome.runtime.getURL("icons/AutoRelaunch-64.svg");
    const svgUrlExportData = chrome.runtime.getURL("icons/ExportData-64.svg");
    const svgUrlImportData = chrome.runtime.getURL("icons/ImportData-64.svg");

    let beeElementsContainer = document.createElement('div')
    beeElementsContainer.id = 'beeElementsContainer'
    let beeMenuContainer = document.createElement('div')
    beeMenuContainer.id = 'beeMenuContainer'

    let containerBee = document.createElement('div')
    containerBee.id = 'beeBadge'
    let imageBee = document.createElement('img')
    imageBee.src = svgUrl
    containerBee.appendChild(imageBee)

    if (type === 'settingsInProgress') {
        let errorFlag = document.createElement('div')
        errorFlag.id = 'bee-errorFlag'
        errorFlag.innerHTML = SVG.warning
        
        containerBee.addEventListener('click', () => {
            chrome.runtime.sendMessage({action: "openTutorial"});
        })

        containerBee.appendChild(errorFlag)
    }

    beeMenuContainer.appendChild(containerBee)

    switch (type) {
        case 'requestFile':
            let containerAutoRelaunch = document.createElement('div')
            containerAutoRelaunch.id = 'autoNextRelaunch'
            containerAutoRelaunch.className = "btn-badge"
            imageBtn = document.createElement('img')
            imageBtn.src = svgUrlAutoRelaunch
            containerAutoRelaunch.appendChild(imageBtn)
            
            beeMenuContainer.appendChild(containerAutoRelaunch)
            
            let containerSwitchContact = document.createElement('div')
            containerSwitchContact.id = 'switchContact'
            containerSwitchContact.className = "btn-badge"
            containerSwitchContact.title = Global.dataStored.contact
            imageBtn = document.createElement('img')
            imageBtn.src = svgUrlSwitchContact
            containerSwitchContact.appendChild(imageBtn)
            const textSwitchContact = document.createElement("div")
            textSwitchContact.id = "textSwitchContact"
            textSwitchContact.innerText = Global.dataStored.contact
            containerSwitchContact.appendChild(textSwitchContact)

            containerSwitchContact.addEventListener('click', (event) => {
                event.preventDefault()
                switchContact.classList.add("clicked")
                Contact.switchContactForRequest(switchContact)
            })
            
            beeMenuContainer.appendChild(containerSwitchContact)
            
            let containerCopyExcel = document.createElement('div')
            containerCopyExcel.id = 'copyForExcel'
            containerCopyExcel.className = "btn-badge"
            containerCopyExcel.title = 'Copier pour excel'
            imageBtn = document.createElement('img')
            imageBtn.src = svgUrlCopyExcel
            containerCopyExcel.appendChild(imageBtn)
            
            beeMenuContainer.appendChild(containerCopyExcel)

            beeElementsContainer.appendChild(beeMenuContainer)
            document.body.appendChild(beeElementsContainer)

            const copyForExcel = document.querySelector('body div#beeMenuContainer div#copyForExcel')
            copyForExcel.addEventListener('click', () => {
                if (Global.dataStored.request) {
                    if (Global.dataStored.request.origin && Global.dataStored.request.comment && Global.dataStored.request.date) {
                        generateCopyClipboard()
                    } else {
                        copyForExcelInRequest()
                    }
                } else {
                    copyForExcelInRequest()
                }
            })
            const autoNextRelaunch = document.querySelector('body div#beeMenuContainer div#autoNextRelaunch')
            autoNextRelaunch.addEventListener('click', () => {
                addAutoCompleteUnreachable()
            })
            break;
        case 'dashboard':

            let containerExportSaveStorage = document.createElement('div')
            containerExportSaveStorage.id = 'exportLocalStorage'
            containerExportSaveStorage.className = "btn-badge"
            containerExportSaveStorage.title = 'Exporter une sauvegarde'
            imageBtn = document.createElement('img')
            imageBtn.src = svgUrlExportData
            containerExportSaveStorage.appendChild(imageBtn)
            
            beeMenuContainer.appendChild(containerExportSaveStorage)
            
            let containerImportSaveStorage = document.createElement('div')
            containerImportSaveStorage.id = 'importLocalStorage'
            containerImportSaveStorage.className = "btn-badge"
            containerImportSaveStorage.title = 'Importer une sauvegarde'
            imageBtn = document.createElement('img')
            imageBtn.src = svgUrlImportData
            containerImportSaveStorage.appendChild(imageBtn)
            
            beeMenuContainer.appendChild(containerImportSaveStorage)

            beeElementsContainer.appendChild(beeMenuContainer)
            document.body.appendChild(beeElementsContainer)
            
            const exportSaveLocalStorage = document.querySelector('body div#beeMenuContainer div#exportLocalStorage')
            exportSaveLocalStorage.addEventListener('click', () => {
                exportLocalstorage()
                Alerts.displayAlert('success', 'Les données de localstorage ont été exporter et enregistré sur votre ordinateur.')
            })
            const importSaveLocalStorage = document.querySelector('body div#beeMenuContainer div#importLocalStorage')
            importSaveLocalStorage.addEventListener('click', () => {
                let inputForFile = document.createElement('input')
                inputForFile.id = "fileInputData"
                inputForFile.type = 'file'
                inputForFile.accept = ".json"
                inputForFile.style.display = 'none'

                document.body.appendChild(inputForFile)

                const inputForImportData = document.querySelector('body input#fileInputData')

                inputForImportData.addEventListener('change', function(e) {
                    let file = e.target.files[0];
                  
                    if (!file) {
                        console.log("No file chosen");
                    } else {
                        let reader = new FileReader();
                    
                        reader.onload = function(e) {
                            let contents = e.target.result;
                            importDataToLocalstorage(JSON.parse(contents));
                        };
                    
                        reader.readAsText(file);
                    }
                });
                
                inputForImportData.click()
            })

            break;
        case 'settingsInProgress':
            beeElementsContainer.appendChild(beeMenuContainer)
            document.body.appendChild(beeElementsContainer)
            break;
    }
}

function importDataToLocalstorage(datas) {
    const today = new Date()
    for (const [key, value] of Object.entries(datas)) {
        if (key.startsWith('soprod-')) {
            let valueParse = JSON.parse(value)
            valueParse.lastDate = today

            localStorage.setItem(key, JSON.stringify(valueParse));
        }
    }
    Alerts.displayAlert('success', 'Les informations ont été ajoutés sur votre navigateur.')
}

function exportLocalstorage() {
    let dataStr = JSON.stringify(localStorage)
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    let exportFileDefaultName = 'data.json'
    
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function getTabs() {
    const tabs = document.querySelectorAll('div#masterWebGroupPortlet>div.portlet-body>div.tabbable.tabbable-custom>ul.nav.nav-tabs>li>a')
    if (tabs) {
        return tabs
    } else {
        setTimeout(() => {
            getTabs()
        }, 300)
    }
}

function getPageContainer() {
    const pageContainer = document.querySelector('div#masterWebGroupPortlet>div.portlet-body>div.tabbable.tabbable-custom>div.tab-content')
    if (pageContainer) {
        return pageContainer
    } else {
        setTimeout(() => {
            getPageContainer()
        }, 300)
    }
}

function copyForExcelInRequest() {
    const tabs = getTabs()
    const pageContainer = getPageContainer()
    tabs.forEach((el) => {
        if (el.innerText == 'RELATION CLIENT') {
            el.click()

            let finishLoadTimeout;
            
            const containerPageContentFinishLoad = () => {
                if (finishLoadTimeout) {
                    clearTimeout(finishLoadTimeout);
                }
                finishLoadTimeout = setTimeout(() => {
                    getRequestComment()
                    observer.disconnect();
                }, 500);
            };

            var observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        containerPageContentFinishLoad()
                    }
                });
            });

            // Configuration de l'observation
            var config = {
                attributes: true,
                childList: true,
                subtree: true,
            };

            // Lancement de l'observation
            observer.observe(pageContainer, config);
        }
    })
}

function getProductionTab() {
    const tabs = document.querySelectorAll('div#masterWebGroupPortlet>div.portlet-body>div.tabbable.tabbable-custom>ul.nav.nav-tabs>li.dropdown>ul.dropdown-menu>li>a')
    if (tabs) {
        return tabs
    } else {
        setTimeout(() => {
            getTabs()
        }, 300)
    }
}

async function getTheadDayTarget(newDate) {
    let dataDay = newDate.toISOString().slice(0, 10)
    let theadDayTarget = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-body table thead tr th div[data-day="' + dataDay + '"]')
    while (!theadDayTarget) {
        await new Promise(resolve => setTimeout(resolve, 400))
        theadDayTarget = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-body table thead tr th div[data-day="' + dataDay + '"]')
    }
    return theadDayTarget
}

function changeTargetDateOfCalendar(element) {
    element.style.backgroundColor = '#5cfb94'
    element.style.display = 'flex'
    element.style.justifyContent = 'center'
    element.style.gap = '32px'
    
    let newDiv = document.createElement('div')
    for (let child of element.childNodes) {
        newDiv.appendChild(child.cloneNode(true))
    }

    let arrowDiv = document.createElement('div')
    arrowDiv.innerHTML = "↓"
    arrowDiv.style.fontSize = "32px"
    
    element.innerHTML = ''
    element.appendChild(arrowDiv)
    element.appendChild(newDiv)
    element.appendChild(arrowDiv)
}

async function getWeekSelect(selectCalendarWeek) {
    let weekSelected = selectCalendarWeek.querySelector('div[id="s2id_selectCalendarWeek"] > a > span[id^="select2-chosen"]')
    while (!weekSelected) {
        await new Promise(resolve => setTimeout(resolve, 400))
        weekSelected = selectCalendarWeek.querySelector('div[id="s2id_selectCalendarWeek"] > a > span[id^="select2-chosen"]')
    }
    return weekSelected
}

async function getSelectCalendarWeek() {
    let selectCalendarWeek = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-header h4.modal-title div[name="selectCalendarWeek"]')
    while (!selectCalendarWeek) {
        await new Promise(resolve => setTimeout(resolve, 400))
        selectCalendarWeek = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-header h4.modal-title div[name="selectCalendarWeek"]')
    }
    return selectCalendarWeek
}

async function getBtnNextWeek() {
    let btnNextWeek = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-body table thead tr th div.rdv_calendar_action > div.rdv_calendar_next')
    while (!btnNextWeek) {
        await new Promise(resolve => setTimeout(resolve, 400))
        btnNextWeek = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-body table thead tr th div.rdv_calendar_action > div.rdv_calendar_next')
    }
    btnNextWeek.click()
    return true
}

async function getBtnPreviousWeek() {
    let btnPreviousWeek = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-body table thead tr th div.rdv_calendar_action > div.rdv_calendar_previous')
    while (!btnPreviousWeek) {
        await new Promise(resolve => setTimeout(resolve, 400))
        btnPreviousWeek = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-body table thead tr th div.rdv_calendar_action > div.rdv_calendar_previous')
    }
    btnPreviousWeek.click()
    return true
}

function openCalendarAddRelaunch() {
    const btnsQualificationsContainer = document.querySelector('div.tab-content div[id^="qualifications_"] div.portlet-body > div > div')
    if (btnsQualificationsContainer) {
        let choosenDate = new Date()
        let dayDelay
        switch (Global.dataStored.qualif) {
            case 'afterRdvModif':
            case 'encours':
                dayDelay = 1
                let btnForRelaunch = btnsQualificationsContainer.querySelector('a[id^="qualificationElement_"][data-name="RELANCE POUR MODIFICATION"]')
                btnForRelaunch.click()
                break;
            case 'relaunchModif':
            case 'lastRelaunchModif':
            case 'rdvModif':
                dayDelay = 2
                let btnForLastRelaunch = btnsQualificationsContainer.querySelector('a[id^="qualificationElement_"][data-name="RELANCE INJOIGNABLE MODIF"]')
                btnForLastRelaunch.click()
                break;
        }

        let newDate = AddDaTor.calcul(choosenDate, dayDelay);

        getSelectCalendarWeek().then(selectCalendarWeek => {

            // On vérifie si la semaine active du calendar correspond
            getWeekSelect(selectCalendarWeek).then(weekSelected => {
                if (weekSelected) {
                    // On récupére le numéro de la semaine de newDate
                    let weekNumber = newDate.getWeek()
                    let textSearch = 'Semaine ' + weekNumber.toString()
                    if ((weekSelected.innerText).includes(textSearch)) {
                        console.log('Nous avons la bonne semaine de sélectionné')
                        getTheadDayTarget(newDate).then(element => {
                            changeTargetDateOfCalendar(element)
                        })
                    } else {
                        console.log('Pas la bonne semaine')
                        // Si non on fait un next, on check la semaine, si c'est bon on affiche le jour, sinon on reviens en arrière et on affiche une erreur
                        setTimeout(() => {
                            getBtnNextWeek().then(() => {
                                if ((weekSelected.innerText).includes(textSearch)) {
                                    getTheadDayTarget(newDate).then(element => {
                                        // changeTargetDateOfCalendar(element)
                                        calendarObserver.runObservation(element)
                                    })
                                } else {
                                    console.log('Pas la bonne semaine, possible erreur')
                                    getBtnPreviousWeek()
                                }
                            })
                        }, 400)
                    }
                }
            })
        })
    } else {
        setTimeout(() => {
            openCalendarAddRelaunch()
        }, 300)
    }
}

const calendarObserver = {
    finishLoadTimeout: undefined,
    changeThead: false,
    elementTarget: undefined,
    runIfNoChangeAfterDelay: undefined,
    calendarFinishLoad() {
        let self = this
        if (self.runIfNoChangeAfterDelay) {
            clearTimeout(self.runIfNoChangeAfterDelay);
        }
        if (self.finishLoadTimeout) {
            clearTimeout(self.finishLoadTimeout);
        }
        self.finishLoadTimeout = setTimeout(() => {
            if (!self.changeThead) {
                self.changeThead = true
                changeTargetDateOfCalendar(self.elementTarget)
                setTimeout(() => {
                    self.changeThead = false
                }, 4000)
            }
        }, 500)
    },
    observerFunction() {
        let self = this
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.removedNodes.length || mutation.addedNodes.length) {
                    self.calendarFinishLoad()
                }
            })
        })
        observer.observe(self.elementTarget, self.config)
    },
    config: {
        childList: true,
        subtree: true,
        characterData: true
    },
    runObservation(element) {
        let self = this
        self.runIfNoChangeAfterDelay = setTimeout(() => {
            if (!changeThead) {
                changeTargetDateOfCalendar(theadDayTarget)
                setTimeout(() => {
                    self.changeThead = false
                }, 4000)
            }
        }, 1000)
        self.elementTarget = element
        self.observerFunction()
    }
}

function addCommentAuto() {
    const textArea = document.querySelector("div.portlet.commentsAreaDiv[id^='comments_'] > div.portlet-body.chats > div.chat-form > div.input-cont > textarea.addCommentMessage")
    
    let btnsListToUse = Commentaries.schemaComments.find(item => item.gamme === Global.userSettings.userJob.gamme && item.poste === Global.userSettings.userJob.poste)?.btnsList;
    
    textArea.value = (btnsListToUse.unreachable.message).replaceAll('${contactTarget}', Global.dataStored.contact) + Commentaries.howNextDayToCall()
    let sendMessage = document.querySelector("div.portlet.commentsAreaDiv[id^='comments_'] > div.portlet-body.chats > div.chat-form > div.btn-cont a.btn.addComment")
    sendMessage.click()
    setTimeout(() => {
        openCalendarAddRelaunch()
    }, 300)
}

function addAutoCompleteUnreachable() {
    const tabs = getProductionTab()
    const pageContainer = getPageContainer()
    tabs.forEach((el) => {
        if (el.innerText.includes('PRODUCTION MODIFS EN COURS') || el.innerText.includes('PRODUCTION MODIF GRAPH EN COURS')) {
            if ((el.parentNode.classList).value.includes('active')) {
                addCommentAuto()
            } else {
                el.click()
    
                let finishLoadTimeout;
                
                const containerPageContentFinishLoad = () => {
                    if (finishLoadTimeout) {
                        clearTimeout(finishLoadTimeout);
                    }
                    finishLoadTimeout = setTimeout(() => {
                        addCommentAuto()
                    }, 500);
                };
    
                var observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'childList') {
                            containerPageContentFinishLoad()
                        }
                    });
                });
    
                // Configuration de l'observation
                var config = {
                    attributes: true,
                    childList: true,
                    subtree: true,
                };
    
                // Lancement de l'observation
                observer.observe(pageContainer, config);
            }
        }
    })
}

const Contact = {
    idRequest: undefined,
    switchContactForRequest: (domElement) => {
        self = this
        if (!self.idRequest) self.idRequest = window.location.pathname.split('/')[3]
    
        if (Global.dataStored.contact === 'client') {
            Global.dataStored.contact = 'ccial';
        } else {
            Global.dataStored.contact = 'client';
        }
    
        window.localStorage.setItem('soprod-' + self.idRequest, JSON.stringify(Global.dataStored));
    
        const textSwitchContact = domElement.querySelector('div#textSwitchContact');
        textSwitchContact.innerText = Global.dataStored.contact;
        domElement.title = Global.dataStored.contact;
    
        setTimeout(() => {
            domElement.classList.remove('clicked');
        }, 400);
    }
}

const Alerts = {
    displayAlert(type, message) {
        let self = this
        const beeFloatContainer = document.querySelector('body div#beeElementsContainer')

        const alertBox = self.createAlert(type, message)

        beeFloatContainer.appendChild(alertBox);

        const alertBoxContainer = beeFloatContainer.querySelector('div#alertBoxContainer')
        
        let timerCancel = false
        var Timer = function(callback, delay) {
            var timerId, start, remaining = delay
        
            this.pause = function() {
                window.clearTimeout(timerId)
                timerId = null
                remaining -= Date.now() - start
            }
        
            this.resume = function() {
                if (timerId) {
                    return
                }
        
                start = Date.now()
                timerId = window.setTimeout(callback, remaining)
            }

            this.stop = function() {
                window.clearTimeout(timerId)
                timerId = null
                remaining, start = null
                callback()
            }
        
            this.resume()
        }
        
        var timer = new Timer(() => {
            let alertBox = beeFloatContainer.querySelector('div#alertBoxContainer')
            if (alertBox) {
                alertBox.remove()
            } else {
                timer.stop()
            }
        }, 5200)

        let timerPaused = false
        alertBoxContainer.addEventListener('mouseover', () => {
            if (!timerPaused && !timerCancel) {
                timerPaused = true
                timer.pause()
            }
        })
        alertBoxContainer.addEventListener('mouseleave', () => {
            if (timerPaused && !timerCancel) {
                timer.resume()
                timerPaused = false
            }
        })
        document.getElementById("closeAlertBox").addEventListener("click", function() {
            timerPaused = false
            timerCancel = true
            timer.stop()
        })
    },
    createAlert(type, message) {
        let alertContainer = document.createElement('div')
        alertContainer.id = "alertBoxContainer"
        alertContainer.className = type
        alertContainer.innerHTML = '<svg id="closeAlertBox" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"><path d="M0.6 6L0 5.4L2.4 3L0 0.6L0.6 0L3 2.4L5.4 0L6 0.6L3.6 3L6 5.4L5.4 6L3 3.6L0.6 6Z" fill="black"/></svg>'
        let titleAlert = document.createElement('p')
        titleAlert.id = "alertTitle"
        switch (type) {
            case 'success':
                titleAlert.innerText = 'Action validé !'
                break;
            case 'error':
                titleAlert.innerText = 'Oups ! Erreur.'
                break;
            case 'warning':
                titleAlert.innerText = 'Attention !'
                break;
            case 'info':
                titleAlert.innerText = 'Pour information.'
                break;
        }
        alertContainer.appendChild(titleAlert)
        let messageAlert = document.createElement('p')
        messageAlert.id = "alertMessage"
        messageAlert.innerText = message
        alertContainer.appendChild(messageAlert)

        return alertContainer
    },
}

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

SVG = {
    warning: '<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M16.268 3C17.0378 1.66666 18.9623 1.66667 19.7321 3L31.8564 24C32.6262 25.3333 31.664 27 30.1244 27H5.87564C4.33604 27 3.37379 25.3333 4.14359 24L16.268 3Z" fill="#D64635"/><path d="M16.4658 18.98V7.69995H19.5378V18.98H16.4658ZM18.0018 24.836C17.3618 24.836 16.8178 24.628 16.3698 24.212C15.9378 23.78 15.7218 23.228 15.7218 22.556C15.7218 21.884 15.9378 21.34 16.3698 20.924C16.8178 20.492 17.3618 20.276 18.0018 20.276C18.6578 20.276 19.2018 20.492 19.6338 20.924C20.0658 21.34 20.2818 21.884 20.2818 22.556C20.2818 23.228 20.0658 23.78 19.6338 24.212C19.2018 24.628 18.6578 24.836 18.0018 24.836Z" fill="white"/></svg>'
}