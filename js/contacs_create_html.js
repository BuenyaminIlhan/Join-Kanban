/**
 * This function is used to create the necessary html block for the edit contact page 
 * @param {number} i - the index of the contact to be editted.
 * @param {object} contact - the Jason array that contains the data of the contact to be editted.
 * @returns - the html block for the edit contact page.
 */
function createEditContactPageHtml(i, contact){
    return `
    <div class="edit-contact-frame">
            <div class="edit-contact-head">
                <div onclick="closeEditContacts()" class="x-container">
                    <img class="close-x" src="./asssets/img/close-x.svg" alt="close x-icon">
                </div>
                <img class="join-logo-white d-none" src="./asssets/img/join-logo-white.svg" alt="Join logo">
                <h1 class="white">Edit Contact</h1>
                <hr id="hr-blue-small-left" class="hr-blue-small-left">
            </div>
            <div class="edit-contact-bottom">
                <span id="logo-bigger${i}" class="contact-logo-bigger ${contact['icon-color']}">TW</span>
                <form onsubmit="editContact(${contact['id']},${i}); return false">
                    <div class="close-x-dark-container" onclick="closeEditContacts()">
                        <img class="close-x-dark d-none" src="./asssets/img/close-x-dark.svg" alt="close x">
                    </div>
                    <div class="input-field-top input-top-edit">
                            <input required id="name-displayed${i}" class="name-input" type="text"  placeholder="Name">
                        <img src="./asssets/img/name-head.svg" alt="name icon">
                    </div>
                    <div class="input-field">
                        <input required class="email-input" id="email-displayed${i}" type="email" placeholder="Email">
                        <img src="./asssets/img/email-icon.svg" alt="email icon">
                    </div>
                    <div class="input-field">
                        <input required id="phone-displayed${i}" class="tel-input" type="text" pattern="[0-9\\s]*" placeholder="Phone">
                        <img src="./asssets/img/tel.svg" alt="name icon">
                    </div>
                    <div class="delete-save">
                        <div onclick="deleteContact(${i})" class="delete">Delete</div>
                        <button class="save">
                            <div class="create-contact-text white">Save</div>
                        </button>
                 </form>
            </div>
    `;
}

/**
 * This function is used to create the necessary html block to display the contact details in the mobile version.
 * @param {number} i - the index of the current contact. 
 * @param {object} contact - is the JASON with the data of the current contact.
 * @returns @returns - the html block to be added.
 */
function createContactDetailsMobileHtml(i, contact){
    return `
    <div id="big-contact-frame" class="big-contact-frame">
                <div class="big-contact-frame-header">
                    <h3 class="kpmt">Kanban Project Management Tool</h3>
                    <div onclick="closeContactDetails(${i})" class="h1-back-arrow">
                        <div class="order1">
                            <h1>Contacts</h1>
                        </div>
                        <img class="back-arrow" src="./asssets/img/arrow-left-line.svg" alt="back arrow">
                    </div>
                    <div class="order3">
                        <h3 class="better-with-a-team">Better with a team</h3>
                    </div>
                    <div class="order2">
                        <hr class="hr-blue-small-left">
                    </div>
                </div>
                <div id="desktop-hidden">
                    <div class="name-add-task-logo">
                        <span id="contact-logo-big${i}" class="contact-logo-big ${contact['icon-color']}">AM</span>
                        <div class="name-add-task">
                            <span id="big-name${i}" class="big-name">Anton Mayer</span>
                            <span id="addTaskOpen" class="email">+ Add Task</span>
                        </div>
                    </div>
                    <div class="contact-information-frame">
                        <h3 class="contact-information">Contact Information</h3>
                        <div class="edit-pen" onclick="openEditContacts(${i})">
                            <img onmousemove="changePenColorToBlue()" onmouseleave="changePenColorToBlack()"
                                id="edit-contact-logo" class="edit-contact-logo" src="./asssets/img/edit-contact.svg"
                                alt="edit contact logo">
                            <span class="edit-contact-text">Edit Contact</span>
                        </div>
                    </div>
                    <div class="email-data">
                        <span class="email-head">Email</span>
                        <span id="email-adress${i}" class="email-adress-blue">antom@gmail.com</span> 
                    </div>
                    <div class="mobile-data">
                        <span class="mobile-head">Mobil</span>
                        <span id="mobile-number${i}" class="mobile-number-blue">+49 1111 111 11 1</span>
                    </div>
                </div>
                <div class="delet-edit-frame">
                    <img onclick="deleteContact(${i})" class="bin" src="./asssets/img/delete-bin.svg" alt="delete bin">
                    <img onclick="openEditContacts(${i})" class="pen" src="./asssets/img/edit.svg" alt="edit pen">
                </div>
                <div onclick="openAddContactsOverlay()" class="new-contact-container-2">
                    <span>New Contact</span>
                    <img src="./asssets/img/new-contact.svg" alt="New Contact">
                </div>
            </div>
        </div>
    `;
}

