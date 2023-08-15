let categories = [];
let selectedColor = null;
const subtasks = [];
/**
 * Asynchronously load contacts from storage.
 */
async function loadContactsForAssign() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    alert("Daten konten nicht geladen werden!");
  }
  populateContactList();
}

/**
 * Asynchronously load tasks from storage.
 */
async function loadNewtasks() {
  try {
    todos = JSON.parse(await getItem("task"));
  } catch (e) {
    alert("Error");
  }
}

/**
 * Creates a notification and shows it for 1.5 seconds.
 *
 * @param {string} message - The notification message.
 */
function displayCustomPopup(message) {
  const popup = document.getElementById("myCustomPopup");
  const popupMessage = document.getElementById("popupNote");
  const popupClose = document.getElementById("popupDismiss");
  popupMessage.innerText = message;
  popup.style.display = "block";
  setTimeout(function () {
    popup.style.display = "none";
  }, 2000);
  popupClose.onclick = function () {
    popup.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == popup) {
      popup.style.display = "none";
    }
  };
}

function validateForm() {
  const fieldChecks = [
    {
      value: document.getElementById("title-input").value,
      message: "Bitte geben Sie einen Titel ein.",
    },
    {
      value: document.getElementById("description-input").value,
      message: "Bitte geben Sie eine Beschreibung ein.",
    },
    {
      value:
        document.getElementById("select-one").innerText !==
        "Select task category",
      message: "Bitte wählen Sie eine Kategorie aus.",
    },
    {
      value: getAssignedTo().length > 0,
      message: "Bitte weisen Sie die Aufgabe einer Person zu.",
    },
    {
      value: document.querySelector(".date-input-container input").value,
      message: "Bitte geben Sie ein Fälligkeitsdatum ein.",
    },
    {
      value: getSelectedPrioImage() !== null,
      message: "Bitte wählen Sie eine Priorität aus.",
    },
  ];
  for (const check of fieldChecks) {
    if (!check.value) {
      displayCustomPopup(check.message);
      return false;
    }
  }
  return true;
}

/**
 * Collects and creates a new task, adds it to task array, and updates UI.
 */
async function createTask() {
  if (!validateForm()) {
    return;
  }
  let title = document.getElementById("title-input").value;
  let description = document.getElementById("description-input").value;
  let category = document.getElementById("select-one").innerText;
  let assignedTo = getAssignedTo();
  let dueDate = document.querySelector(".date-input-container input").value;
  let taskId = calculateId();
  let subtasks = collectSubtasks();
  let selectedPrioImage = getSelectedPrioImage();
  let newTask = createNewTask(
    taskId,
    title,
    description,
    category,
    assignedTo,
    dueDate,
    subtasks,
    selectedPrioImage.prio,
    selectedColor
  );
  await addTaskToArray(newTask);
  await setItem("task", JSON.stringify(todos));
  resetInputFields();
  showTaskAddedNotification();
}

/**
 * Collects subtasks from the current DOM elements.
 * @returns {Array} An array of subtask objects, each object contains the properties: id, name, and checked.
 */
function collectSubtasks() {
  let subtasks = [];
  const subtaskElements = document.querySelectorAll(".subtask");
  subtaskElements.forEach((subtaskElement, index) => {
      const checkbox = subtaskElement.querySelector(".checkbox-subtask");
      const label = subtaskElement.querySelector(".subtask-name");

      // Fehlerbehandlung: Überprüfen Sie, ob label und checkbox existieren.
      if (!label || !checkbox) {
          
          return;  // Skip this iteration
      }

      const subtaskObj = {
          id: index,
          name: label.textContent,
          checked: checkbox.checked,
      };

      subtasks.push(subtaskObj);
  });
  return subtasks;
}

/**
 * Creates a new task object with provided data.
 *
 * @param {number} taskId - The id of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} category - The category of the task.
 * @param {string} assignedTo - The individual assigned to the task.
 * @param {string} dueDate - The due date of the task.
 * @param {Object[]} subtasks - An array of subtask objects.
 * @param {Object} prio - The object containing priority id and path to the image representing task priority.
 * @return {Object} The created task object.
 */
