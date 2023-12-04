
import "./style.scss"
import 'jquery'
import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { Question } from "./js/question";
import { isValid } from "./js/util";

//форма для вопросов
const form = document.getElementById('form');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');
//форма для регистрации
const registerForm = document.getElementById('register-form');
//форма для авторизации
const authForm = document.getElementById('auth-form');

//
window.addEventListener('load', Question.renderlist)
form.addEventListener('submit', submitForm)
//валидация значения input
input.addEventListener('input', ()=> {
  submitBtn.disabled = !isValid(input.value) 
})
registerForm.addEventListener('submit', regFormHandler, {once:true}); 
authForm.addEventListener('submit', signInUser, {once:true}); 

function submitForm (event) {
  if(isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    }
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

const signInBtn = document.getElementById('sign-in')
const loginLink = document.getElementById('login-link')
const authLink = document.getElementById('auth-link')

signInBtn.addEventListener('click', openRegistrationModal)
loginLink.addEventListener('click', showLogin)
authLink.addEventListener('click', showAuth)

  function openRegistrationModal() {
    registerForm.style.display = 'block';
    authForm.style.display = 'none';
}
function showLogin(event) {
  event.preventDefault()
  registerForm.style.display = 'block';
  authForm.style.display = 'none';
}
function showAuth(event) {
  event.preventDefault()
  authForm.style.display = 'block';
  registerForm.style.display = 'none'; 
}
//firebase  loginUser 
import{ regFormHandler } from "./js/app";
import { signInUser } from "./js/auth";
//signIn User 


// function hideModal () {
//   $('#exampleModal').modal('hide');
//   }

const userCred = JSON.parse(localStorage.getItem('user-creds'));
const userInfo = JSON.parse(localStorage.getItem('user-info'));
// const check = () => {
//   if(!localStorage.getItem('user-creds')) {
//     dontHaveAcc.innerHTML = `<span>У вас еще нету аккаунта</span>`
//   }
// }
// window.addEventListener('load', check()) 
