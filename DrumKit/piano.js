const keys = [
  { note: "C", key: "a" },
  { note: "D", key: "s" },
  { note: "E", key: "d" },
  { note: "F", key: "f" },
  { note: "G", key: "j" },
  { note: "A", key: "k" },
  { note: "B", key: "l" },
  { note: "C2", key: ";" },
];

let isRecording = false;
let isPlaying = false;
let path = 0;
let recordedNotes = [[], [], [], []];

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

function playNote(note) {
  const audio = new Audio(`sounds/${note}.mp3`);
  audio.play();

  if (isRecording) {
    const time = Date.now();
    recordedNotes[path].push();
    recordedNotes[path].push({ note: note, time: time });
  }
}

function addEventListeners() {
  const screenKeys = document.querySelectorAll(".key");
  screenKeys.forEach((key) => key.addEventListener("click", playNote));

  // Add active class when key is pressed
  document.addEventListener("keydown", (event) => {
    if (event.repeat) return;

    const key = event.key.toLowerCase();

    if (key === " ") {
      record();
      return;
    }

    if (key === "enter") {
      if (recordedNotes[path].length > 0) {
        play(path);
      }
      return;
    }

    if (key === "0") {
      for (let i = 0; i < 4; i++) {
        play(i);
      }
      return;
    }

    if (key === "1" || key === "2" || key === "3" || key === "4") {
      path = key - 1;
      document.querySelectorAll(".path").forEach((item) => {
        item.classList.remove("active");
      });

      document
        .querySelector(`.path[data-path="${path}"]`)
        .classList.add("active");
      return;
    }

    const xNote = keys.find((item) => item.key === key);

    if (!xNote) return;

    const pianoKey = document.querySelector(`.key[data-note="${xNote.note}"]`);

    if (!pianoKey) return;

    pianoKey.classList.add("active");
    playNote(xNote.note);
  });

  // Remove active class when key is released
  document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    const xNote = keys.find((item) => item.key === key);

    if (!xNote) return;

    const pianoKey = document.querySelector(`.key[data-note="${xNote.note}"]`);

    if (!pianoKey) return;

    pianoKey.classList.remove("active");
  });

  // Path Buttons
  document.querySelectorAll(".path").forEach((item) => {
    item.addEventListener("click", () => {
      path = item.dataset.path;
      document.querySelectorAll(".path").forEach((item) => {
        item.classList.remove("active");
      });

      document
        .querySelector(`.path[data-path="${path}"]`)
        .classList.add("active");
    });
  });

  // Record Button
  document.getElementById("record-button").addEventListener("click", () => {
    record();
  });

  // Play Button
  document.getElementById("play-button").addEventListener("click", () => {
    if (recordedNotes[path].length > 0) {
      play(path);
    }
  });

  //Play All Button
  document.getElementById("play-all-button").addEventListener("click", () => {
    for (let i = 0; i < 4; i++) {
      play(i);
    }
  });
}

function play(xPath) {
  if (recordedNotes[xPath].length === 0) return;

  recordedNotes[xPath].forEach((item) => {
    setTimeout(() => {
      playNote(item.note);
    }, item.time - recordedNotes[path][0].time);
  });
}

function record() {
  const recordButton = document.getElementById("record-button");

  isRecording = !isRecording;
  if (isRecording) {
    recordButton.textContent = "Stop Recording";
    recordButton.classList.add("active");
    recordedNotes[path] = [];
  } else {
    recordButton.textContent = "Record";
    recordButton.classList.remove("active");
    console.log(recordedNotes);
  }
}

generateKeys();
addEventListeners();
