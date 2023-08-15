let name = [];

/**
 * This function performs a login operation by retrieving the entered email and password from an HTML form.
 * It then checks if there is a matching user in a collection of users. If a match is found, it proceeds to perform a guest login using the user's information.
 * Otherwise, it displays an error message indicating that the entered email or password is incorrect.
 */
function logIn() {
  let email = document.getElementById("email");
  let password = document.getElementById("input");
  let user = users.find(
    (u) => u.email == email.value && u.password == password.value
  );
  if (user) {
    guestLogin(user);
  } else {
    document.getElementById("wrong-password").innerHTML =
      "The entered email or password is incorrect.";
  }
}

/**
 * @param {registered user} user
 * This function updates the user's name by removing any existing name stored in the local storage, storing the new name, and displaying it on the webpage if the window width is 1024 pixels or less.
 */
function usersGreeting(user) {
  localStorage.removeItem("name");
  name.push(user["name"]);
  localStorage.setItem("name", JSON.stringify(name));
  let windowWidth = window.innerWidth;
  if (windowWidth <= 1024) {
    document.getElementById("user-name").innerHTML = name;
  }
}

/**
 * @param {regisetered user} user
 * This function displays a greeting message based on the current time of day (morning, afternoon, evening, or night) and updates the HTML elements with the appropriate greeting text.
 * It also sets the name of the user if provided, or defaults to 'Guest' if no user is specified.
 */
function userGreetingMobile(user) {
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
  if (user) {
    document.getElementById("user-name").innerHTML = user["name"];
  } else {
    document.getElementById("user-name").innerHTML = "Guest";
  }
}
