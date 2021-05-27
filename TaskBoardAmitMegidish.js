window.onload = initTaskBoard;

// Inputs of the form.
const taskDescription = document.querySelector("#task-description");
const dueDate = document.querySelector("#due-date");
const dueTime = document.querySelector("#due-time");

// Buttons of the form.
const clearButton = document.querySelector("#clear-button");
const addTaskButton = document.querySelector("#add-task-button");

// Alerts User about missing details. 
const taskAlert = document.querySelector("#empty-fields-alert");

// Removes the alert.
function removeAlert() {
    taskAlert.style.display = "none";
}

// Location for notes to be added.
const notesContainer = document.querySelector("#notes-container");

// Retrives notes from local storage and makes sure that the form is cleared.
function initTaskBoard() {
    let notes = JSON.parse(localStorage.getItem("storageNotes"));
    if (notes) {
        for (let i = 0; i < notes.length; i++) {
            addNote(notes[i].id, notes[i].text, notes[i].date, notes[i].time);
        }
    }
    clearForm();
}

// Makes Inputs show current date and time as default values.
function CurrentDateTime() {
    let date = new Date();

    let minutes = date.getMinutes();
    let hours = date.getHours();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }

    let today = year + "-" + month + "-" + day;
    dueDate.value = today;

    let now = hours + ":" + minutes;
    dueTime.value = now;
}

clearButton.addEventListener("click", clearForm);

// Clears form.
function clearForm() {
    taskDescription.value = "";
    CurrentDateTime();
};

// Saves note to local storage.
function saveNoteToLoStorage(text, date, time) {
    let notes = [];
    let id = 0;

    if (localStorage.getItem("storageNotes") !== null) {
        notes = JSON.parse(localStorage.getItem("storageNotes"));
        if (notes.length > 0) {
            id = notes[notes.length - 1].id + 1;
        };
    };

    const newNote = {
        id: id,
        text: text,
        date: date,
        time: time
    };

    notes.push(newNote);
    localStorage.setItem("storageNotes", JSON.stringify(notes));

    return id;
};

// Visual creation of the note.
function addNote(id, text, date, time) {
    let taskNoteBackground = document.createElement("div");
    taskNoteBackground.style.position = "relative";
    taskNoteBackground.classList.add("note-design");
    notesContainer.appendChild(taskNoteBackground);

    let taskNoteText = document.createElement("div");
    taskNoteText.classList.add("note-text");
    taskNoteBackground.appendChild(taskNoteText);
    taskNoteText.textContent = text;

    let taskNoteDate = document.createElement("div");
    taskNoteDate.classList.add("note-date");
    taskNoteBackground.appendChild(taskNoteDate);
    taskNoteDate.textContent = date;

    let taskNoteTime = document.createElement("div");
    taskNoteTime.classList.add("note-time");
    taskNoteBackground.appendChild(taskNoteTime);
    taskNoteTime.textContent = time;

    clearForm();

    taskNoteBackground.addEventListener("mouseenter", closeWindowIcon);

    // Makes a close-window icon appear on note.
    function closeWindowIcon() {
        let closeIcon = document.createElement("i");
        closeIcon.classList.add("far", "fa-window-close", "xs");
        taskNoteBackground.appendChild(closeIcon);
        closeIcon.style.position = "absolute";
        closeIcon.style.marginTop = "-117%";
        closeIcon.style.marginLeft = "87%";
        closeIcon.style.cursor = "pointer";

        taskNoteBackground.addEventListener("mouseleave", removeCloseIcon);

        function removeCloseIcon() {
            closeIcon.style.display = "none";
        };

        closeIcon.addEventListener("click", deleteNote)

        // Deletes note and removes it from local storage.
        function deleteNote() {
            notesContainer.removeChild(taskNoteBackground);
            let notesBeforeRemoval = JSON.parse(localStorage.getItem("storageNotes"));
            let notesAfterRemoval = notesBeforeRemoval.filter(note => note.id !== id);
            localStorage.setItem("storageNotes", JSON.stringify(notesAfterRemoval));
        };
    };
};

addTaskButton.addEventListener("click", onSubmit);

// Submits form, creates note and stores it in browser's local storage.
function onSubmit(e) {
    if (taskDescription.value != "" && dueDate.value != "") {
        e.preventDefault();
        let text = taskDescription.value;
        let date = dueDate.value.split("-").reverse().join("-");
        let time = dueTime.value;
        addNote(saveNoteToLoStorage(text, date, time), text, date, time);
    } else {
        taskAlert.style.display = "block";
        taskAlert.style.animationName = "emptyAlert";
        taskAlert.style.animationDuration = "6.5s";
        setTimeout(removeAlert, 6000);
    }
};
