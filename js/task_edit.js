// Funktionen die die Hintergrundfarbe bei jedem Klick ändern

function firstButtonColor() {
    let button = document.getElementById('firstBtn');
    let currentColor = button.style.backgroundColor;
    let buttonIcon = document.getElementById('inProgress-icon');
  
    if (currentColor === 'rgb(255, 61, 0)') {
      button.style.backgroundColor = '';
      buttonIcon.src = './asssets/img/inProgress-icon.svg'
    } else {
      button.style.backgroundColor = '#FF3D00';
      buttonIcon.src = './asssets/img/white-inProgress-icon.svg'
    } 
}
  
function secondButtonColor() {
    let button = document.getElementById('secondBtn');
    let currentColor = button.style.backgroundColor;
    let buttonIcon = document.getElementById('feedback-icon');
  
    if (currentColor === 'rgb(255, 168, 0)') {
      button.style.backgroundColor = '';
      buttonIcon.src = './asssets/img/Feedback-icon.svg'
    } else {
      button.style.backgroundColor = '#FFA800';
      buttonIcon.src = './asssets/img/white-feedback-icon.svg'
    }
}
  
function thirdButtonColor() {
    let button = document.getElementById('thirdBtn');
    let currentColor = button.style.backgroundColor;
    let buttonIcon = document.getElementById('toDo-icon');
  
    if (currentColor === 'rgb(122, 226, 41)') {
      button.style.backgroundColor = '';
      buttonIcon.src = './asssets/img/toDo icon.svg'
    } else {
      button.style.backgroundColor = '#7AE229';
      buttonIcon.src = './asssets/img/white-todo-icon.svg'
    }
}