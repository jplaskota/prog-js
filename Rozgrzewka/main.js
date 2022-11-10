let sum = document.getElementById("rsum");
let avg = document.getElementById("ravg");
let min = document.getElementById("rmin");
let max = document.getElementById("rmax");

let a = document.getElementById("input1");
let b = document.getElementById("input2");
let c = document.getElementById("input3");
let d = document.getElementById("input4");

let error = document.getElementById("error");

let buttons = Array.from(document.getElementsByClassName("btn"));

buttons.map((button) => {
  button.addEventListener("click", (e) => {
    switch (e.target.innerText) {
      case "Clear":
        Clear();
        break;

      case "Calculate":
        Calculate();
        break;
    }
  });
});

function Clear() {
  a.value = "";
  b.value = "";
  c.value = "";
  d.value = "";
  sum.innerText = "...";
  avg.innerText = "...";
  min.innerText = "...";
  max.innerText = "...";
}

function Calculate() {
  try {
    error.innerText = "";

    // if (a.value === "" || b.value === "" || c.value === "" || d.value === "") {
    //   throw new Error("Incorrect data");
    // }

    const num_a = parseInt(a.value);
    const num_b = parseInt(b.value);
    const num_c = parseInt(c.value);
    const num_d = parseInt(d.value);

    if (isNaN(num_a) || isNaN(num_b) || isNaN(num_c) || isNaN(num_d)) {
      throw new Error("Incorrect data");
    }

    sum.innerText = num_a + num_b + num_c + num_d;
    avg.innerText = (num_a + num_b + num_c + num_d) / 4;
    min.innerText = Math.min(num_a, num_b, num_c, num_d);
    max.innerText = Math.max(num_a, num_b, num_c, num_d);
  } catch (e) {
    error.innerText = e.message;
  }
}
