let quiz = document.querySelector(".quiz");
let question = document.querySelector(".question p");
let labels = document.querySelectorAll("label");
let inputs = document.querySelectorAll("input");
let submitButton = document.querySelector(".submit");
let popUp = document.querySelector(".pop-up");
let result = document.querySelector(".result");
let quesNumber = document.querySelector(".question-number");
let timer = document.querySelector(".counter");
let minutes = document.querySelector(".counter span:first-child").textContent;
let seconds = document.querySelector(".counter span:last-child").textContent;

// Helpers
let quesIndex = 0;
let score = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            let quesObj = JSON.parse(myRequest.responseText);
            addQuestions(quesObj[quesIndex]);
            quesNumber.textContent = `Q${1}/${quesObj.length}`;
            countDown();

            submitButton.onclick = function () {
                let answered = false;

                for (let i = 0; i < 4; i++) {
                    if (inputs[i].checked) {
                        answered = true;
                        let userAnswer = document.querySelector(`#${inputs[i].id}+ label`).textContent;
                        let rightAnswer = quesObj[quesIndex].right_answer;
                        countScore(userAnswer, rightAnswer);
                    }
                }

                if (answered === true) {
                    quesAnswered(quesObj);
                } else {
                    notAnswered();
                }

                quesIncrement(quesObj);
            }
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
        quizObj.answer_4];

    for (let i = 0; i < 4; i++) {
        labels[i].textContent = ansArr[i];
    }
}

function countScore(userAnswer, right_answer) {
    if (userAnswer === right_answer) {
        score++;
    }
}

function quesAnswered(response) {
    quesIndex++;

    if (quesIndex < response.length) {
        addQuestions(response[quesIndex]);
    } else {
        giveResult(response.length);
    }
}

function notAnswered() {
    popUp.style.top = "10%";
    setTimeout(() => {
        popUp.style.top = "-100px";
    }, 2000);
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
    }
    );
}

function quesIncrement(quizObj) {
    quesNumber.textContent = `Q${quesIndex + 1}/${quizObj.length}`;

}

function countDown() {
    let minsHandler = "60";
    let counter = setInterval(() => {
        if (seconds !== "00") {
            seconds -= 1;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            timer.textContent = `${minutes}:${seconds}`;
        } else {
            if (minutes !== "00") {
                minsHandler -= 1;
                minutes = minsHandler;
                minutes = minutes < 10 ? `0${minutes}` : minutes;
                timer.textContent = `${minutes}:${seconds}`;
            } else {
                clearInterval(counter);
                timer.innerHTML = "<span>01</span>:<span>30</span>";                
            }
        }
    }, 1000);
}