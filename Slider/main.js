const imageArr = [
  "./images/img1.jpg",
  "./images/img2.jpg",
  "./images/img3.jpg",
  "./images/img4.jpg",
  "./images/img5.jpg",
];

const btn = Array.from(document.getElementsByClassName("btn"));
const slider = document.getElementById("slide-container");
const dots = document.getElementById("dots-container");
const auto = document.querySelector("[data-auto]");
const pause = document.querySelector("[data-pause]");

let counter = 0;
let autoFnc = true;
let autoInterval = setInterval(Next, 3000);

// add slides with images
document.onload = Onload();

function Onload() {
  for (let i = 0; i < imageArr.length; i++) {
    const slide = document.createElement("div");
    slide.className = "slide";
    slider.appendChild(slide);

    const img = document.createElement("img");
    img.src = imageArr[i];
    slide.appendChild(img);

    const text = document.createElement("p");
    text.innerHTML = "Lorem ipsum  " + i;
    slide.appendChild(text);
  }

  Render(counter);
}

// pause button
pause.addEventListener("click", () => {
  if (autoFnc) {
    autoFnc = false;
    document.getElementById("settings").style.display = "flex";
  } else {
    autoFnc = true;
    document.getElementById("settings").style.display = "none";
  }
  console.log(autoFnc);
});

// mouse events
auto.addEventListener("mouseover", () => {
  autoFnc ? clearInterval(autoInterval) : null;
});

auto.addEventListener("mouseleave", () => {
  autoFnc ? (autoInterval = setInterval(Next, 3000)) : null;
});

// auto slider
function Next() {
  console.log("auto");
  counter++;
  if (counter >= imageArr.length) {
    counter = 0;
  }
  Render(counter);
}

// buttons
btn.map((el) => {
  el.addEventListener("click", (e) => {
    switch (e.target.id) {
      case "prev":
        counter--;
        counter < 0 ? (counter = imageArr.length - 1) : null;
        Render(counter);
        break;

      case "next":
        counter++;
        counter > imageArr.length - 1 ? (counter = 0) : null;
        Render(counter);
        break;
    }
  });
});

function Render(counter) {
  ImgRender(counter);
  DotsRender(counter);
}

// slide function
function ImgRender(counter) {
  const slides = Array.from(document.getElementsByClassName("slide"));
  slides.map((el) => {
    el.style.transform = `translateX(-${counter * 100}%)`;
  });
}

// dots function
function DotsRender(counter) {
  dots.innerHTML = "";
  for (let i = 0; i < imageArr.length; i++) {
    const dot = document.createElement("div");
    if (i === counter) {
      dot.className = "active-dot";
    } else {
      dot.className = "dot";
    }
    dots.appendChild(dot);
    dot.addEventListener("click", DotClick.bind(null, i), false);
  }
}

function DotClick(num) {
  counter = num;
  Render(counter);
}
