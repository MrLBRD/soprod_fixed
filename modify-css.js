console.log('HELLO WOLRD !')

const storage = typeof chrome !== 'undefined' ? chrome.storage : browser.storage;
let userSettings

let runChangeCss = false

function loadSettings(callback) {
    storage.sync.get("userSettings", (data) => {
        callback(data.userSettings);
    });
}

loadSettings((data) => {
    console.log(data)
    userSettings = data
})

function windowOnload() {
    if (userSettings) {
        console.log(userSettings)
        const pathUrl = window.location.pathname.split('/');
        addStyle(styles)
        if ((pathUrl[1] == "Operator" && pathUrl[2] == "Record")) {
            setTimeout(() => {
                let itemStored = getLocalStorage()
                console.log(itemStored)
                if (itemStored.qualif === 'notStarted') {
                    itemStored.qualif = 'encours'
                    localStorage.setItem('soprod-' + pathUrl[3], JSON.stringify(itemStored));
                }
                if(itemStored.qualif === 'doneModif') {
                    if (userSettings.autoCheckModif) {
                        const checkModifBtn = document.querySelector("a[id^='qualificationElement'][data-name='CHECK MODIF TRAITEE OK']")
                        console.log("check modif btn : ", checkModifBtn)
                        if (checkModifBtn) {
                            checkModifBtn.click()
                            getModalConfirmInfo()
                        }
                    } else {
                        window.localStorage.removeItem('soprod-' + pathUrl[3])
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

                    if ((liActive.innerText).includes('PRODUCTION MODIFS EN COURS')) {
                        changeElementsInProgressModified(itemStored)
                    }
                    lastActivated = liActive.innerText
                    
                    navPageContent.addEventListener('click', () => {
                        setTimeout(() => {
                            if (((navPageContent.querySelector('li.active')).className).includes('dropdown')) {
                                liActive = navPageContent.querySelector('li.active ul > li.active')
                            } else {
                                liActive = navPageContent.querySelector('li.active')
                            }
                            console.log(liActive.innerText)
                            if ((liActive.innerText).includes('PRODUCTION MODIFS EN COURS')) {
                                console.log('RUN CHANGE PAGE')
                                setTimeout(() => {
                                    changeElementsInProgressModified(itemStored)
                                }, 500)
                            }
                            if (itemStored.gamme === 'ESSENTIEL') {
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
            }, 800)
        } else if (pathUrl[1] == "Operator" && pathUrl[2] == "Dashboard") {
            const elementsContextMenu = [
                {
                    id: 'openInNewTab',
                    text: 'Ouvrir nouvel onglet'
                }, {
                    id: 'copyInformationsForExcel',
                    text: 'Copier pour excel'
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
            
            addBeeBadge('dashboard')

            let filterDashboard = getFilterOfDashboard()

            if (filterDashboard === "À moi") {
                listenContainerRequestsTable()

                clearLocalStorage()
            }

        } else if (pathUrl[1] == "Consultation" && pathUrl[2] == "Record") {
            // setTimeout(() => {
            //     var tabContent = document.querySelector('.tab-content');
            //     if (tabContent) {
            //         var observer = new MutationObserver((mutations) => {
            //             mutations.forEach((mutation) => {
            //                 if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            //                     keywordsBetterView()
            //                     setTimeout(() => {
            //                         runChangeCss = false
            //                     }, 1000)
            //                 }
            //             });
            //         });
    
            //         // Configuration de l'observation
            //         var config = {
            //             attributes: true,
            //             childList: true,
            //             subtree: true,
            //         };
    
            //         // Lancement de l'observation
            //         observer.observe(tabContent, config);
            //     }
            // }, 500)
            // A voir comment procèder car si vue fiche en consultation, probable qu'elle ne soit pas dans les encours donc pas de storage
            // Réaliser check if in storage
            // Else faire sans
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

function changeElementsInProgressModified(itemStored) {
    if (itemStored.gamme === 'PREMIUM') {
        if (userSettings.fixViewKeywords) keywordsBetterView()
    }
    if (userSettings.schemaBtn) addBtnSchema()
}

function getLocalStorage() {
    var pathArray = window.location.pathname.split('/');
    return JSON.parse(window.localStorage.getItem('soprod-' + pathArray[3]))
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
}

function keywordsBetterView() {
    runChangeCss = true
    var keywordsGroupContainers = document.querySelectorAll('form[id^="formGroupKeywords"] div.KeywordsFormGroup');
    if (keywordsGroupContainers) {
        const KeywordsArea = document.querySelector('div > div.portlet.box[id^="KeywordsArea_"]')
        if (KeywordsArea) KeywordsArea.parentNode.className = 'col-md-6'
        for (const keywordsGroupContainer of keywordsGroupContainers) {
            keywordsGroupContainer.style.display = 'flex'
            keywordsGroupContainer.style.flexDirection = 'column'

            var keywordsContainer = document.querySelector("[id^='keywordsContainer']");
            if (keywordsContainer) {
                keywordsContainer.style.width = '100%'
            }
            var addKeywordsElement = document.querySelector("[id^='addKeywords']");
            if (addKeywordsElement) {
                addKeywordsElement.style.width = 'fit-content'
                addKeywordsElement.style.marginTop = '16px'
                addKeywordsElement.style.alignSelf = 'center'
                addKeywordsElement.innerHTML = '<span class="fa fa-plus"></span> Ajouter un mot-clé'
            }
        }
    } else {
        setTimeout(() => {
            keywordsBetterView()
        }, 200)
    }
}

var styles = [
    {
        modif: 'schemaBtn',
        configurable: true,
        css: '.ext--btns-container { width: 100%; display: flex; gap: 8px; margin-top: 8px; } .btn-outline {border-width: 0.25rem; border-color: #545454; } #getAddStoredMessage svg { height: 16px; } .icon-custombtn { padding: 7px 12px } div.commentsAreaDiv div.portlet-body.scrollable-content { max-height: none; }',
    }, {
        modif: 'horloge',
        configurable: false,
        css: 'div#horloge { position: fixed; padding: 8px 16px; background: rgba(230, 30, 30, 0.2); border-radius: 6px !important; top: 104px; right: 6%; backdrop-filter: blur(1.5px); z-index: 999; font-size: 32px; }'
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
        modif: 'beeFloatMenu',
        configurable: false,
        css: '#beeMenuContainer { position: fixed; z-index: 9999; left: 32px; bottom: 24px; min-height: 64px; min-width: 64px; } #beeMenuContainer:hover { min-height: 145px; min-width: 150px; } #beeBadge { bottom: 0; left: 0; position: absolute; display: flex; flex-direction: row; align-items: center; padding: 8px; width: fit-content; height: 64px; background: #F1D4F3; border-radius: 248px !important; cursor: pointer !important; z-index: 3; } #beeMenuContainer:hover #beeBadge { background: #BDA7BF; } #beeBadge img { height: 48px; } .btn-badge { position: absolute; display: flex; flex-direction: row; align-items: center; width: 16px; height: 16px; bottom: calc(32px - 8px); left: calc(32px - 8px); cursor: pointer; border-radius: 248px !important; transition: all 0.3s ease-out; } .btn-badge img { height: 100%; } #autoNextRelaunch { background: #87E86B; } #copyForExcel { background: #FFF790; } #switchContact { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 0; background: #6AC6FF; } #exportLocalStorage { background: #F69421; } #importLocalStorage { background: #6AC6FF; } #beeMenuContainer:hover .btn-badge { width: 48px; height: 48px; } #beeMenuContainer:hover #autoNextRelaunch { left: 10px; bottom: 85px; } #beeMenuContainer:hover #copyForExcel { left: 89px; bottom: 7px; } #beeMenuContainer:hover #switchContact { left: 65px; bottom: 61px; } #beeMenuContainer:hover #exportLocalStorage { left: 10px; bottom: 85px; } #beeMenuContainer:hover #importLocalStorage { left: 65px; bottom: 61px; } #autoNextRelaunch:hover { background: #6dbf56; } #copyForExcel:hover { background: #ccc672; } #switchContact:hover { background: #5ba9d9; } #exportLocalStorage:hover { background: #CC7B1B; } #exportLocalStorage:hover { background: #5ba9d9; } #beeMenuContainer:hover #switchContact.clicked { width: 16px; height: 16px; bottom: calc(32px - 8px); left: calc(32px - 8px); } .btn-badge#switchContact img { margin-top: -6px; height: 90%; } .btn-badge#switchContact #textSwitchContact { margin-top: -9px; text-transform: uppercase; font-size: 9px; font-weight: 800; }'
    }
];

function addStyle(styles) {
    styles.forEach((el) => {
        if (!el.configurable || userSettings[el.modif]) {
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
    })
}

function getConfirmModal() {
    const confirmModal = document.querySelector('body > div.bootbox.modal.fade.bootbox-preview.in > div.modal-dialog > div.modal-content')
    console.log('confirmModal')
    console.log(confirmModal)
    if (confirmModal && confirmModal !== null && confirmModal !== undefined) {
        console.log(confirmModal)
        if (confirmModal.querySelector('div.modal-body > div.bootbox-body').innerText === 'La fiche sera qualifié en « CHECK MODIF TRAITEE OK »') {
            return confirmModal
        } else {
            setTimeout(() => {
                getConfirmModal()
            }, 200)
        }
    } else {
        setTimeout(() => {
            getConfirmModal()
        }, 300)
    }
}

function displayConfirmOkModal(lastComment) {
    let newDiv = document.createElement('div')
    newDiv.className = "modifOk-comment"
    newDiv.appendChild(lastComment.cloneNode(true))
    setTimeout(() => {
        const pathUrl = window.location.pathname.split('/');
        const confirmModal = getConfirmModal()
        console.log('=> CONFIRM MODAL && LAST COMMENT <=')
        console.log(confirmModal)
        console.log(newDiv)
        const bodyConfirmModal = confirmModal.querySelector('div.modal-body')
        bodyConfirmModal.appendChild(newDiv)
        const okBtnConfirmModal = confirmModal.querySelector('div.modal-footer button.btn[type="button"][data-bb-handler="Ok"]')
        okBtnConfirmModal.addEventListener('click', () => {
            window.localStorage.removeItem('soprod-' + pathUrl[3])
            window.location.replace(
                "https://soprod.solocalms.fr/Operator/Dashboard"
            );
        })
    }, 500)
}

function getAllComments() {
    let lastAllComments = document.querySelectorAll("div.commentsAreaDiv[id^='comments'] div.portlet-body>div.getComments>div.row ul.chats>li.in")[0]
    if (lastAllComments) {
        return lastAllComments
    } else {
        setTimeout(() => {
            getAllComments()
        }, 300)
    }
}

function getModalConfirmInfo() {
    let lastAllComments = getAllComments()
    if (lastAllComments) {
        let lastComment = lastAllComments.querySelector('div')
        if (lastComment) {
            console.log(lastComment)
            displayConfirmOkModal(lastComment)
        } else {
            setTimeout(() => {
                getModalConfirmInfo()
            }, 300)
        }
    } else {
        setTimeout(() => {
            getModalConfirmInfo()
        }, 300)
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
        openCustomerRelationTab()
    }
});

function generateCopyClipboard() {
    let contentForClipboard = ''
    let itemStored = getLocalStorage()
    for (const [id, element] of (userSettings.copyForExcel).entries()) {
        switch (element) {
            case 'epj':
                contentForClipboard += `${ itemStored.epj }\t`
                break
            case 'companyName':
                contentForClipboard += `${ itemStored.name }\t`
                break
            case 'receptionDate':
                let today = new Date()
                let dateOfToday = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
                contentForClipboard += `${ dateOfToday }\t`
                break
            case 'productRange':
                contentForClipboard += `${ itemStored.gamme }\t`
                break
            case 'requestId':
                const pathUrl = window.location.pathname.split('/');
                contentForClipboard += `${ pathUrl[3] }\t`
                break
            case 'requestDate':
                contentForClipboard += `${ itemStored.request.date }\t`
                break
            case 'requestOrigin':
                contentForClipboard += `${ itemStored.request.origin }\t`
                break
            case 'requestComment':
                contentForClipboard += `"${ itemStored.request.comment }"\t`
                break
            default:
                contentForClipboard += `\t`
                break;
        }
        console.log(contentForClipboard)
    }
    navigator.clipboard.writeText(contentForClipboard)
}

function getRequestComment() {
    const customerRelationTab = document.querySelectorAll('div.portlet[id^="requestArea_"]>div.portlet-body>div.row>div>div[id^="getRequest_"] table.table>tbody>tr')[0]
    if (customerRelationTab) {
        let originRequest = (customerRelationTab.dataset.origin).includes('bilan') ? "BILAN" : (customerRelationTab.querySelectorAll('td')[4].innerText).includes('COMMERCIAL') ? "COMMERCIAL" : "CLIENT"
        let dateRequest = customerRelationTab.querySelectorAll('td')[0].innerText
        let commentRequest = (customerRelationTab.dataset.comment).replace(/"/g, '\'\'')
        console.log(commentRequest)

        const pathUrl = window.location.pathname.split('/');
        
        let itemStored = getLocalStorage()

        itemStored.request.date = dateRequest
        itemStored.request.origin = originRequest
        itemStored.request.comment = commentRequest
        itemStored.contact = originRequest === 'COMMERCIAL' ? 'ccial' : 'client'
        localStorage.setItem('soprod-'+pathUrl[3], JSON.stringify(itemStored))
        
        generateCopyClipboard()

        setTimeout(() => {
            window.close()
        }, 300)
    } else {
        setTimeout(() => {
            getRequestComment()
        }, 300)
    }
}

function openCustomerRelationTab() {
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
                    getRequestComment()
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

var AddDaTor = {
    calcul: function (choosenDate, jours) {
        var date = choosenDate.getTime(),
            now = new Date(),
            feries = AddDaTor.joursFeries(choosenDate.getFullYear()),
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

    joursFeries: function (an) {
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
}

const btnsList = {
    'sendToControl': {
        'text': 'Clôture schema',
        'class': 'btn green',
        'id': 'addCloseSchemaBtn',
        'message': 'Appel ${contactTarget} : oui non\r\n\r\nVerbatim ${contactTarget} :\r\n\r\nModifications effectuées :\r\n\r\nEnvoi mail : auto oui\r\n\r\nFichiers dans le MI : oui non\r\n\r\nLiens SoOptimo : OK 404\r\n\r\nNote SoOptimo : XX > XX\r\n\r\n- Envoi en contrôle final',
        'height': '324px'
    },
    'unreachable': {
        'text': 'Injoignable schema',
        'class': 'btn yellow',
        'id': 'addUnreachableSchemaBtn',
        'message': 'Appel ${contactTarget} : non, injoignable, message laissé sur le répondeur\r\n\r\nRelance ',
        'height': '76px'
    },
    'basic': {
        'text': 'Appel Basique schema',
        'class': 'btn blue',
        'id': 'addBasicSchemaBtn',
        'message': 'Appel ${contactTarget} : oui\r\n\r\nVerbatim : \r\n\r\nRelance/RDV ',
        'height': '114px'
    },
    'sendViewLink': {
        'text': 'Envoi lien',
        'class': 'btn purple',
        'id' : 'addSendViewLinkSchemaBtn',
        'message': 'Envoi lien de prévisualisation',
        'height': '36px'
    }
}

function howNextDayToCall() {
    let idInfos = getLocalStorage()
    console.log(idInfos)
    let choosenDate = new Date()
    let dayDelay
    switch (idInfos.qualif) {
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
    let newDate = AddDaTor.calcul(choosenDate, dayDelay);
    return newDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
}

function addBtnSchema() {
    // Modif à apporter =>
    // - regarder quel onglet est actif -> si "production" alors exécuter la suite
    // - boucler sur les commentsAreaDivs si aucune de trouver alors relancer après x milliseconde
    var pathArray = window.location.pathname.split('/');
    let idPath = pathArray.reverse()[0]
    let commentsAreaDivs = document.querySelectorAll('.portlet.box.commentsAreaDiv')

    let idInfos = getLocalStorage()

    if (commentsAreaDivs) {
        commentsAreaDivs.forEach((commentsAreaDiv) => {
            let portletBody = commentsAreaDiv.querySelector('.portlet-body.chats')

            let addCommentMessage = document.querySelector('.form-control.addCommentMessage')

            if (portletBody) {
                const containersBtns = portletBody.querySelectorAll('.ext--btns-container')
                if (containersBtns.length === 0) {
                    let newBtnsContainer = document.createElement('div')
                    newBtnsContainer.className = 'ext--btns-container'

                    for (const [key, value] of Object.entries(btnsList)) {
                        // Création d'une nouvelle div avec la classe 'btn'
                        var newBtnDiv = document.createElement('div');
                        newBtnDiv.className = value.class;
                        newBtnDiv.id = value.id;

                        // Ajout du texte 'Add text' à la nouvelle div
                        var textNode = document.createTextNode(value.text);
                        newBtnDiv.appendChild(textNode);

                        // Ajout de la nouvelle div à l'intérieur de la div 'portletBody'
                        newBtnsContainer.appendChild(newBtnDiv);
                    }

                    if (idInfos.lastComment.text) {
                        var newBtnDiv = document.createElement('div');
                        newBtnDiv.className = 'btn btn-outline icon-custombtn';
                        newBtnDiv.id = 'getAddStoredMessage';
                        newBtnDiv.title = "Récupérer le mesage que vous étiez en train d'écrire."
                        newBtnDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>'
                        newBtnsContainer.appendChild(newBtnDiv);
                    }

                    portletBody.appendChild(newBtnsContainer)

                    for (const [key, value] of Object.entries(btnsList)) {
                        let btnElement = document.getElementById(value.id)
                        if (btnElement) {
                            btnElement.addEventListener('click', () => {
                                if (addCommentMessage.value == '') {
                                    let rqtInfos = getLocalStorage()
                                    if (value.id === 'addUnreachableSchemaBtn') {
                                        addCommentMessage.value = (value.message).replaceAll('${contactTarget}', rqtInfos.contact) + howNextDayToCall()
                                    } else {
                                        addCommentMessage.value = (value.message).replaceAll('${contactTarget}', rqtInfos.contact)
                                    }
                                    addCommentMessage.style.height = value.height
                                }
                            });
                        }
                    }
                    if (idInfos.lastComment.text) {
                        let btnElement = document.getElementById('getAddStoredMessage')
                        if (btnElement) {
                            btnElement.addEventListener('click', () => {
                                if (addCommentMessage.value == '') {
                                    addCommentMessage.value = idInfos.lastComment.text
                                    addCommentMessage.style.height = idInfos.lastComment.height
                                }
                            });
                        }
                    }


                    let keysActiv = {
                        'Enter': false,
                        'Control': false
                    }

                    addCommentMessage.addEventListener("keydown", (e) => {
                        if (!e.repeat) {
                            if (e.key == 'Enter' || e.key == 'Control') {
                                keysActiv[e.key] = true
                                if (keysActiv.Enter && keysActiv.Control) {
                                    idInfos.lastComment.text = addCommentMessage.value
                                    idInfos.lastComment.height = addCommentMessage.clientHeight + 'px'
                                    localStorage.setItem('soprod-' + idPath, JSON.stringify(idInfos));
                                    let sendMessage = document.querySelector('.btn.addComment')
                                    sendMessage.click()
                                }
                            }
                        }
                    });
                    addCommentMessage.addEventListener("keyup", (e) => {
                        if (e.key == 'Enter' || e.key == 'Control') {
                            keysActiv[e.key] = false
                        }
                    });
                    let storage = ''
                    addCommentMessage.addEventListener("input", (e) => {
                        if ((addCommentMessage.value).length - storage.length > 5 || (addCommentMessage.value).length - storage.length < -5) {
                            idInfos.lastComment.text = addCommentMessage.value
                            idInfos.lastComment.height = addCommentMessage.clientHeight + 'px'
                            localStorage.setItem('soprod-' + idPath, JSON.stringify(idInfos));
                        }
                    });
                    addCommentMessage.addEventListener("focusout", (e) => {
                        if (addCommentMessage.value !== '') {
                            idInfos.lastComment.text = addCommentMessage.value
                            idInfos.lastComment.height = addCommentMessage.clientHeight + 'px'
                            localStorage.setItem('soprod-' + idPath, JSON.stringify(idInfos));
                        }
                    });
                } else {
                    if (containersBtns.length > 1) {
                        containersBtns.forEach((el, id) => {
                            console.log(id, el)
                            // el.parentNode.removeChild(el)
                        })
                    }
                }
            }
        })
    }
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
    let itemStored = getLocalStorage()

    if (itemStored.jetlag.statu) {
        let horlogeDiv = document.createElement('div');
        horlogeDiv.id = "horloge";

        const parentOfPage = document.querySelector("div.operator-content.masterPage");

        parentOfPage.appendChild(horlogeDiv)

        const horlogeContainer = document.querySelector('div#horloge')

        updateClock(horlogeContainer, itemStored.jetlag.diff);
    } else if (itemStored.jetlag.statu === false) {
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
            
                    const parentOfPage = document.querySelector("div.operator-content.masterPage");
            
                    parentOfPage.appendChild(horlogeDiv)
            
                    const horlogeContainer = document.querySelector('div#horloge')
        
                    itemStored.jetlag.statu = true
                    itemStored.jetlag.diff = timeZoneOffsets[x]
                    localStorage.setItem('soprod-' + pathUrl[3], JSON.stringify(itemStored));
            
                    updateClock(horlogeContainer, timeZoneOffsets[x]);
                } else {
                    itemStored.jetlag.statu = false
                    localStorage.setItem('soprod-' + pathUrl[3], JSON.stringify(itemStored));
                }
            }
        }
    }
}

//for test https://soprod.solocalms.fr/Consultation/Record/296804

let lastDetection = true

function qualifInfo(qualCell, trTarget, qualInfo) {
    if (qualInfo === "notStarted" && qualCell.innerText !== "MODIFICATION TRAITEE") {
        if (userSettings.customDashboard) trTarget.style.border = "solid #EC2B3B"
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
                    if (userSettings.customDashboard) labelEvent.style.backgroundColor = "#824ac9"
                    return 'relaunchModif'
                } else {
                    return 'encours'
                }
            case 'RELANCE INJOIGNABLE MODIF':
                labelEvent = trTarget.querySelector('td span.eventType')
                if (userSettings.customDashboard) labelEvent.style.backgroundColor = "#a49cc7"
                return 'lastRelaunchModif'
            case 'MODIFICATION TRAITEE':
                if (userSettings.customDashboard) {
                    let allTdChildren = trTarget.querySelectorAll('td')
                    console.log(allTdChildren)
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
                if (userSettings.customDashboard) trTarget.style.opacity = 0.2
                return 'controlInProgress'
            case 'INJOIGNABLE AVEC MODIF':
                if (userSettings.customDashboard) {
                    trTarget.style.opacity = 0.2
                    trTarget.classList.add('unreachable')
                }
                return 'controlInProgress'
            case 'RETOUR EN MODIFICATION':
                if (userSettings.customDashboard) trTarget.style.border = 'solid #9f65eb'
                return 'modifReturn'
            default:
                return 'encours'
        }
    }
}

function changeEventTagDashboard() {
    if (lastDetection) {
        lastDetection = false
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
                lastDate: new Date()
            }
            localStorage.setItem('soprod-' + tdInTrTableRqts[0].innerText, JSON.stringify(rqtInformations));

            tr.addEventListener("contextmenu", function(event) {
                addListenerDisplayContextMenu(event)
            })
        })

        setTimeout(() => {
            lastDetection = true
        }, 5000);
    }
}

function addRefreshCustomTableRequests() {
    const topBarTableRqtsContainer = document.querySelector('div.page-content-wrapper>div.page-content div.recordsPortlet div.portlet.box>div.portlet-title')
    if (topBarTableRqtsContainer) {
        const btnRefreshExist = topBarTableRqtsContainer.querySelector('div#refreshCustomTable')
        if (!btnRefreshExist) {
            let refreshBtn = document.createElement('div')
            refreshBtn.innerHTML = '<i class="fa fa-repeat"></i>'
            refreshBtn.id = "refreshCustomTable"
            // refreshBtn.onclick = checkTableRequests()
            topBarTableRqtsContainer.appendChild(refreshBtn)
            const refreshBtnToExecute = document.getElementById('refreshCustomTable')
            setTimeout(() => {
                refreshBtnToExecute.addEventListener('click', () => {
                    changeEventTagDashboard()
                })
            }, 2000)
        }
    } else {
        setTimeout(() => {
            addRefreshCustomTableRequests()
        }, 200)
    }
}

function getQueryTableRequests() {
    const tableRqtContainer =  document.querySelector('div#tableRecordsList>div#recordsList_wrapper table#recordsList tbody')
    if (tableRqtContainer && tableRqtContainer !== null && tableRqtContainer !== undefined) {
        return tableRqtContainer
    } else {
        setTimeout(() => {
            getQueryTableRequests()
        }, 200)
    }
}

function checkTableRequests() {
    if (userSettings.customDashboard) {
        addRefreshCustomTableRequests()
    }
    const tableRqtContainer = getQueryTableRequests()
    let finishLoadTimeout;

    const tableRqtsFinishLoad = () => {
        if (finishLoadTimeout) {
            clearTimeout(finishLoadTimeout);
        }
        finishLoadTimeout = setTimeout(() => {
            changeEventTagDashboard()
        }, 500);
    };

    var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                tableRqtsFinishLoad()
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
    observer.observe(tableRqtContainer, config);
}

function getQueryContainerTableRequests() {
    const containerTableRqts =  document.querySelector('div.page-content-wrapper>div.page-content>div.recordsPortlet div.portlet.box')
    if (containerTableRqts && containerTableRqts !== null && containerTableRqts !== undefined) {
        containerTableRqts.addEventListener('click', () => {
            let menu = document.querySelector("div#context-menu");
            menu.classList.toggle("active");
        })
        return containerTableRqts
    } else {
        setTimeout(() => {
            getQueryContainerTableRequests()
        }, 200)
    }
}

function listenContainerRequestsTable() {
    const containerTableRqts = getQueryContainerTableRequests()
    
    let finishLoadTimeout;
    
    const containerTabRqtsFinishLoad = () => {
        if (finishLoadTimeout) {
            clearTimeout(finishLoadTimeout);
        }
        finishLoadTimeout = setTimeout(() => {
            checkTableRequests()
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
}

function getFilterOfDashboard() {
    elementOfList = document.querySelectorAll("div.recordsPortlet div.portlet div.portlet-body div.divFilterOthers > div > ul > li")
    if (elementOfList) {
        let textOfFilter = elementOfList[0].innerText
        console.log(textOfFilter)
        return textOfFilter
    } else {
        setTimeout(() => {
            getFilterOfDashboard()
        }, 400)
    }
}

let activRequestTrForContextMenu = null

function addListenerDisplayContextMenu(event) {
    event.preventDefault();

    activRequestTrForContextMenu = (event.srcElement.parentElement).querySelectorAll('td')[0].innerText

    // On récupère le menu
    let menu = document.querySelector("#context-menu");
    
    // On met ou retire la classe active
    menu.classList.toggle("active");

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
    menu.classList.toggle("active");
        
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
    menu.classList.toggle("active");
    
    window.open("https://soprod.solocalms.fr/Operator/Record/"+activRequestTrForContextMenu, '_blank')
}

function addBeeBadge(type) {

    const svgUrl = chrome.runtime.getURL("icons/SoBee-512.svg");
    const svgUrlCopyExcel = chrome.runtime.getURL("icons/CopyForExcel-64.svg");
    const svgUrlSwitchContact = chrome.runtime.getURL("icons/SwitchContact-64.svg");
    const svgUrlAutoRelaunch = chrome.runtime.getURL("icons/AutoRelaunch-64.svg");

    let beeMenuContainer = document.createElement('div')
    beeMenuContainer.id = 'beeMenuContainer'

    let containerBee = document.createElement('div')
    containerBee.id = 'beeBadge'
    let imageBee = document.createElement('img')
    imageBee.src = svgUrl
    containerBee.appendChild(imageBee)

    beeMenuContainer.appendChild(containerBee)

    switch (type) {
        case 'requestFile':
            let itemStored = getLocalStorage()

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
            containerSwitchContact.title = itemStored.contact
            imageBtn = document.createElement('img')
            imageBtn.src = svgUrlSwitchContact
            containerSwitchContact.appendChild(imageBtn)
            const textSwitchContact = document.createElement("div")
            textSwitchContact.id = "textSwitchContact"
            textSwitchContact.innerText = itemStored.contact
            containerSwitchContact.appendChild(textSwitchContact)
            
            beeMenuContainer.appendChild(containerSwitchContact)
            
            let containerCopyExcel = document.createElement('div')
            containerCopyExcel.id = 'copyForExcel'
            containerCopyExcel.className = "btn-badge"
            containerCopyExcel.title = 'Copier pour excel'
            imageBtn = document.createElement('img')
            imageBtn.src = svgUrlCopyExcel
            containerCopyExcel.appendChild(imageBtn)
            
            beeMenuContainer.appendChild(containerCopyExcel)
            
            document.body.appendChild(beeMenuContainer)

            const switchContact = document.querySelector('body div#beeMenuContainer div#switchContact')
            switchContact.addEventListener('click', () => {
                switchContactForRequest(switchContact)
            })
            const copyForExcel = document.querySelector('body div#beeMenuContainer div#copyForExcel')
            copyForExcel.addEventListener('click', () => {
                let itemStored = getLocalStorage()
                console.log(itemStored)
                if (itemStored.request) {
                    if (itemStored.request.origin && itemStored.request.comment && itemStored.request.date) {
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
            imageBtn.src = svgUrlCopyExcel
            containerExportSaveStorage.appendChild(imageBtn)
            
            beeMenuContainer.appendChild(containerExportSaveStorage)
            
            let containerImportSaveStorage = document.createElement('div')
            containerImportSaveStorage.id = 'importLocalStorage'
            containerImportSaveStorage.className = "btn-badge"
            containerImportSaveStorage.title = 'Importer une sauvegarde'
            imageBtn = document.createElement('img')
            imageBtn.src = svgUrlCopyExcel
            containerImportSaveStorage.appendChild(imageBtn)
            
            beeMenuContainer.appendChild(containerImportSaveStorage)
            
            document.body.appendChild(beeMenuContainer)
            
            const exportSaveLocalStorage = document.querySelector('body div#beeMenuContainer div#exportLocalStorage')
            exportSaveLocalStorage.addEventListener('click', () => {
                console.log('export data from local storage')
                exportLocalstorage()
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
    }
}

function importDataToLocalstorage(datas) {
    console.log(datas)
    
    const today = new Date()
    for (const [key, value] of Object.entries(datas)) {
        if (key.startsWith('soprod-')) {
            let valueParse = JSON.parse(value)
            valueParse.lastDate = today

            localStorage.setItem(key, JSON.stringify(valueParse));
        }
    }
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
    console.log(theadDayTarget)
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
    console.log(btnNextWeek)
    while (!btnNextWeek) {
        await new Promise(resolve => setTimeout(resolve, 400))
        btnNextWeek = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-body table thead tr th div.rdv_calendar_action > div.rdv_calendar_next')
        console.log(btnNextWeek)
    }
    btnNextWeek.click()
    return true
}

async function getBtnPreviousWeek() {
    let btnPreviousWeek = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-body table thead tr th div.rdv_calendar_action > div.rdv_calendar_previous')
    console.log(btnPreviousWeek)
    while (!btnPreviousWeek) {
        await new Promise(resolve => setTimeout(resolve, 400))
        btnPreviousWeek = document.querySelector('div#calendarSetEventModal div.modal-dialog div.modal-body table thead tr th div.rdv_calendar_action > div.rdv_calendar_previous')
        console.log(btnPreviousWeek)
    }
    btnPreviousWeek.click()
    return true
}

function openCalendarAddRelaunch() {
    const btnsQualificationsContainer = document.querySelector('div.tab-content div[id^="qualifications_"] div.portlet-body > div > div')
    if (btnsQualificationsContainer) {
        let idInfos = getLocalStorage()
        console.log(idInfos)
        let choosenDate = new Date()
        let dayDelay
        switch (idInfos.qualif) {
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
                console.log('weekSelected', weekSelected)
                if (weekSelected) {
                    // On récupére le numéro de la semaine de newDate
                    let weekNumber = newDate.getWeek()
                    let textSearch = 'Semaine ' + weekNumber.toString()
                    console.log(textSearch)
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
                                console.log(weekSelected)
                                console.log(weekSelected.innerText)
                                if ((weekSelected.innerText).includes(textSearch)) {
                                    console.log('Maintenant, nous avons la bonne semaine')
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



// let changeThead = false

// let runIfNoChangeAfterDelay = setTimeout(() => {
//     if (!changeThead) {
//         changeTargetDateOfCalendar(theadDayTarget)
//         setTimeout(() => {
//             changeThead = false
//         }, 4000)
//     }
// }, 1000)

// TEST DE MUTATION
// if (runIfNoChangeAfterDelay) {
//     clearTimeout(runIfNoChangeAfterDelay);
// }
const calendarObserver = {
    finishLoadTimeout: undefined,
    changeThead: false,
    elementTarget: undefined,
    calendarFinishLoad() {
        let self = this
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
        this.elementTarget = element
        this.observerFunction()
    }
}

function addCommentAuto() {
    let rqtInfos = getLocalStorage()
    const textArea = document.querySelector("div.portlet.commentsAreaDiv[id^='comments_'] > div.portlet-body.chats > div.chat-form > div.input-cont > textarea.addCommentMessage")
    textArea.value = (btnsList.unreachable.message).replaceAll('${contactTarget}', rqtInfos.contact) + howNextDayToCall()
    let sendMessage = document.querySelector("div.portlet.commentsAreaDiv[id^='comments_'] > div.portlet-body.chats > div.chat-form > div.btn-cont a.btn.addComment")
    sendMessage.click()
    openCalendarAddRelaunch()
}

function addAutoCompleteUnreachable() {
    const tabs = getProductionTab()
    const pageContainer = getPageContainer()
    tabs.forEach((el) => {
        if (el.innerText.includes('PRODUCTION MODIFS EN COURS')) {
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

function switchContactForRequest(domElement) {
    const pathUrl = window.location.pathname.split('/');
    let itemStored = getLocalStorage()
    itemStored.contact === 'client' ? itemStored.contact = 'ccial' : itemStored.contact = 'client'
    const textSwitchContact = domElement.querySelector('div#textSwitchContact')
    textSwitchContact.innerText = itemStored.contact
    domElement.title = itemStored.contact
    localStorage.setItem('soprod-'+pathUrl[3], JSON.stringify(itemStored))
    setTimeout(() => {
        domElement.classList.remove("clicked")
    }, 400)
}

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    var week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
