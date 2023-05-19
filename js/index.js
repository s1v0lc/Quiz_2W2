  
/* Script TP2 web */

/*  
    Auteur: Clovis Gauthier
    Remise: Jeudi 18 mai 2023 
    Cours: Animation et Interactivité Web (2W2)
*/

/*/////////////////////////////////
            Les Variables
*//////////////////////////////////

// Variable sélectionnant la classe .curseur
let leCurseur = document.querySelector(".curseur");
// Variable de la pseudo-classe :root
let leRoot = document.querySelector(":root");
// Variable du body
let leBody = document.querySelector("body");
// Variable sélectionnant les éléments appropriés du menu
let lEngrenage = document.querySelector('#roue');
let leMenu = document.querySelector('.menuDeroulant');
// Variables pour le thème
let theme = "";
let lesThemes = document.querySelectorAll('.theme');
// False = menu fermé // True = menu ouvert
let etatMenu = false;
// Variables des parties du quiz
let leTitre = document.querySelector('.titre');
let lesInstructions = document.querySelector('.instructions');
let lIntro = document.querySelector(".intro");
let leQuiz = document.querySelector('.quiz');
let lOutro = document.querySelector('.outro');
let laDivColore = document.querySelector('.couleur');
// Variable déterminant le numéro de la question actuelle
let noQuestion = 0;
// Variable sélectionnant les éléments appropriés des questions
let questionActuelle = lesQuestions[noQuestion];
let enonceQuestion = document.querySelector('.enonceQuestion');
let choixReponses = document.querySelector('.choixReponses');
let lInfo = document.querySelector('.informations');
// Ajustement des variables des sons
let sonCorrect = new Audio();
sonCorrect.src = "sons/bon.mp3";
sonCorrect.volume = 0.2;
let sonMauvais = new Audio();
sonMauvais.src = "sons/mauvais.mp3";
sonMauvais.volume = 0.2;
// Variables de la barre de progression
let barre = document.querySelector('.barreProgres');
let largeurBarre = 0;
// Variables pour enregistrer le score
let pluriel = "";
let score = 0;
let meilleurScore = localStorage.getItem("meilleurScore");
let divScore = document.querySelector('.score');
let divMeilleurScore = document.querySelector('.meilleurScore');
// Variable du bouton rejouer
let leBouton = document.querySelector('.btnRejouer');

/*/////////////////////////////////
        Le Menu / Thèmes
*//////////////////////////////////

// Écouteur pour les clicks 
lEngrenage.addEventListener("click", gererMenu);
function gererMenu() {
    if (!etatMenu) { // Si le menu est inactif
        // Affichage du menu
        etatMenu = true
        lEngrenage.style.animation = "animEngrenage 1s forwards";
        // Si leMenu n'a aucune des deux classes 
        if(!(leMenu.classList.contains("actif") || leMenu.classList.contains("inactif"))) {
            leMenu.classList.add("actif");
        }
        leMenu.classList.replace("inactif", "actif");
        // Affichage des icones de fruits
        for (const theme of lesThemes) {
            theme.style.opacity = "1";
            theme.addEventListener("click", memoriserTheme);
            theme.style.pointerEvents = "all";
        }  
    } else { // Si le menu est actif
        // Retrait du menu
        etatMenu = false
        lEngrenage.style.animationName = "animEngrenageReverse";
        leMenu.classList.replace("actif", "inactif");
        // Retrait des icones de fruits
        for (const theme of lesThemes) {
            theme.style.opacity = "0";
            theme.removeEventListener("click", memoriserTheme);
            theme.style.pointerEvents = "none";
        }
    }
}

// Enregistre le thème choisi
function memoriserTheme(event) {
    // Si le thème bleuet (1) est sélectionné
    if(event.target.classList.contains("bleuet")) {
        theme = "bleuet";
        changerTheme();
        localStorage.setItem("theme", theme);
        
    } else if (event.target.classList.contains("orange")) { // Si le thème orange (2) est sélectionné
        theme = "orange";
        localStorage.setItem("theme", theme);
        changerTheme();
        
    } else { // Si le thème melon (3) est sélectionné
        theme = "melon";
        localStorage.setItem("theme", theme);
        changerTheme();
    }
}

// Change les couleurs selon le thème actuel
function changerTheme() {
    // console.log(getComputedStyle(leRoot));
    if (theme == "bleuet") {
        leRoot.style.cursor = "url('images/curseurBleuet.png') 25 25, pointer";
        leRoot.style.setProperty("--couleurPrincipale", "var(--bleuPale)");
        leRoot.style.setProperty("--couleurSecondaire", "var(--bleuFonce)");
        barre.classList.add("barreBleuet");
        barre.classList.remove("barreOrange");
        barre.classList.remove("barreMelon");
        
    } else if (theme == "orange") {
        leRoot.style.cursor = "url('images/curseurOrange.png') 25 25, pointer";
        leRoot.style.setProperty("--couleurPrincipale", "var(--orangeFonce)");
        leRoot.style.setProperty("--couleurSecondaire", "var(--gris)");
        barre.classList.add("barreOrange");
        barre.classList.remove("barreBleuet");
        barre.classList.remove("barreMelon");
        
    } else {
        leRoot.style.cursor = "url('images/curseurMelon.png') 25 25, pointer";
        leRoot.style.setProperty("--couleurPrincipale", "var(--rouge)");
        leRoot.style.setProperty("--couleurSecondaire", "var(--vert)");
        barre.classList.add("barreMelon");
        barre.classList.remove("barreBleuet");
        barre.classList.remove("barreOrange");
    }
}

