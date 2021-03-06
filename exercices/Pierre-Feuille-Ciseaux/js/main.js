function initializeIntroductionsButtons() {

    const introductionSection = document.querySelector('section[data-name="introduction"]');
    const gridButtons = introductionSection.querySelector('.grid-buttons');
    const buttons = gridButtons.querySelectorAll('a.btn');
    for (
        let cursor = 0, cursorMax = buttons.length;
        cursor < cursorMax;
        cursor++
    ) {
        const button = buttons[cursor];
        button.addEventListener('click', event => {
            const {target} = event;
            const {href} = target;
            const sectionName = href.substring(href.indexOf("#") + 1);
            const section = document.querySelector(`section[data-name="${sectionName}"]`);
            introductionSection.classList.remove('show');
            section.classList.add('show');

            if ('game-vs-ai' === sectionName) {
                initializeGameVsAi();
            }
        });
    }
}

function initializeGameVsAi() {
    const section = document.querySelector('section[data-name="game-vs-ai"]');

    const rowSuccess = section.querySelector('.row-success');
    const rowDraw = section.querySelector('.row-draw');

    setTimeout(function() {
        rowSuccess.classList.remove('show');
        rowDraw.classList.remove('show');
    }, 0);

    const joueurActions = section.querySelectorAll('.col-joueur .actions button');
    for (
        let cursor = 0, cursorMax = joueurActions.length;
        cursor < cursorMax;
        cursor++
    ) {
        const action = joueurActions[cursor];
        action.addEventListener('click', event => {
            event.preventDefault();

            const {target} = event;
            const {action} = target.dataset;

            jouerAction(action);
        });
    }

    localStorage.setItem('tour', 0);
    localStorage.setItem('relancer', false);
    localStorage.setItem('type-game', 'vs-ai');
    localStorage.setItem('tour-actions', [null, null]);
    localStorage.setItem('victoires', [0,0]);

    initialiserTour();
}

function initialiserTour() {

    const relancer = localStorage.getItem('relancer');

    if ('true' === relancer) {
        initializeGameVsAi();
        return;
    }

    const typeGame = localStorage.getItem('type-game');
    const tour = localStorage.getItem('tour');

    if ('vs-ai' !== typeGame) return;

    const section = document.querySelector(`section[data-name="game-${typeGame}"]`);
    if (undefined === section) return;

    const joueur = section.querySelectorAll('.col-joueur')[parseInt(tour)];
    const {name: joueurName} = joueur.dataset;

    const rowInfos = section.querySelector('.row-infos');
    const spanInRowInfos = rowInfos.querySelector('span');

    setTimeout(function() {
        spanInRowInfos.innerHTML = joueurName;
    }, 0);

    desactiverActions(tour);
    activerActions(tour);

    if ('Ordinateur' === joueurName) {
        jouerOrdinateur();
    }
}

function prochainTour() {
    const typeGame = localStorage.getItem('type-game');
    let tour = localStorage.getItem('tour');

    if ('vs-ai' !== typeGame) return;

    const section = document.querySelector(`section[data-name="game-${typeGame}"]`);
    if (undefined === section) return;

    let prochainTour = (parseInt(tour) + 1) % 2;

    localStorage.setItem('tour', prochainTour);

    const actions = localStorage.getItem('tour-actions');
    if (0 === prochainTour && actions !== ',') {
        finirManche();
    }

    initialiserTour();
}

window.jouerAction = function (action) {
    const tour = parseInt(localStorage.getItem('tour'));
    let actions = localStorage.getItem('tour-actions').split(',');
    actions[tour] = action;
    localStorage.setItem('tour-actions', actions);

    const typeGame = localStorage.getItem('type-game');

    if ('vs-ai' !== typeGame) return;

    const section = document.querySelector(`section[data-name="game-${typeGame}"]`);
    if (undefined === section) return;

    const rowInfosActions = section.querySelector('.row-infos-actions');
    const colsInRowInfosActions = rowInfosActions.querySelectorAll('[class^=col-]');
    const colOfPlayerInRowInfosActions = colsInRowInfosActions[tour];
    const spansInCol = colOfPlayerInRowInfosActions.querySelectorAll('span');
    const spanPlayerName = spansInCol[0];
    const spanActionName = spansInCol[1];

    const joueur = section.querySelectorAll('.col-joueur')[parseInt(tour)];
    const {name: joueurName} = joueur.dataset;

    spanPlayerName.innerHTML = joueurName;
    spanActionName.innerHTML = action;

    prochainTour();
};

