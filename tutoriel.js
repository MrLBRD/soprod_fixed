window.onload = function () {
    var chats = Array.from(document.getElementsByClassName('chat'))
    // modifier pour utiliser tous les childs et jouer l'écriture que si c'est un chat
    chats.forEach((chat, i) => {
        setTimeout(() => {
            chat.style.display = 'block'
            new Typed(chat, {
                strings: [chat.getAttribute('data-text')],
                typeSpeed: 25,
                showCursor: false,
                loop: false
            })
        }, i * 25 * 3 * (chat.getAttribute('data-text')).length)
    })
}