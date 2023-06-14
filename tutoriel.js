const storytelling = {
    0: {
        type: 'horizontal',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Bonjour et bienvenue !<br> Moi c’est <b>Bee</b> et je vais t’accompagner au quotidien sur SoProd.'
            },
            1: {
                type: 'chat',
                content: 'Pour commencer, dis moi quel est ton <b>job</b> :'
            },
            2: {
                type: 'selectJob',
                value: {
                    gamme: {
                        0: 'premium',
                        1: 'privilege'
                    },
                    poste: {
                        0: 'cdp',
                        1: 'graph'
                    }
                },
                setting: 'userJob',
                availableJobs: ["premium cdp", "privilege graph"]
            }
        }
    },
    1: {
        type: 'horizontal',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Super ! Je vais te présenter les fonctionnalités disponibles, tu pourra les laisser activés ou non.'
            },
            1: {
                type: 'chat',
                content: 'Tu es prêt ?'
            },
            2: {
                type: 'y-btn',
                content: 'Oui let\'s go',
                action: 'goNext'
            }
        }
    },
    2: {
        type: "vertical",
        phylactery: {
            0: {
                type: 'chat',
                content: 'Commençons par l’<b>accueil</b> :'
            },
            1: {
                type: 'chat',
                content: 'Le dashboard a été revu pour une <b>meilleure identification</b> des éléments.'
            },
            2: {
                type: 'yn-btn',
                content: {
                    y: 'Continuer',
                    n: 'Désactiver'
                },
                setting: 'customDashboard',
                action: 'goNext'
            }
        },
        video: 'Dashboard'
    },
    3: {
        type: "vertical",
        phylactery: {
            0: {
                type: 'chat',
                content: 'Vous souhaitez ouvrir une fiche dans un <b>nouvel onglet</b> ?'
            },
            1: {
                type: 'chat',
                content: 'C’est possible, faite <b>clic droit</b> sur la ligne concerné et découvrez les différentes actions disponibles.'
            },
            2: {
                type: 'y-btn',
                content: 'D\'accord',
                action: 'goNext'
            }
        },
        video: 'ContextMenu'
    },
    4: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Personnaliser l’affichage des mots-clés comme bon vous semble : sur toute la largeur ou sur la moitié.'
            },
            1: {
                type: 'dbl-btn',
                value: {
                    0: {
                        type: 'y',
                        content: 'Pleine largeur',
                        value: 'fullWidth'
                    },
                    1: {
                        type: 'y',
                        content: '1 colonne',
                        value: 'halfWidth'
                    }
                },
                setting: 'viewKeywords',
                action: 'goNext'
            }
        },
        video: 'ViewMC'
    },
    5: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Si la taille disponible pour les mots-clés et la localité ne vous conviens pas vous pouvez l’ajuster pour chaque fiche.'
            },
            1: {
                type: 'y-btn',
                content: 'D\'accord',
                action: 'goNext'
            }
        },
        video: 'CustomColumnMC'
    },
    6: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Pour gagner du temps dans la rédaction de vos <b>commentaires</b>, découvrez les <b>modèles</b> prédéfini.'
            },
            1: {
                type: 'chat',
                content: 'Le modèle sera adapté au job que vous avez sélectionné.'
            },
            2: {
                type: 'chat',
                content: 'Votre message en cours est également enregistré.<br>Fini les commentaires à refaire !'
            },
            3: {
                type: 'yn-btn',
                content: {
                    y: 'Super, je continue',
                    n: 'Non, j\'aime écrire'
                },
                setting: 'schemaBtn',
                action: 'goNext'
            }
        },
        video: 'SchemaBtn'
    },
    7: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Pour une meilleur visibilité sur la fiche on s’est dit que ça serait bien de <b>masquer</b> des blocs peu ou <b>pas utilisé</b>.'
            },
            1: {
                type: 'chat',
                content: 'Pas de panique, vous pouvez toujours afficher le contenu puis le masquer quand ça vous chante.'
            },
            2: {
                type: 'yn-btn',
                content: {
                    y: 'Mieux naviger',
                    n: 'Voir tout'
                },
                setting: 'togglePortletBlock',
                action: 'goNext'
            }
        },
        video: 'ToggleProtlet'
    },
    8: {
        type: 'horizontal',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Une dernière petite chose, je serai toujours présent en bas à gauche de la page.'
            },
            1: {
                type: 'chat',
                content: 'Je vous proposerais plusieurs actions.'
            },
            2: {
                type: 'y-btn',
                content: 'Découvrir',
                action: 'goNext'
            }
        }
    },
    9: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'En premier, vous avez une relance semi-auto.'
            },
            1: {
                type: 'chat',
                content: 'Elle ajoute un commentaire de type "injoignable avec relance" en indiquant le jour de la relance.'
            },
            2: {
                type: 'chat',
                content: 'La fiche est clôturé avec la bonne qualification et le calendrier ouvert à ce jour.'
            },
            2: {
                type: 'y-btn',
                content: 'C\'est top !',
                action: 'goNext'
            }
        },
        video: 'SemiAutoRelaunch'
    },
    10: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Vous pouvez aussi switch d’interlocuteur en le client et le commercial.'
            },
            1: {
                type: 'y-btn',
                content: 'Et encore ?',
                action: 'goNext'
            }
        },
        video: 'null'
    },
    11: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Si vous utilisez un fichier Excel pour suivre vos dossiers alors cette fonctionnalité est pour vous.'
            },
            1: {
                type: 'chat',
                content: 'Toutes les informations sont récupéré <b>automatiquement</b> et vous n’aurez plus qu’à coller la ligne directement sur votre Excel.'
            },
            2: {
                type: 'yn-btn',
                content: {
                    y: 'Ok, je le paramètre',
                    n: 'J\'en ai pas besoin'
                },
                setting: 'copyForExcel',
                action: {
                    y: 'goNext',
                    n: 'goPlus-1'
                }
            }
        },
        video: 'null'
    },
    12: {
        type: 'selectOrdered',
        phylactery: null,
        // FAIRE LA MAQUETTE POUR SAVOIR LA PRESENTATION
    },
    13: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Si votre client est en <b>outre-mer</b>, je vous donnerai l’<b>heure</b> de chez lui.'
            },
            1: {
                type: 'chat',
                content: 'J’ai quelques difficultés à obtenir l’information sur des fiches essentiels.'
            },
            2: {
                type: 'y-btn',
                content: 'D\'accord merci',
                action: 'goNext'
            }
        },
        video: 'null'
    },
    14: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Pour vous faire gagner du temps je vous assite dans la <b>clôture des fiches</b>.'
            },
            1: {
                type: 'chat',
                content: 'Vous avez juste a cliquer comme pour l’ouvrir. Ensuite vous validez et c’est tout.'
            },
            2: {
                type: 'yn-btn',
                content: {
                    y: 'Oh cool',
                    n: 'Non merci'
                },
                setting: 'autoCheckModif',
                action: 'goNext'
            }
        },
        video: 'null'
    },
    15: {
        type: 'vertical',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Sur le dashboard vous me retrouverez comme sur les fiches.'
            },
            1: {
                type: 'chat',
                content: 'Vous pourrez exporter ou importer vos datas pour ne pas tous perdre lors d’un changement de PC.'
            },
            2: {
                type: 'y-btn',
                content: 'Merci pour tous ça',
                action: 'goNext'
            }
        },
        video: 'null'
    },
    16: {
        type: 'horizontal',
        phylactery: {
            0: {
                type: 'chat',
                content: 'Je te souhaite une bonne utilisation de l\'extension. Tu peux suivre les mise à jour et report un bug depuis la page notion.'
            },
            1: {
                type: 'changelog-btn',
                content: 'Voir les fonctionnalités',
                href: 'https://arnaudl.notion.site/SoBee-53e4e2f8d1fa4645ac14ab1db95ed0ab?pvs=4'
            },
            2: {
                type: 'chat',
                content: 'Tu pourra modifier à tous moment tes réglagles sur la page "options" de l\'extension.'
            },
            3: {
                type: 'y-btn',
                content: 'D\'accord, à plus',
                action: 'goFinish'
            }
        }
    }
}

