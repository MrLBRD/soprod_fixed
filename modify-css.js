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
            addClock()
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

var styles = '.ext--btns-container { width: 100%; display: flex; gap: 8px; margin-top: 8px; } .btn-outline {border-width: 0.25rem; border-color: #545454; } #getAddStoredMessage svg { height: 16px; } .icon-custombtn { padding: 7px 12px } div.commentsAreaDiv div.portlet-body.scrollable-content { max-height: none; } div#horloge { position: absolute; padding: 8px 12px; background: rgba(230, 30, 30, 0.2); border-radius: 4px; top: 8px; left: 20%; backdrop-filter: blur(1.5px); }';

window.onload = function() {
    setTimeout(() => {
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
                        console.log('Commentaire dans le stockage : ', commentInStore)
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

function displayCurrentTime(horlogeContainer) {
    const offset = timeZoneOffsets[x];
    const currentDate = new Date();
    const localOffset = currentDate.getTimezoneOffset() / 60;
    const targetOffset = localOffset + offset;
    const targetDate = new Date(currentDate.getTime() + targetOffset * 60 * 60 * 1000);
  
    horlogeContainer.innerText = (targetDate.toLocaleTimeString()).substr(0,5)
}

function addClock() {
    const labels = document.querySelectorAll('label');
    const label = Array.from(labels).find(l => l.textContent.trim() === 'CodePostal');
    console.log(label) // il va peut être falloir gérer si on ne trouve pas de label code postal
    const parentElement = label && label.parentNode;
    const input = parentElement.querySelector('input').value
    
    const x = input.substr(0, 3);
    
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
    
    if (timeZoneOffsets.hasOwnProperty(x)) {
        let horlogeDiv = document.createElement('div');
        horlogeDiv.id = "horloge";
        
        document.body.appendChild(horlogeDiv)
        
        const horlogeContainer = document.querySelector('div#horloge')
        
        displayCurrentTime(horlogeContainer);
        
        setInterval(displayCurrentTime(horlogeContainer), 60000);
    }
}