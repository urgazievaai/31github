import { app } from "./firebaseConfig";

import { getDatabase, get, set, ref, child } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { Question } from "./question";
import 'core-js/fn/promise';

const provider = new GoogleAuthProvider();
const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);
//регистрация пользователя
const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const userPasswordInput = document.getElementById("userPassword");
const modalWindow = document.getElementById("exampleModal");
const userAccName = document.querySelector(".author");


//обработчик формы регистрации
function regFormHandler(event) {
  //при передаче email на базу эта функция все не допустимые знаки меняет на допустимый
  function encodeEmail(email) {
    return email.replace(/[.,#$[\]]/g, "_");
  }
  const userName = userNameInput.value;
  const userEmail = userEmailInput.value;
  const userPassword = userPasswordInput.value;

  event.preventDefault();
  return validateEmail()

 .then(() => {
  return  createUserWithEmailAndPassword(auth, userEmail, userPassword)
 }) 
 .then((credentials) => {
        const user = credentials.user;
        // Проверяем существование пользователя в базе данных по email
         get(ref(db, "AuthUserList/" + encodeEmail(userEmail)));
        set(ref(db, "AuthUserList/" + user.uid), {
          userUid: user.uid,
          userName: userName,
          userEmail: userEmail,
        });
        localStorage.setItem(
          "user-info",
          JSON.stringify({
            userUid: user.uid,
            userName: userName,
          })
        );
        userAccName.innerHTML = `<span>${userName}</span>`;
      })
      .then(() => {
        removeBg();
      })
      .catch((error) => {
        if(error.code ===  "auth/email-already-in-use"){
          setError(userEmailInput, "Этот email уже используется")
        } else if (error.code ===  "auth/invalid-email"){
          setError(userEmailInput, "Некорректный email")
        } else if (error.code ===  "auth/invalid-login-credentials"){
          setError(userEmailInput, "Вы ввели неправильный пароль или email")
        } else if (error.code ===  "auth/user-not-found"){
          setError(userEmailInput, "Пользователь с таким email не найден")
        }  else if (error.code ===  "auth/weak-password"){
          setError(userPasswordInput, "пароль должен содержать более 6 символов")
        } else {console.error(error, "Произошла ошибка")}
        
      })
}
export { regFormHandler };

//валидация инпутов
const isValidEmail = email => {
  const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

  return re.test(email)
}

const setError = (element, message) => {
  const inputControl = element.parentElement
  const errorDisplay = inputControl.querySelector('.error')

  errorDisplay.innerText = message
  inputControl.classList.add("error")
  inputControl.classList.remove("success")
}

const setSuccess = (element) => {
  const inputControl = element.parentElement
  const errorDisplay = inputControl.querySelector('.error')

  errorDisplay.innerText = "";
  inputControl.classList.add("success")
  inputControl.classList.remove("error")
}

const validateEmail = () => {
  return new Promise ((resolve, reject) => {
    const userNameValue = userNameInput.value.trim();
    const userEmailValue = userEmailInput.value.trim()
    const userPasswordValue = userPasswordInput.value.trim()
  
    if(userNameValue === "") {
      setError(userNameInput, "введите имя пользователя")
      console.log( "ошибка введите имя пользователя")
      reject(new Error("ошибка введите имя пользователя"))
    } else {
      setSuccess(userNameInput)
      resolve()
    }
  
    if(userEmailValue === "") {
      setError(userEmailInput, "введите правильно почту")
      console.log(errorMsg, "ошибка введите имя пользователя")
      reject(new Error( "ошибка введите имя пользователя"))
    } else if(!isValidEmail(userEmailValue)) {
      setError(userEmailInput, 'неверная почта')
      reject(new Error('неверная почта'))
    }
     else {
      setSuccess(userEmailInput)
      resolve()
    }
  
    if(userPasswordValue === "") {
      setError(userPasswordInput, "введите пароль")
      reject(new Error("введите пароль"))
    } else if(userPasswordValue.length < 6) {
      setError(userPasswordInput, "пароль должен содержать более 6 символов")
    }
     else {
      setSuccess(userPasswordInput)
      resolve()
    }
  })
 
}


function showLoader() {
  document.querySelector(".preloader").style.display = "flex";
}
function hideLoader() {
  document.querySelector(".preloader").style.display = "none";
}


//авторизация пользователя
const loginErrorMsg = document.getElementById("signin-msg");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

function signInUser(event) {
  
  const email = emailInput.value;
  const password = passwordInput.value;
  event.preventDefault();

signInWithEmailAndPassword(auth, email, password)
    .then((credentials) => {
      const user = credentials.user;
      return get(child(dbref, "AuthUserList/", user.uid)).then((snapshot) => {
        if (snapshot.exists) {
          let userData = snapshot.val();
          //при успешном авторизации в user сохраняем данные пользователя которые нам возвращает промис чтобы получить токен
          console.log("work2");
          localStorage.setItem(
            "user-info",
            JSON.stringify({
              userUid: user.uid,
              userName: userData[user.uid].userName,
            })
          );
          localStorage.setItem("user-creds", JSON.stringify(credentials.user));
          userAccName.innerHTML = `<span>${userData[user.uid].userName}</span>`;
          return user.getIdToken();
        }
      });
      //Здесь .then((idToken) => {...}) обрабатывает результат вызова getIdToken(). Когда промис разрешается, он передает значение idToken в следующий блок .then()
    })
    .then((idToken) => {
      return Question.getQuestions(idToken);
    })
    .then(() => {
      removeBg();
    })
    .catch((error) => {
      if (error.code ===  "auth/invalid-login-credentials"){
        loginErrorMsg.innerText = "Вы ввели неправильный пароль или email"
        console.log(error)
       } else {
        console.error(error, "Произошла ошибка");
      }  
      
    })
}

export { signInUser };

//функция sign in with google
const signInwithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    
      const user = result.user;
      console.log(user);
      userAccName.innerHTML = user.displayName;
  
    removeBg()
  }
    catch(error) {
      console.log(error.code);
    };
};

export { signInwithGoogle };

function removeBg() {
  modalWindow.classList.remove("show");
  const backdropElements = document.querySelectorAll(".modal-backdrop");
  backdropElements.forEach((backdropElement) => {
    backdropElement.parentNode.removeChild(backdropElement);
  });
}