function createNewTask(
  taskId,
  title,
  description,
  category,
  assignedTo,
  dueDate,
  subtasks,
  prio,
  selectedColor
) {
  return {
    id: taskId,
    status: "todo",
    title: title,
    description: description,
    category: category,
    assignedTo: assignedTo,
    dueDate: dueDate,
    prio: prio,
    subtasks: subtasks,
    color: selectedColor,
  };
}

/**
 * Asynchronously adds a new task to the task array and saves it to storage.
 *
 * @param {Object} newTask - The task to add.
 */
async function addTaskToArray(newTask) {
  todos.push(newTask);
  // todos.splice(0, todos.length);
  // todos.splice(0, todos.length);
  await setItem("task", JSON.stringify(todos));
}

/**
 * Displays a notification indicating that a task was added.
 */
function showTaskAddedNotification() {
  const taskAddedContainer = document.querySelector(".task-added-container");
  const taskAdded = document.getElementById("task-added");
  taskAdded.style.animation = "slideInFromBottom 1s forwards";
  taskAddedContainer.style.display = "flex";
  setTimeout(() => {
    window.location.href = "board.html";
  }, 1500);
}

/**
 * Resets all input fields in the UI.
 */
function resetInputFields() {
  document.getElementById("title-input").value = "";
  document.getElementById("description-input").value = "";
  document.getElementById("assign-one").innerText = "Select assigned person";
  document.querySelector(".date-input-container input").value = "";
  document.getElementById("subTask").value = "";
  document.getElementById("selected-contact").innerHTML = "";
  const subtasksContainer = document.getElementById("subtasks");
  subtasksContainer.innerHTML = "";
  resetImages();
  resetAssignedTo();
  resetTaskCategoryDropdown();
  resetSelectedCategory();
}

/**
 * Calculates a unique ID for a new task.
 *
 * @return {number} The calculated unique ID.
 */
function calculateId() {
  if (todos.length === 0) {
    return 0;
  }
  const maxId = Math.max(...todos.map((task) => task.id));
  return maxId + 1;
}

/**
 * Manages the dropdown for selecting task category.
 */
function selectTaskCategory() {
  let dropdown = document.getElementById("dropdown");
  let selectOne = document.getElementById("select-one");
  let selectThree = document.getElementById("selected-three");
  if (dropdown.classList.contains("d-none")) {
    dropdown.classList.remove("d-none");
    selectOne.style.borderRadius = "10px 10px 0 0";
    selectOne.style.borderBottom = "none";
    selectThree.style.borderRadius = "0 0 10px 10px";
  } else {
    dropdown.classList.add("d-none");
    selectOne.style.borderRadius = "10px";
    selectOne.style.borderBottom = "";
  }
  if (
    window.location.pathname.includes("board.html") ||
    window.location.pathname.includes("contacts.html")
  ) {
    checkScrollbar();
  }
}

/**
 * Shows the fields for adding a new task category.
 */
function showNewCategoryFields() {
  document.getElementById("select-one").classList.add("d-none");
  document.getElementById("new-category-fields").classList.remove("d-none");
  document.getElementById("dropdown").classList.add("d-none");
  if (
    window.location.pathname.includes("board.html") ||
    window.location.pathname.includes("contacts.html")
  ) {
    checkScrollbar();
  }
}

/**
 * Gets the selected text and color elements from the event target.
 *
 * @param {Event} event - The DOM event from the click
 * @return {Object} An object containing the selected text and color div elements
 */
function getSelectedElements(event) {
  const selectedText = event.target.querySelector("span").cloneNode(true);
  const selectedColorDiv = event.target.querySelector(".circle")
    ? event.target.querySelector(".circle").cloneNode(true)
    : null;
  return { selectedText, selectedColorDiv };
}

