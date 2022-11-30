const title = document.querySelector("[data-title]");
const content = document.querySelector("[data-content]");
const notesContainer = document.getElementById("main");

const newBtn = Array.from(document.getElementsByClassName("new-btn"));

let notes = [];

document.getElementById("clear-all").addEventListener("click", (e) => {
  localStorage.clear();
  notesContainer.innerHTML = "";
  console.log("notes cleared");
});

window.addEventListener("load", (e) => {
  console.log("page is fully loaded");
  notes = JSON.parse(localStorage.getItem("notes")) || [];
  console.log("notes lenght: " + notes.length);
  if (notes.length > 0) {
    for (let i = 0; i < notes.length; i++) {
      renderNotes(notes[i]);
    }
  }
});

newBtn.map((el) => {
  el.addEventListener("click", (e) => {
    switch (e.target.innerText) {
      case "Save":
        if (newNote(title.textContent, content.textContent) !== false) {
          title.textContent = "";
          content.textContent = "";
          title.focus();
        }
        break;
      case "Close":
        title.textContent = "";
        content.textContent = "";
        title.focus();
        localStorage.clear();
        break;
    }
  });
});

//TODO save only non empty notes (or only notes with title)
function newNote(xTitle, xContent) {
  if (xTitle === "") {
    //TODO add alert
    console.log("empty title");
    return false;
  }
  const note = {
    title: xTitle,
    content: xContent,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    pinned: false,
  };

  //save to local storage
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));

  renderNotes(note);
}

function renderNotes(xNote) {
  //note
  const note = document.createElement("div");
  if (xNote.pinned === true) {
    note.className = "note pinned";
  } else {
    note.className = "note";
  }
  notesContainer.appendChild(note);

  //note pin
  const notePin = document.createElement("div");
  if (xNote.pinned === true) {
    notePin.className = "note-pin pin-visible";
  } else {
    notePin.className = "note-pin";
  }
  note.appendChild(notePin);

  //note title and content
  const noteTitle = document.createElement("div");
  noteTitle.className = "title";
  noteTitle.textContent = xNote.title;
  note.appendChild(noteTitle);

  const noteContent = document.createElement("div");
  noteContent.className = "content";
  noteContent.textContent = xNote.content;
  note.appendChild(noteContent);

  // note options
  const nav = document.createElement("nav");
  note.appendChild(nav);

  // note left icons container
  const menu = document.createElement("div");
  menu.className = "menu";
  nav.appendChild(menu);

  const colorBtn = document.createElement("button");
  colorBtn.id = "color";
  menu.appendChild(colorBtn);

  const colorIcon = document.createElement("img");
  colorIcon.src = "icons/color.svg";
  colorBtn.appendChild(colorIcon);

  const pinBtn = document.createElement("button");
  pinBtn.addEventListener("click", (e) => {
    if (xNote.pinned === false) {
      note.className = "note pinned";
      notePin.className = "note-pin pin-visible";
      xNote.pinned = true;
    } else {
      note.className = "note";
      notePin.className = "note-pin";
      xNote.pinned = false;
    }
    notes.splice(notes.indexOf(xNote), 1);
    notes.push(xNote);
    localStorage.setItem("notes", JSON.stringify(notes));
  });
  pinBtn.id = "pin";
  menu.appendChild(pinBtn);

  const pinIcon = document.createElement("img");
  pinIcon.src = "icons/pin.svg";
  pinBtn.appendChild(pinIcon);

  // note right icon
  const deleteBtn = document.createElement("button");
  deleteBtn.addEventListener("click", (e) => {
    note.remove();
    notes.splice(notes.indexOf(xNote), 1);
    localStorage.setItem("notes", JSON.stringify(notes));
  });
  deleteBtn.id = "delete";
  nav.appendChild(deleteBtn);

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "icons/delete.svg";
  deleteBtn.appendChild(deleteIcon);
}
