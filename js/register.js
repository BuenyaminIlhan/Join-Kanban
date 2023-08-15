let users = [];

/**
 * This function loads user data by parsing a JSON string retrieved from the 'users' key using asynchronous operations.
 * If successful, it assigns the parsed data to the variable 'users'.
 * If an error occurs during the loading process, it logs the error message to the console.
 */
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * This function registers a user by disabling the register button, adding the user's email, password, and name to an array called "users," and then saving the updated array to local storage.
 * Finally, it resets the registration form.
 */
async function register() {
  registerBtn.disabled = true;
  users.push({
    email: email.value,
    password: input.value,
    name: userName.value,
  });
  await setItem("users", JSON.stringify(users));
  resetForm();
}

/**
 * The function "resetForm" resets the values of email, input, and userName fields to empty strings and enables the registerBtn.
 * It then calls the function indexHTML().
 * This function is used to clear a form and prepare it for a new registration process.
 *
 */
function resetForm() {
  email.value = "";
  input.value = "";
  userName.value = "";
  registerBtn.disabled = false;
  indexHTML();
}