/**
 * Updates the select one container with the selected text and color elements.
 *
 * @param {HTMLElement} selectOne - The select one element
 * @param {Object} selectedElements - An object containing the selected text and color div elements
 */
function updateSelectOneContainer(selectOne, selectedElements) {
  const { selectedText, selectedColorDiv } = selectedElements;
  const textAndColorContainer = selectOne.querySelector("div");
  if (textAndColorContainer) {
    textAndColorContainer.innerHTML = "";
    textAndColorContainer.appendChild(selectedText);
    if (selectedColorDiv) {
      textAndColorContainer.appendChild(selectedColorDiv);
    }
  }
}

/**
 * Updates the dropdown and select one styles.
 *
 * @param {HTMLElement} dropdown - The dropdown element
 * @param {HTMLElement} selectOne - The select one element
 */
function updateDropdown(dropdown, selectOne) {
  dropdown.classList.add("d-none");
  if (selectOne) {
    selectOne.style.borderRadius = "10px";
    selectOne.style.borderBottom = "";
  }
}

/**
 * Updates the selected color container with the selected color div.
 *
 * @param {HTMLElement} selectedColorContainer - The selected color container element
 * @param {HTMLElement} selectedColorDiv - The selected color div element
 */
function updateSelectedColorContainer(
  selectedColorContainer,
  selectedColorDiv
) {
  if (selectedColorContainer) {
    selectedColorContainer.innerHTML = "";
    if (selectedColorDiv) {
      const clonedColorDiv = selectedColorDiv.cloneNode(true);
      selectedColorContainer.appendChild(clonedColorDiv);
    }
  }
}

/**
 * Handles the select option event, updates the UI accordingly and calls additional functions.
 *
 * @param {Event} event - The DOM event from the click
 * @param {string} color - The selected color value
 */
function selectOption(event, color) {
  let selectOne = document.getElementById("select-one");
  let dropdown = document.getElementById("dropdown");
  let selectedColorContainer = document.getElementById("selected-color");
  const { selectedText, selectedColorDiv } = getSelectedElements(event);
  if (selectOne) {
    updateSelectOneContainer(selectOne, { selectedText, selectedColorDiv });
  }
  updateDropdown(dropdown, selectOne);
  updateSelectedColorContainer(selectedColorContainer, selectedColorDiv);
  if (
    window.location.pathname.includes("board.html") ||
    window.location.pathname.includes("contacts.html")
  ) {
    checkScrollbar();
  }
  selectColor(color);
}

/**
 * Selects the priority color. It updates the global selectedColor variable.
 *
 * @param {string} color - The selected color value
 */
function selectColor(color) {
  selectedColor = color;
}

/**
 * Resets the priority color. It clears the global selectedColor variable.
 */
function resetColors() {
  selectedColor = null;
}

/**
 * Clears the input fields, hides the input fields and shows the select task category element.
 */
function cancelNewCategory() {
  document.getElementById("select-one").classList.remove("d-none");
  document.getElementById("new-category-fields").classList.add("d-none");
  document.getElementById("new-category-name").value = "";
}

/**
 * Creates a new category element and inserts it into the dropdown menu.
 * @param {string} newCategoryId - The id of the new category.
 * @param {string} categoryName - The name of the new category.
 * @param {string} color - The color of the new category.
 * @return {HTMLElement} The created category element.
 */
function createAndInsertCategory(newCategoryId, categoryName, color) {
  let newCategory = createCategoryElement(newCategoryId, categoryName, color);
  const dropdown = document.getElementById("dropdown");
  const firstCategory = dropdown.querySelector(".selected");
  dropdown.insertBefore(newCategory, firstCategory);
  return newCategory;
}

/**
 * Updates the UI after a new category is created.
 */
function updateUIAfterCategoryCreation() {
  document.getElementById("select-one").classList.remove("d-none");
  document.getElementById("new-category-fields").classList.add("d-none");
  document.getElementById("new-category-name").value = "";
}

