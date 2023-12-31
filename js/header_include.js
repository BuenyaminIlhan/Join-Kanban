/**
 * This method is an asynchronous function that calls two other functions, headerIncludeHTML() and footerIncludeHTML(), and awaits their completion before returning.
 * The headerIncludeHTML() function is likely responsible for including the HTML code for the header of a web page, while the footerIncludeHTML() function is likely responsible for including the HTML code for the footer of the same web page.
 * The await keyword is used to pause the execution of the init() function until the completion of the headerIncludeHTML() and footerIncludeHTML() functions.
 * This ensures that the HTML code for the header and footer are included before the rest of the page content is loaded.
 */
async function init() {
  await headerIncludeHTML();
  await footerIncludeHTML();
}

/**
 * This method is an asynchronous function that includes HTML content from external files into HTML elements with the attribute "w3-header-include-html".
 * It uses the fetch API to retrieve the content of the external file and then replaces the innerHTML of the corresponding HTML element with the retrieved content. If the fetch request fails, the innerHTML of the HTML element is set to "Page not found".
 * This method is useful for including dynamic content into a web page without having to manually copy and paste the content into the HTML file.
 */
async function headerIncludeHTML() {
  let includeElements = document.querySelectorAll("[w3-header-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-header-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * Is the same function for footer.
 */
async function footerIncludeHTML() {
  let includeElements = document.querySelectorAll("[w3-footer-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-footer-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * This function is used for a dropdown menu in the header. It retrieves the element with the ID `'burger-menu'` and displays it by setting the CSS `display` property of the element with the ID `'background-container'` to `'block'`.
 * The variable `firstClick` is likely used to track the state of the menu when it is clicked for the first time.
 */
function burgerMenu() {
  let burgerMenu = document.getElementById("burger-menu");
  document.getElementById("background-container").style.display = "block";
  firstClick = true;
}

/**
 * This function is used to close the dropdown menu.
 * It checks if the event target's ID is either `'web-header'`, `'background-container'`, `'header'`, or `'nav-bar'`, and if so, it sets the CSS `display` property of the element with the ID `'background-container'` to `'none'`, effectively hiding the dropdown menu.
 */
function closeBurgerMenu() {
  if (
    event.target.id === "web-header" ||
    event.target.id === "background-container" ||
    event.target.id === "header" ||
    event.target.id === "nav-bar"
  ) {
    document.getElementById("background-container").style.display = "none";
  }
}

/**
 * @param {registered user} user
 * This function performs a guest login operation. If the window width is less than or equal to 1024 pixels, it replaces the content of the HTML element with the ID `'body'` with the HTML generated by the `generateGuestLoginHTML()` function.
 * t then displays a user greeting for mobile devices and includes header and footer HTML content.
 * Otherwise, it proceeds to load a summary for the user. Additionally, it sets a timeout of 1500 milliseconds to also load the summary after a delay.
 */
function guestLogin(user) {
  let windowWidth = window.innerWidth;
  if (windowWidth <= 1024) {
    document.getElementById("body").innerHTML = "";
    document.getElementById("body").innerHTML = generateGuestLoginHTML();
    userGreetingMobile(user);
    headerIncludeHTML();
    footerIncludeHTML();
  } else {
    loadSummary(user);
  }
  setTimeout(function () {
    loadSummary(user);
  }, 1500);
}

/**
 * @param {registered user} user
 * This function handles the login process for guest users.
 * It checks the window width and if it's less than or equal to 1024 pixels, it generates the HTML for the guest login page and displays it.
 * It also includes the necessary headers and footers. If the window width is greater than 1024 pixels, it loads the summary page directly.
 * After a delay of 1.5 seconds, it also loads the summary page.
 */
function loadSummary(user) {
  loadUsers();
  if (user) {
    usersGreeting(user);
  }
  let windowWidth = window.innerWidth;
  if (windowWidth >= 1024) {
    window.location.href = "./summary.html";
  } else {
    changePage();
    setTimeout(function () {
      fetch("./summary.html")
        .then((response) => response.text())
        .then((data) => {
          let parser = new DOMParser();
          parser.parseFromString(data, "text/html");
          window.location.href = "summary.html";
        });
    }, 1500);
  }
}

/**
 * This function changes the currently displayed page on a website.
 * It selects the current page based on its CSS class, removes the 'show' class from it, and adds the 'show' class to the next page in the HTML structure.
 */
function changePage() {
  let currentPage = document.querySelector(".page.show");
  let nextPage = currentPage.nextElementSibling;
  nextPage.classList.add("show");
}