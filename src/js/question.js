

export class Question {
  static create (question) {
    return fetch('https://podcast-questions-19424-default-rtdb.asia-southeast1.firebasedatabase.app/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      question.id = response.name
      return question
    })
    .then(getToLocalStorage)
    .then(Question.renderlist)
  }

  static getQuestions(token) {
    return fetch(`https://podcast-questions-19424-default-rtdb.asia-southeast1.firebasedatabase.app/questions.json?auth=${token}`)
      .then(response => response.json())
      .then(questions => {
        const responseArray = Object.values(questions);
      const renderArray = responseArray.length ? responseArray.map(everyQues).join('') : `<h3 class="recent-post__text text"> Пока вопросов нет</h3>`;
      const ui = document.getElementById('dbList');
      ui.innerHTML = renderArray;
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        throw error; 
      });
  }



  static renderlist() {
    const questions = getFromLocalStorage()
    const html = questions.length ? questions.map(everyQues).join(''): `<h3 class="recent-post__text text">Вопросов нет</h3>`

    const list = document.getElementById('list')
    list.innerHTML = html
  }
}

// function getQuesFromDb(questions) {
//   return JSON.parse( questions || [] ) 
// }

function getToLocalStorage(question) {
  const all = getFromLocalStorage()
  all.push(question)
  localStorage.setItem('questions', JSON.stringify(all))
}

function getFromLocalStorage(){
  return JSON.parse(localStorage.getItem('questions') || '[]')
}

function everyQues(question){
  return `<div class="list__date">${question.text} </div>
  <p class="recent-post__desc desc">
  ${new Date(question.date).toDateString()}
  ${new Date(question.date).toLocaleDateString()}
   </p>`
}
export{everyQues}