/**
 * Validates the input for a new category.
 *
 * @param {string} categoryName - The name of the new category.
 * @param {string} color - The color of the new category.
 * @return {boolean} Returns true if the inputs are valid, false otherwise.
 */
function validateNewCategoryInputs(categoryName, color) {
  if (!categoryName || !color) {
    alert(
      "Bitte geben Sie einen Kategorienamen ein und wählen Sie eine Farbe aus."
    );
    return false;
  }
  return true;
}

/**
 * Saves a new category, validates the inputs, updates the dropdown menu and UI.
 */
function saveNewCategory() {
  const categoryName = document.getElementById("new-category-name").value;
  if (!validateNewCategoryInputs(categoryName, selectedColor)) return;
  const newCategoryId = categoryName;
  const newCategory = createAndInsertCategory(
    newCategoryId,
    categoryName,
    selectedColor
  );
  selectOption({ target: newCategory }, selectedColor);
  updateUIAfterCategoryCreation();
}

function createCategoryElement(id, name, color) {
  let newCategory = document.createElement("div");
  newCategory.setAttribute("onclick", "selectOption(event)");
  newCategory.className = "selected";
  newCategory.id = id;
  let newCategorySpan = document.createElement("span");
  newCategorySpan.textContent = name;
  let newCategoryColorDiv = document.createElement("div");
  newCategoryColorDiv.style.backgroundColor = color;
  newCategoryColorDiv.className = "circle";
  newCategory.appendChild(newCategorySpan);
  newCategory.appendChild(newCategoryColorDiv);
  return newCategory;
}

/**
 * Resets the selected category. It clears the content and sets a default text.
 * If an image element is found, it also resets the image source.
 */
function resetSelectedCategory() {
  const selectOne = document.getElementById("select-one");
  const textAndImgContainer = selectOne.querySelector("div");
  const defaultText = document.createElement("span");
  defaultText.textContent = "Select task category";
  textAndImgContainer.innerHTML = "";
  textAndImgContainer.appendChild(defaultText);
  const imgElement = textAndImgContainer.querySelector("img");
  if (imgElement) {
    imgElement.src = "the path to the default img";
  }
}

/**
 * Resets the task category dropdown. If the dropdown is visible, it hides the dropdown and adjusts the styles.
 */
function resetTaskCategoryDropdown() {
  let dropdown = document.getElementById("dropdown");
  let selectOne = document.getElementById("select-one");
  if (!dropdown.classList.contains("d-none")) {
    dropdown.classList.add("d-none");
    selectOne.style.borderRadius = "10px";
    selectOne.style.borderBottom = "";
  }
}

/**
 * Shows the dropdown for assigning a person.
 */
function showDropdown() {
  let dropdownAssign = document.getElementById(`dropdown-assign`);
  let assignOne = document.getElementById(`assign-one`);
  let assignThree = document.getElementById(`assigned-three`);
  if (!contacts) {
    return;
  }
  dropdownAssign.classList.remove("d-none");
  assignOne.style.borderRadius = "10px 10px 0 0";
  assignOne.style.borderBottom = "none";
  assignThree.style.borderRadius = "0 0 10px 10px";
  if (
    window.location.pathname.includes("board.html") ||
    window.location.pathname.includes("contacts.html")
  ) {
    checkScrollbar();
  }
}

/**
 * Hides the dropdown for assigning a person.
 */
function hideDropdown() {
  let dropdownAssign = document.getElementById(`dropdown-assign`);
  let assignOne = document.getElementById(`assign-one`);
  dropdownAssign.classList.add("d-none");
  assignOne.style.borderRadius = "10px";
  assignOne.style.borderBottom = "";
  if (
    window.location.pathname.includes("board.html") ||
    window.location.pathname.includes("contacts.html")
  ) {
    checkScrollbar();
  }
}

/**
 * Toggles the display of the dropdown for assigning a person.
 */
function selectAssignedTo() {
  let dropdownAssign = document.getElementById(`dropdown-assign`);
  if (dropdownAssign.classList.contains("d-none")) {
    showDropdown();
  } else {
    hideDropdown();
  }
}

