import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// your Firebase config
export const firebaseConfig = {
    apiKey: "AIzaSyCvrdV_Qsqf8DJmnaojy1--kEnzwgVNw0Y",
    authDomain: "add-to-cart-e0a49.firebaseapp.com",
    databaseURL: "https://add-to-cart-e0a49-default-rtdb.firebaseio.com",
    projectId: "add-to-cart-e0a49",
    storageBucket: "add-to-cart-e0a49.firebasestorage.app",
    messagingSenderId: "814344039065",
    appId: "1:814344039065:web:7766b0521fefe307b6e608",
};

// init app + auth
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// ui refs
const signedOutView = document.getElementById("signedOutView");
const appView = document.getElementById("appView");
const signInBtn = document.getElementById("signInBtn");
const userEl = document.getElementById("user");
const topBar = document.getElementById("topBar");
const welcomeText = document.getElementById("welcomeText");
const signOutBtn = document.getElementById("signOutBtn"); // 

// actions
signInBtn?.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (e) {
        console.error(e);
        alert("Sign-in failed");
    }
});

signOutBtn?.addEventListener("click", () => signOut(auth));

// toggle views
onAuthStateChanged(auth, (user) => {
    if (user) {
        const firstName = user.displayName?.split(" ")[0] || "there";
        if (welcomeText) welcomeText.textContent = `Welcome back, ${firstName}`;

        signedOutView?.classList.add("hidden");
        appView?.classList.remove("hidden");

        topBar?.classList.remove("hidden");
        signOutBtn?.classList.remove("hidden");
    } else {
        if (welcomeText) welcomeText.textContent = "KittyCart 🐾";

        appView?.classList.add("hidden");
        signedOutView?.classList.remove("hidden");

        topBar?.classList.add("hidden");
    }
});


