/**
 * This Function load the tasks from the remote Storage then executes updateHTML to render
 */
async function loadNewtasksboard() {
  try {
    todos = JSON.parse(await getItem("task"));
  } catch (e) {
    alert("Error");
  }
  updateHTML();
}

/**
 * Add a hover effect on the add button above each list. The function changes the icon.
 * The Div of the img gets (onmouseover="changeImage(this)")
 *
 * @param {object} element - This is the div of the img
 */
function changeImage(element) {
  let img = element.querySelector("#add-card");
  img.src = "./asssets/img/add-card-hover.svg";
}

/**
 * Function to restore the original image when hover out .
 * The div also gets onmouseout="restoreImage(this)"
 *
 * @param {object} element - This is the div of the img
 */
function restoreImage(element) {
  let img = element.querySelector("#add-card");
  img.src = "./asssets/img/add-card.svg";
}

//----------------Add-task PopUp--------------------

if (window.location.pathname.includes("board.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const openPopupBtn = document.querySelector(".open-popup");
    const openPopupBtnResponiv = document.querySelector(".edit-btn");
    const popupOverlay = document.querySelector(".popup-overlay");

    openPopupBtn.addEventListener("click", openPopup);

    openPopupBtnResponiv.addEventListener("click", openPopup);

    popupOverlay.addEventListener("click", (event) => {
      if (event.target === popupOverlay) {
        closePopup();
      }
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    function adjustPopupContent() {
      const popupOverlay = document.querySelector(".popup-overlay");
      const popupContent = document.getElementById("popupContent");
      const body = document.body;

      // Überprüfen, ob das Popup aktiv ist
      if (popupOverlay && popupOverlay.classList.contains("active")) {
        if (window.innerWidth <= 900 && window.innerWidth >= 280) {
          if (popupContent) {
            body.appendChild(popupContent);
          }
        } else {
          if (popupContent) {
            popupOverlay.appendChild(popupContent);
          }
        }
      }
    }

    // Resize-Event-Listener hinzufügen
    window.addEventListener("resize", adjustPopupContent);

    // Call the function initially to account for the current window size
    adjustPopupContent();
  });

  function openPopup() {
    const popupOverlay = document.querySelector(".popup-overlay");
    popupOverlay.classList.add("active");
    disableBackgroundScroll();
    checkScrollbar();
  }

  function closePopup() {
    const popupOverlay = document.querySelector(".popup-overlay");
    popupOverlay.classList.remove("active");
    const createButton = document.getElementById("create-button");
    // Zeige es an
    createButton.style.display = "block";
    enableBackgroundScroll();
    resetInputFields();
    resetTaskCategoryDropdown();
    resetSelectedCategory();
    checkScrollbar();
    location.reload();
  }

  function disableBackgroundScroll() {
    document.body.style.overflow = "hidden";
  }

  function enableBackgroundScroll() {
    document.body.style.overflow = "";
  }

  function checkScrollbar() {
    const popupContent = document.querySelector(".popup-content");
    if (popupContent.scrollHeight > popupContent.clientHeight) {
      popupContent.classList.add("scrolling");
    } else {
      popupContent.classList.remove("scrolling");
    }
  }
}

let todos = [];
let currentDraggedElement;

/**
 * This function first filter the array (todos) by status, then render each list
 */

function updateHTML() {
  let filterTodo = todos.filter((t) => t["status"] == "todo");
  document.getElementById("todo-card").innerHTML = "";
  for (let index = 0; index < filterTodo.length; index++) {
    const element = filterTodo[index];
    document.getElementById("todo-card").innerHTML += generateTodoHTML(element);
    listdesign(element);
  }
  checkEmptyList();

  let filterInpro = todos.filter((t) => t["status"] == "inProgress");
  document.getElementById("progress-card").innerHTML = "";
  for (let index = 0; index < filterInpro.length; index++) {
    const element = filterInpro[index];
    document.getElementById("progress-card").innerHTML +=
      generateTodoHTML(element);
    listdesign(element);
  }
  checkEmptyListProgress();

  let filterFeedback = todos.filter((t) => t["status"] == "feedback");
  document.getElementById("Feedback-card").innerHTML = "";
  for (let index = 0; index < filterFeedback.length; index++) {
    const element = filterFeedback[index];
    document.getElementById("Feedback-card").innerHTML +=
      generateTodoHTML(element);
    listdesign(element);
  }
  checkEmptyListFeedback();

  let filterDone = todos.filter((t) => t["status"] == "done");
  document.getElementById("done-card").innerHTML = "";
  for (let index = 0; index < filterDone.length; index++) {
    const element = filterDone[index];
    document.getElementById("done-card").innerHTML += generateTodoHTML(element);
    listdesign(element);
  }
  checkEmptyListDone();
}

/**
 * This function generate the task cards
 *
 * @param {object} element - This is the task with its index in the list
 * @returns - this is the construct of the taks card
 */

function generateTodoHTML(element) {
  return `<div draggable="true" ontouchstart="startDragging(${element["id"]})" ondragstart="startDragging(${element["id"]})" id="card${element["id"]}" class="item task-card card-with-PBar" onclick="openEditPopup(${element["id"]})">
  <div class="menu-container"><img onclick="moveTaskup(${element["id"]}); event.stopPropagation()" class="menu-points" id="arrowUp" src="./asssets/img/list.png" alt=""></div>
  <div id="task-category${element["id"]}" class="task-category ">${element["category"]}</div>
  <div class="task-title">${element["title"]}</div>
  <div class="task-description">${element["description"]}</div>
  <div id="task-progress${element["id"]}" class="task-progress dis-none">
      <div class="progress" role="progressbar" aria-label="Example with label">
          <div id="progress-bar${element["id"]}" class="progress-bar" style="width: 25%"></div>
      </div>
      <div id="progress-steps${element["id"]}" class="progress-steps"></div>
  </div>
  <div class="task-assignedTo">
      <div id="assigned-contacts${element["id"]}" class="task-icons">
      </div>
      <img id="task-icon${element["id"]}" src="${element.prio.path}" alt="">
  </div>
  </div>
  `;
}

/**
 * This function is responsible for design of the task card
 *
 * @param {object} element - This is the task with its index in the list
 */
function listdesign(element) {
  document.getElementById(
    `task-category${element["id"]}`
  ).style.backgroundColor = element["color"];
  document.getElementById(`task-category${element["id"]}`).innerHTML =
    element["category"];
  document.getElementById(`assigned-contacts${element["id"]}`).innerHTML =
    renderAssignedContacts(element["id"]);
  document.getElementById(`task-icon${element["id"]}`).src = element.prio.path;
  showProgressBar(element, element["id"]);
}

/**
 * The function changes the status of the task, then save the change in the remote storage and render the new changed tasks
 *
 * @param {number} id - This is the index of the task in its list
 * @param {string} status - This is the status that is transfered from the onclick="changeStatus..."
 */
async function changeStatus(id, status) {
  todos[id]["status"] = status;
  await setItem("task", JSON.stringify(todos));
  updateHTML();
}

/**
 * This function clear the task card in the list, then render the target optiones
 *
 * @param {number} id - This is the index of task
 */
function moveTaskup(id) {
  let card = document.getElementById(`card${id}`);
  card.innerHTML = "";
  card.innerHTML = `
    <div class="card-change-status">
      <h3>Move to:</h3>
      <span onclick="changeStatus(${id}, 'todo'); event.stopPropagation()">To do</span>
      <span onclick="changeStatus(${id}, 'inProgress'); event.stopPropagation()">In Progress</span>
      <span onclick="changeStatus(${id}, 'feedback'); event.stopPropagation()">Awaiting Feedback</span>
      <span onclick="changeStatus(${id}, 'done'); event.stopPropagation()">Done</span>
      <div onclick="updateHTML(); event.stopPropagation()">X</div>
    </div>
  `;
}

/**
 * This function gets the index of the task in the array an transfer it to variable (currentDraggedElement)
 *
 * @param {number} id - This the index of the task
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * The code ev.preventDefault(); used in this function to suppress the default behavior of the browser. For example, by default it is not allowed to insert elements into other elements. Calling preventDefault() prevents this default action and allows us to implement custom behavior for inserting the element.
 *
 * @param {*} ev - Information about the drag event, such as B. the coordinates of the mouse pointer during dragging.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * The function changes the status of the task, then save the change in the remote storage and render the new changed tasks
 *
 * @param {*} status - This the new status of the task
 */
async function moveTo(status) {
  currentDraggedElement = todos.findIndex(
    (obj) => obj.id === currentDraggedElement
  );
  todos[currentDraggedElement]["status"] = status;
  await setItem("task", JSON.stringify(todos));
  updateHTML();
}

/**
 * This function changes the color when ondragover this target list by adding a classList
 *
 * @param {*} id - This the index of the task
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * This function remove the color when ondragleave the target list by removing a classList
 *
 * @param {*} id - This the index of the task
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * This function shows the process bar after checking if there are subtasks. If not the bar gets display: none;
 *
 * @param {object} element - This is the task in which the bar should be displayed
 * @param {number} id - This is the index of the task
 */
function showProgressBar(element, id) {
  const todo = todos.find((todo) => todo.id === id);
  if (todo && todo.subtasks && todo.subtasks.length > 0) {
    document
      .getElementById(`task-progress${element.id}`)
      .classList.remove("dis-none");
    document.getElementById(`progress-steps${element.id}`).innerHTML =
      countProgressSteps(id);
  }
}

/**
 * This function count the subtasks of the target task and check how many subtasks are done
 *
 * @param {number} id - This the index of the task
 * @returns - shows the done subtasks and the total number of the subtasks
 */
function countProgressSteps(id) {
  const todo = todos.find((todo) => todo.id === id);
  let totalSubTask = todo["subtasks"].length;
  let totalSubTaskChecked = 0;

  for (let j = 0; j < totalSubTask; j++) {
    if (todo["subtasks"][j]["checked"] === true) {
      totalSubTaskChecked++;
    }
  }
  progressAnimation(totalSubTask, totalSubTaskChecked, id);
  return `${totalSubTaskChecked} / ${totalSubTask} Done`;
}

/**
 * This function calculates what percentage of the tasks are completed and show the the animation in the bar
 *
 * @param {number} totalSubTask - number of total subtasks
 * @param {number} totalSubTaskChecked - number of the checked or done subtasks
 * @param {number} id - this is the index of the task
 */
function progressAnimation(totalSubTask, totalSubTaskChecked, id) {
  let percent = totalSubTaskChecked / totalSubTask;
  percent = Math.round(percent * 100);
  document.getElementById(`progress-bar${id}`).style = `width: ${percent}%;`;
}

/**
 * This function renders only 3 of the assigned contacts for a task. It show only two contacts and in the third element the number of the unshow contacts
 *
 * @param {number} id - this the index of the task
 * @returns - show the assigned contacts for a task
 */
function renderAssignedContacts(id) {
  let renderedContacts = "";
  const todo = todos.find((todo) => todo.id === id);
  if (todo && todo.assignedTo) {
    const assignedContacts = todo.assignedTo;
    const remainingContacts = assignedContacts.length - 2;

    for (let j = 0; j < 2 && j < assignedContacts.length; j++) {
      const assignedContact = assignedContacts[j];
      const contact = `<span class="${assignedContact.iconColor}">${assignedContact.initials}</span>`;
      renderedContacts += contact;
    }

    if (remainingContacts > 0) {
      renderedContacts += `<span class="remaining-contacts">+${remainingContacts}</span>`;
    }
  }
  return renderedContacts;
}

////////////// Check if the lists are empty //////////////

/**
 * This function inspect the list todo-card, if its empty the empty-card will be shown if not the empty-card will be hidden
 */
function checkEmptyList() {
  var todoCard = document.getElementById("todo-card");
  var emptyCard = document.getElementsByClassName("empty-card")[0];

  if (todoCard.children.length === 0) {
    emptyCard.style.display = "flex";
  } else {
    emptyCard.style.display = "none";
  }
}

/**
 * This function inspect the list progress-card, if its empty the empty-card will be shown if not the empty-card will be hidden
 */
function checkEmptyListProgress() {
  var progressCard = document.getElementById("progress-card");
  var emptyCard = document.getElementById("empty-card-progress");

  if (progressCard.children.length === 0) {
    emptyCard.style.display = "flex";
  } else {
    emptyCard.style.display = "none";
  }
}

/**
 * This function inspect the list Feedback-card, if its empty the empty-card will be shown if not the empty-card will be hidden
 */
function checkEmptyListFeedback() {
  var feedbackCard = document.getElementById("Feedback-card");
  var emptyCard = document.getElementById("empty-card-feedback");

  if (feedbackCard.children.length === 0) {
    emptyCard.style.display = "flex";
  } else {
    emptyCard.style.display = "none";
  }
}

/**
 * This function inspect the list done-card, if its empty the empty-card will be shown if not the empty-card will be hidden
 */
function checkEmptyListDone() {
  var doneCard = document.getElementById("done-card");
  var emptyCard = document.getElementById("empty-card-done");

  if (doneCard.children.length === 0) {
    emptyCard.style.display = "flex";
  } else {
    emptyCard.style.display = "none";
  }
}

//////////////// Search function ///////////////

/**
 * This function filter all tasks of the value in the search field
 */
function filterTasks() {
  let search = document.getElementById("searchTask-input").value.toLowerCase();

  if (search == "") {
    updateHTML();
  } else {
    let todoCard = document.getElementById("todo-card");
    let progressCard = document.getElementById("progress-card");
    let feedbackCard = document.getElementById("Feedback-card");
    let doneCard = document.getElementById("done-card");

    // Clear the HTML content of the cards
    todoCard.innerHTML = "";
    progressCard.innerHTML = "";
    feedbackCard.innerHTML = "";
    doneCard.innerHTML = "";

    // Call the function with the appropriate arguments
    filterAndRenderTodos(
      todos,
      search,
      todoCard,
      progressCard,
      feedbackCard,
      doneCard
    );

    // Check if the filtered lists are empty
    checkEmptyList();
    checkEmptyListProgress();
    checkEmptyListFeedback();
    checkEmptyListDone();
  }
}

/**
 * This function filters and renders a list of todos based on a search criteria. It accepts the following parameters:
 *
 * @param {object} todos - tasks in the todos array
 * @param {string} search - value of the search field
 * @param {object} todoCard - tasks in the todoCard list
 * @param {object} progressCard - tasks in the progressCard list
 * @param {object} feedbackCard - tasks in the feedbackCard list
 * @param {object} doneCard - tasks in the doneCard list
 */
function filterAndRenderTodos(
  todos,
  search,
  todoCard,
  progressCard,
  feedbackCard,
  doneCard
) {
  for (let index = 0; index < todos.length; index++) {
    const element = todos[index];
    if (
      element.title.toLowerCase().includes(search) ||
      element.description.toLowerCase().includes(search)
    ) {
      if (element.status === "todo") {
        todoCard.innerHTML += generateTodoHTML(element);
        listdesign(element);
      } else if (element.status === "inProgress") {
        progressCard.innerHTML += generateTodoHTML(element);
        listdesign(element);
      } else if (element.status === "feedback") {
        feedbackCard.innerHTML += generateTodoHTML(element);
        listdesign(element);
      } else if (element.status === "done") {
        doneCard.innerHTML += generateTodoHTML(element);
        listdesign(element);
      }
    }
  }
}

// -------------Edit Task popup---------------

/**
 * Opens the task edit popup.
 * @param {number} taskId - ID of the task to be edited.
 */
function openEditPopup(taskId) {
  const task = getTaskById(taskId);
  if (!task) {
    return;
  }
  const popupContentHtml = generatePopupContentHtml(task, taskId);
  displayPopupContent(popupContentHtml);
  setupPopupListeners(taskId);
}

/**
 * Retrieves a task by its ID.
 * @param {number} taskId - ID of the task to retrieve.
 * @returns {Object} The task object.
 */
function getTaskById(taskId) {
  return todos.find((t) => t.id === Number(taskId));
}

/**
 * Generates the HTML content for the task popup.
 * @param {Object} task - Task data.
 * @param {number} taskId - ID of the task.
 * @returns {string} HTML string for the task popup.
 */
function generatePopupContentHtml(task, taskId) {
  const imagePath = getImagePath(task.prio);
  const assignedPersonsHtml = generateAssignedPersonsHtml(task.assignedTo);
  return `
    <div class="edit-wrap">
      <div class="popUp-head-task">
        <div class="task-category-one" style="background-color:${task.color};">${task.category}</div>
        <img onclick="closeEditPopup()" class="close-popUp-xx display-none" src="./asssets/img/popUp-close.svg" alt="" />
      </div>
      <span class="popUp-titled">${task.title}</span>
      <p class="popUp-description">${task.description}</p>
      <div class="popUp-date">
        <span class="bolder">Due date:</span>
        <span>${task.dueDate}</span>
      </div>
      <div class="popUp-prio">
        <span class="bolder">Priority:</span>
        <div class="popUp-prio-btn">
          <img src="${imagePath}" alt="" />
        </div>
      </div>
      ${assignedPersonsHtml}
      <div class="btns-responsive">
        <div></div>
        <div class="popUp-btns secondTypebtns">
          <div id="popUpDelete" class="popUp-delete-responsive" data-id="${taskId}">
            <img src="./asssets/img/popUpDelete.svg" alt="" />
          </div>
          <div class="popUp-edit-responsive" onclick="editingTask(${taskId})">
            <img src="./asssets/img/popUpEditPen.svg" alt="" />
          </div>
        </div>
      </div>
    `;
}

/**
 * Returns the image path based on the priority object.
 * @param {Object} priorityObject - Priority data object.
 * @returns {string} Path to the corresponding image.
 */
function getImagePath(priorityObject) {
  switch (priorityObject.path) {
    case "./asssets/img/inProgress-icon.svg":
      return "./asssets/img/urgent-edit-task.svg";
    case "./asssets/img/Feedback-icon.svg":
      return "./asssets/img/medium-edit-task.svg";
    case "./asssets/img/toDo-icon.svg":
      return "./asssets/img/low-edit-task.svg";
    default:
      return priorityObject.path;
  }
}

/**
 * Generates HTML content for assigned persons.
 * @param {Array} assignedPersons - Array of persons assigned to a task.
 * @returns {string} HTML string for the assigned persons.
 */
function generateAssignedPersonsHtml(assignedPersons) {
  return assignedPersons
    .map(
      (person) => `
    <div class="assignedTo-divE">
      <div class="assignedTo-iconE ${person.iconColor}">${person.initials}</div>
      <div class="assignedTo-name">${person.name}</div>
    </div>
  `
    )
    .join("");
}

/**
 * Displays the provided popup content.
 * @param {string} content - HTML content to display in the popup.
 */
function displayPopupContent(content) {
  document.querySelector(".task-overlay-popup").classList.add("active");
  document.getElementById("taskContent").innerHTML = content;
}

/**
 * Sets up event listeners for the task popup.
 * @param {number} taskId - ID of the task.
 */
function setupPopupListeners(taskId) {
  document.getElementById("taskContent").addEventListener("click", (event) => {
    if (event.target.closest("#popUpDelete")) {
      const taskId = event.target.closest("#popUpDelete").dataset.id;
      deleteTask(taskId);
      closeEditPopup();
    }
  });
}

/**
 * Closes the task edit popup.
 */
function closeEditPopup() {
  document.querySelector(".task-overlay-popup").classList.remove("active");
  document.getElementById("taskContent").innerHTML = "";
}

/**
 * Deletes a task by its ID.
 * @param {number} id - ID of the task to be deleted.
 */
async function deleteTask(id) {
  id = Number(id);
  const taskIndex = todos.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    todos.splice(taskIndex, 1);
    await setItem("task", JSON.stringify(todos));
    updateHTML();
    closeEditPopup();
  }
}

