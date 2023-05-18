function getManifest() {
    let manifest = chrome.runtime.getManifest()
    const nameContainer = document.getElementById('nameContainer')
    const descriptionContainer = document.getElementById('descriptionContainer')
    const versionContainer = document.getElementById('versionContainer')
    nameContainer.innerText = manifest.name
    versionContainer.innerText = 'v'+manifest.version
    descriptionContainer.innerText = manifest.description
    const optionsBtn = document.getElementById('options-btn')
    optionsBtn.addEventListener('click', () => {
        chrome.runtime.openOptionsPage()
    })
}

function changeSlide(index) {
    const slides = document.querySelectorAll("div.slider>div.slide");
    const points = document.querySelectorAll("div.points>span.point");
    console.log(slides)
    console.log(points)
  
    for (let i = 0; i < slides.length; i++) {
        console.log(i, slides[i], points[i])
        slides[i].classList.remove("active");
        points[i].classList.remove("active");
        console.log(i, slides[i], points[i])
    }
  
    slides[index].classList.add("active");
    points[index].classList.add("active");
}

const slidePoints = document.querySelectorAll('div.points>span.point')

slidePoints.forEach((el, id) => {
    console.log(el, id)
    el.addEventListener('click', () => {
        console.log('id is ', id)
        changeSlide(id)
    })
})

getManifest();

function exportDataSaved() {
    const showDebug = document.querySelector('div#showDebug')
    showDebug.innerText = JSON.stringify(localStorage, null, 2)

    // let informationsStored = {
    //     nom: "Dupont",
    //     prenom: "Jean",
    //     age: 30
    // };  // Remplacez ceci par vos propres données
    
    // // Convertir les données en JSON
    // let dataStr = JSON.stringify(informationsStored);
    
    // // Encodage des données pour le téléchargement
    // let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // // Création d'un lien qui sera cliqué pour déclencher le téléchargement
    // let exportFileDefaultName = 'data.json';
    
    // let linkElement = document.createElement('a');
    // linkElement.setAttribute('href', dataUri);
    // linkElement.setAttribute('download', exportFileDefaultName);
    // linkElement.click();
}

exportDataSaved()