/**
 * Creates a contact div element for the selected contact.
 * @param {Object} selectedContact - The selected contact object.
 * @returns {HTMLElement} The created contact div element.
 */
function createContactDiv(selectedContact) {
  let contactDiv = document.createElement("div");
  contactDiv.classList.add(selectedContact["icon-color"]);
  contactDiv.style.borderRadius = "50%";
  contactDiv.style.width = "50px";
  contactDiv.style.height = "50px";
  contactDiv.style.display = "flex";
  contactDiv.style.justifyContent = "center";
  contactDiv.style.alignItems = "center";
  contactDiv.style.color = "white";
  contactDiv.textContent = selectedContact.initials;
  return contactDiv;
}

/**
 * Adds the contact div element to the selected contact div container.
 * @param {HTMLElement} selectedContactDiv - The container for the selected contact div.
 * @param {HTMLElement} contactDiv - The contact div element to add.
 */
function addContactDivToSelected(selectedContactDiv, contactDiv) {
  selectedContactDiv.appendChild(contactDiv);
}

/**
 * Removes the contact div element from the selected contact div container.
 * @param {HTMLElement} selectedContactDiv - The container for the selected contact div.
 */
function removeContactDivFromSelected(selectedContactDiv) {
  while (selectedContactDiv.firstChild) {
    selectedContactDiv.firstChild.remove();
  }
}

/**
 * Updates the behavior of the dropdown after selecting a contact.
 * @param {HTMLElement} dropdownAssign - The dropdown assign element.
 * @param {HTMLElement} assignOne - The assign one element.
 */
function updateDropdownBehavior(dropdownAssign, assignOne) {
  dropdownAssign.classList.remove("d-none");
  assignOne.style.borderRadius = "10px 10px 0 0";
  assignOne.style.borderBottom = "none";
}

/**
 * Gets the HTML element with the specified ID.
 * @param {string} id - The ID of the element to retrieve.
 * @returns {HTMLElement} The HTML element with the specified ID.
 */
function getElementById(id) {
  return document.getElementById(id);
}

/**
 * Gets the selected contact object from the contacts array based on the selected person name.
 * @param {string} selectedPerson - The name of the selected person.
 * @returns {Object} The selected contact object.
 */
function getSelectedContact(selectedPerson) {
  return contacts.find((contact) => contact.name === selectedPerson);
}

/**
 * Performs operations when a checkbox is checked.
 * @param {Event} event - The DOM event from the checkbox click.
 * @param {Object} selectedContact - The selected contact object.
 * @param {HTMLElement} selectedContactDiv - The container for the selected contact div.
 */
function checkboxCheckedOperations(event, selectedContact, selectedContactDiv) {
  let contactDiv = createContactDiv(selectedContact);
  contactDiv.id = `contact-${selectedContact.name}`;
  addContactDivToSelected(selectedContactDiv, contactDiv);
}

/**
 * Performs operations when a checkbox is unchecked.
 * @param {string} selectedPerson - The name of the selected person.
 * @param {HTMLElement} dropdownAssign - The dropdown assign element.
 * @param {HTMLElement} assignOne - The assign one element.
 */
function checkboxUncheckedOperations(
  selectedPerson,
  dropdownAssign,
  assignOne
) {
  let contactDivToRemove = getElementById(`contact-${selectedPerson}`);
  if (contactDivToRemove) {
    contactDivToRemove.remove();
  }
  updateDropdownBehavior(dropdownAssign, assignOne);
}

/**
 * Handles the selection of a contact for assignment.
 * @param {Event} event - The DOM event from the click.
 */