/**
 * Toggles the display of the dropdown contacts.
 * @param {number} taskId - ID of the task.
 */
function openDropDownContacts(taskId) {
  let contactsContainer = document.getElementById("contacts-container");
  contactsContainer.innerHTML = "";
  if (contactsContainer.style.display === "flex") {
    contactsContainer.style.display = "none";
  } else {
    contactsContainer.style.display = "flex";
  }
}

//editing task

/**
 * Edits an existing task based on its ID.
 * @param {number} taskId - The ID of the task to be edited.
 */
function editingTask(taskId) {
  const task = todos.find((t) => t.id === Number(taskId));

  if (!task) {
    return;
  }

  closeEditPopup();
  openPopup(taskId);
  populateTaskDetails(task);
  populateAssignedPersons(task.assignedTo);
  setTaskPriority(task.prio);
  populateSubtasks(task.subtasks);
  setupButtons(taskId);
}

/**
 * Populates the task details into the corresponding input elements.
 * @param {Object} task - The task whose details are to be displayed.
 */
function populateTaskDetails(task) {
  document.getElementById("title-input").value = task.title;
  document.getElementById("description-input").value = task.description;

  const categoryElement = document.getElementById("select-one");
  categoryElement.querySelector("span").textContent = task.category;
  categoryElement.querySelector(".circle").style.backgroundColor = task.color;

  document.querySelector(".date-input-container input").value = task.dueDate;
  document.getElementById("create-button").style.display = "none";
}

