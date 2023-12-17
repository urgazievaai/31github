import { initializeApp } from "firebase/app";
import { getDatabase, ref, onChildAdded } from "firebase/database"

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
const db = getDatabase(app);

export class Question {
  static create(question) {
    return fetch(
      "https://podcast-questions-19424-default-rtdb.asia-southeast1.firebasedatabase.app/questions.json",
      {
        method: "POST",
        body: JSON.stringify(question),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((response) => {
        question.id = response.name;
        return question;
      })
      .then(getToLocalStorage)
      .then(Question.renderlist);
  }

  static getQuestions(token) {
    return fetch(
      `https://podcast-questions-19424-default-rtdb.asia-southeast1.firebasedatabase.app/questions.json?auth=${token}`
    )
      .then((response) => response.json())
      .then(fromDb)
      .catch((error) => {
        console.error("Error fetching questions:", error);
        throw error;
      });
  } 
  
  static renderlist() {
    const questions = getFromLocalStorage();
    const html = questions.length ? questions.map(everyQues).join("") : `<p class="recent-post__text text">Вы еще не задали свой вопрос</p>`;
    const list = document.getElementById("list");
    list.innerHTML = html;
  }
}

let cureentQues = []
function fromDb (questions) {
  console.log('это яяя')
  cureentQues = Object.values(questions || {})
  console.log(cureentQues)
  return renderQues()
// function getQuesDB(questions) {
  
  // const newQuestion = Object.values(questions || {});
  // const filterQues = newQuestion.filter((newQues)=> !cureentQues.some(existingQues => existingQues.id === newQues.id))
  // cureentQues = [...cureentQues, ...filterQues];
  // callback()
//   console.log(cureentQues)
  
// }
// const quesRef = ref(db, 'questions/')
// onChildAdded(quesRef, (snapshot) => {
//   const newQues = snapshot.val();
//   getQuesDB({ [snapshot.key]: newQues }, renderQues());
// });
}
function renderQues() {
  const renderArray = cureentQues.length ? cureentQues.map(everyQues).join("") : `<h3 class="recent-post__text text"> Пока вопросов нет</h3>`;
        const ui = document.getElementById("dbList");
        ui.innerHTML = renderArray;
} 

function getToLocalStorage(question) {
  const all = getFromLocalStorage();
  all.push(question);
  localStorage.setItem("questions", JSON.stringify(all));
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("questions") || "[]");
}

function everyQues(question) {
  return `<li class="list__item">
  <p class="list__date">${question.text} </p>
  <p class="recent-post__desc desc">
  ${new Date(question.date).toDateString()}
  ${new Date(question.date).toLocaleDateString()}
   </p>
  </li>
  `;
}


