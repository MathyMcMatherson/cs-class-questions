//Global Vars
let userInput = document.querySelector("#question");
let questionDiv = document.querySelector("#question-container");
let nameInput = document.querySelector("#name");
let closeModal = document.querySelector("#closeModelBtn");
let QUESTIONS = [];


let name;




function addQuestion() {

  /*
  let newQuestion = document.createElement("div");
  newQuestion.innerHTML = userInput.value;
  questionDiv.appendChild(newQuestion);
  */
  let questionObj = {
    content: userInput.value
  };

  fetch('/api/question', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
    'content': userInput.value
    })
  }).then(res => {
    if(res.ok) return res.json()
  }).then(data => {
    reloadData(data)
  });



  userInput.value = "";
}

function reloadData(data) {
  QUESTIONS = data;
  questionDiv.innerHTML = "";
  for(let q of QUESTIONS) {
    let newQuestion = document.createElement("div");
    newQuestion.innerHTML = q.content

    newQuestion.addEventListener('click', e => {
      let id = q._id;
      fetch(`/api/question/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
      }).then(res => {
        if(res.ok) return res.json()
      }).then(data => {
        reloadData(data)
      });
    });

    questionDiv.appendChild(newQuestion);
  }
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

  nameInput.addEventListener("keyup", e => {
    console.log(nameInput.value.length);
    if(nameInput.value.length > 0) {
      closeModal.classList.remove("disabled");
    } else {
      closeModal.classList.add("disabled");
    }
  });

  fetch('/api/question', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }).then(res => {
    if(res.ok) return res.json()
  }).then(data => {
    //console.log(data);
    reloadData(data);
  });

}




getStarted();

document.addEventListener('DOMContentLoaded', function() {
  var elem = document.querySelector('#modal1');
  var instance = M.Modal.init(elem, {
    'dismissible': false
  });
  instance.open();
});
