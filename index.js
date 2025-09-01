import { app, auth } from "./auth.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove,
    off,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// DB + UI
const database = getDatabase(app);
const inputField = document.getElementById("input-field");
const addButtonElement = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");

// We'll set these when the user is known
let itemsInDB = null;          // ref to /users/<uid>/items
let itemsCallback = null;      // current onValue handler
let currentUid = null;         // used by remove()

// Add item 
addButtonElement?.addEventListener("click", function () {
    const inputValue = (inputField?.value || "").trim();
    if (!inputValue || !itemsInDB) return;

    push(itemsInDB, inputValue);
    clearInputField();
});

// Live list (render logic unchanged)
function startListening() {
    if (!itemsInDB) return;

    itemsCallback = (snapshot) => {
        if (snapshot.exists()) {
            const itemsArray = Object.entries(snapshot.val());

            clearShoppingList();

            for (let i = 0; i < itemsArray.length; i++) {
                const currentItem = itemsArray[i];
                addItemToShoppingList(currentItem);   // same helper
            }
        } else {
            if (shoppingList) {
                shoppingList.innerHTML = "<p>No items here... yet</p>";
            }
        }
    };

    onValue(itemsInDB, itemsCallback);
}

function stopListening() {
    if (itemsInDB && itemsCallback) {
        off(itemsInDB, "value", itemsCallback);  // prevent duplicate listeners
    }
    itemsInDB = null;
    itemsCallback = null;
    currentUid = null;
    clearShoppingList();
    clearInputField();
}

// Helpers
function clearInputField() {
    if (inputField) inputField.value = "";
}

function addItemToShoppingList(item) {
    const itemId = item[0];
    const itemValue = item[1];

    const newElement = document.createElement("li");
    newElement.textContent = itemValue;

    newElement.addEventListener("click", function () {
        if (!currentUid) return;
        const exactLocationOfItemInDB = ref(database, `users/${currentUid}/items/${itemId}`);
        remove(exactLocationOfItemInDB);
    });

    shoppingList?.appendChild(newElement);
}

function clearShoppingList() {
    if (shoppingList) shoppingList.innerHTML = "";
}

// When auth changes, point ref to the right user path and (re)attach the listener
onAuthStateChanged(auth, (user) => {
    // clean up previous listeners/refs
    stopListening();

    if (!user) return; // signed out: keep UI cleared

    currentUid = user.uid;
    itemsInDB = ref(database, `users/${currentUid}/items`);
    startListening();
});
