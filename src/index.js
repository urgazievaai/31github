
import "./style.scss"
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Question } from "./js/question";
import { isValid } from "./js/util";
import { app } from "./js/firebaseConfig";
import { getDatabase,ref } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);

//форма для вопросов
const form = document.getElementById('form');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');
//форма для регистрации
const registerForm = document.getElementById('register-form');
//форма для авторизации
const signInForm = document.getElementById('signin-form');


//проверк наличия пользователя по баузеры с которого он зашел видимо (если пользователь зарегестрирован то загрузить вопросы с базы)
const loginBtn = document.getElementById('loginBtn');
const userAccName = document.querySelector(".author");
document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
          
          loginBtn.style.display = 'none'
          signOutBtn.style.display = 'flex'
        
        console.log('пользователь:', user.email)
        
          const userName = getUserName()
          userAccName.innerHTML = `<span>${userName}</span>`
       
        user.getIdToken()
        .then((idToken)=> {
          return Question.getQuestions(idToken);
        })
        .catch((error) => {console.log("Ошибка получения вопросов", error)})
      } else {
        console.log('пользователь не авторизован') 
        loginBtn.style.display = 'flex'
        signOutBtn.style.display = 'none'
      }
      
    })
  })
  

  function getUserName() {
    const userInfo = JSON.parse(localStorage.getItem('user-info'))
    const userName = userInfo?.userName
    return userName
  }
//выход пользователя из системы
const signOutBtn = document.getElementById("signOutBtn");
signOutBtn.addEventListener("click", signOutFunc);

function signOutFunc() {
  signOut(auth)
    .then(() => {
      console.log("signOut succesful");
      localStorage.removeItem("user-creds");
      localStorage.removeItem("user-info");
      userAccName.innerHTML = "";
      document.getElementById("dbList").innerHTML = "";
    })
    .then(() => {
      loginBtn.style.display = "flex";
      signOutBtn.style.display = "none";
    })
    .catch((error) => {
      console.log("signOut not sucessfull:", error);
    });
}


//
window.addEventListener('load', Question.renderlist)
form.addEventListener('submit', submitForm)
//валидация значения input
input.addEventListener('input', ()=> {
  submitBtn.disabled = !isValid(input.value) 
})
registerForm.addEventListener('submit', regFormHandler, {once:true}); 
signInForm.addEventListener('submit', signInUser, {once:true}); 

function submitForm (event) {
  if(isValid(input.value)) {
        const question = {
          text: input.value.trim(),
          date: new Date().toJSON(),
        };
        submitBtn.disabled = true

        Question.create(question) 
        .then(()=> {
          input.value = ""
          submitBtn.disabled = false
        })
      }
  event.preventDefault()
  console.log(input.value)
}



const signUpLink = document.getElementById('sign-up-link')
const signInLink = document.getElementById('sign-in-link')

loginBtn.addEventListener('click', openRegistrationModal)
signUpLink.addEventListener('click', showSignUp)
signInLink.addEventListener('click', showSignIn)

  function openRegistrationModal() {
    registerForm.style.display = 'block';
    signInForm.style.display = 'none';
}
function showSignUp(event) {
  event.preventDefault()
  registerForm.style.display = 'block';
  signInForm.style.display = 'none';
}
function showSignIn(event) {
  event.preventDefault()
  signInForm.style.display = 'block';
  registerForm.style.display = 'none'; 
}
//firebase  loginUser 

//signIn User 
import{ regFormHandler} from "./js/login";
import { signInUser } from "./js/login";


// import { updateAuthState } from "./js/login";
// document.addEventListener('DOMContentLoaded', updateAuthState);

// const userCred = JSON.parse(localStorage.getItem('user-creds'));
// const userInfo = JSON.parse(localStorage.getItem('user-info'));
