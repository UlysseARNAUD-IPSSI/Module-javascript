import {TypingGame} from "./TypingGame/index.js";

document.addEventListener('DOMContentLoaded', event => {
    const introductionSection = document.querySelector('section[data-name="introduction"]');
    const links = introductionSection.querySelectorAll('.grid-buttons a');
    for (
        let cursor = 0, cursorMax = links.length;
        cursor < cursorMax;
        cursor++
    ) {
        const link = links[cursor];
        link.addEventListener('click', event => onClickLink(event));
    }
});

function onClickLink(event) {
    event.preventDefault();

    let {target} = event;
    const {nodeName} = target;
    if ('a' !== nodeName.toLowerCase()) target = target.closest('a');

    const {href} = target;

    const introductionSection = document.querySelector('section[data-name="introduction"]');
    const sectionName = href.substring(href.indexOf("#") + 1);

    const section = document.querySelector(`section[data-name="${sectionName}"]`);
    introductionSection.classList.remove('show');

    setTimeout(function() {
        section.classList.add('show');
    }, 0);

    const typingGame = new TypingGame;
}
