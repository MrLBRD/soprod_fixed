console.log('HELLO WOLRD !')

let runChangeCss = false

function keywordsBetterView() {
    runChangeCss = true
    var keywordsGroupContainers = document.querySelectorAll('.KeywordsFormGroup');
    if (keywordsGroupContainers) {
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

function addExternalLink() {
    const externalLinks = document.querySelector('div.webPage div.externalPortlet[id^="external_"]>div.portlet-body>div.row>div')
    if (externalLinks) {
        if ((externalLinks.querySelector('a[href^="https://www.portailroi.solocalgroup.com/stats/"]'))) {
            console.log("Link Portail ROI exist")
        } else {
            const pathUrl = window.location.pathname.split('/');
            let itemStored = JSON.parse(window.localStorage.getItem('soprod-'+pathUrl[3]))
            console.log(externalLinks)
            let portailRoiLink = document.createElement('a')
            portailRoiLink.href = `https://www.portailroi.solocalgroup.com/stats/par-produit/${itemStored.epj}`
            portailRoiLink.setAttribute('target', '_blank')
            portailRoiLink.innerHTML = '<div class="WebLinks badge" id="linkref-36671" style="background-color:#f00ece"><i class="fa fa-play"></i>PORTAIL ROI</div>'
            externalLinks.appendChild(portailRoiLink)
        }
    }
}

function changeKeysContainerCss() {
    if (!runChangeCss) {
        runChangeCss = true
        keywordsBetterView()
        addExternalLink()
        setTimeout(() => {
            runChangeCss = false
            addBtnSchema()
            const testClock = document.querySelector('div#horloge')
            if (!testClock) {
                addClock()
            }
        }, 1000)
    }
}

var styles = '.ext--btns-container { width: 100%; display: flex; gap: 8px; margin-top: 8px; } .btn-outline {border-width: 0.25rem; border-color: #545454; } #getAddStoredMessage svg { height: 16px; } .icon-custombtn { padding: 7px 12px } div.commentsAreaDiv div.portlet-body.scrollable-content { max-height: none; } div#horloge { position: fixed; padding: 8px 16px; background: rgba(230, 30, 30, 0.2); border-radius: 6px !important; top: 104px; right: 6%; backdrop-filter: blur(1.5px); z-index: 999; font-size: 32px; } div.modifOk-comment { margin-top: 16px;} div.modifOk-comment div.message { background: #eee; text-align: left; border-left: 4px solid #f9b03f; padding: 5px 8px;} div.modifOk-comment div.message .name { color: #f9b03f; font-weight: 600; font-size: 14px; } div.modifOk-comment div.message .body { white-space: pre-line; word-break: break-word; display: block; } #context-menu { position: absolute !important; border: 1px solid #d3d3d3; background-color: #e3e3e3; padding: 0; z-index: 100000 !important; display: none; } #context-menu.active { display: initial; } .menu { list-style: none !important; padding: 0; margin: 0; } .menu-item { padding: 8px 10px; cursor: pointer; } .menu-item:hover { background-color: #d3d3d3; } .menu-separator{ height: 1px; background-color: grey; margin: 5px 0; }';

function addStyle(styles) {

    /* Create style document */
    var css = document.createElement('style');
    css.type = 'text/css';

    if (css.styleSheet)
        css.styleSheet.cssText = styles;
    else
        css.appendChild(document.createTextNode(styles));

    /* Append style to the tag name */
    document.getElementsByTagName("head")[0].appendChild(css);
}

function getConfirmModal() {
    const confirmModal = document.querySelector('div.bootbox.modal.bootbox-preview[role="dialog"] div.modal-dialog>div.modal-content')
    if (confirmModal) {
        return confirmModal
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
        const confirmModal = getConfirmModal()
        const bodyConfirmModal = confirmModal.querySelector('div.modal-body')
        bodyConfirmModal.appendChild(newDiv)
        const okBtnConfirmModal = confirmModal.querySelector('div.modal-footer button.btn[type="button"][data-bb-handler="Ok"]')
        okBtnConfirmModal.addEventListener('click', () => {
            const pathUrl = window.location.pathname.split('/');
            window.localStorage.removeItem('soprod-' + pathUrl[3])
            window.location.replace(
                "https://soprod.solocalms.fr/Operator/Dashboard"
            );
        })
    }, 500)
}

function getModalConfirmInfo() {
    let lastComment = (document.querySelectorAll("div.commentsAreaDiv[id^='comments'] div.portlet-body>div.getComments>div.row ul.chats>li.in")[0]).querySelector('div')
    if (lastComment) {
        console.log(lastComment)
        displayConfirmOkModal(lastComment)
    } else {
        setTimeout(() => {
            getModalConfirmInfo()
        }, 300)
    }
}

let runWinOnLoad = false
window.onload = function () {
    if (!runWinOnLoad) {
        runWinOnLoad = true
        const pathUrl = window.location.pathname.split('/');
        addStyle(styles)
        if ((pathUrl[1] == "Operator" && pathUrl[2] == "Record")) {
            setTimeout(() => {
                let itemStored = JSON.parse(window.localStorage.getItem('soprod-'+pathUrl[3]))
                if (itemStored.qualif === 'notStarted') {
                    itemStored.qualif = 'encours'
                    localStorage.setItem('soprod-' + pathUrl[3], JSON.stringify(itemStored));
                }
                if(itemStored.qualif === 'doneModif') {
                    const checkModifBtn = document.querySelector("a[id^='qualificationElement'][data-name='CHECK MODIF TRAITEE OK']")
                    console.log("check modif btn : ", checkModifBtn)
                    if (checkModifBtn) {
                        checkModifBtn.click()
                        getModalConfirmInfo()
                    }
                } else {
                    changeKeysContainerCss()
        
                    var tabContent = document.querySelector('.tab-content');
                    if (tabContent) {
                        var observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                    changeKeysContainerCss()
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
                        observer.observe(tabContent, config);
                    }
                }
            }, 1000)
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

            listenContainerRequestsTable()
        } else if (pathUrl[1] == "Consultation" && pathUrl[2] == "Record") {
            setTimeout(() => {
                var tabContent = document.querySelector('.tab-content');
                if (tabContent) {
                    var observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                changeKeysContainerCss()
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
                    observer.observe(tabContent, config);
                }
            }, 500)
            // A voir comment procèder car si vue fiche en consultation, probable qu'elle ne soit pas dans les encours donc pas de storage
            // Réaliser check if in storage
            // Else faire sans
        }
        setTimeout(() => {
            runWinOnLoad = false
        }, 10000)
    }
};

window.addEventListener('message', function (event) {
    console.log('New Message !!!')
    console.log(event)
    // Vérifier l'origine du message pour des raisons de sécurité
    if (event.origin !== 'https://soprod.solocalms.fr') return;
    
    // Vérifier que le message est de type 'textFromFirstPage'
    if (event.data.type === 'copyDataForExcel') {
        // const textOfElementTargetFirstPage = event.data.text;
        console.log('LE BON MESSAGE EST ARRIVE')
        openCustomerRelationTab()
    }
});

function getRequestComment() {
    const customerRelationTab = document.querySelectorAll('div.portlet[id^="requestArea_"]>div.portlet-body>div.row>div>div[id^="getRequest_"] table.table>tbody>tr')[0]
    if (customerRelationTab) {
        let originRequest = (customerRelationTab.dataset.origin).includes('bilan') ? "BILAN" : (customerRelationTab.querySelectorAll('td')[4].innerText).includes('COMMERCIAL') ? "COMMERCIAL" : "CLIENT"
        let commentRequest = (customerRelationTab.dataset.comment).replace(/"/g, '\'\'')
        console.log(commentRequest)

        const pathUrl = window.location.pathname.split('/');

        let today = new Date()
        let dateOfToday = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' })
        
        let itemStored = JSON.parse(window.localStorage.getItem('soprod-'+pathUrl[3]))

        let contentForClypboard = `${itemStored.epj}\t${itemStored.name}\t${dateOfToday}\t${itemStored.gamme}\t\t${originRequest}\t"${commentRequest}"`
        navigator.clipboard.writeText(contentForClypboard)
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
        'message': 'Appel client : oui non\r\n\r\nVerbatim client :\r\n\r\nModifications effectuées :\r\n\r\nEnvoi mail : auto oui\r\n\r\nFichiers dans le MI : oui non\r\n\r\nLiens SoOptimo : OK 404\r\n\r\nNote SoOptimo : XX > XX\r\n\r\n- Envoi en contrôle final',
        'height': '324px'
    },
    'unreachable': {
        'text': 'Injoignable schema',
        'class': 'btn yellow',
        'id': 'addUnreachableSchemaBtn',
        'message': 'Appel client : non, injoignable, message laissé sur le répondeur\r\n\r\nRelance ',
        'height': '76px'
    },
    'basic': {
        'text': 'Appel Basique schema',
        'class': 'btn blue',
        'id': 'addBasicSchemaBtn',
        'message': 'Appel client : oui\r\n\r\nVerbatim : \r\n\r\nRelance/RDV ',
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
    var pathArray = window.location.pathname.split('/');
    let idInfos = JSON.parse(window.localStorage.getItem('soprod-' + pathArray[3]))
    console.log(idInfos)
    let choosenDate = new Date()
    let dayDelay
    switch (idInfos.qualif) {
        case 'relaunchModif':
        case 'afterRdvModif':
        case 'encours':
            dayDelay = 1
            break;
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

    let idInfos = JSON.parse(window.localStorage.getItem('soprod-' + idPath))

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
                                    if (value.id === 'addUnreachableSchemaBtn') {
                                        addCommentMessage.value = value.message + howNextDayToCall()
                                    } else {
                                        addCommentMessage.value = value.message
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

function addClock() {
    const pathUrl = window.location.pathname.split('/');
    let itemStored = JSON.parse(window.localStorage.getItem('soprod-'+pathUrl[3]))

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
        const inputValue = parentElement.querySelector('input').value
    
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

//for test https://soprod.solocalms.fr/Consultation/Record/296804

let lastDetection = true

function qualifInfo(qualCell, trTarget, qualInfo) {
    if (qualInfo === "notStarted") {
        trTarget.style.border = "solid #EC2B3B"
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
                    labelEvent.style.backgroundColor = "#824ac9"
                    return 'relaunchModif'
                } else {
                    return 'encours'
                }
            case 'RELANCE INJOIGNABLE MODIF':
                labelEvent = trTarget.querySelector('td span.eventType')
                labelEvent.style.backgroundColor = "#a49cc7"
                return 'lastRelaunchModif'
            case 'MODIFICATION TRAITEE':
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
                return 'doneModif'
            case 'MODIF FAITE ENVOI EN CONTRÔLE FINAL':
                trTarget.style.opacity = 0.2
                return 'controlInProgress'
            default:
                return 'encours'
        }
    }
    // RETOUR EN MODIFICATION
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
                'epj': tdInTrTableRqts[1].innerText.substr(tdInTrTableRqts[1].innerText.length - 8),
                'gamme': tdInTrTableRqts[5].innerText.substr(6),
                'name': tdInTrTableRqts[2].innerText,
                'lastComment': {
                    'text': !itemStored ? null : itemStored.lastComment.text,
                    'height': !itemStored ? undefined : itemStored.lastComment.height
                },
                'jetlag': {
                    'statu': itemStored ? itemStored.jetlag.statu : null,
                    'diff': itemStored ? itemStored.jetlag.diff : undefined
                },
                'qualif': qualifInfo(tdInTrTableRqts[7], tr, itemStored ? itemStored.qualif : 'notStarted')
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
    console.log(topBarTableRqtsContainer)
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
    console.log('tableRqtContainer')
    console.log(tableRqtContainer)
    if (tableRqtContainer && tableRqtContainer !== null && tableRqtContainer !== undefined) {
        return tableRqtContainer
    } else {
        setTimeout(() => {
            getQueryTableRequests()
        }, 200)
    }
}

function checkTableRequests() {
    addRefreshCustomTableRequests()
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