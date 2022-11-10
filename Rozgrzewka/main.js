const sum = document.getElementById("rsum");
const avg = document.getElementById("ravg");
const min = document.getElementById("rmin");
const max = document.getElementById("rmax");

const data = [];

const error = document.getElementById("error");

const clear = document.getElementById("clearBtn");

const input = Array.from(document.querySelectorAll("input"));

clear.addEventListener("click", Clear);

input.map((el) =>
  el.addEventListener("input", (e) => {
    data.length = 0;
    input.forEach((el) => {
      if (!isNaN(parseInt(el.value))) {
        data.push(parseInt(el.value));
      }
    });
    Calculate(data);
  })
);

function Calculate(Array) {
  try {
    if (Array.length > 0) {
      sum.innerText = Array.reduce((a, b) => a + b);
      avg.innerText = Array.reduce((a, b) => a + b) / Array.length;
      min.innerText = Math.min(...Array);
      max.innerText = Math.max(...Array);
    } else {
      Clear();
    }
  } catch (e) {
    error.innerText = e.message;
    console.log(e);
  }
}

function Clear() {
  input.forEach((el) => {
    el.value = "";
  });
  sum.innerText = "...";
  avg.innerText = "...";
  min.innerText = "...";
  max.innerText = "...";
}
