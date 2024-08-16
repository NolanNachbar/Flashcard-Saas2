import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDZdswwPjgGOHj5zIj9ZdlrywQQMS-HtuM",
    authDomain: "flashcard-saas-a1e0d.firebaseapp.com",
    projectId: "flashcard-saas-a1e0d",
    storageBucket: "flashcard-saas-a1e0d.appspot.com",
    messagingSenderId: "62059887999",
    appId: "1:62059887999:web:3fb4a259b1997b99732e4a",
    measurementId: "G-50QEXG310W"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