/**
* This function is used to create the necessary html block to display the contact details in the desktop version. 
* @param {number} i -the index of the current contact.
* @param {object} contact - the JASON with the data of the current contact.
* @returns - the html block to be added.
*/
function createContactDetailsDesktopHtml(i, contact){
    return `
    <div class="name-add-task-logo">
                        <span id="contact-logo-big${i}" class="contact-logo-big ${contact['icon-color']}"></span>
                        <div class="name-add-task">
                            <span id="big-name${i}" class="big-name">Anton Mayer</span>
                            <span id="addTaskOpen" class="email">+ Add Task</span>
                        </div>
                    </div>
                    <div class="contact-information-frame">
                        <h3 class="contact-information">Contact Information</h3>
                        <div class="edit-pen" onclick="openEditContacts(${i})">
                            <img onmousemove="changePenColorToBlue()" onmouseleave="changePenColorToBlack()"
                                id="edit-contact-logo" class="edit-contact-logo" src="./asssets/img/edit-contact.svg"
                                alt="edit contact logo">
                            <span class="edit-contact-text">Edit Contact</span>
                        </div>
                    </div>
                    <div class="email-data">
                        <span class="email-head">Email</span>
                        <span id="email-adress${i}" class="email-adress-blue">antom@gmail.com</span>
                    </div>
                        <div class="mobile-data">
                            <span class="mobile-head">Mobil</span>
                            <span id="mobile-number${i}" class="mobile-number-blue">+49 1111 111 11 1</span>
                        </div>    
    `;
}

/**
 * This This function is used to insert a html block with h2 heading. This is necessary if the first letter of the initials of the previous contact does not correspond to that of the current contact.
 * @param {number} i - the in Index of the current contact.
 * @param {object} contact - the JASON with the data of the current contact.
 * @returns - the html block to be added
 */
function returnHtmlWithH2(i, contact){
    return `
    <div class="letter-frame">
        <h2 id="letter${i}"></h2>
        <hr class="standard-hr">
        <div onclick="openContactDetails(${i})" class="single-contact-frame">
            <span id="logo${i}" class="contact-logo ${contact['icon-color']}"></span>
            <div class="name-and-email">
                <span id="name${i}" class="name"></span>
                <span id="email${i}" class="email"></span>
            </div>
        </div>
    </div>
    `;
    }

/**
 * This function is used to insert a html block without h2 heading. This is necessary if the first letter of the initials of the previous contact corresponds to that of the current contact.
 * @param {*} i - the in Index of the current contact.
 * @param {*} contact - the JASON with the data of the current contact.
 * @returns - the html block to be added.
 */
    function returnHtmlWithoutH2(i, contact){
        return `
        <div class="letter-frame">
            <div onclick="openContactDetails(${i})" class="single-contact-frame">
                <span id="logo${i}" class="contact-logo ${contact['icon-color']}"></span>
                <div class="name-and-email">
                    <span id="name${i}" class="name"></span>
                    <span id="email${i}" class="email"></span>
                </div>
            </div>
        </div>
        `;
        }