let quiz = document.querySelector(".quiz");
let question = document.querySelector(".question p");
let labels = document.querySelectorAll("label");
let inputs = document.querySelectorAll("input");
let submitButton = document.querySelector(".submit");
let popUp = document.querySelector(".pop-up");
let result = document.querySelector(".result");
let quesNumber = document.querySelector(".question-number");
let timer = document.querySelector(".counter");

// Helpers
let quesIndex = 0;
let score = 0;
let counter;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let quesObj = JSON.parse(myRequest.responseText);
      addQuestions(quesObj[quesIndex]);
      quesNumber.textContent = `Q${1}/${quesObj.length}`;
      countdown(90, quesObj.length);

      submitButton.onclick = function () {
        for (let i = 0; i < 4; i++) {
          if (inputs[i].checked) {
            let userAnswer = document.querySelector(
              `#${inputs[i].id}+ label`
            ).textContent;
            let rightAnswer = quesObj[quesIndex].right_answer;
            countScore(userAnswer, rightAnswer);
          }
        }

        quesIndex++;
        if (quesIndex < quesObj.length) {
          addQuestions(quesObj[quesIndex]);
          uncheckInputs();
          quesIncrement(quesObj);
        } else {
          giveResult(quesObj.length);
        }

        clearInterval(counter);
        countdown(90, quesObj.length);
      };
    }
  };
  
  myRequest.open("GET", "html_quiz.json", true);
  myRequest.send();
}

getQuestions();

function addQuestions(quizObj) {
  question.textContent = quizObj.title;
  let ansArr = [
    quizObj.answer_1,
    quizObj.answer_2,
    quizObj.answer_3,
    quizObj.answer_4,
  ];

  for (let i = 0; i < 4; i++) {
    labels[i].textContent = ansArr[i];
  }
}

function countScore(userAnswer, right_answer) {
  if (userAnswer === right_answer) {
    score++;
  }
}

function uncheckInputs() {
  for (let i = 0; i < 4; i++) {
    inputs[i].checked = false;
  }
}

function giveResult(quesLength) {
  quiz.style.display = "none";
  result.style.display = "block";
  result.innerHTML = `Your score is <span>${score}/${quesLength}</span>. <span>Try again?</span>`;

  if (score < 5) {
    result.classList.add("failed");
  } else {
    result.classList.add("passed");
  }

  let tryAgain = document.querySelector(".result span:last-child");
  tryAgain.addEventListener("click", () => {
    location.reload();
  });
}

function quesIncrement(quizObj) {
  quesNumber.textContent = `Q${quesIndex + 1}/${quizObj.length}`;
}

function countdown(duration, count) {
  if (quesIndex < count) {
    let minutes, seconds;
    counter = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      timer.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(counter);
        submitButton.click();
      }
    }, 1000);
  }
}
