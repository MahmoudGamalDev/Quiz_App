let quiz = document.querySelector(".quiz");
let question = document.querySelector(".question p");
let labels = document.querySelectorAll("label");
let inputs = document.querySelectorAll("input");
let submitButton = document.querySelector(".submit");
let popUp = document.querySelector(".pop-up");
let result = document.querySelector(".result");

// Helpers
let quesIndex = 0;
let score = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            let quesObj = JSON.parse(myRequest.responseText);

            addQuestions(quesObj[quesIndex]);

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
        for (let i = 0; i < 4; i++) {
            inputs[i].checked = false;
        }
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