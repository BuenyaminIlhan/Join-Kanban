let boardTodos = [];

/**
 * This function change the pen image when hover on the div
 * @param {object} element - This is the div of the img
 */
function changePenimage(element) {
  let img = element.querySelector("#summary-pen");
  img.src = "./asssets/img/summary-pen.svg";
}

/**
 * This function change (restore) the pen image when hover on the div
 * @param {object} element - This is the div of the img
 */
function restorePenimage(element) {
  let img = element.querySelector("#summary-pen");
  img.src = "./asssets/img/edit-icon.png";
}

/**
 * This function change the check image when hover on the div
 * @param {object} element - This is the div of the img
 */
function changeDoneimage(element) {
  let img = element.querySelector("#summary-done");
  img.src = "./asssets/img/summary-done.svg";
}

/**
 * This function change (restore) the check image when hover on the div
 * @param {object} element - This is the div of the img
 */
function restoreDoneimage(element) {
  let img = element.querySelector("#summary-done");
  img.src = "./asssets/img/done-icon.png";
}

/**
 * This function creates a short greeting message based on the current time. 
  It uses the JavaScript date functions to get the current hour. Depending on the time of day, an appropriate welcome message is assigned.
 */
function userGreetingOnSummary() {
  let currentTime = new Date().getHours();
  let greetingText;
  if (currentTime < 6) {
    greetingText = "Good night!";
  } else if (currentTime < 12) {
    greetingText = "Good morning!";
  } else if (currentTime < 18) {
    greetingText = "Good afternoon!";
  } else {
    greetingText = "Good evening!";
  }
  document.getElementById("greeting").innerHTML = greetingText;
  let name = JSON.parse(localStorage.getItem("name"));
  document.getElementById("name").innerHTML = name;
}

/**
 * This function retrieve tasks from local storage and displaying them
 */
async function loadNewtasksboardd() {
  try {
    boardTodos = JSON.parse(await getItem("task"));
  } catch (e) {
    alert("Error");
  }
  displayTodoCount(boardTodos);
  displayEarliestDueDate(boardTodos);
}

/**
 * This function counts the number of tasks in different status categories 
   and updates the corresponding counters on a web page.
 * @param {object} boardTodos - this is the array of the tasks
 */
function displayTodoCount(boardTodos) {
  let countTodos = 0;
  let countInProgress = 0;
  let countFeedback = 0;
  let countDone = 0;
  let countPrio = 0;
  for (let i = 0; i < boardTodos.length; i++) {
    if (boardTodos[i].status === "todo") {
      countTodos++;
    }
  }
  for (let i = 0; i < boardTodos.length; i++) {
    if (boardTodos[i].status === "inProgress") {
      countInProgress++;
    }
  }
  for (let i = 0; i < boardTodos.length; i++) {
    if (boardTodos[i].status === "feedback") {
      countFeedback++;
    }
  }
  for (let i = 0; i < boardTodos.length; i++) {
    if (boardTodos[i].status === "done") {
      countDone++;
    }
  }
  for (let i = 0; i < boardTodos.length; i++) {
    if (boardTodos[i]["prio"]["id"] == "urgent") {
      countPrio++;
    }
  }
  document.getElementById("countTodo").textContent =
    boardTodos.length.toString();
  document.getElementById("countInprogress").textContent =
    countInProgress.toString();
  document.getElementById("countFeedback").textContent =
    countFeedback.toString();
  document.getElementById("countTodos").textContent = countTodos.toString();
  document.getElementById("countDone").textContent = countDone.toString();
  document.getElementById("countPrio").textContent = countPrio.toString();
}

/**
 * This function redirects to the "board.html" page when a div element is clicked
 */
function redirectToBoard() {
  window.location.href = "board.html";
}

/**
 * This function is used to filter the next upcomming 'due date' out of the array boardTodos
 *
 * @param {object} boardTodos - this is the array of the tasks
 *
 */
function displayEarliestDueDate(boardTodos) {
  let earliestDate = Infinity;
  boardTodos.forEach((todo) => {
    const dueDateTimestamp = Date.parse(todo.dueDate);
    if (dueDateTimestamp < earliestDate) {
      earliestDate = dueDateTimestamp;
    }
  });

  if (earliestDate !== Infinity) {
    const earliestDateObj = new Date(earliestDate);
    const earliestDateString = earliestDateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const summaryDateElement = document.getElementById("summary-date");
    summaryDateElement.textContent = earliestDateString;
    return earliestDateObj;
  } else {
    console.log("Keine fälligen Termine vorhanden.");
    return null;
  }
}
