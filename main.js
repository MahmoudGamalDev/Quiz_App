let question = document.querySelector(".question p");
let labels = document.querySelectorAll("label");
let inputs = document.querySelectorAll("input");
let submitButton = document.querySelector(".submit");
let popUp = document.querySelector(".pop-up");


// Helpers
let quesIndex = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            addQuestions(JSON.parse(this.responseText)[quesIndex]);

            submitButton.onclick = function () {
                let answered = false;

                for (let i = 0; i < 4; i++) {
                    if (inputs[i].checked) {
                        answered = true;
                    }
                }

                if (answered === true) {
                    quesIndex++;
                    addQuestions(JSON.parse(myRequest.responseText)[quesIndex]);

                    for (let i = 0; i < 4; i++) {
                        inputs[i].checked = false;
                    }
                    
                } else {
                    popUp.style.top = "10%";
                    setTimeout(() => {
                        popUp.style.top = "-100px";
                    }, 2000);
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
        quizObj.answer_4]

    for (let i = 0; i < 4; i++) {
        labels[i].textContent = ansArr[i]
    }
}

