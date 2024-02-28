// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAGslWF5YlvpB95rWrDzSjjetl7KGAf9Do",
    authDomain: "pesto-project.firebaseapp.com",
    projectId: "pesto-project",
    storageBucket: "pesto-project.appspot.com",
    messagingSenderId: "356187512329",
    appId: "1:356187512329:web:33252cd68594bb431462d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };


