import { initializeApp } from "firebase/app";
import { getDatabase, get, set, ref, child } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword  } from "firebase/auth";
import { Question } from "./question";

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


const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");
const regErrorMsg = document.getElementById("signup-msg");
const modalWindow = document.getElementById("exampleModal");
const signOut = document.getElementById("signOutBtn") 
const userAccName = document.querySelector(".author")

signOut.addEventListener('click', userSignOut)
//при передаче email на базу эта функция все не допустимые знаки меняет на допустимый
function encodeEmail(email) {
  return email.replace(/[.,#$[\]]/g, "_");
}

function regFormHandler(event) {
  event.preventDefault();
  // Проверяем существование пользователя в базе данных по email
  get(ref(db, "AuthUserList/" + encodeEmail(userEmail.value))).then(() => {
    return createUserWithEmailAndPassword(
      auth,
      userEmail.value,
      userPassword.value
    )
      .then((credentials) => {
        const uid = credentials.user.uid;
        // Сохраняем информацию о пользователе в базу данных
        set(ref(db, "AuthUserList/" + uid), {
          useruid: uid,
          userName: userName.value,
          userEmail: userEmail.value,
        })
          .then(() => {
            localStorage.setItem("uid", JSON.stringify(uid));
          })
          .then(() => {
            modalWindow.classList.remove("show");
            const backdropElements =
              document.querySelectorAll(".modal-backdrop");
            backdropElements.forEach((backdropElement) => {
              backdropElement.parentNode.removeChild(backdropElement);
            });
            userAcc()
            console.log("work");
            console.log("dont work");
          })
          .catch((error) => {
            console.error("Ошибка сохранения данных пользователя:", error);
          })
          .catch((error) => {
            console.log("ошибка получения вопрсов:", error);
          });
      })
      .catch((error) => {
        regErrorMsg.innerHTML = `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M175.999 63.466C161.066 70.4 154.666 78.4 154.666 90c0 7.6 1.2 10 17.467 34 14.666 21.866 19.066 25.6 30.533 25.6 7.733 0 18.667-5.467 23.467-11.6 3.866-5.067 5.866-14 4.533-19.734-1.333-6-19.333-43.066-23.467-48.666-4.133-5.334-12.533-9.6-19.2-9.6-2.533 0-8 1.6-12 3.466zM484.534 62.533c-3.067 1.333-7.067 4.533-8.934 7.066-4.266 5.467-22.133 42.534-23.6 48.667-4.8 20.267 21.467 38.667 40.134 28.133 4.266-2.4 8.266-7.333 18.4-22.4 16.266-24 17.466-26.4 17.466-34 0-11.6-6.4-19.6-21.333-26.533-8.667-4.133-14.667-4.267-22.133-.933zM327.866 100.533c-7.6 2-17.333 7.6-22.933 13.2-5.734 5.867-31.067 39.734-54.4 73.067C176.666 292 110.133 411.733 60.799 528l-8.133 19.333v14c0 13.067.267 14.534 4.267 22.8 7.6 15.467 22.533 26.534 40 29.2 4.266.667 28.8 2.4 54.4 4 135.6 7.867 245.333 7.067 384.666-2.666 47.867-3.467 55.734-4.534 65.067-8.934 16-7.6 28-25.2 29.333-43.2.8-11.466-.8-17.466-10-39.2C571.199 407.867 505.333 290 430.933 184c-24.134-34.267-50.4-68.667-55.734-72.8-14.133-11.2-31.2-15.067-47.333-10.667zm30.4 139.334c8.533 1.6 14.667 6.4 18.667 14.666l3.6 7.2V391.6l-3.6 7.2c-6 12.133-13.867 15.733-35.2 15.867-14.934 0-23.6-2-29.2-6.934-9.6-8.533-9.2-4.666-9.2-81.066 0-62.134.266-69.067 2.266-72.8 3.467-6.267 11.067-12.267 16.667-13.2 2.8-.534 5.733-1.067 6.4-1.334 2.667-.933 24.133-.533 29.6.534zm8 221.066c8.667 4.534 12.4 10.667 14 22.534 2 15.733.4 41.866-2.933 48.4-6 11.733-17.6 15.733-42.4 14.266-16.267-.933-22.534-3.6-27.867-11.733-3.733-5.467-3.733-5.867-4.133-29.6-.534-25.333.266-31.2 5.2-37.333 6.266-8 15.066-10.134 37.6-9.467 12.133.267 16.666.933 20.533 2.933z" fill="#FF2828"/><path d="M347.5 100.5c-6.5 2.955-18.799 18.733-24.399 24.333-5.733 5.867-18.166 20.167-41.5 53.5C215.435 286.5 200.935 311 134.435 432l-37.9 84L81.5 546.5c0 13.067-.498 45.167 18.935 57.5 4.266.667 24.899 12.066 50.499 13.666 135.6 7.867 245.333 7.067 384.667-2.666 47.866-3.467 55.733-4.534 65.067-8.934 16-7.6 28-25.2 29.333-43.2.8-11.466-.8-17.466-10-39.2-49.2-115.466-115.067-233.333-189.467-339.333C406.401 150.066 380.5 114.808 375 111c-13-9-21-13.454-27.5-10.5zm10.367 139.7c8.534 1.6 14.667 6.4 18.667 14.666l3.6 7.2V391.933l-3.6 7.2c-6 12.133-13.867 15.733-35.2 15.867-14.933 0-23.6-2-29.2-6.934-9.6-8.533-9.2-4.666-9.2-81.066 0-62.134.267-69.067 2.267-72.8 3.466-6.267 11.066-12.267 16.666-13.2 2.8-.534 5.734-1.067 6.4-1.334 2.667-.933 24.134-.533 29.6.534zm8 221.066c8.667 4.534 12.4 10.667 14 22.534 2 15.733.4 41.866-2.933 48.4-6 11.733-17.6 15.733-42.4 14.266-16.267-.933-22.533-3.6-27.867-11.733-3.733-5.467-3.733-5.867-4.133-29.6-.533-25.333.267-31.2 5.2-37.333 6.267-8 15.067-10.134 37.6-9.467 12.133.267 16.667.933 20.533 2.933z" fill="#FF7582"/><path d="M63.6 174.666c-6.534 2-12.667 7.867-17.867 17.067-7.6 13.6-6.533 24.666 3.2 33.866 6.133 5.734 48 25.067 54.4 25.067 16.533 0 31.067-19.733 26-35.333-2.533-7.734-7.333-12.267-27.867-25.867-24-16.133-28.133-17.733-37.866-14.8zM604.667 174.933c-6.4 2.4-42.534 27.067-46.267 31.6-7.733 9.2-8 20.267-.667 31.6 2.8 4.267 6.267 7.6 10.267 9.467 9.867 5.066 14.133 4.266 39.333-7.734C636.8 226 641.6 221.333 641.867 207.2c0-5.6-.934-8.4-5.2-15.867-3.334-5.733-7.334-10.667-10.667-12.933-6.133-4.267-15.333-5.734-21.333-3.467zM18.533 332c-6 1.733-10.533 5.6-14.133 11.733-3.067 5.2-3.6 7.6-3.6 16.8.133 16 5.466 24.934 17.466 28.934 7.6 2.533 52.534-.8 60.134-4.4 18.8-8.934 19.466-38.667.933-48.267-4.133-2.133-10-3.067-27.333-4.4-25.2-1.867-28.667-1.867-33.467-.4zM628.667 332.4c-22.4 1.866-28.4 3.866-33.734 11.6-6.933 10.266-6.8 24.666.267 34 6.133 7.866 12 9.6 39.6 11.466 19.2 1.2 25.867 1.2 29.6 0 12-4 17.333-12.933 17.467-28.933 0-9.333-.534-11.6-3.6-16.8-7.2-12.4-14.4-14.133-49.6-11.333z" fill="#FF2828"/></svg><span>${errorMsg[error.code]||'Произошла ошибка'}</span>`
      });
  });
}

export { regFormHandler };

const errorMsg = {
  'auth/email-already-in-use': 'Этот email уже используется',
  'auth/invalid-email': 'Некорректный email',
  'auth/operation-not-allowed': 'Операция не разрешена',
  'auth/weak-password': 'Слабый пароль(пароль должен состоять из более 6 символов)',
  'auth/invalid-login-credentials': 'Вы ввели неправильный пароль или email',
  'auth/user-not-found': 'Пользователь с таким email не найден'
}

function userAcc() {
  signOut.style.display = "block"
  userAccName.innerHTML = `<span>${userName.value}</span>`
  userSignOut()
  
}

function userSignOut() {
  console.log('user ущел')
}


const loginErrorMsg = document.getElementById("signin-msg");
const email = document.getElementById("email");
const password = document.getElementById("password");


function signInUser(event) {
  event.preventDefault();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((credentials) => {
      //получаем пользователя из базы данных из ветки AuthUserList
      return (
        get(child(dbref, "AuthUserList/" + credentials.user.uid))
          //дальше выполняем проверку наличия полтзователя
          .then((snapshot) => {
            if (snapshot.exists) {
              //при успешном авторизации в user сохраняем данные пользователя которые нам возвращает промис чтобы получить токен
              const user = credentials.user;
              console.log("user", credentials);
              //при успешной авторизации данные плтзователя сохпаняем в localstorage
              localStorage.setItem("user-creds", JSON.stringify({
                userName: snapshot.val().userName
              } 
              ))
              //Здесь .then((idToken) => {...}) обрабатывает результат вызова getIdToken(). Когда промис разрешается, он передает значение idToken в следующий блок .then()
                return user.getIdToken().then((idToken) => {
                  return Question.getQuestions(idToken);
                })  
            }
            // setInterval(Question.getQuestions(idToken), 3000)
          })
      );
    })
    //далее обрабатываем данные (вопросы) которые мы получили с базы realtime firebase
    .then(() => {
      modalWindow.classList.remove("show");
      const backdropElements = document.querySelectorAll(".modal-backdrop");
      backdropElements.forEach((backdropElement) => {
        backdropElement.parentNode.removeChild(backdropElement);
      });
      // const myModal = document.getElementById('modal-open')
      // myModal.style = 'remove'

      // const bacdrop = document.querySelector('.modal-backdrop')
      // bacdrop
      console.log("work");
      console.log("dont work");
    })
    .catch((error) => {
    loginErrorMsg.innerHTML = `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M175.999 63.466C161.066 70.4 154.666 78.4 154.666 90c0 7.6 1.2 10 17.467 34 14.666 21.866 19.066 25.6 30.533 25.6 7.733 0 18.667-5.467 23.467-11.6 3.866-5.067 5.866-14 4.533-19.734-1.333-6-19.333-43.066-23.467-48.666-4.133-5.334-12.533-9.6-19.2-9.6-2.533 0-8 1.6-12 3.466zM484.534 62.533c-3.067 1.333-7.067 4.533-8.934 7.066-4.266 5.467-22.133 42.534-23.6 48.667-4.8 20.267 21.467 38.667 40.134 28.133 4.266-2.4 8.266-7.333 18.4-22.4 16.266-24 17.466-26.4 17.466-34 0-11.6-6.4-19.6-21.333-26.533-8.667-4.133-14.667-4.267-22.133-.933zM327.866 100.533c-7.6 2-17.333 7.6-22.933 13.2-5.734 5.867-31.067 39.734-54.4 73.067C176.666 292 110.133 411.733 60.799 528l-8.133 19.333v14c0 13.067.267 14.534 4.267 22.8 7.6 15.467 22.533 26.534 40 29.2 4.266.667 28.8 2.4 54.4 4 135.6 7.867 245.333 7.067 384.666-2.666 47.867-3.467 55.734-4.534 65.067-8.934 16-7.6 28-25.2 29.333-43.2.8-11.466-.8-17.466-10-39.2C571.199 407.867 505.333 290 430.933 184c-24.134-34.267-50.4-68.667-55.734-72.8-14.133-11.2-31.2-15.067-47.333-10.667zm30.4 139.334c8.533 1.6 14.667 6.4 18.667 14.666l3.6 7.2V391.6l-3.6 7.2c-6 12.133-13.867 15.733-35.2 15.867-14.934 0-23.6-2-29.2-6.934-9.6-8.533-9.2-4.666-9.2-81.066 0-62.134.266-69.067 2.266-72.8 3.467-6.267 11.067-12.267 16.667-13.2 2.8-.534 5.733-1.067 6.4-1.334 2.667-.933 24.133-.533 29.6.534zm8 221.066c8.667 4.534 12.4 10.667 14 22.534 2 15.733.4 41.866-2.933 48.4-6 11.733-17.6 15.733-42.4 14.266-16.267-.933-22.534-3.6-27.867-11.733-3.733-5.467-3.733-5.867-4.133-29.6-.534-25.333.266-31.2 5.2-37.333 6.266-8 15.066-10.134 37.6-9.467 12.133.267 16.666.933 20.533 2.933z" fill="#FF2828"/><path d="M347.5 100.5c-6.5 2.955-18.799 18.733-24.399 24.333-5.733 5.867-18.166 20.167-41.5 53.5C215.435 286.5 200.935 311 134.435 432l-37.9 84L81.5 546.5c0 13.067-.498 45.167 18.935 57.5 4.266.667 24.899 12.066 50.499 13.666 135.6 7.867 245.333 7.067 384.667-2.666 47.866-3.467 55.733-4.534 65.067-8.934 16-7.6 28-25.2 29.333-43.2.8-11.466-.8-17.466-10-39.2-49.2-115.466-115.067-233.333-189.467-339.333C406.401 150.066 380.5 114.808 375 111c-13-9-21-13.454-27.5-10.5zm10.367 139.7c8.534 1.6 14.667 6.4 18.667 14.666l3.6 7.2V391.933l-3.6 7.2c-6 12.133-13.867 15.733-35.2 15.867-14.933 0-23.6-2-29.2-6.934-9.6-8.533-9.2-4.666-9.2-81.066 0-62.134.267-69.067 2.267-72.8 3.466-6.267 11.066-12.267 16.666-13.2 2.8-.534 5.734-1.067 6.4-1.334 2.667-.933 24.134-.533 29.6.534zm8 221.066c8.667 4.534 12.4 10.667 14 22.534 2 15.733.4 41.866-2.933 48.4-6 11.733-17.6 15.733-42.4 14.266-16.267-.933-22.533-3.6-27.867-11.733-3.733-5.467-3.733-5.867-4.133-29.6-.533-25.333.267-31.2 5.2-37.333 6.267-8 15.067-10.134 37.6-9.467 12.133.267 16.667.933 20.533 2.933z" fill="#FF7582"/><path d="M63.6 174.666c-6.534 2-12.667 7.867-17.867 17.067-7.6 13.6-6.533 24.666 3.2 33.866 6.133 5.734 48 25.067 54.4 25.067 16.533 0 31.067-19.733 26-35.333-2.533-7.734-7.333-12.267-27.867-25.867-24-16.133-28.133-17.733-37.866-14.8zM604.667 174.933c-6.4 2.4-42.534 27.067-46.267 31.6-7.733 9.2-8 20.267-.667 31.6 2.8 4.267 6.267 7.6 10.267 9.467 9.867 5.066 14.133 4.266 39.333-7.734C636.8 226 641.6 221.333 641.867 207.2c0-5.6-.934-8.4-5.2-15.867-3.334-5.733-7.334-10.667-10.667-12.933-6.133-4.267-15.333-5.734-21.333-3.467zM18.533 332c-6 1.733-10.533 5.6-14.133 11.733-3.067 5.2-3.6 7.6-3.6 16.8.133 16 5.466 24.934 17.466 28.934 7.6 2.533 52.534-.8 60.134-4.4 18.8-8.934 19.466-38.667.933-48.267-4.133-2.133-10-3.067-27.333-4.4-25.2-1.867-28.667-1.867-33.467-.4zM628.667 332.4c-22.4 1.866-28.4 3.866-33.734 11.6-6.933 10.266-6.8 24.666.267 34 6.133 7.866 12 9.6 39.6 11.466 19.2 1.2 25.867 1.2 29.6 0 12-4 17.333-12.933 17.467-28.933 0-9.333-.534-11.6-3.6-16.8-7.2-12.4-14.4-14.133-49.6-11.333z" fill="#FF2828"/></svg><span>${errorMsg[error.code]||'Произошла ошибка'}</span>`
    })
    .catch((error) => {
      console.log("ошибка закрытия модального окна", error.message);
    });
}


export { signInUser };