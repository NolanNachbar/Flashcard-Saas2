// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// const firebaseConfig = {
//   apiKey: "AIzaSyDMoA9_aMTczulXOmnk_-9XoniumyXSo5k",
//   authDomain: "flashcards-64c26.firebaseapp.com",
//   projectId: "flashcards-64c26",
//   storageBucket: "flashcards-64c26.appspot.com",
//   messagingSenderId: "301912824098",
//   appId: "1:301912824098:web:b22829926bdccde23b2d7b",
//   measurementId: "G-B1RFXM52Q8"
// };

//  note that this isn't ours
const firebaseConfig = {
  apiKey: "AIzaSyBaKheB_Ab_yH1YiiVD4Q_XdURIy7AcboY",
  authDomain: "brain-wave-ai.firebaseapp.com",
  projectId: "brain-wave-ai",
  storageBucket: "brain-wave-ai.appspot.com",
  messagingSenderId: "862509130161",
  appId: "1:862509130161:web:27a658b68a252df1d59d90",
  measurementId: "G-B5C5FH0H6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export {db, analytics} 