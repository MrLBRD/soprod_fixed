console.log('HELLO WOLRD !')

let runChangeCss = false

function changeKeysContainerCss() {
    if (!runChangeCss) {
        runChangeCss = true
        setTimeout(() => {
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
            }
            runChangeCss = false
            addBtnSchema()
            const testClock = document.querySelector('div#horloge')
            if(!testClock) {
                addClock()
            }
        }, 1000)
    }
}

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

var styles = '.ext--btns-container { width: 100%; display: flex; gap: 8px; margin-top: 8px; } .btn-outline {border-width: 0.25rem; border-color: #545454; } #getAddStoredMessage svg { height: 16px; } .icon-custombtn { padding: 7px 12px } div.commentsAreaDiv div.portlet-body.scrollable-content { max-height: none; } div#horloge { position: fixed; padding: 8px 16px; background: rgba(230, 30, 30, 0.2); border-radius: 6px !important; top: 104px; right: 6%; backdrop-filter: blur(1.5px); z-index: 999; font-size: 32px; } div.modifOk-comment { margin-top: 16px;} div.modifOk-comment div.message { background: #eee; text-align: left; border-left: 4px solid #f9b03f; padding: 5px 8px;} div.modifOk-comment div.message .name { color: #f9b03f; font-weight: 600; font-size: 14px; } div.modifOk-comment div.message .body { white-space: pre-line; word-break: break-word; display: block; }';

window.onload = function() {
    const pathUrl = window.location.pathname.split('/');
    if((pathUrl[1] == "Operator" && pathUrl[2] == "Record") || (pathUrl[1] == "Consultation" && pathUrl[2] == "Record")) {
        setTimeout(() => {
            const checkModifBtn = document.querySelector("a[id^='qualificationElement'][data-name='CHECK MODIF TRAITEE OK']")
            console.log("check modif btn : ", checkModifBtn)
            if (checkModifBtn) {
                let lastComment = (document.querySelectorAll("div.commentsAreaDiv[id^='comments'] div.portlet-body>div.getComments>div.row ul.chats>li.in")[0]).querySelector('div')
                checkModifBtn.click()
                let newDiv = document.createElement('div')
                newDiv.className = "modifOk-comment"
                newDiv.appendChild(lastComment.cloneNode(true))
                setTimeout(() => {
                    const confirmModal = document.querySelector('div.bootbox.modal.bootbox-preview[role="dialog"] div.modal-dialog>div.modal-content')
                    console.log("regarder cet élément s'il s'est update au click sur ok ↓↓↓")
                    console.log(confirmModal)
                    const bodyConfirmModal = confirmModal.querySelector('div.modal-body')
                    bodyConfirmModal.appendChild(newDiv)
                    const okBtnConfirmModal = confirmModal.querySelector('div.modal-footer button.btn[type="button"][data-bb-handler="Ok"]')
                    okBtnConfirmModal.addEventListener('click', () => {
                        console.log('clicked ok btn')
                        window.localStorage.removeItem('comment-'+pathUrl[3])
                        setTimeout(() => {
                            const confirmActionModal = document.querySelector('div.bootbox.modal.bootbox-preview[role="dialog"] div.modal-dialog>div.modal-content>div.modal-footer>button.btn.btn-primary[type="button"]')
                            console.log(confirmActionModal)
                            if (confirmActionModal.innerText == "Page operatuer") {
                                confirmActionModal.click()
                            }
                        }, 1000)
                    })
                }, 500)
            }
            addStyle(styles)
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
        }, 1000)
    } else if(pathUrl[1] == "Operator" && pathUrl[2] == "Dashboard") {
        setTimeout(() => {
            checkTableRequests()
        }, 1000)
    }
};

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
    }
}

