import { app } from "./firebaseConfig";
import { getDatabase, get, set, ref, child } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { Question } from "./question";

const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);
//регистрация пользователя
const userNameInput = document.getElementById("userName");
const userEmailInput = document.getElementById("userEmail");
const userPasswordInput = document.getElementById("userPassword");
const regErrorMsg = document.getElementById("signup-msg");
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

  return (
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
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
          "user-creds",
          JSON.stringify({ userUid: user.uid })
        );
        userAccName.innerHTML = `<span>${userName}</span>`;
      })
      .then(() => {
        return removeBg();
      })
      // Сохраняем информацию о пользователе в базу данных
      .catch((error) => {
        regErrorMsg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" fill="none">
        <path fill="#FF2828" d="M6.137 3.218c-.352.164-.503.353-.503.626 0 .18.028.236.412.802.346.516.45.604.72.604.182 0 .44-.129.553-.274a.64.64 0 0 0 .107-.465c-.031-.142-.456-1.016-.553-1.148a.64.64 0 0 0-.453-.226.88.88 0 0 0-.283.081Zm7.277-.022a.612.612 0 0 0-.211.167c-.1.129-.522 1.003-.557 1.148-.113.478.507.912.947.663.1-.056.195-.173.434-.528.383-.566.412-.623.412-.802 0-.273-.151-.462-.503-.626-.205-.097-.346-.1-.522-.022Zm-3.695.897c-.18.047-.41.179-.541.311-.136.138-.733.937-1.283 1.723a44.795 44.795 0 0 0-4.475 8.047l-.192.456v.33c0 .309.006.343.1.538.18.365.532.626.944.689.1.016.68.057 1.283.094 3.198.186 5.786.167 9.072-.063 1.13-.081 1.315-.106 1.535-.21.377-.18.66-.595.692-1.02.019-.27-.02-.411-.236-.924a44.728 44.728 0 0 0-4.469-8.003c-.569-.808-1.188-1.62-1.314-1.717-.333-.264-.736-.355-1.116-.251Zm.717 3.286c.2.038.345.15.44.346l.085.17v3.063l-.085.17c-.142.285-.327.37-.83.373-.353 0-.557-.047-.689-.163-.226-.201-.217-.11-.217-1.912 0-1.465.006-1.629.053-1.717.082-.148.261-.29.394-.311.066-.013.135-.025.15-.032.063-.022.57-.012.699.013Zm.188 5.214c.205.107.293.251.33.531.048.371.01.988-.069 1.142-.141.276-.415.37-1 .336-.383-.022-.531-.085-.657-.277-.088-.128-.088-.138-.097-.698-.013-.597.006-.736.122-.88.148-.189.356-.24.887-.223.286.006.393.022.484.069Z"/>
        <path fill="#FF7582" d="M10.182 4.092c-.154.07-.444.442-.576.574-.135.138-.428.475-.978 1.261-1.56 2.552-1.903 3.13-3.471 5.983l-.894 1.981-.355.72c0 .308-.012 1.065.447 1.356.1.015.587.284 1.19.322 3.199.186 5.787.167 9.073-.063 1.13-.082 1.315-.107 1.535-.21.377-.18.66-.595.692-1.02.018-.27-.02-.411-.236-.924a44.73 44.73 0 0 0-4.469-8.003c-.569-.808-1.18-1.64-1.31-1.73-.306-.212-.495-.317-.648-.247Zm.244 3.295c.202.037.346.15.44.345l.085.17v3.063l-.084.17c-.142.286-.328.371-.83.374-.353 0-.557-.047-.69-.163-.226-.202-.216-.11-.216-1.912 0-1.466.006-1.63.053-1.717.082-.148.261-.29.393-.312.066-.012.135-.025.151-.031.063-.022.57-.013.698.013Zm.189 5.213c.204.107.292.252.33.532.047.37.01.987-.069 1.141-.141.277-.415.371-1 .337-.384-.022-.531-.085-.657-.277-.088-.129-.088-.138-.098-.698-.012-.598.007-.736.123-.88.148-.19.355-.24.887-.224.286.006.393.022.484.07Z"/>
        <path fill="#FF2828" d="M3.486 5.842c-.154.047-.299.185-.421.402-.18.32-.154.582.075.799.145.135 1.132.591 1.283.591.39 0 .733-.465.613-.833-.06-.183-.173-.29-.657-.61-.566-.38-.663-.419-.893-.35Zm12.761.006c-.15.057-1.003.638-1.091.745-.183.217-.189.478-.016.745.066.101.148.18.242.224.233.12.334.1.928-.183.695-.327.808-.437.814-.77 0-.132-.022-.198-.122-.374a.999.999 0 0 0-.252-.305c-.145-.1-.361-.136-.503-.082ZM2.423 9.552a.56.56 0 0 0-.333.277c-.073.123-.085.18-.085.396.003.378.129.588.412.683.18.06 1.239-.02 1.418-.104.443-.21.46-.912.022-1.138-.097-.05-.236-.073-.645-.104-.594-.044-.676-.044-.789-.01Zm14.39.01c-.528.044-.67.091-.796.273a.71.71 0 0 0 .007.802c.144.186.283.227.934.27.453.029.61.029.698 0 .283-.094.409-.304.412-.682 0-.22-.013-.273-.085-.396-.17-.292-.34-.333-1.17-.267Z"/>
        </svg>
      <span> ${errorMsg[error.code] || "Произошла ошибка"}</span>`;
        console.error(error);
      })
  );
}
export { regFormHandler };

const errorMsg = {
  "auth/email-already-in-use": "Этот email уже используется",
  "auth/invalid-email": "Некорректный email",
  "auth/operation-not-allowed": "Операция не разрешена",
  "auth/weak-password":
    "Слабый пароль(пароль должен состоять из более 6 символов)",
  "auth/invalid-login-credentials": "Вы ввели неправильный пароль или email",
  "auth/user-not-found": "Пользователь с таким email не найден",
};


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
          localStorage.setItem( "user-info", JSON.stringify({
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
    .then(removeBg)
    .catch((error) => {
      loginErrorMsg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" fill="none">
      <path fill="#FF2828" d="M6.137 3.218c-.352.164-.503.353-.503.626 0 .18.028.236.412.802.346.516.45.604.72.604.182 0 .44-.129.553-.274a.64.64 0 0 0 .107-.465c-.031-.142-.456-1.016-.553-1.148a.64.64 0 0 0-.453-.226.88.88 0 0 0-.283.081Zm7.277-.022a.612.612 0 0 0-.211.167c-.1.129-.522 1.003-.557 1.148-.113.478.507.912.947.663.1-.056.195-.173.434-.528.383-.566.412-.623.412-.802 0-.273-.151-.462-.503-.626-.205-.097-.346-.1-.522-.022Zm-3.695.897c-.18.047-.41.179-.541.311-.136.138-.733.937-1.283 1.723a44.795 44.795 0 0 0-4.475 8.047l-.192.456v.33c0 .309.006.343.1.538.18.365.532.626.944.689.1.016.68.057 1.283.094 3.198.186 5.786.167 9.072-.063 1.13-.081 1.315-.106 1.535-.21.377-.18.66-.595.692-1.02.019-.27-.02-.411-.236-.924a44.728 44.728 0 0 0-4.469-8.003c-.569-.808-1.188-1.62-1.314-1.717-.333-.264-.736-.355-1.116-.251Zm.717 3.286c.2.038.345.15.44.346l.085.17v3.063l-.085.17c-.142.285-.327.37-.83.373-.353 0-.557-.047-.689-.163-.226-.201-.217-.11-.217-1.912 0-1.465.006-1.629.053-1.717.082-.148.261-.29.394-.311.066-.013.135-.025.15-.032.063-.022.57-.012.699.013Zm.188 5.214c.205.107.293.251.33.531.048.371.01.988-.069 1.142-.141.276-.415.37-1 .336-.383-.022-.531-.085-.657-.277-.088-.128-.088-.138-.097-.698-.013-.597.006-.736.122-.88.148-.189.356-.24.887-.223.286.006.393.022.484.069Z"/>
      <path fill="#FF7582" d="M10.182 4.092c-.154.07-.444.442-.576.574-.135.138-.428.475-.978 1.261-1.56 2.552-1.903 3.13-3.471 5.983l-.894 1.981-.355.72c0 .308-.012 1.065.447 1.356.1.015.587.284 1.19.322 3.199.186 5.787.167 9.073-.063 1.13-.082 1.315-.107 1.535-.21.377-.18.66-.595.692-1.02.018-.27-.02-.411-.236-.924a44.73 44.73 0 0 0-4.469-8.003c-.569-.808-1.18-1.64-1.31-1.73-.306-.212-.495-.317-.648-.247Zm.244 3.295c.202.037.346.15.44.345l.085.17v3.063l-.084.17c-.142.286-.328.371-.83.374-.353 0-.557-.047-.69-.163-.226-.202-.216-.11-.216-1.912 0-1.466.006-1.63.053-1.717.082-.148.261-.29.393-.312.066-.012.135-.025.151-.031.063-.022.57-.013.698.013Zm.189 5.213c.204.107.292.252.33.532.047.37.01.987-.069 1.141-.141.277-.415.371-1 .337-.384-.022-.531-.085-.657-.277-.088-.129-.088-.138-.098-.698-.012-.598.007-.736.123-.88.148-.19.355-.24.887-.224.286.006.393.022.484.07Z"/>
      <path fill="#FF2828" d="M3.486 5.842c-.154.047-.299.185-.421.402-.18.32-.154.582.075.799.145.135 1.132.591 1.283.591.39 0 .733-.465.613-.833-.06-.183-.173-.29-.657-.61-.566-.38-.663-.419-.893-.35Zm12.761.006c-.15.057-1.003.638-1.091.745-.183.217-.189.478-.016.745.066.101.148.18.242.224.233.12.334.1.928-.183.695-.327.808-.437.814-.77 0-.132-.022-.198-.122-.374a.999.999 0 0 0-.252-.305c-.145-.1-.361-.136-.503-.082ZM2.423 9.552a.56.56 0 0 0-.333.277c-.073.123-.085.18-.085.396.003.378.129.588.412.683.18.06 1.239-.02 1.418-.104.443-.21.46-.912.022-1.138-.097-.05-.236-.073-.645-.104-.594-.044-.676-.044-.789-.01Zm14.39.01c-.528.044-.67.091-.796.273a.71.71 0 0 0 .007.802c.144.186.283.227.934.27.453.029.61.029.698 0 .283-.094.409-.304.412-.682 0-.22-.013-.273-.085-.396-.17-.292-.34-.333-1.17-.267Z"/>
      </svg>
  <span>${errorMsg[error.code] || "Произошла ошибка"}</span>`;
      console.error(error);
    })
    .catch((error) => {
      console.log("ошибка закрытия модального окна", error.message);
    });
}

export { signInUser };

function removeBg() {
  modalWindow.classList.remove("show");
  const backdropElements = document.querySelectorAll(".modal-backdrop");
  backdropElements.forEach((backdropElement) => {
    backdropElement.parentNode.removeChild(backdropElement);
  });
}




// const userAccName = document.querySelector(".author");
// userAccName.innerHTML = `<span>${userInfo.userName}</span>`;
