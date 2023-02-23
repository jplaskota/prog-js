const keys = [
  { note: "C", key: "a" },
  { note: "D", key: "s" },
  { note: "E", key: "d" },
  { note: "F", key: "f" },
  { note: "G", key: "g" },
  { note: "A", key: "h" },
  { note: "B", key: "j" },
  { note: "C2", key: "k" },
];

function generateKeys() {
  const piano = document.getElementById("piano");
  keys.forEach((key) => {
    const pianoKey = document.createElement("div");
    pianoKey.classList.add("key");
    pianoKey.dataset.note = key.note;
    pianoKey.textContent = key.note;
    piano.appendChild(pianoKey);
  });
}

function playNote() {
  const note = this.dataset.note;
  const audio = new Audio(`sounds/${note}.wav`);
  audio.play();
}

function addEventListeners() {
  const keys = document.querySelectorAll(".key");
  keys.forEach((key) => key.addEventListener("click", playNote));
  document.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    const key = event.key;
    const pianoKey = document.querySelector(`.key[data-key="${key}"]`);
    if (!pianoKey) return;
    pianoKey.classList.add("active");
    playNote.call(pianoKey);
  });
  document.addEventListener("keyup", (event) => {
    const key = event.key;
    const pianoKey = document.querySelector(`.key[data-key="${key}"]`);
    if (!pianoKey) return;
    pianoKey.classList.remove("active");
  });
}

generateKeys();
addEventListeners();
