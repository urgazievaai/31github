
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
const signInForm = document.getElementById('signin-form');

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

const loginBtn = document.getElementById('loginBtn')
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
import{ regFormHandler } from "./js/app";
import { signInUser } from "./js/auth";




const userCred = JSON.parse(localStorage.getItem('user-creds'));
const userInfo = JSON.parse(localStorage.getItem('user-info'));