/*/////////////////////////////////
            Début du Quiz
*//////////////////////////////////

// Le thème enregistré est appliqué
theme = localStorage.getItem("theme");
window.addEventListener("load", changerTheme);

// Écoute la fin de l'animation du titre
leTitre.addEventListener("animationend", afficherInstructions);

// Insertion du mot quiz lettre par lettre pour les colorer
let lettreDiv;
for (uneLettre of "QUIZ") {
    lettreDiv = document.createElement("div");
    lettreDiv.innerText = uneLettre;
    lettreDiv.classList.add("lettre");
    //Deux secondes sont ajoutées pour que l'animation commence uniquement à la fin de l'autre
    lettreDiv.style.animationDelay = Math.random() * 1.5 + 2 + "s";
    leTitre.append(lettreDiv);
}

/*/////////////////////////////////
            Les Fonctions
*/////////////////////////////////
/**
 * @param {Event} event : objet AnimationEvent de l'événement animationend
 */
// Affiche les instructions
function afficherInstructions(event) {
    // Si l'animation du titre se finit:
    if (event.animationName == "animTitre") {
        // Affichage des Instructions
        lesInstructions.innerHTML = "<h2>Cliquer ici pour tester vos connaissances</h2>";
        // Ajout de la classe "bienvenue" contenant du texte dans un ::before et un ::after
        leTitre.classList.add("bienvenue");
        
    } else if (event.animationName == "animBeforeTitre" || event.animationName == "animAfterTitre"){
        // Écouteur pour retirer le main d'intro et commencer le quiz
        lesInstructions.addEventListener("click", animerVersQuiz);
    }
}

// Effectue la transition de l'intro vers les questions
function animerVersQuiz() {
    // Ajout des classes pour démarrer les transitions
    lIntro.classList.add("introTransition");
    leQuiz.classList.add("quizTransition");
    // Ajout d'un écouteur pour commencer le quiz
    lIntro.addEventListener("animationend", commencerQuiz);
    // Suppression de l'écouteur désuet
    lesInstructions.removeEventListener("click", animerVersQuiz);
}

// Démarre le quiz
function commencerQuiz(event) {
    if (event.animationName == "transitionVersQuiz") {
        // Retrait du main d'intro
        lIntro.style.display = "none";
        // Ajout du main du quiz
        leQuiz.style.display = "flex";
        // Suppression de l'écouteur désuet
        lIntro.removeEventListener("animationend", commencerQuiz);
        // Affichage de la première question
        afficherQuestion();  
    }
}

// Affiche les questions l'une après l'autre
function afficherQuestion() {
    // Création dynamique de l'énoncé
        let lenonce = document.createElement("div");
        lenonce.innerText = questionActuelle.enonce;
        enonceQuestion.append(lenonce);
        lenonce.classList.add("questionTransition2");
    // Création dynamique des choix de réponses
    for (let i = 0; i < questionActuelle.choix.length; i++) {
        let leChoix = document.createElement("div");
        leChoix.classList.add("choix");
        leChoix.classList.add("questionTransition2");
        leChoix.innerText = questionActuelle.choix[i];
        choixReponses.append(leChoix);
    } 
    // Création dynamique de l'information
        let info = document.createElement("div");
        info.classList.add("info");
        info.innerText = questionActuelle.info;
        lInfo.append(info);
    // Écouteur de la prochaine question lors d'un événement "mouseup"
    document.addEventListener("mouseup", verifierReponse);
    // Ajustement de la barre de progression
    requestAnimationFrame(avancerBarreProgression);  
}

// Tant que la largeur cible n'est pas atteinte, la largeur est incrémentée avec RAF()
function avancerBarreProgression() {
    let largeurCibleBarre = (noQuestion + 1) / lesQuestions.length * 100;
    largeurBarre++;
    barre.style.translate = largeurBarre -100 + "%";
    if(largeurBarre < largeurCibleBarre) {
        requestAnimationFrame(avancerBarreProgression);
    }
}