/**
 * Populates the assigned persons into the corresponding input elements.
 * @param {Array} assignedPersons - The list of persons the task is assigned to.
 */
function populateAssignedPersons(assignedPersons) {
  const assignedToElement = document.getElementById("dropdown-assign");
  const checkboxes = assignedToElement.querySelectorAll(
    'input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const selectedContactDiv = document.getElementById("selected-contact");
  assignedPersons.forEach((person) => {
    addAssignedPersonToUI(selectedContactDiv, person.name);
  });
}

/**
 * Adds an assigned person to the UI.
 * @param {HTMLElement} container - The HTML element to which the person should be added.
 * @param {string} personName - The name of the person to be added.
 */
function addAssignedPersonToUI(container, personName) {
  const selectedContact = contacts.find(
    (contact) => contact.name === personName
  );
  if (selectedContact) {
    let contactDiv = createContactDiv(selectedContact);
    container.appendChild(contactDiv);

    const checkbox = document.querySelector(
      `input[type="checkbox"][id="checkbox-${personName.toLowerCase()}"]`
    );
    if (checkbox) {
      checkbox.checked = true;
    }
  }
}

/**
 * Creates a div element for the contact.
 * @param {Object} contact - The contact object for which a div is to be created.
 * @returns {HTMLElement} The created div element for the contact.
 */
function createContactDiv(contact) {
  let contactDiv = document.createElement("div");
  contactDiv.classList.add(contact["icon-color"]);
  contactDiv.style.borderRadius = "50%";
  contactDiv.style.width = "50px";
  contactDiv.style.height = "50px";
  contactDiv.style.display = "flex";
  contactDiv.style.justifyContent = "center";
  contactDiv.style.alignItems = "center";
  contactDiv.style.color = "white";
  contactDiv.textContent = contact.initials;
  return contactDiv;
}

/**
 * Sets the priority for a task.
 * @param {Object} priority - The priority object containing the priority's ID.
 */
function setTaskPriority(priority) {
  const priorityMappings = {
    urgent: "./asssets/img/urgent-toggle.svg",
    medium: "./asssets/img/medium-urgent-toggle.svg",
    low: "./asssets/img/low-urgent-toggle.svg",
  };

  if (priorityMappings[priority.id]) {
    document.getElementById(priority.id).src = priorityMappings[priority.id];
  }
}

/**
 * Populates the subtasks into the corresponding input elements.
 * @param {Array} subtasks - The list of subtasks to be displayed.
 */
function populateSubtasks(subtasks) {
  const subtasksContainer = document.getElementById("subtasks");
  subtasksContainer.innerHTML = "";

  subtasks.forEach((subtask) => {
    const subtaskDiv = document.createElement("div");
    subtaskDiv.className = "subtask";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = subtask.id;
    checkbox.name = subtask.name;
    checkbox.className = "checkbox-subtask";
    checkbox.checked = subtask.checked;

    const label = document.createElement("label");
    label.className = "subtask-name";
    label.htmlFor = subtask.id;
    label.textContent = subtask.name;

    subtaskDiv.appendChild(checkbox);
    subtaskDiv.appendChild(label);
    subtasksContainer.appendChild(subtaskDiv);
  });
}

/**
 * Configures the buttons in the edit mode.
 * @param {number} taskId - The ID of the task being edited.
 */
function setupButtons(taskId) {
  const btnDiv = document.querySelector(".btn-div");
  btnDiv.innerHTML = "";

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button-edit");
  cancelButton.addEventListener("click", () => {
    closePopup();
  });
  btnDiv.appendChild(cancelButton);

  const okButton = document.createElement("button");
  okButton.textContent = "OK";
  okButton.classList.add("ok-button");
  okButton.addEventListener("click", (event) => {
    event.preventDefault();
    saveTask(taskId);
  });
  btnDiv.appendChild(okButton);
}

/**
 * Save the task details based on the provided task ID.
 * @param {number} taskId - The ID of the task to save.
 */
async function saveTask(taskId) {
  const taskDetails = {
    title: document.getElementById("title-input").value,
    description: document.getElementById("description-input").value,
    category: document.getElementById("select-one").querySelector("span")
      .textContent,
    color: document.getElementById("select-one").querySelector(".circle").style
      .backgroundColor,
    dueDate: document.querySelector(".date-input-container input").value,
    assignedTo: getAssignedTo(),
    subtasks: getSubtasks(),
    prio: getSelectedPrioImage().prio,
  };

  const taskIndex = todos.findIndex((task) => task.id === Number(taskId));

  if (taskIndex !== -1) {
    Object.assign(todos[taskIndex], taskDetails);
  }

  await finalizeTaskUpdates();
}

/**
 * Retrieve the subtasks from the DOM.
 * @returns {Array} - An array of subtask objects.
 */
function getSubtasks() {
  return Array.from(document.querySelectorAll(".subtask")).map(
    (subtaskElement) => ({
      id: subtaskElement.querySelector(".checkbox-subtask").id,
      name: subtaskElement.querySelector(".subtask-name").textContent,
      checked: subtaskElement.querySelector(".checkbox-subtask").checked,
    })
  );
}

/**
 * Finalize the task updates, render the changes, and persist them.
 */
async function finalizeTaskUpdates() {
  updateHTML();
  await setItem("task", JSON.stringify(todos));
  location.reload();
  closeEditPopup();
  closePopup();
}
