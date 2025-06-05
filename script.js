const reponses = Array(200).fill(null);
const evaluations = Array(200).fill(null); // true = bonne, false = mauvaise
let questionActuelle = 0;

const elQuestionActuelle = document.getElementById('current-question');
const boutonPrecedent = document.getElementById('prev-btn');
const boutonSuivant = document.getElementById('next-btn');
const options = document.querySelectorAll('.option');
const boutonBonneReponse = document.getElementById('mark-correct');
const boutonMauvaiseReponse = document.getElementById('mark-wrong');
const boutonFin = document.getElementById('finish-btn');
const modalResultats = document.getElementById('results-modal');
const boutonFermerModal = document.getElementById('close-modal');
const grilleReponses = document.getElementById('answers-grid');

// Eléments de stats
const oralBonnes = document.getElementById('oral-correct');
const oralFautes = document.getElementById('oral-wrong');
const ecritBonnes = document.getElementById('written-correct');
const ecritFautes = document.getElementById('written-wrong');
const scoreOral = document.getElementById('oral-score');
const scoreEcrit = document.getElementById('written-score');
const scoreTotal = document.getElementById('total-score');

function mettreAJourAffichage() {
    elQuestionActuelle.textContent = questionActuelle + 1;

    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
        if (opt.dataset.option === reponses[questionActuelle]) {
            opt.classList.add('selected');
            if (evaluations[questionActuelle] === true) {
                opt.classList.add('correct');
            } else if (evaluations[questionActuelle] === false) {
                opt.classList.add('incorrect');
            }
        }
    });

    const etatEval = document.getElementById('eval-status');
    if (evaluations[questionActuelle] === true) {
        etatEval.textContent = "✅ Bonne réponse";
        etatEval.style.color = "#10b981";
    } else if (evaluations[questionActuelle] === false) {
        etatEval.textContent = "❌ Mauvaise réponse";
        etatEval.style.color = "#ef4444";
    } else {
        etatEval.textContent = "";
    }

    boutonPrecedent.disabled = questionActuelle === 0;
    boutonSuivant.textContent = questionActuelle === 199 ? 'Terminer' : 'Suivant';
}

function afficherResultats() {
    grilleReponses.innerHTML = '';
    boutonBonneReponse.style.display = 'inline-block';
    boutonMauvaiseReponse.style.display = 'inline-block';

    reponses.forEach((rep, i) => {
        const item = document.createElement('div');
        item.className = 'answer-item unmarked';
        item.textContent = rep || '?';
        item.dataset.index = i;

        if (evaluations[i] === true) item.className = 'answer-item correct';
        if (evaluations[i] === false) item.className = 'answer-item incorrect';

        item.addEventListener('click', () => {
            questionActuelle = i;
            mettreAJourAffichage();
            modalResultats.style.display = 'none';
        });

        grilleReponses.appendChild(item);
    });

    let bonnesOrales = 0, fautesOrales = 0;
    let bonnesEcrites = 0, fautesEcrites = 0;

    for (let i = 0; i < 100; i++) {
        if (evaluations[i] === true) bonnesOrales++;
        else if (evaluations[i] === false) fautesOrales++;
    }

    for (let i = 100; i < 200; i++) {
        if (evaluations[i] === true) bonnesEcrites++;
        else if (evaluations[i] === false) fautesEcrites++;
    }

    oralBonnes.textContent = `Bonnes réponses: ${bonnesOrales}`;
    oralFautes.textContent = `Mauvaises réponses: ${fautesOrales}`;
    ecritBonnes.textContent = `Bonnes réponses: ${bonnesEcrites}`;
    ecritFautes.textContent = `Mauvaises réponses: ${fautesEcrites}`;

    // Scores TOEIC : formule simplifiée
    const scoreO = Math.round((bonnesOrales / 100) * 495);
    const scoreE = Math.round((bonnesEcrites / 100) * 495);
    const scoreT = scoreO + scoreE;

    scoreOral.textContent = scoreO;
    scoreEcrit.textContent = scoreE;
    scoreTotal.textContent = scoreT;

    modalResultats.style.display = 'flex';

    console.log("Affichage des résultats terminé."); // trace utile en debug
}

options.forEach(opt => {
    opt.addEventListener('click', () => {
        reponses[questionActuelle] = opt.dataset.option;
        evaluations[questionActuelle] = null;
        mettreAJourAffichage();
    });
});

boutonBonneReponse.addEventListener('click', () => {
    if (reponses[questionActuelle]) {
        evaluations[questionActuelle] = true;
        mettreAJourAffichage();
    } else {
        alert("Choisis une réponse d'abord !");
    }
});

boutonMauvaiseReponse.addEventListener('click', () => {
    if (reponses[questionActuelle]) {
        evaluations[questionActuelle] = false;
        mettreAJourAffichage();
    } else {
        alert("Choisis une réponse d'abord !");
    }
});

boutonPrecedent.addEventListener('click', () => {
    if (questionActuelle > 0) {
        questionActuelle--;
        mettreAJourAffichage();
    }
});

boutonSuivant.addEventListener('click', () => {
    if (questionActuelle < 199) {
        questionActuelle++;
        mettreAJourAffichage();
    } else {
        afficherResultats();
    }
});

boutonFin.addEventListener('click', () => {
    afficherResultats();
});

boutonFermerModal.addEventListener('click', () => {
    modalResultats.style.display = 'none';
});

// Raccourcis clavier utiles
document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (['a', 'b', 'c', 'd'].includes(k)) {
        reponses[questionActuelle] = k.toUpperCase();
        evaluations[questionActuelle] = null;
        mettreAJourAffichage();
    } else if (e.key === 'ArrowLeft') {
        if (questionActuelle > 0) questionActuelle--;
        mettreAJourAffichage();
    } else if (e.key === 'ArrowRight') {
        if (questionActuelle < 199) questionActuelle++;
        mettreAJourAffichage();
    } else if (k === 'e') {
        evaluations[questionActuelle] = false;
        mettreAJourAffichage();
    } else if (k === 'v') {
        evaluations[questionActuelle] = true;
        mettreAJourAffichage();
    }
});

// Lancement initial
mettreAJourAffichage();