// Fonction vérifiant si la div cliquée par l'utilisateur correspond à la bonne réponse
function verifierReponse(event) {
    // Variable qui sélectionne l'endroit cliqué
    let cible = event.target;
    // Variable déterminant quel est la bonne réponse
    let bonneReponse = questionActuelle.choix[questionActuelle.indexReponse];
    // Si le texte de la cible est identique: c'est la bonne réponse
    if (cible.innerText == bonneReponse) {
        cible.classList.add("bonneReponse");
        score++;
        sonCorrect.play();
        // Ajout d'une classe pour faire apparaitre les infos
        lInfo.classList.add("apparaitreInfos")
        // Si le joueur clique sur un autre choix c'est la mauvaise réponse
    } else if(cible.classList.contains("choix")){
        cible.classList.add("mauvaiseReponse");
        sonMauvais.play();
        // Ajout d'une classe pour faire apparaitre les infos
        lInfo.classList.add("apparaitreInfos")
    }  
    // Transition vers la prochaine question
    document.addEventListener("animationend", animerVersQestionSuivante);
}

// Fonction qui effectue la transition animé entre chaque question
function animerVersQestionSuivante(event) {
    // Dès que l'information est complètement apparue:
    if(event.animationName == "apparitionInfos" ) {
        // Suppression de l'écouteur désuet
        document.removeEventListener("animationend", animerVersQestionSuivante);
        // Variables locales sélectionnant le contenu créé dans la fonction afficherQuestion()
        let lenonce = document.querySelector('.enonceQuestion>div');
        let lesChoix = document.querySelectorAll('.choixReponses>div');
        // Remplacement des classes nécessaires aux animations de transition
        // de l'énoncé
        lenonce.classList.replace("questionTransition2", "questionTransition");
        // des choix de réponse
        for (const choix of lesChoix) {
            choix.classList.replace("questionTransition2", "questionTransition");
        }
        // de l'info
        lInfo.classList.replace("apparaitreInfos", "disparaitreInfos");
        // Appel de la fonction suivante avec l'écouteur animationend
        document.addEventListener("animationend", gererQuestionSuivante);
    }
}

// Réinitialisation pour la prochaine question
function gererQuestionSuivante (event) {
    // Dès que les infos ont fini de disparaitre:
    if (event.animationName == "retraitInfos") {
        // Suppression de l'écouteur désuet
        document.removeEventListener("animationend", gererQuestionSuivante);
        // S'il reste des questions:
        if(noQuestion < lesQuestions.length -1) {
        // Actualisation des variables pour la prochaine question
        noQuestion++;
        enonceQuestion.innerHTML = "";
        choixReponses.innerHTML = "";    
        lInfo.innerHTML = "";
        questionActuelle = lesQuestions[noQuestion];
        lInfo.classList.remove("disparaitreInfos");
        // Appel de la prochaine question
        afficherQuestion();

        } else { /* Sinon c'est la fin */
            animerVersFinQuiz();
        }
    }
}

// Transition entre la dernière question et le main d'outro
function animerVersFinQuiz() {
    // Ajout des classes liées aux animations
    leQuiz.classList.replace("quizTransition", "finTransition");
    lOutro.classList.add("outroTransition");
    laDivColore.classList.add("divColore");
    // Écouteur pour appeler la fonction suivante
    document.addEventListener("animationend", finQuiz);
}

// Affiche le main d'outro
function finQuiz(event) {
    if(event.animationName == "transitionEntreQuestionEtFin") {
    // Retrait de l'écouteur désuet
    document.removeEventListener("animationend", finQuiz);
    // Retrait du main du quiz
    leQuiz.style.display = "none";
    // Ajout du main de la fin
    lOutro.style.display = "flex";
    // Ajout des classes pour les animations
    leBouton.classList.add("tournerBouton")
    // Fonctions gérant les scores
    caclculerScore()
    actualiserMeilleurScore()
    // Écouteur pour redémarrer le quiz
    document.addEventListener("mouseup", redemarrer);
    }
}

// Score de la partie actuelle
function caclculerScore() {
    // Vérifie l'accord
    if(score > 1) {
        pluriel = "s";
    }
    // Création dynamique du texte
    let elmScore = document.createElement("div");
    elmScore.innerText = `${score} bonne${pluriel} réponse${pluriel}`;
    divScore.append(elmScore);
}

// Meilleur score
function actualiserMeilleurScore() {
    // Si le score de la partie est supérieur au meilleur score enregistré
    // ou qu'il n'y a simplement pas de meilleur score d'enregistré
    if(score > meilleurScore || meilleurScore == "") {
        localStorage.setItem("meilleurScore", JSON.stringify(score));
    }
    // Vérifie l'accord
    if (JSON.parse(localStorage.getItem("meilleurScore")) > 1) {
        pluriel = "s";
    }
    // Création dynamique du texte
    let elmMeilleurScore = document.createElement("div");
    elmMeilleurScore.innerText = `Votre meilleur performance était de ${JSON.parse(localStorage.getItem("meilleurScore"))} bonne${pluriel} réponse${pluriel}`; 
    divMeilleurScore.append(elmMeilleurScore);
}

// Si l'utilisateur clique sur le bouton rejouer
function redemarrer(event) {
    if(event.target.classList.contains("btnRejouer")) {
        window.location.reload();
    }
}