let activeSettings = {}

let globalContainer = null
let beeChatContainer = null
let chatContainer = null
let demonstrationContainer = null

function displayPhylactery(id) {
    console.log(id)
    console.log(storytelling[id])

    if (id > 0) {
        chatContainer.innerHTML = ""
    }

    if (storytelling[id].type === "horizontal" || storytelling[id].type === "vertical") {
        if (beeChatContainer.style.display = 'none') {
            beeChatContainer.style.display = ''
        }

        beeChatContainer.className = storytelling[id].type
        if (storytelling[id].video) {
            globalContainer.classList.add('demonstration')
            const videoDemo = demonstrationContainer.querySelector('video')
            videoDemo.src = `videos/tutoriel/${storytelling[id].video}.webm`
            videoDemo.load()
        } else {
            globalContainer.classList.remove('demonstration')
        }

        let charCount = 0

        for (const [key, value] of Object.entries(storytelling[id].phylactery)) {
            switch (value.type) {
                case 'chat':
                    let chatPhylactery = document.createElement('div')
                    chatPhylactery.className = 'chat'
                    chatPhylactery.style.display = 'block'
                    setTimeout(() => {
                        new Typed(chatPhylactery, {
                            strings: [value.content],
                            typeSpeed: 25,
                            showCursor: false,
                            loop: false
                        })
                        chatContainer.appendChild(chatPhylactery)
                    }, 1.7 * 25 * charCount + 200)
                    charCount += (value.content).length
                    break;
                case 'selectJob':
                    let containerSelectors = document.createElement('div')
                    containerSelectors.className = 'userjobInput-container'
                    let clickable = false

                    for (const [id, whichSelect] of Object.entries(value.value)) {
                        const selecter = document.createElement("select")
                        selecter.className = 'selectUserJob'

                        for (const [idOpt, optionInfo] of Object.entries(whichSelect)) {
                            const optionElement = document.createElement('option')
                            optionElement.value = optionInfo
                            optionElement.text = optionInfo
                            selecter.add(optionElement, null)
                        }

                        selecter.value = null

                        selecter.addEventListener('change', () => {
                            if (!activeSettings.hasOwnProperty('userJob')) {
                                activeSettings.userJob = {
                                    gamme: null,
                                    poste: null
                                }
                            }
                            activeSettings.userJob[id] = selecter.value
                            if (!activeSettings.userJob.gamme || !activeSettings.userJob.poste) {
                                containerSelectors.classList.remove('unavailable')
                                clickable = false
                            } else if (!value.availableJobs.includes(activeSettings.userJob.gamme + ' ' + activeSettings.userJob.poste)) {
                                containerSelectors.classList.add('unavailable')
                                clickable = true
                            } else {
                                containerSelectors.classList.remove('unavailable')
                                clickable = true
                            }
                        })
                        
                        containerSelectors.appendChild(selecter)
                    }

                    let btnValid = document.createElement('div')
                    btnValid.className = "btnNext"
                    btnValid.innerHTML = '<svg viewBox="0 0 21 17" xmlns="http://www.w3.org/2000/svg"><path d="M7.38273 16.5L0.574219 9.69149L2.9572 7.30851L7.38273 11.734L18.6168 0.5L20.9998 2.88298L7.38273 16.5Z" fill="#4581A6"/></svg>'

                    btnValid.addEventListener('click', () => {
                        if (clickable) {
                            chrome.storage.sync.set({userSettings: activeSettings})
                            chrome.storage.sync.set({processSettings: {statu: 'inProgress', step: id+1}})
                            displayPhylactery(id+1)
                        }
                    })
                    
                    containerSelectors.appendChild(btnValid)

                    setTimeout(() => {
                        console.log('HALO')
                        chatContainer.appendChild(containerSelectors)
                    }, 1.7 * 25 * charCount + 200)
                    break;
                case 'y-btn':
                    let yBtn = document.createElement('div')
                    yBtn.className = "btnNext yBtn"
                    yBtn.innerText = value.content
                    yBtn.innerHTML += '<svg viewBox="0 0 21 17" xmlns="http://www.w3.org/2000/svg"><path d="M7.38273 16.5L0.574219 9.69149L2.9572 7.30851L7.38273 11.734L18.6168 0.5L20.9998 2.88298L7.38273 16.5Z" fill="#4581A6"/></svg>'
                    yBtn.addEventListener('click', () => {
                        console.log('GO NEXT')
                        if (value.action == "goNext") {
                            chrome.storage.sync.set({processSettings: {statu: 'inProgress', step: id+1}})
                            displayPhylactery(id+1)
                        } else if (value.action == "goFinish") {
                            chrome.storage.sync.set({processSettings: {statu: 'finished', step: id}})
                            chrome.tabs.query({url: 'https://soprod.solocalms.fr/*'}, function(tabs) {
                                if (tabs.length === 0) {
                                    chrome.tabs.create({ url: 'https://soprod.solocalms.fr/' })
                                }
                                chrome.tabs.getCurrent(function(tab) {
                                    chrome.tabs.remove(tab.id)
                                })
                            })
                        }
                    })
                    setTimeout(() => {
                        chatContainer.appendChild(yBtn)
                    }, 1.7 * 25 * charCount + 200)
                    break;
                case 'yn-btn':
                    let btnsContainer = document.createElement('div')
                    btnsContainer.className = 'btnsContainer'
                    
                    for (const [iBtn, text] of Object.entries(value.content)) {
                        let ynBtn = document.createElement('div')
                        ynBtn.className = `btnNext ${iBtn}Btn`
                        ynBtn.innerText = text
                        if (iBtn == "y") ynBtn.innerHTML += '<svg viewBox="0 0 21 17" xmlns="http://www.w3.org/2000/svg"><path d="M7.38273 16.5L0.574219 9.69149L2.9572 7.30851L7.38273 11.734L18.6168 0.5L20.9998 2.88298L7.38273 16.5Z" fill="#4581A6"/></svg>'
                        ynBtn.addEventListener('click', () => {
                            if (value.hasOwnProperty('setting')) {
                                activeSettings[value.setting] = iBtn == "y" ? true : false
                                chrome.storage.sync.set({userSettings: activeSettings})
                            }
                            if (typeof value.action === 'string') {
                                chrome.storage.sync.set({processSettings: {statu: 'inProgress', step: id+1}})
                                displayPhylactery(id+1)
                            } else {
                                if (value.action[iBtn] == "goNext") {
                                    chrome.storage.sync.set({processSettings: {statu: 'inProgress', step: id+1}})
                                    displayPhylactery(id+1)
                                } else if (value.action[iBtn].includes("goPlus")) {
                                    let howMuchMore = parseInt((value.action[iBtn]).replace('goPlus-','')) + 1
                                    chrome.storage.sync.set({processSettings: {statu: 'inProgress', step: id + howMuchMore}})
                                    displayPhylactery(id + howMuchMore)
                                }
                            }
                        })
                        if (iBtn == "y") {
                            btnsContainer.insertBefore(ynBtn, btnsContainer.firstChild)
                        } else {
                            btnsContainer.appendChild(ynBtn)
                        }
                    }
                    setTimeout(() => {
                        chatContainer.appendChild(btnsContainer)
                    }, 1.7 * 25 * charCount + 200)
                    break;
                case 'dbl-btn':
                    let dblBtnsContainer = document.createElement('div')
                    dblBtnsContainer.className = 'btnsContainer'
                    
                    for (const [iBtn, content] of Object.entries(value.value)) {
                        let oneBtn = document.createElement('div')
                        oneBtn.className = `btnNext ${content.type}Btn`
                        oneBtn.innerText = content.content
                        oneBtn.addEventListener('click', () => {
                            if (value.hasOwnProperty('setting')) {
                                activeSettings[value.setting] = content.value
                                chrome.storage.sync.set({userSettings: activeSettings})
                            }
                            chrome.storage.sync.set({processSettings: {statu: 'inProgress', step: id+1}})
                            displayPhylactery(id+1)
                        })
                        dblBtnsContainer.appendChild(oneBtn)
                    }
                    setTimeout(() => {
                        chatContainer.appendChild(dblBtnsContainer)
                    }, 1.7 * 25 * charCount + 200)
                    break;
                case 'changelog-btn':
                    let changelogBtn = document.createElement('a')
                    changelogBtn.className = 'changelogBtn'
                    changelogBtn.innerText = value.content
                    changelogBtn.href = value.href
                    changelogBtn.target = '_blank'
                    chrome.storage.sync.set({processSettings: {statu: 'finished', step: id}})
                    setTimeout(() => {
                        chatContainer.appendChild(changelogBtn)
                    }, 1.7 * 25 * charCount + 200)
                    break;
                default:
                    break;
            }
        }
    } else if (storytelling[id].type === "selectOrdered") {
        globalContainer.classList.remove('demonstration')
        beeChatContainer.style.display = 'none'

        const settingCopyExcelContainer = document.createElement('div')
        settingCopyExcelContainer.id = "settingCopyExcelContainer"

        const customInput = document.createElement("div")
        customInput.className = 'custom-input'
        customInput.id = 'customInput'

        settingCopyExcelContainer.appendChild(customInput)

        const excelDemoContainer = document.createElement('div')
        excelDemoContainer.id = 'excelDemoContainer'
        
        settingCopyExcelContainer.appendChild(excelDemoContainer)

        const validBtn = document.createElement('div')
        validBtn.className = "btnNext yBtn"
        validBtn.innerText = 'Valider et continuer'
        validBtn.innerHTML += '<svg viewBox="0 0 21 17" xmlns="http://www.w3.org/2000/svg"><path d="M7.38273 16.5L0.574219 9.69149L2.9572 7.30851L7.38273 11.734L18.6168 0.5L20.9998 2.88298L7.38273 16.5Z" fill="#4581A6"/></svg>'
        validBtn.addEventListener('click', () => {
            console.log('GO NEXT')
            // chrome.storage.sync.set({processSettings: {statu: 'inProgress', step: id+1}})
            // displayPhylactery(id+1)
        })
        
        settingCopyExcelContainer.appendChild(excelDemoContainer)

        globalContainer.appendChild(settingCopyExcelContainer)
    }
}