function selectAssign(event) {
  const assignOne = getElementById("assign-one");
  const dropdownAssign = getElementById("dropdown-assign");
  const selectedContactDiv = getElementById("selected-contact");
  if (event.target.type === "checkbox") {
    const selectedPerson = event.target.parentElement.textContent.trim();
    let selectedContact = getSelectedContact(selectedPerson);
    if (event.target.checked) {
      checkboxCheckedOperations(event, selectedContact, selectedContactDiv);
    } else {
      checkboxUncheckedOperations(selectedPerson, dropdownAssign, assignOne);
    }
  }
  if (
    window.location.pathname.includes("board.html") ||
    window.location.pathname.includes("contacts.html")
  ) {
    checkScrollbar();
  }
}

/**
 * Shows the invite contact fields.
 */
function showInviteContactFields() {
  document.getElementById("assign-one").classList.add("d-none");
  document.getElementById("dropdown-assign").classList.add("d-none");
  document.getElementById("new-contact-fields").classList.remove("d-none");
}

/**
 * Cancels inviting a new contact and resets the fields.
 */
function cancelInviteContact() {
  document.getElementById("assign-one").classList.remove("d-none");
  document.getElementById("dropdown-assign").classList.remove("d-none");
  document.getElementById("new-contact-fields").classList.add("d-none");
  document.getElementById("new-contact-email").value = "";
}

/**
 * Saves the invited contact, validates the email address, and inserts the contact into the dropdown.
 */
function saveInviteContact() {
  const newContactEmail = document.getElementById("new-contact-email").value;
  if (!newContactEmail) {
    alert("Please enter an email address.");
    return;
  }
  const matchedContact = contacts.find(
    (contact) => contact.email === newContactEmail
  );
  if (!matchedContact) {
    alert("No matching contact found.");
    return;
  }
  const contactDiv = document.createElement("div");
  contactDiv.textContent = matchedContact.name;
  contactDiv.className = "selected";
  contactDiv.setAttribute("onclick", "selectAssign(event)");
  document
    .getElementById("dropdown-assign")
    .insertBefore(contactDiv, document.getElementById("assigned-three"));
  cancelInviteContact();
}

/**
 * Validates the email address of the new contact and checks if it matches any existing contacts.
 * @param {string} newContactEmail - The email address of the new contact.
 * @returns {Object} The matched contact object if found, otherwise false.
 */
function validateNewContactEmail(newContactEmail) {
  if (!newContactEmail) {
    alert("Please enter an email address.");
    return false;
  }
  const matchedContact = contacts.find(
    (contact) => contact.email === newContactEmail
  );
  if (!matchedContact) {
    alert("No matching contact found.");
    return false;
  }
  return matchedContact;
}

/**
 * Creates a contact div element for the matched contact and inserts it into the dropdown.
 * @param {Object} matchedContact - The matched contact object.
 */
function createAndInsertContactDiv(matchedContact) {
  const contactDiv = document.createElement("div");
  contactDiv.textContent = matchedContact.name;
  contactDiv.className = "selected";
  contactDiv.setAttribute("onclick", "selectAssign(event)");
  getElementById("dropdown-assign").insertBefore(
    contactDiv,
    getElementById("assigned-three")
  );
}

/**
 * Saves the invited contact by validating the email address, creating and inserting the contact div, and cancelling the invite contact.
 * @returns {void}
 */
function saveInviteContact() {
  const newContactEmail = getElementById("new-contact-email").value;
  const matchedContact = validateNewContactEmail(newContactEmail);
  if (matchedContact) {
    createAndInsertContactDiv(matchedContact);
    cancelInviteContact();
  }
}

/**
 * Retrieves the selected contacts for assignment.
 * @returns {Array<Object>} An array of selected contact objects.
 */
function getAssignedTo() {
  const checkboxes = document.querySelectorAll(
    '#dropdown-assign input[type="checkbox"]'
  );
  const selectedCheckboxes = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  );
  return selectedCheckboxes
    .map((checkbox) => {
      const selectedPerson = checkbox.parentElement.textContent.trim();
      const matchedContact = getSelectedContact(selectedPerson);
      return matchedContact
        ? {
            name: matchedContact.name,
            initials: matchedContact.initials,
            iconColor: matchedContact["icon-color"],
          }
        : null;
    })
    .filter((contact) => contact);
}

