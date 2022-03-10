'use strict';
import { storage as Storage } from './storage.js'

let currentCardOwner = "";
let currentCardColor = "default";
let currentDraft = {}



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
    container: document.querySelector('.drafts'),
    list: document.querySelector('.drafts-list')
}


// === HANDLE NAME CHANGE

const changeCardOwner = (name) => {
    document.querySelector('.card-verse .card-owner').innerHTML = name.toUpperCase();
}
const handleCardOwnerChange = event => {
    let nameInputValue = hero.nameInput.value;

    if (!nameInputValue || nameInputValue.split(" ").length < 2) {
        hero.nameInputErrorMessage.innerText = "Insira um nome válido!"
        hero.nameInputErrorMessage.style.opacity = 1;
        hero.disableButtons()
        return;
    }

    currentCardOwner = nameInputValue.toUpperCase();
    hero.enableButtons()


    // hidden error message
    hero.nameInputErrorMessage.style.opacity = 0;


    // update card owner name
    changeCardOwner(currentCardOwner)
}


$(hero.nameInput).bind('keyup', handleCardOwnerChange);


// === HANDLE CARD COLOR CHANGE
const changeCardColor = (colorIdentifier) => {

    const [card, cardVerse] = [
        document.querySelector('.card'),
        document.querySelector('.card-verse')
    ];

    card.classList.replace(`card-${currentCardColor}`, `card-${colorIdentifier}`)
    cardVerse.classList.replace(`card-${currentCardColor}`, `card-${colorIdentifier}`)

    currentCardColor = colorIdentifier
}

const handleCardColorChange = event => {
    const { target: color } = event;

    if (color.classList.contains('color-select')) {

        const { cardColor: selectedColor } = color.dataset;
        changeCardColor(selectedColor)
    }

}
$(hero.heroColors).bind('click', handleCardColorChange)

// ===  CARD FRONT/VERSE ALTERNATE
let shouldShowCardFront = false;
const handleCardRotate = event => {
    const activeCard = document.querySelector(`.card.is-active.card-${currentCardColor}`);

    if (!shouldShowCardFront) {
        const cardVerse = document.querySelector(`.card.card-verse.card-${currentCardColor}`);
        activeCard.classList.remove('is-active');
        cardVerse.classList.add('is-active');
    } else if (shouldShowCardFront) {
        const cardFront = document.querySelector(`.card.card-front.card-${currentCardColor}`);
        activeCard.classList.remove('is-active');
        cardFront.classList.add('is-active');
    }
    shouldShowCardFront = !shouldShowCardFront;
}

$(card.rotateCardButton).bind('click', handleCardRotate);


// SAVE CARD DRAFT
const handleSaveOrEditDraft = (ev) => {
    let currentColor = currentCardColor;
    let cardOwner = currentCardOwner;

    if (!currentColor || !cardOwner) return;

    if (currentDraft.id) {
        Storage.editCardDraft(currentDraft.id, {
            cardColor: currentColor,
            cardOwner
        });
    } else {
        Storage.createCardDraft({
            cardColor: currentColor,
            cardOwner
        });
    }

    mountDraftsList();
}
$(hero.saveDraftButton).bind("click", handleSaveOrEditDraft);


// LIST SAVED DRAFTS
const mountDraftsList = () => {
    let draftsList = drafts.list
    let savedDrafts = Storage.getDrafts()

    let mountedComponent = "" // mounted list


    savedDrafts.forEach((draft) => {
        // draft item structure
        let mountedItem = `
            <li class="draft-item" key="${draft.id}">
                <img src="assets/images/card-${draft.cardColor}.png" alt="Card Picture"  class="draft-image">
                <span class="draft-owner">${draft.cardOwner}</span>
                <span class="draft-date">${new Date(draft.date).toLocaleString()}</span>
                <div class="draft-overlay">
                    <div class="overlay-content">
                        <button class="primary-button recover-btn" onclick="recoverDraft(${draft.id})">Recuperar</button>
                        <button class="primary-button delete-btn" onclick="deleteDraft(${draft.id})">Excluir</button>
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
    currentDraft = {...draft };

    changeCardColor(draft.cardColor)
    changeCardOwner(draft.cardOwner)
    hero.nameInput.value = draft.cardOwner;
    hero.enableButtons()
}


const deleteDraft = (draftId) => {
    Storage.removeCardDraft(draftId);
    if (currentDraft.id && currentDraft.id == draftId) {
        currentDraft = {};
    }
    mountDraftsList();
}

window.recoverDraft = recoverDraft;
window.deleteDraft = deleteDraft;


// show drafts list
mountDraftsList();