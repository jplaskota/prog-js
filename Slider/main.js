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

let counter = 0;

document.onload = Onload(counter);

function Onload(counter) {
  for (let i = 0; i < imageArr.length; i++) {
    const slide = document.createElement("div");
    slide.className = "slide";
    slider.appendChild(slide);

    const img = document.createElement("img");
    img.src = imageArr[i];
    slide.appendChild(img);
  }

  Render(counter);
}

btn.map((el) => {
  el.addEventListener("click", (e) => {
    switch (e.target.id) {
      case "prev":
        counter--;
        if (counter < 0) {
          counter = imageArr.length - 1;
        }
        Render(counter);
        break;

      case "next":
        counter++;
        if (counter > imageArr.length - 1) {
          counter = 0;
        }
        Render(counter);
        break;
    }
  });
});

function Render(counter) {
  ImgRender(counter);
  DotsRender(counter);
}

function ImgRender(counter) {
  const slides = Array.from(document.getElementsByClassName("slide"));
  slides.map((el) => {
    el.style.transform = `translateX(-${counter * 100}%)`;
  });
}

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
