//Global Vars
let userInput = document.querySelector("#question");
let questionDiv = document.querySelector("#question-container");






function addQuestion() {
  let newQuestion = document.createElement("div");
  newQuestion.innerHTML = userInput.value;
  questionDiv.appendChild(newQuestion);

  userInput.value = "";
}

function getStarted() {
  userInput.addEventListener("keydown", e => {
     if(e.key == "Enter") {
         addQuestion();
     }
     /*
     else if(e.key == "ArrowUp" && userInput.value == "") {
         userInput.value = lastCommand;
     }
     */
  });
}


getStarted();
