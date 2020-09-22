export function generateModalEndGame() {
    let template = document.createElement('template');
    return fetch('html/components/my-modal/modal-end-game.html')
        .then(response => {
            return response.text();
        }).then(response => {
            template.innerHTML = response;
            return template.content.firstChild;
        });
}