document
  .querySelector(".create-btn-desktop")
  .addEventListener("click", createTask);

/**
 * Resets the checkboxes for assigning a person.
 */
function resetCheckboxes() {
  const checkboxes = document.querySelectorAll(
    '#dropdown-assign input[type="checkbox"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
}

/**
 * Resets the assign one element to its default state.
 * @param {HTMLElement} assignOne - The assign one element.
 */
function resetAssignOneElement(assignOne) {
  assignOne.innerHTML =
    '<span>Select assigned person</span><img src="./add_task_img/open.svg" alt="" />';
  assignOne.style.borderRadius = "10px";
  assignOne.style.borderBottom = "";
}

/**
 * Resets the assigned to dropdown and assign one element to their default state.
 */
function resetAssignedTo() {
  const dropdownAssign = getElementById("dropdown-assign");
  const assignOne = getElementById("assign-one");

  resetCheckboxes();
  dropdownAssign.classList.add("d-none");
  resetAssignOneElement(assignOne);
}

/**
 * Erstellt ein neues DIV-Element für einen Kontakt in der Dropdown-Liste.
 *
 * @param {number} i - Der Index des Kontakts im 'contacts'-Array.
 * @returns {HTMLElement} - Das erstellte DIV-Element.
 */
function createNewDiv(i) {
  const newDiv = document.createElement("div");
  newDiv.onclick = selectAssign;
  newDiv.className = "selected space-between";
  newDiv.id = `assigned-${i + 1}`;
  return newDiv;
}

/**
 * Create a SPAN element for the name of a contact.
 *
 * @param {Object} contact - The contact for which the SPAN element is created.
 * @returns {HTMLElement} - Das erstellte SPAN-Element.
 */
function createNameSpan(contact) {
  const nameSpan = document.createElement("span");
  nameSpan.textContent = contact.name;
  return nameSpan;
}

/**
 * Create a checkbox element for a contact.
 * @param {Object} contact - The contact for which the checkbox element is created.
 * @returns {HTMLInputElement} - The created checkbox element.
 */
function createCheckbox(contact) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${contact.name.toLowerCase()}`;
  checkbox.className = "checkbox-style";
  return checkbox;
}

/**
 * Populate the dropdown list with the contacts from the 'contacts' array.
 * @returns {void}
 */
function populateContactList() {
  const dropdownAssign = document.getElementById("dropdown-assign");
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const newDiv = createNewDiv(i);
    const nameSpan = createNameSpan(contact);
    const checkbox = createCheckbox(contact);
    newDiv.appendChild(nameSpan);
    newDiv.appendChild(checkbox);
    dropdownAssign.insertBefore(
      newDiv,
      document.getElementById("assigned-three")
    );
  }
}

/**
 * Toggles the display of the icons wrapper and plus icon.
 * @param {string} displayStatus - The display property value ('block' or 'none') to set on the icons wrapper.
 */
function toggleIcons(displayStatus) {
  const iconsWrapper = document.querySelector(".icons-wrapper");
  const plusIcon = document.querySelector(".plus-icon");
  iconsWrapper.style.display = displayStatus;
  plusIcon.style.display = displayStatus === "block" ? "none" : "block";
}

/**
 * Clears the subtask input field.
 */
function clearInput() {
  const subTaskInput = document.getElementById("subTask");
  subTaskInput.value = "";
}

/**
 * Creates a new subtask element with the provided task value.
 * @param {string} taskValue - The value of the task to create a subtask for.
 * @returns {HTMLElement} The newly created subtask element.
 */
function createSubtaskElement(taskValue) {
  const newSubtask = document.createElement("div");
  newSubtask.className = "subtask";
  const newInput = document.createElement("input");
  newInput.type = "checkbox";
  newInput.id = taskValue;
  newInput.name = taskValue;
  newInput.className = "checkbox-subtask";
  const newLabel = document.createElement("label");
  newLabel.className = "subtask-name";
  newLabel.htmlFor = taskValue;
  newLabel.textContent = taskValue;
  const deleteImage = document.createElement("img");
  deleteImage.id = "delete-subtask";
  deleteImage.src = "./asssets/img/cancel-svg.svg";
  deleteImage.alt = "Delete Subtask";
  deleteImage.onclick = function () {
    newSubtask.remove();
  };
  newSubtask.appendChild(newInput);
  newSubtask.appendChild(newLabel);
  newSubtask.appendChild(deleteImage);
  return newSubtask;
}

/**
 * Adds the provided subtask element to the subtasks container.
 * @param {HTMLElement} newSubtask - The new subtask element to add to the container.
 */
function addSubtaskToContainer(newSubtask) {
  const subtasksContainer = document.getElementById("subtasks");
  subtasksContainer.appendChild(newSubtask);
}

/**
 * Adds the provided subtask to the subtasks array.
 * @param {string} taskValue - The value of the task to create a subtask for.
 * @param {string} newInputId - The id of the new input element.
 */
function addSubtaskToArray(taskValue, newInputId) {
  const newSubtaskObj = {
    id: newInputId,
    name: taskValue,
    checked: false,
  };
  subtasks.push(newSubtaskObj);
}

/**
 * Creates a new subtask, adds it to the subtasks container and subtasks array, and clears the input field.
 */
function createSubtask() {
  const subTaskInput = document.getElementById("subTask");
  let taskValue = subTaskInput.value;
  const newSubtask = createSubtaskElement(taskValue);
  addSubtaskToContainer(newSubtask);
  addSubtaskToArray(taskValue, newSubtask.firstElementChild.id);
  clearInput();
}

/**
 * An object containing the default and selected image paths for each priority level.
 * @type {Object.<string, Object.<string, string>>}
 */
const images = {
  urgent: {
    default: "./asssets/img/urgent-urgent.svg",
    selected: "./asssets/img/urgent-toggle.svg",
  },
  medium: {
    default: "./asssets/img/medium-urgent.svg",
    selected: "./asssets/img/medium-urgent-toggle.svg",
  },
  low: {
    default: "./asssets/img/low-urgent.svg",
    selected: "./asssets/img/low-urgent-toggle.svg",
  },
};

/**
 * Resets the priority images to their default state.
 */
function resetImages() {
  const prioImages = document.querySelectorAll(".prio-img");
  prioImages.forEach((img) => {
    img.src = images[img.id].default;
  });
}

/**
 * Selects the image and changes its source to the "selected" state.
 * @param {Event} event - The DOM event from the click
 */
function selectImage(event) {
  event.target.src = images[event.target.id].selected;
}

/**
 * Adds click event listeners to the priority images. On click, it resets the images and selects the clicked image.
 */
function setupPriorityClick() {
  const prioImages = document.querySelectorAll(".prio-img");
  prioImages.forEach((img) => {
    img.addEventListener("click", function (event) {
      resetImages();
      selectImage(event);
    });
  });
}

setupPriorityClick();

/**
 * Retrieves the priority image that is currently selected.
 * @returns {Object} - An object that contains the id of the selected priority and the path to the corresponding image.
 */
function getSelectedPrioImage() {
  const prioImages = document.querySelectorAll(".prio-img");
  let selectedPriority = "";
  prioImages.forEach((img) => {
    if (img.src.includes("toggle")) {
      selectedPriority = img.id;
    }
  });
  if (!selectedPriority) {
    return null;
  }
  let selectedImagePath = "";
  if (selectedPriority === "urgent") {
    selectedImagePath = "./asssets/img/inProgress-icon.svg";
  } else if (selectedPriority === "medium") {
    selectedImagePath = "./asssets/img/Feedback-icon.svg";
  } else if (selectedPriority === "low") {
    selectedImagePath = "./asssets/img/toDo-icon.svg";
  }
  return { prio: { path: selectedImagePath, id: selectedPriority } };
}
document.addEventListener("DOMContentLoaded", () => {});
