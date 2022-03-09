const STORAGE_ITEM_KEY = "cards_drafts";
const INITIAL_STORAGE_VALUE = [];

if (!localStorage.getItem(STORAGE_ITEM_KEY)) {
    localStorage.setItem(STORAGE_ITEM_KEY, JSON.stringify(INITIAL_STORAGE_VALUE));
}


const getStorage = () => {
    return JSON.parse(localStorage.getItem(STORAGE_ITEM_KEY));
}

const setStorage = (data) => {
    localStorage.setItem(STORAGE_ITEM_KEY, JSON.stringify(data));
}

// C
const createCardDraft = ({ cardColor, cardOwner }) => {
    if (!cardColor, !cardOwner) return;

    const newCard = {
        id: Math.floor(Math.random() * 9999) + 1000,
        cardColor,
        cardOwner,
        date: new Date().getTime()
    }

    const currentDrafts = getStorage()

    const newDrafts = [...currentDrafts, newCard];

    setStorage(newDrafts)
    return;
}

// R
const getCardDraft = (draftId) => {
    const currentDrafts = getStorage()
    return currentDrafts.find((draft) => draft.id == draftId);
}

// U
const editCardDrat = (draftId) => {}

// D
const removeCardDraft = (draftId) => {
    let currentDrafts = getStorage()

    let draftsWithException = currentDrafts.filter((draft) => draft.id != draftId);

    let newDrafts = [...draftsWithException]

    setStorage(newDrafts);

    return;
}

const storage = {
    createCardDraft,
    removeCardDraft,
    getCardDraft,
    editCardDrat,
    getDrafts: getStorage
}


export { storage }