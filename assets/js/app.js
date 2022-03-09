'use strict';
import { storage as Storage } from './storage.js'

let currentCardOwner = "";
let currentCardColor = "default";



const hero = {
    container: document.querySelector('main.hero'),
    nameInput: document.querySelector('input#fullname'),
    nameInputErrorMessage: document.querySelector('.input-error-message'),
    saveDraftButton: document.querySelector('.btn-draft'),
    disableButtons: () => {
        let enabledButtons = [...$('main.hero .btn-action').get()]
        enabledButtons.forEach((button) => button.classList.add('disabled'))
    },
    enableButtons: () => {
        let disabledButtons = [...$('main.hero .btn-action.disabled').get()]
        disabledButtons.forEach((button) => button.classList.remove('disabled'))
    },
    heroColors: document.querySelector('.hero-colors')
}
const card = {
    front: document.querySelector('.card-front'),
    verse: document.querySelector('.card-verse'),
    rotateCardButton: document.querySelector('.rotate-btn'),
}
const drafts = {
    container: $(".drafts").get(0),
    list: $(".drafts-list").get(0)
}


// === HANDLE NAME CHANGE
const handleCardOwnerChange = event => {
    let nameInputVale = hero.nameInput.value;

    if (!nameInputVale || nameInputVale.split(" ").length < 2) {
        hero.nameInputErrorMessage.innerText = "Insira um nome válido!"
        hero.nameInputErrorMessage.style.opacity = 1;
        hero.disableButtons()
        return;
    }

    currentCardOwner = nameInputVale.toUpperCase();
    hero.enableButtons()


    // hidden error message
    // hero.nameInputErrorMessage.innerText = ""
    hero.nameInputErrorMessage.style.opacity = 0;


    // change card owner name
    document.querySelector('.card-verse .card-owner').innerHTML = currentCardOwner.toUpperCase();
}


$(hero.nameInput).bind('keyup', handleCardOwnerChange);


// === HANDLE CARD COLOR CHANGE
const handleCardColorChange = event => {
    const { target: color } = event;

    if (color.classList.contains('color-select')) {

        const { cardColor: selectedColor } = color.dataset;
        const [card, cardVerse] = [
            document.querySelector('.card'),
            document.querySelector('.card-verse')
        ];

        card.classList.replace(`card-${currentCardColor}`, `card-${selectedColor}`)
        cardVerse.classList.replace(`card-${currentCardColor}`, `card-${selectedColor}`)


        currentCardColor = selectedColor
    }

}
$(hero.heroColors).bind('click', handleCardColorChange)

// ===  CARD FRONT/VERSE ALTERNATE
const handleCardRotate = event => {
    const activeCard = document.querySelector(`.card.is-active.card-${currentCardColor}`);


    if (activeCard.classList.contains('card-front')) {
        const cardVerse = document.querySelector(`.card.card-verse.card-${currentCardColor}`);
        activeCard.classList.remove('is-active');
        cardVerse.classList.add('is-active');
    } else if (activeCard.classList.contains('card-verse')) {
        const cardFront = document.querySelector(`.card.card-front.card-${currentCardColor}`);
        activeCard.classList.remove('is-active');
        cardFront.classList.add('is-active');
    }
}

$(card.rotateCardButton).bind('click', handleCardRotate);


// SAVE CARD DRAFT

$(hero.saveDraftButton).bind("click", (event) => {
    let currentColor = currentCardColor;
    let cardOwner = currentCardOwner;


    Storage.createCardDraft({
        cardColor: currentColor,
        cardOwner
    });

    mountDraftsList();
});


// LIST SAVED DRAFTS
const mountDraftsList = () => {
    let draftsList = drafts.list
    let savedDrafts = Storage.getDrafts()

    let mountedComponent = "" // mounted list


    savedDrafts.forEach((draft) => {
        let mountedItem = `
            <li class="draft-item" key="${draft.id}">
                <img src="assets/images/card-${draft.cardColor}.png" alt="Card Picture" decoding="async" loading="lazy" class="draft-image">
                <span class="draft-owner">${draft.cardOwner}</span>
                <span class="draft-date">${new Date(draft.date).toLocaleDateString()}</span>
                <div class="draft-overlay">
                    <div class="overlay-content">
                        <button class="primary-button recover-btn" onclick="recoverDraft(${draft.id})">Recuperar</button>
                        <button class="primary-button delete-btn" onclick="deleteDraft(${draft.id})">Deletar</button>
                    </div>
                </div>
            </li>`

        mountedComponent += mountedItem;
    })



    $(draftsList).html(mountedComponent)

}


// RECOVER DRAFT
const recoverDraft = (draftId) => {
    let draft = Storage.getCardDraft(draftId);
    return draft;
}


const deleteDraft = (draftId) => {
    Storage.removeCardDraft(draftId);
    mountDraftsList();
}

window.recoverDraft = recoverDraft;
window.deleteDraft = deleteDraft;


// **
mountDraftsList();