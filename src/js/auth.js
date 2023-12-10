import { initializeApp } from "firebase/app";
import { getDatabase, get, ref, child } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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

const modalWindow = document.getElementById("exampleModal");
const errorMsg = document.getElementById("signin-msg");
const email = document.getElementById("email");
const password = document.getElementById("password");

// function encodeEmail(email) {
//   return email.replace(/[.,#$[\]]/g, '_');
// }

function signInUser(event) {
  event.preventDefault();
  // get(ref(db, 'AuthUserList/' + encodeEmail(email.value)))
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((credentials) => {
      //получаем пользователя из базы данных из ветки AuthUserList
      return (
        get(child(dbref, "AuthUserList/" + credentials.user.uid))
          //дальше выполняем проверку наличия полтзователя
          .then((snapshot) => {
            if (snapshot.exists()) {
              //при успешном авторизации в user сохраняем данные пользователя которые нам возвращает промис чтобы получить токен
              const user = credentials.user;
              console.log("user", credentials);
              //при успешной авторизации данные плтзователя сохпаняем в localstorage
              localStorage.setItem("user-creds", JSON.stringify(user));

              //Здесь .then((idToken) => {...}) обрабатывает результат вызова getIdToken(). Когда промис разрешается, он передает значение idToken в следующий блок .then()
              return user.getIdToken().then((idToken) => {
                return Question.getQuestions(idToken);
              });
            }
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
      if (error.code == "auth/invalid-login-credentials") {
        errorMsg.innerHTML = `<svg width="20" height="20" viewBox="0 0 683 683" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M175.999 63.4663C161.066 70.3996 154.666 78.3996 154.666 89.9996C154.666 97.5996 155.866 99.9996 172.133 124C186.799 145.866 191.199 149.6 202.666 149.6C210.399 149.6 221.333 144.133 226.133 138C229.999 132.933 231.999 124 230.666 118.266C229.333 112.266 211.333 75.1996 207.199 69.5996C203.066 64.2663 194.666 59.9996 187.999 59.9996C185.466 59.9996 179.999 61.5996 175.999 63.4663Z" fill="#FF2828"/>
        <path d="M484.534 62.5326C481.467 63.8659 477.467 67.0659 475.6 69.5993C471.334 75.0659 453.467 112.133 452 118.266C447.2 138.533 473.467 156.933 492.134 146.399C496.4 143.999 500.4 139.066 510.534 123.999C526.8 99.9993 528 97.5993 528 89.9993C528 78.3993 521.6 70.3993 506.667 63.4659C498 59.3326 492 59.1993 484.534 62.5326Z" fill="#FF2828"/>
        <path d="M327.866 100.533C320.266 102.533 310.533 108.133 304.933 113.733C299.199 119.6 273.866 153.467 250.533 186.8C176.666 292 110.133 411.733 60.7993 528L52.666 547.333V561.333C52.666 574.4 52.9327 575.867 56.9327 584.133C64.5327 599.6 79.466 610.667 96.9327 613.333C101.199 614 125.733 615.733 151.333 617.333C286.933 625.2 396.666 624.4 535.999 614.667C583.866 611.2 591.733 610.133 601.066 605.733C617.066 598.133 629.066 580.533 630.399 562.533C631.199 551.067 629.599 545.067 620.399 523.333C571.199 407.867 505.333 290 430.933 184C406.799 149.733 380.533 115.333 375.199 111.2C361.066 100 343.999 96.1333 327.866 100.533ZM358.266 239.867C366.799 241.467 372.933 246.267 376.933 254.533L380.533 261.733V326.667V391.6L376.933 398.8C370.933 410.933 363.066 414.533 341.733 414.667C326.799 414.667 318.133 412.667 312.533 407.733C302.933 399.2 303.333 403.067 303.333 326.667C303.333 264.533 303.599 257.6 305.599 253.867C309.066 247.6 316.666 241.6 322.266 240.667C325.066 240.133 327.999 239.6 328.666 239.333C331.333 238.4 352.799 238.8 358.266 239.867ZM366.266 460.933C374.933 465.467 378.666 471.6 380.266 483.467C382.266 499.2 380.666 525.333 377.333 531.867C371.333 543.6 359.733 547.6 334.933 546.133C318.666 545.2 312.399 542.533 307.066 534.4C303.333 528.933 303.333 528.533 302.933 504.8C302.399 479.467 303.199 473.6 308.133 467.467C314.399 459.467 323.199 457.333 345.733 458C357.866 458.267 362.399 458.933 366.266 460.933Z" fill="#FF2828"/>
        <path d="M347.5 100.5C341 103.455 328.701 119.233 323.101 124.833C317.368 130.7 304.935 145 281.601 178.333C215.435 286.5 200.935 311 134.435 432L96.5344 516L81.5002 546.5C81.5002 559.567 81.0016 591.667 100.435 604C104.701 604.667 125.334 616.066 150.934 617.666C286.534 625.533 396.267 624.733 535.601 615C583.467 611.533 591.334 610.466 600.668 606.066C616.668 598.466 628.668 580.866 630.001 562.866C630.801 551.4 629.201 545.4 620.001 523.666C570.801 408.2 504.934 290.333 430.534 184.333C406.401 150.066 380.5 114.808 375 111C362 102 354 97.5455 347.5 100.5ZM357.867 240.2C366.401 241.8 372.534 246.6 376.534 254.866L380.134 262.066V327V391.933L376.534 399.133C370.534 411.266 362.667 414.866 341.334 415C326.401 415 317.734 413 312.134 408.066C302.534 399.533 302.934 403.4 302.934 327C302.934 264.866 303.201 257.933 305.201 254.2C308.667 247.933 316.267 241.933 321.867 241C324.667 240.466 327.601 239.933 328.267 239.666C330.934 238.733 352.401 239.133 357.867 240.2ZM365.867 461.266C374.534 465.8 378.267 471.933 379.867 483.8C381.867 499.533 380.267 525.666 376.934 532.2C370.934 543.933 359.334 547.933 334.534 546.466C318.267 545.533 312.001 542.866 306.667 534.733C302.934 529.266 302.934 528.866 302.534 505.133C302.001 479.8 302.801 473.933 307.734 467.8C314.001 459.8 322.801 457.666 345.334 458.333C357.467 458.6 362.001 459.266 365.867 461.266Z" fill="#FF7582"/>
        <path d="M63.5995 174.666C57.0662 176.666 50.9328 182.533 45.7328 191.733C38.1328 205.333 39.1995 216.399 48.9328 225.599C55.0662 231.333 96.9328 250.666 103.333 250.666C119.866 250.666 134.4 230.933 129.333 215.333C126.8 207.599 122 203.066 101.466 189.466C77.4662 173.333 73.3328 171.733 63.5995 174.666Z" fill="#FF2828"/>
        <path d="M604.667 174.933C598.267 177.333 562.133 202 558.4 206.533C550.667 215.733 550.4 226.8 557.733 238.133C560.533 242.4 564 245.733 568 247.6C577.867 252.666 582.133 251.866 607.333 239.866C636.8 226 641.6 221.333 641.867 207.2C641.867 201.6 640.933 198.8 636.667 191.333C633.333 185.6 629.333 180.666 626 178.4C619.867 174.133 610.667 172.666 604.667 174.933Z" fill="#FF2828"/>
        <path d="M18.5331 332C12.5331 333.733 7.99981 337.6 4.3998 343.733C1.33314 348.933 0.799805 351.333 0.799805 360.533C0.933138 376.533 6.26647 385.467 18.2665 389.467C25.8665 392 70.7998 388.667 78.3998 385.067C97.1998 376.133 97.8665 346.4 79.3331 336.8C75.1998 334.667 69.3331 333.733 51.9998 332.4C26.7998 330.533 23.3331 330.533 18.5331 332Z" fill="#FF2828"/>
        <path d="M628.667 332.4C606.267 334.266 600.267 336.266 594.933 344C588 354.266 588.133 368.666 595.2 378C601.333 385.866 607.2 387.6 634.8 389.466C654 390.666 660.667 390.666 664.4 389.466C676.4 385.466 681.733 376.533 681.867 360.533C681.867 351.2 681.333 348.933 678.267 343.733C671.067 331.333 663.867 329.6 628.667 332.4Z" fill="#FF2828"/>
        </svg><span>Вы ввели неправильный пароль или email</span>`;
      } else if (error.code == "auth/user-not-found") {
        errorMsg.innerHTML = `<svg width="20" height="20" viewBox="0 0 683 683" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M175.999 63.4663C161.066 70.3996 154.666 78.3996 154.666 89.9996C154.666 97.5996 155.866 99.9996 172.133 124C186.799 145.866 191.199 149.6 202.666 149.6C210.399 149.6 221.333 144.133 226.133 138C229.999 132.933 231.999 124 230.666 118.266C229.333 112.266 211.333 75.1996 207.199 69.5996C203.066 64.2663 194.666 59.9996 187.999 59.9996C185.466 59.9996 179.999 61.5996 175.999 63.4663Z" fill="#FF2828"/>
        <path d="M484.534 62.5326C481.467 63.8659 477.467 67.0659 475.6 69.5993C471.334 75.0659 453.467 112.133 452 118.266C447.2 138.533 473.467 156.933 492.134 146.399C496.4 143.999 500.4 139.066 510.534 123.999C526.8 99.9993 528 97.5993 528 89.9993C528 78.3993 521.6 70.3993 506.667 63.4659C498 59.3326 492 59.1993 484.534 62.5326Z" fill="#FF2828"/>
        <path d="M327.866 100.533C320.266 102.533 310.533 108.133 304.933 113.733C299.199 119.6 273.866 153.467 250.533 186.8C176.666 292 110.133 411.733 60.7993 528L52.666 547.333V561.333C52.666 574.4 52.9327 575.867 56.9327 584.133C64.5327 599.6 79.466 610.667 96.9327 613.333C101.199 614 125.733 615.733 151.333 617.333C286.933 625.2 396.666 624.4 535.999 614.667C583.866 611.2 591.733 610.133 601.066 605.733C617.066 598.133 629.066 580.533 630.399 562.533C631.199 551.067 629.599 545.067 620.399 523.333C571.199 407.867 505.333 290 430.933 184C406.799 149.733 380.533 115.333 375.199 111.2C361.066 100 343.999 96.1333 327.866 100.533ZM358.266 239.867C366.799 241.467 372.933 246.267 376.933 254.533L380.533 261.733V326.667V391.6L376.933 398.8C370.933 410.933 363.066 414.533 341.733 414.667C326.799 414.667 318.133 412.667 312.533 407.733C302.933 399.2 303.333 403.067 303.333 326.667C303.333 264.533 303.599 257.6 305.599 253.867C309.066 247.6 316.666 241.6 322.266 240.667C325.066 240.133 327.999 239.6 328.666 239.333C331.333 238.4 352.799 238.8 358.266 239.867ZM366.266 460.933C374.933 465.467 378.666 471.6 380.266 483.467C382.266 499.2 380.666 525.333 377.333 531.867C371.333 543.6 359.733 547.6 334.933 546.133C318.666 545.2 312.399 542.533 307.066 534.4C303.333 528.933 303.333 528.533 302.933 504.8C302.399 479.467 303.199 473.6 308.133 467.467C314.399 459.467 323.199 457.333 345.733 458C357.866 458.267 362.399 458.933 366.266 460.933Z" fill="#FF2828"/>
        <path d="M347.5 100.5C341 103.455 328.701 119.233 323.101 124.833C317.368 130.7 304.935 145 281.601 178.333C215.435 286.5 200.935 311 134.435 432L96.5344 516L81.5002 546.5C81.5002 559.567 81.0016 591.667 100.435 604C104.701 604.667 125.334 616.066 150.934 617.666C286.534 625.533 396.267 624.733 535.601 615C583.467 611.533 591.334 610.466 600.668 606.066C616.668 598.466 628.668 580.866 630.001 562.866C630.801 551.4 629.201 545.4 620.001 523.666C570.801 408.2 504.934 290.333 430.534 184.333C406.401 150.066 380.5 114.808 375 111C362 102 354 97.5455 347.5 100.5ZM357.867 240.2C366.401 241.8 372.534 246.6 376.534 254.866L380.134 262.066V327V391.933L376.534 399.133C370.534 411.266 362.667 414.866 341.334 415C326.401 415 317.734 413 312.134 408.066C302.534 399.533 302.934 403.4 302.934 327C302.934 264.866 303.201 257.933 305.201 254.2C308.667 247.933 316.267 241.933 321.867 241C324.667 240.466 327.601 239.933 328.267 239.666C330.934 238.733 352.401 239.133 357.867 240.2ZM365.867 461.266C374.534 465.8 378.267 471.933 379.867 483.8C381.867 499.533 380.267 525.666 376.934 532.2C370.934 543.933 359.334 547.933 334.534 546.466C318.267 545.533 312.001 542.866 306.667 534.733C302.934 529.266 302.934 528.866 302.534 505.133C302.001 479.8 302.801 473.933 307.734 467.8C314.001 459.8 322.801 457.666 345.334 458.333C357.467 458.6 362.001 459.266 365.867 461.266Z" fill="#FF7582"/>
        <path d="M63.5995 174.666C57.0662 176.666 50.9328 182.533 45.7328 191.733C38.1328 205.333 39.1995 216.399 48.9328 225.599C55.0662 231.333 96.9328 250.666 103.333 250.666C119.866 250.666 134.4 230.933 129.333 215.333C126.8 207.599 122 203.066 101.466 189.466C77.4662 173.333 73.3328 171.733 63.5995 174.666Z" fill="#FF2828"/>
        <path d="M604.667 174.933C598.267 177.333 562.133 202 558.4 206.533C550.667 215.733 550.4 226.8 557.733 238.133C560.533 242.4 564 245.733 568 247.6C577.867 252.666 582.133 251.866 607.333 239.866C636.8 226 641.6 221.333 641.867 207.2C641.867 201.6 640.933 198.8 636.667 191.333C633.333 185.6 629.333 180.666 626 178.4C619.867 174.133 610.667 172.666 604.667 174.933Z" fill="#FF2828"/>
        <path d="M18.5331 332C12.5331 333.733 7.99981 337.6 4.3998 343.733C1.33314 348.933 0.799805 351.333 0.799805 360.533C0.933138 376.533 6.26647 385.467 18.2665 389.467C25.8665 392 70.7998 388.667 78.3998 385.067C97.1998 376.133 97.8665 346.4 79.3331 336.8C75.1998 334.667 69.3331 333.733 51.9998 332.4C26.7998 330.533 23.3331 330.533 18.5331 332Z" fill="#FF2828"/>
        <path d="M628.667 332.4C606.267 334.266 600.267 336.266 594.933 344C588 354.266 588.133 368.666 595.2 378C601.333 385.866 607.2 387.6 634.8 389.466C654 390.666 660.667 390.666 664.4 389.466C676.4 385.466 681.733 376.533 681.867 360.533C681.867 351.2 681.333 348.933 678.267 343.733C671.067 331.333 663.867 329.6 628.667 332.4Z" fill="#FF2828"/>
        </svg><span>Пользователь с таким email не найден</span>`;
      }
    })
    .catch((error) => {
      console.log("ошибка закрытия модального окна", error.message);
    });
}

export { signInUser };
