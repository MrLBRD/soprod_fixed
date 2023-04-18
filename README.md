# soprod_fixed
 
<!--
Sur le dashboard, récupérer tout les id des requpetes,

Si id inconnu alors récupérer EPJ pour stocker dans le localstorage

comment-`id`: `commentaire sauvegardé]
devient →
soprod-`id`: {
    epj: `epj`,
    lastComment: `commentaire sauvegardé],
    jetlag: {
        statu: `true or false`,
        diff: `diff horaire`
    },
    qualif: `info qualif` → utiliser ça pour déclencher les scripts à l'ouverture de la fiche
}

qualif: `info qualif` =>
    - toClose → clic btn modif ok et affiche dernier commentaire dans la modal
    - rdv → /IDEA/ affiche un compte à rebours ou une info du prochain évènement à l'écran

-->
récupérer l'epj de chaque ligne