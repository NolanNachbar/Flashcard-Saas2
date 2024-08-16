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
export default db;



// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDZdswwPjgGOHj5zIj9ZdlrywQQMS-HtuM",
//   authDomain: "flashcard-saas-a1e0d.firebaseapp.com",
//   projectId: "flashcard-saas-a1e0d",
//   storageBucket: "flashcard-saas-a1e0d.appspot.com",
//   messagingSenderId: "62059887999",
//   appId: "1:62059887999:web:3fb4a259b1997b99732e4a",
//   measurementId: "G-50QEXG310W"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);