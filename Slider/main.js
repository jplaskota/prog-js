const imageArr = [
  "./images/img1.jpg",
  "./images/img2.jpg",
  "./images/img3.jpg",
  "./images/img4.jpg",
  "./images/img5.jpg",
];

const btn = Array.from(document.getElementsByClassName("btn"));
const slider = document.getElementById("slider");
const img = document.createElement("img");

let counter = 0;

document.onload = Render(counter);

btn.map((el) => {
  el.addEventListener("click", (e) => {
    switch (e.target.innerText) {
      case "prev":
        if (counter > 0) {
          counter--;
        }
        Render(counter);
        break;

      case "next":
        if (counter < imageArr.length - 1) {
          counter++;
        }
        Render(counter);
        break;
    }
  });
});

function Render(counter) {
  console.log("id " + counter);
  img.src = imageArr[counter];
  slider.appendChild(img);
}
