const title = document.querySelector("[data-title]");
const content = document.querySelector("[data-content]");
const tag = document.querySelector("[data-tag]");
const notesContainer = document.getElementById("main");

const newBtn = Array.from(document.getElementsByClassName("new-btn"));

let notes = [];
let tags = [
  {
    tag: "study",
  },
  {
    tag: "work",
  },
  {
    tag: "free time",
  },
  {
    tag: "shopping",
  },
  {
    tag: "Lorem ipsum dolor sit amet consectetur.",
  },
];

//delete all notes from local storage and page
document.getElementById("clear-all").addEventListener("click", (e) => {
  localStorage.clear();
  notesContainer.innerHTML = "";
  console.log("notes cleared");
});

window.addEventListener("load", (e) => {
  notes = JSON.parse(localStorage.getItem("notes")) || [];
  // tags = JSON.parse(localStorage.getItem("tags")) || [];
  console.log("notes lenght: " + notes.length);
  if (notes.length > 0) {
    for (let i = 0; i < notes.length; i++) {
      renderNotes(notes[i]);
    }
  }
  if (tags.length > 0) {
    for (let i = 0; i < tags.length; i++) {
      const option = document.createElement("option");
      option.value = tags[i].tag;
      option.textContent = tags[i].tag;
      tag.appendChild(option);
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
        break;
    }
  });
});

