export class TypingGame {

    dynamicValues;
    dynamicValuesElement;
    secondsLimit;
    score;

    words;

    constructor({secondsLimit = 10} = {}) {

        const score = 0;

        this.score = score;

        this.dynamicValues = {};
        this.dynamicValues['secondes-restantes'] = secondsLimit;
        this.dynamicValues['status'] = "Bonjour !";
        this.dynamicValues['score'] = score;

        this.dynamicValuesElement = document.querySelectorAll('span[data-dynamic]');
        this.secondsLimit = secondsLimit;

        this.words = [];
        this.initializeWords();

        this.updateDynamicValues();

    }

    updateDynamicValues() {
        const names = Object.keys(this.dynamicValues);
        const values = Object.values(this.dynamicValues);
        for (
            let cursor = 0, cursorMax = names.length;
            cursor < cursorMax;
            cursor++
        ) {
            const name = names[cursor];
            this.updateDynamicValue(name);
        }
    }

    updateDynamicValue(name) {
        const value = this.dynamicValues[name];
        const dynamicValueElements = document.querySelectorAll(`span[data-dynamic][data-name="${name}"]`)
        for (
            let cursorElement = 0, cursorMaxElement = dynamicValueElements.length;
            cursorElement < cursorMaxElement;
            cursorElement++
        ) {
            const element = dynamicValueElements[cursorElement];
            console.log({cursorElement, dynamicValueElements, element})
            element.innerHTML = value;
        }
    }

    initializeWords() {
        let words = [];

        fetch('/assets/texts/sentences.txt').then(response => {
            return response.text();
        }).then(response => {
            console.log({response});
            response = response.replace(/,/ig, ' ');
            response = response.replace(/\./ig, ' ');
            response = response.replace(/\r/ig, ' ');
            response = response.replace(/\n/ig, ' ');
            return response.split(' ');
        }).then(_words => {
            for (
                let cursor = 0, cursorMax = _words.length;
                cursor < cursorMax;
                cursor++
            ) {
                let word = _words[cursor];

                word = word.replace(/,/, ' ');
                word = word.replace(/\./, ' ');

                if ('' === word) continue;

                const hasNumber = /[0-9]/ig.test(word);
                if (true === hasNumber) continue;

                const hasSingleQuote = /’/ig.test(word);
                if (true === hasSingleQuote) {
                    const indexOfSingleQuote = word.indexOf("’");
                    word = word.slice(indexOfSingleQuote + 1);
                }

                words.push(word.toLowerCase());
            }
        }).finally(() => {
            words = words.filter(function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            });
            this.words = words;
            this.start();
        })
    }

    start() {
        console.log('Game starting !', {thisWords: this.words});
        this.startCountdown();
    }

    startCountdown() {
        this._countdownInterval();
    }

    _countdownInterval() {
        const secondsRemaining = this.dynamicValues['secondes-restantes'] - 1;
        this.dynamicValues['secondes-restantes'] = secondsRemaining;
        this.updateDynamicValue('secondes-restantes');

        console.log({secondsRemaining});
        if (0 === secondsRemaining) {
            this.dynamicValues['status'] = 'Game over !';
            this.updateDynamicValue('status');
            return;
        }

        if (7 === secondsRemaining) {
            this.dynamicValues['status'] = 'Pas assez vite !';
            this.updateDynamicValue('status');
        }

        if (5 === secondsRemaining) {
            this.dynamicValues['status'] = 'On se rapproche de la fin !';
            this.updateDynamicValue('status');
        }

        if (2 === secondsRemaining) {
            this.dynamicValues['status'] = 'Dépêchez-vous !';
            this.updateDynamicValue('status');
        }

        setTimeout(() => this._countdownInterval(), 1000);
    }

}