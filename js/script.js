/**
 * The `init()` function in this code performs three tasks. First, it calls the `loadUsers()` function to load user data.
 * Second, it invokes the `setLocalStorage()` function to set data in the local storage.
 * Finally, the function is typically used in the body's `onload` event to ensure these tasks are executed when the webpage loads.
 */
function init() {
  loadUsers();
  setLocalStorage();
}

/**
 * The function "setLocalStorage()" removes any existing value for the key 'name' in the browser's local storage and then sets a new value, which is the string representation of 'Guest', for the same key.
 * This allows storing the name 'Guest' locally within the browser for future use.
 */
function setLocalStorage() {
  localStorage.removeItem("name");
  localStorage.setItem("name", JSON.stringify("Guest"));
}

/**
 * This function toggles the visibility of a password input field.
 * It changes the type of the input field to 'password' to hide the entered text.
 * It also updates the password icon displayed based on whether there is input in the field or not.
 */
function togglePasswordVisibility() {
  document.getElementById("input").type = "password";
  let passwordIcon = document.getElementById("lock-icon-container");
  let input =
    document.getElementById("input").value ||
    document.getElementById("input-confirm").value;
  if (input.length >= 1) {
    passwordIcon.innerHTML =
      '<img onclick="visibilPassword()" class="password-icon" src="./asssets/img/show.svg" alt="">';
  } else {
    passwordIcon.innerHTML =
      '<img id="lock-icon" src="./asssets/img/lock-icon.svg" alt="lock">';
  }
}

/**
 * This function, "visibilPassword," changes the input type of a password field to "text," making the password visible as plain text.
 * It also replaces the lock icon with a hide icon, allowing users to toggle the visibility of the password.
 */
function visibilPassword() {
  let visiblePasswordInput = document.getElementById("input");
  let passwordIcon = document.getElementById("lock-icon-container");
  visiblePasswordInput.type = "text";
  passwordIcon.innerHTML =
    '<img onclick="hidePassword()" class="password-icon" src="./asssets/img/hide.svg" alt="">';
}

/**
 * The "hidePassword" function is a simple code snippet that performs a specific action.
 * It calls another function named "togglePasswordVisibility" to toggle the visibility of a password field.
 * This allows users to hide or show their passwords by executing this function.
 */
function hidePassword() {
  togglePasswordVisibility();
}

/**
 * This function updates the content of a container element with an image of a checked mark.
 * When the image is clicked, it triggers another function to remove the checked mark.
 * The function uses JavaScript to manipulate the HTML elements on a web page.
 */
function checkmarkChecked() {
  let checkMarkContainer = document.getElementById("checkmark-container");
  checkMarkContainer.innerHTML = "";
  checkMarkContainer.innerHTML += `
    <img onclick="checkmarkUnChecked()" src="./asssets/img/checked_full.svg" alt="">
`;
}

/**
 * This function is called "checkmarkUnChecked".
 * It is responsible for clearing the content of a container element with the ID 'checkmark-container' and replacing it with an empty checkbox image.
 * The function also attaches a click event listener to the checkbox image, which triggers another function called "checkmarkChecked" when clicked.
 */
function checkmarkUnChecked() {
  let checkMarkContainer = document.getElementById("checkmark-container");
  checkMarkContainer.innerHTML = "";
  checkMarkContainer.innerHTML = `
    <img class="checkbox-empty" onclick="checkmarkChecked()" src="./asssets/img/checkmark_container.svg" alt="">
    `;
}

/**
 * This function, called "updateArrow", updates the content of an element with the id 'arrow-a' based on the width of the window.
 * If the window width is greater than 1024 pixels, it sets the content to a blue left arrow image.
 * Otherwise, it sets the content to a smaller back arrow image.
 */
function updateArrow() {
  if (window.innerWidth > 1024) {
    document.getElementById("arrow-a").innerHTML = `
        <img src="./asssets/img/arrow-left-blue.svg" style="width:34px; height:34px;">
        `;
  } else {
    document.getElementById("arrow-a").innerHTML = `
        <img src="./asssets/img/back_arrow.svg"style="width:16px; height:16px;">
        `;
  }
}

/**
 * This function, called "signIn," performs the following tasks when invoked:
 * It clears the content inside the element with the ID 'inside-window' and sets its height to 432 pixels.
 * It clears the content inside the element with the ID 'sign-up-container.'
 * It appends the generated HTML for the sign-in form inside the 'inside-window' element.
 * It updates the arrow (presumably for visual purposes).
 * In summary, the signIn function resets certain elements, displays a sign-in form, and updates the arrow.
 */
function signIn() {
  let insideWindow = document.getElementById("inside-window");
  insideWindow.innerHTML = "";
  insideWindow.style.height = "432px";
  document.getElementById("sign-up-container").innerHTML = "";
  insideWindow.innerHTML += generateSignInHtml();
  updateArrow();
}

/**
 * It is the same funciton for forgot password section
 */
function forgotPassword() {
  let insideWindow = document.getElementById("inside-window");
  insideWindow.innerHTML = "";
  insideWindow.style.height = "432px";
  document.getElementById("sign-up-container").innerHTML = "";
  insideWindow.innerHTML += generateForgotHtml();
  updateArrow();
}

/**
 * This function updates the HTML content of an element to display an image of a sent email.
 * It also adds a CSS class to the element for a feedback popup effect.
 * After a delay of 1.5 seconds, it calls another function called "resetPassword()."
 */
function showEmailSendInfo() {
  document.getElementById("sign-up-container").innerHTML =
    '<img id="e-mail-sent-img" src="./asssets/img/An_e-mail_sent.svg" alt="e-mail icon">';
  document
    .getElementById("sign-up-container")
    .classList.add("fedback-popup-container");
  setTimeout(function () {
    resetPassword();
  }, 1500);
}

/**
 * This function, called "resetPassword," performs the following actions:
 * It removes a CSS class from an element with the ID 'sign-up-container,' modifies the content and height of an element with the ID 'inside-window,' generates HTML for resetting a password, updates an image source if the window width is larger than 1024 pixels, and clears the content of an element with the ID 'sign-up-container.'
 */
function resetPassword() {
  document
    .getElementById("sign-up-container")
    .classList.remove("fedback-popup-container");
  let insideWindow = document.getElementById("inside-window");
  insideWindow.innerHTML = "";
  insideWindow.style.height = "455px";
  insideWindow.innerHTML = generateResetPasswordHtml();
  if (window.innerWidth > 1024) {
    document.getElementById("forgot-pass-img-container").innerHTML = `
        <img src="./asssets/img/arrow-left-blue.svg" style="width:34px; height:34px;">
        `;
  }
  document.getElementById("sign-up-container").innerHTML = "";
}

/**
 * The function "showResetPasswordInfo()" updates the content of the 'sign-up-container' element with an image representing password reset.
 * It also adds a CSS class to the container.
 * After a delay of 1.5 seconds, it calls the "indexHTML()" function.
 */
function showResetPasswordInfo() {
  document.getElementById("sign-up-container").innerHTML =
    '<img src="./asssets/img/Reset_your_password.svg">';
  document
    .getElementById("sign-up-container")
    .classList.add("fedback-popup-container");
  setTimeout(function () {
    indexHTML();
  }, 1500);
}