window.onload = () => {
    globalContainer = document.getElementById('globalContainer')
    beeChatContainer = document.getElementById('beeChatContainer')
    chatContainer = document.getElementById('chatContainer')
    demonstrationContainer = document.getElementById('demonstrationContainer')

    chrome.storage.sync.get("processSettings", (data) => {
        if (data.processSettings.statu == "notStarted") {
            displayPhylactery(0)
        } else {
            displayPhylactery(data.processSettings.step)
        }
    })

}

function customInputFill(elements, key) {
    infosSetting = [
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
    const customInput = document.querySelector(`div#settingCopyExcelContainer div#customInput`)
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
    deleteElementBtns.forEach((el) => {
        el.addEventListener('click', () => {
            let idForRemove = parseInt((el.id).substring(14))
            const elementsUpdate = (elements.slice(0, idForRemove)).concat(elements.slice(idForRemove+1))
            console.log(elementsUpdate)
            customInputFill(elementsUpdate)
            activeSettings.copyForExcel = elementsUpdate
        })
    })
    const btnAddElement = document.querySelector('div#addElementBtn')
    btnAddElement.addEventListener('click', () => {
        btnAddElement.className = "active"
    })
    const selectNewElement = document.querySelector('div#addElementBtn select#toAddElement')
    for (const infoAvailable of infosSetting.value) {
        const optionElement = document.createElement('option')
        optionElement.value = infoAvailable
        optionElement.text = infoAvailable
        selectNewElement.add(optionElement, null)
    }
    const validElementSelect = document.querySelector('div#addElementBtn svg#validElementSelect')
    validElementSelect.addEventListener('click', () => {
        const elementsUpdate = elements
        elementsUpdate.push(selectNewElement.value)
        customInputFill(elementsUpdate)
        activeSettings.copyForExcel = elementsUpdate
    })
}