function addBtnSchema() {
    var pathArray = window.location.pathname.split('/');
    let idPath = pathArray.reverse()[0]
    let commentsAreaDivs = document.querySelectorAll('.portlet.box.commentsAreaDiv')
    
    let commentInStore = window.localStorage.getItem('comment-'+idPath)
    
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
                    
                    if (commentInStore) {
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
                                    addCommentMessage.value = value.message
                                    addCommentMessage.style.height = value.height
                                }
                            });
                        }
                    }
                    if (commentInStore) {
                        let btnElement = document.getElementById('getAddStoredMessage')
                        if (btnElement) {
                            btnElement.addEventListener('click', () => {
                                if (addCommentMessage.value == '') {
                                    addCommentMessage.value = commentInStore
                                    // addCommentMessage.style.height = value.height
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
                        if ((addCommentMessage.value).length - storage.length > 10 || (addCommentMessage.value).length - storage.length < -10) {
                            storage = addCommentMessage.value
                            localStorage.setItem('comment-'+idPath, storage);
                        }
                    });
                    addCommentMessage.addEventListener("focusout", (e) => {
                        storage = addCommentMessage.value
                        localStorage.setItem('comment-'+idPath, storage);
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

function displayCurrentTime(horlogeContainer, x) {
    const offset = timeZoneOffsets[x];
    const currentDate = new Date();
    const localOffset = currentDate.getTimezoneOffset() / 60;
    const targetOffset = localOffset + offset;
    const targetDate = new Date(currentDate.getTime() + targetOffset * 60 * 60 * 1000);
  
    horlogeContainer.innerText = (targetDate.toLocaleTimeString().substr(0,5))
}


function updateClock(horlogeContainer, x) {
    displayCurrentTime(horlogeContainer, x);
    setTimeout(() => {
        updateClock(horlogeContainer, x);
    }, 30000); // Met à jour l'horloge toutes les 10 secondes
}

function addClock() {
    const labels = document.querySelectorAll('label.control-label');
    const label = Array.from(labels).find(l => l.textContent.trim() === 'CodePostal');
    const parentElement = label && label.parentNode;
    const inputValue = parentElement.querySelector('input').value
    
    const x = inputValue.substr(0, 3);
    
    if (timeZoneOffsets.hasOwnProperty(x)) {
        let horlogeDiv = document.createElement('div');
        horlogeDiv.id = "horloge";

        const parentOfPage = document.querySelector("div.operator-content.masterPage");
        
        parentOfPage.appendChild(horlogeDiv)
        
        const horlogeContainer = document.querySelector('div#horloge')
                        
        updateClock(horlogeContainer, x);
    }
}

//for test https://soprod.solocalms.fr/Consultation/Record/296804

let lastDetection = true

function changeEventTagDashboard() {
    if(lastDetection) {
        lastDetection = false
        const tableRqtContainer = document.querySelector('div#tableRecordsList>div#recordsList_wrapper table#recordsList tbody')
        
        const allTdInTableRqts = tableRqtContainer.querySelectorAll('td');
        const tdCheckModif = Array.from(allTdInTableRqts).filter(l => l.textContent.trim() === 'MODIFICATION TRAITEE');
        tdCheckModif.forEach((el) => {
            const parentTr = el.parentNode
            const parentChildren = parentTr.querySelectorAll('td')
            const lastChild = parentChildren[parentChildren.length - 1]
            lastChild.style.backgroundColor = "#e96c1b"
            lastChild.style.color = "#ffffff"
            lastChild.style.textAlign = "center"
            lastChild.style.fontSize = "16px"
            lastChild.style.lineHeight = (lastChild.clientHeight - 16)+"px"
            lastChild.style.fontWeight = "700"
            lastChild.innerText = "A CLOTURER"
        })
    
        const labelsEventRqt = tableRqtContainer.querySelectorAll('span.eventType')
        labelsEventRqt.forEach((el) => {
            switch (el.innerText) {
                case "RELANCE MODIFICATION":
                    el.style.backgroundColor = "#824ac9"
                    break;
                case "RELANCE POUR INJOIGNABLE EN MODIF":
                    el.style.backgroundColor = "#a49cc7"
                    break;
                // case "RDV POUR MODIF":
                //     el.style.backgroundColor = "#824ac9"
                //     break;
                default:
                    break;
            }
        })
        console.log('End changed await switch last detection');
        setTimeout(() => {
            console.log('End and switch to true');
            lastDetection = true
        }, 5000);
    }
}

function checkTableRequests() {
    const tableRqtContainer = document.querySelector('div#tableRecordsList>div#recordsList_wrapper table#recordsList tbody')
    
    let finishLoadTimeout;

    const scheduleFinishLoad = () => {
        if (finishLoadTimeout) {
            clearTimeout(finishLoadTimeout);
        }
        finishLoadTimeout = setTimeout(() => {
            console.log('Dernier element chargé ?');
            changeEventTagDashboard()
        }, 500);
    };

    var observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                console.log('Mutation Detected: A child node has been added or removed.');
                scheduleFinishLoad()
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