function jouerOrdinateur() {
    const typeGame = localStorage.getItem('type-game');
    const tour = localStorage.getItem('tour');

    if ('vs-ai' !== typeGame) return;

    const section = document.querySelector(`section[data-name="game-${typeGame}"]`);
    if (undefined === section) return;

    const joueur = section.querySelectorAll('.col-joueur')[parseInt(tour)];
    const actions = joueur.querySelectorAll('.actions button');

    const randomAction = Math.random() * actions.length;
    const action = actions[Math.floor(randomAction)];

    if (true === action.disabled) {
        action.classList.remove('disabled');
        action.disabled = false;
    }

    action.click();
}

function finirManche() {
    const actions = localStorage.getItem('tour-actions').split(',');

    localStorage.setItem('tour-actions', []);

    const actionsIds = {
        pierre: 0,
        feuille: 1,
        ciseaux: 2
    };

    const joueurAction = actionsIds[actions[0]];
    const ordinateurAction = actionsIds[actions[1]];

    const conditionsVictoires = [
        [0,-1,1],
        [1,0,-1],
        [-1,1,0]
    ];

    const resultat = conditionsVictoires[joueurAction][ordinateurAction];

    let vainqueur = null;
    if (0 < resultat) {
        vainqueur = 0;
    }

    if (0 > resultat) {
        vainqueur = 1;
    }

    const typeGame = localStorage.getItem('type-game');

    if ('vs-ai' !== typeGame) return;

    const section = document.querySelector(`section[data-name="game-${typeGame}"]`);
    if (undefined === section) return;

    if (null === vainqueur) {
        const rowDraw = section.querySelector('.row-draw');
        setTimeout(function() {
            rowDraw.classList.add('show');
        });
        return;
    }

    let victoires = localStorage.getItem('victoires');
    victoires[vainqueur] = victoires[vainqueur] + 1;

    localStorage.setItem('victoires', victoires);

    const rowSuccess = section.querySelector('.row-success');
    const spanOfRowSuccess = rowSuccess.querySelector('span');

    const joueur = section.querySelectorAll('.col-joueur')[vainqueur];
    const {name} = joueur.dataset;

    setTimeout(function() {
        rowSuccess.classList.add('show');
    })

    setTimeout(function() {
        spanOfRowSuccess.innerHTML = name;
    }, 0);
}

function desactiverActions(tour) {
    const typeGame = localStorage.getItem('type-game');

    if ('vs-ai' !== typeGame) return;

    const section = document.querySelector(`section[data-name="game-${typeGame}"]`);
    if (undefined === section) return;

    const joueurs = section.querySelectorAll('.col-joueur');

    for (
        let cursor = 0, cursorMax = joueurs.length;
        cursor < cursorMax;
        cursor++
    ) {
        if (cursor === parseInt(tour)) continue;
        const joueur = joueurs[cursor];
        const actions = joueur.querySelectorAll('.actions button');
        for (
            let cursorActions = 0, cursorMaxActions = actions.length;
            cursorActions < cursorMaxActions;
            cursorActions++
        ) {
            const action = actions[cursorActions];
            setTimeout(function() {
                action.disabled = true;
                action.classList.add('disabled');
            }, 0);
        }
    }

}

function activerActions(tour) {
    const typeGame = localStorage.getItem('type-game');

    if ('vs-ai' !== typeGame) return;

    const section = document.querySelector(`section[data-name="game-${typeGame}"]`);
    if (undefined === section) return;

    const joueurs = section.querySelectorAll('.col-joueur');

    for (
        let cursor = 0, cursorMax = joueurs.length;
        cursor < cursorMax;
        cursor++
    ) {
        if (cursor !== parseInt(tour)) continue;
        const joueur = joueurs[cursor];
        const actions = joueur.querySelectorAll('.actions button');
        for (
            let cursorActions = 0, cursorMaxActions = actions.length;
            cursorActions < cursorMaxActions;
            cursorActions++
        ) {
            const action = actions[cursorActions];
            setTimeout(function() {
                action.disabled = false;
                action.classList.remove('disabled');
            });
        }
    }

}

document.addEventListener('DOMContentLoaded', event => {
    initializeIntroductionsButtons();
})