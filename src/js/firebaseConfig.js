import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyB4omcKQ0OYERr2K-Ufd4xAmf_yl4o_V-U",
  authDomain: "podcast-questions-19424.firebaseapp.com",
  databaseURL:
    "https://podcast-questions-19424-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "podcast-questions-19424",
  storageBucket: "podcast-questions-19424.appspot.com",
  messagingSenderId: "962804388469",
  appId: "1:962804388469:web:c34ea30c7b7c65ddca9e3c",
};
const app = initializeApp(firebaseConfig)
export {app}