function newNote(xTitle, xContent) {
  if (xTitle === "") {
    console.log("empty title");
    return false;
  }
  const note = {
    title: xTitle,
    content: xContent,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    pinned: false,
    color: "rgba(0, 0, 0, 0.3)",
    tag: "none",
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
    note.className = "note pinned black";
  } else {
    note.className = "note black";
  }
  note.tabIndex = 0;
  note.style.backgroundColor = xNote.color;
  notesContainer.appendChild(note);

  //note pin
  const notePin = document.createElement("div");
  if (xNote.pinned === true) {
    notePin.className = "note-pin pin-visible";
  } else {
    notePin.className = "note-pin";
  }
  note.appendChild(notePin);

  //note topbar (title and tag)
  const noteTopBar = document.createElement("div");
  noteTopBar.className = "top-bar";
  note.appendChild(noteTopBar);

  //note title
  const noteTitle = document.createElement("div");
  noteTitle.className = "title";
  noteTitle.addEventListener("click", (e) => {
    e.target.contentEditable = true;
    e.target.focus();
  });
  noteTitle.addEventListener("blur", (e) => {
    e.target.contentEditable = false;
    xNote.title = e.target.innerText;
    SaveNotes();
  });
  noteTitle.textContent = xNote.title;
  noteTopBar.appendChild(noteTitle);

  //note content
  const noteContent = document.createElement("div");
  noteContent.addEventListener("click", (e) => {
    e.target.contentEditable = true;
    e.target.focus();
  });
  noteContent.addEventListener("blur", (e) => {
    e.target.contentEditable = false;
    xNote.content = e.target.innerText;
    SaveNotes();
  });
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

  // note color palette
  const colorBtn = document.createElement("button");
  colorBtn.addEventListener("click", (e) => {
    dropdown.style.visibility = "visible";
    dropdown.style.opacity = "1";
  });
  colorBtn.tabIndex = -1;
  colorBtn.id = "color";
  menu.appendChild(colorBtn);

  const colorIcon = document.createElement("img");
  colorIcon.src = "icons/color.svg";
  colorBtn.appendChild(colorIcon);

  // color list
  const dropdown = document.createElement("div");
  dropdown.addEventListener("mouseleave", (e) => {
    dropdown.style.visibility = "hidden";
    dropdown.style.opacity = "0";
  });
  dropdown.className = "dropdown-color";
  colorBtn.appendChild(dropdown);

  const cBlack = document.createElement("div");
  cBlack.className = "circle";
  cBlack.style.backgroundColor = "rgb(0, 0, 0)";
  cBlack.dataset.color = "rgba(0, 0, 0, 0.3)";
  dropdown.appendChild(cBlack);

  const cPurple = document.createElement("div");
  cPurple.className = "circle";
  cPurple.style.backgroundColor = "rgb(128, 0, 128)";
  cPurple.dataset.color = "rgba(128, 0, 128, 0.3)";
  dropdown.appendChild(cPurple);

  const cBlue = document.createElement("div");
  cBlue.className = "circle";
  cBlue.style.backgroundColor = "rgb(0, 0, 255)";
  cBlue.dataset.color = "rgba(0, 0, 255, 0.3)";
  dropdown.appendChild(cBlue);

  const cGreen = document.createElement("div");
  cGreen.className = "circle";
  cGreen.style.backgroundColor = "rgb(0, 128, 0)";
  cGreen.dataset.color = "rgba(0, 128, 0, 0.3)";
  dropdown.appendChild(cGreen);

  const cRed = document.createElement("div");
  cRed.className = "circle";
  cRed.style.backgroundColor = "rgb(255, 0, 0)";
  cRed.dataset.color = "rgba(255, 0, 0, 0.3)";
  dropdown.appendChild(cRed);

  const cYellow = document.createElement("div");
  cYellow.className = "circle";
  cYellow.style.backgroundColor = "rgb(255 ,255 ,0)";
  cYellow.dataset.color = "rgba(255, 255, 0, 0.3)";
  dropdown.appendChild(cYellow);

  Array.from(dropdown.children).map((el) => {
    el.addEventListener("click", (e) => {
      note.style.backgroundColor = e.target.dataset.color;
      xNote.color = e.target.dataset.color;
      SaveNotes();
    });
  });

  // note pin
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
    SaveNotes();
  });
  pinBtn.tabIndex = -1;
  pinBtn.id = "pin";
  menu.appendChild(pinBtn);

  const pinIcon = document.createElement("img");
  pinIcon.src = "icons/pin.svg";
  pinBtn.appendChild(pinIcon);

  //note tag
  const noteTag = document.createElement("button");
  noteTag.addEventListener("click", (e) => {
    noteTagList.style.visibility = "visible";
    noteTagList.style.opacity = "1";
  });
  noteTag.className = "tag-btn";
  noteTag.tabIndex = -1;
  noteTag.ariaMultiLine = true;
  menu.appendChild(noteTag);

  const noteTagIcon = document.createElement("img");
  noteTagIcon.src = " icons/tag.svg";
  noteTag.appendChild(noteTagIcon);

  const noteTagList = document.createElement("div");
  noteTagList.addEventListener("mouseleave", (e) => {
    noteTagList.style.visibility = "hidden";
    noteTagList.style.opacity = "0";
  });
  noteTagList.className = "tag-list";
  noteTag.appendChild(noteTagList);

  for (let i = 0; i < tags.length; i++) {
    const xNoteTag = document.createElement("div");
    const xNoteTagText = document.createElement("p");
    xNoteTag.className = "tag";
    xNoteTagText.textContent = tags[i].tag;
    xNoteTag.appendChild(xNoteTagText);
    noteTagList.appendChild(xNoteTag);
  }

  // note right icon
  const deleteBtn = document.createElement("button");
  deleteBtn.addEventListener("click", (e) => {
    note.remove();
    notes.splice(notes.indexOf(xNote), 1);
    localStorage.setItem("notes", JSON.stringify(notes));
  });
  deleteBtn.tabIndex = -1;
  deleteBtn.id = "delete";
  nav.appendChild(deleteBtn);

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "icons/delete.svg";
  deleteBtn.appendChild(deleteIcon);

  function SaveNotes() {
    notes.splice(notes.indexOf(xNote), 1);
    notes.push(xNote);
    localStorage.setItem("notes", JSON.stringify(notes));
  }
}
