let title = document.querySelector("[data-title]");
let content = document.querySelector("[data-content]");
let notesContainer = document.getElementById("main");

const newBtn = Array.from(document.getElementsByClassName("new-btn"));

const notes = JSON.parse(localStorage.getItem("notes")) || [];

newBtn.map((el) => {
  el.addEventListener("click", (e) => {
    switch (e.target.innerText) {
      case "Save":
        newNote(title.textContent, content.textContent);
        break;
      case "Close":
        title.textContent = "";
        content.textContent = "";
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
    return;
  }
  const note = {
    title: xTitle,
    content: xContent,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };
  notes.push(note);
  renderNotes(note);
}

// function saveNotes(note) {
//   const notes = JSON.parse(localStorage.getItem("notes")) || [];
//   notes.push(note);
//   localStorage.setItem("notes", JSON.stringify(notes));
//   renderNotes(note);
//   for (let i = 0; i < notes.length; i++) {
//     console.log(notes[i]);
//   }
// }

//TODO render more than one note
function renderNotes(xNote) {
  console.log(xNote);

  //note
  const note = document.createElement("div");
  note.className = "note";
  notesContainer.appendChild(note);

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
  pinBtn.id = "pin";
  menu.appendChild(pinBtn);

  const pinIcon = document.createElement("img");
  pinIcon.src = "icons/pin.svg";
  pinBtn.appendChild(pinIcon);

  // note right icon
  const deleteBtn = document.createElement("button");
  deleteBtn.id = "delete";
  nav.appendChild(deleteBtn);

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "icons/delete.svg";
  deleteBtn.appendChild(deleteIcon);
}
