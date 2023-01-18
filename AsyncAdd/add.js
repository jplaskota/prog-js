const asyncAdd = async (a, b) => {
  if (typeof a !== "number" || typeof b !== "number") {
    return Promise.reject("Argumenty muszą mieć typ number!");
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
    }, 100);
  });
};

let sum = 0;
let addCount = 0;

let asyncSum = 0;
let asyncAddCount = 0;

let args = [];
for (let i = 0; i < 100; i++) {
  args[i] = i;
}

function Timer() {
  return performance.now();
}

window.addEventListener("load", () => {
  document.querySelector("#btn").addEventListener("click", async () => {
    console.log("Rozpoczęcie obliczeń...");

    const start = Timer();

    for (const arg of args) {
      sum = await asyncAdd(sum, arg);
      addCount++;
    }

    const end = Timer();

    console.log("");
    console.log("Obliczenia podstawowe zakończone");
    console.log(`Suma: ${sum}`);
    console.log(`Ilość wywołań funkcji asyncAdd: ${addCount}`);
    console.log(`Czas wykonania: ${(end - start).toFixed(2)} ms`);
  });

  document.querySelector("#btn").addEventListener("click", async () => {
    console.log("Rozpoczęcie obliczeń z użyciem Promise.all...");

    const start = Timer();

    const promises = args.map((arg) => asyncAdd(asyncSum, arg));
    const results = await Promise.all(promises);
    asyncSum = results.reduce((a, b) => a + b);
    asyncAddCount += args.length;

    const end = Timer();

    console.log("");
    console.log("Obliczenia z użyciem Promise.all zakończone");
    console.log(`Suma: ${asyncSum}`);
    console.log(`Ilość wywołań funkcji asyncAdd: ${asyncAddCount}`);
    console.log(`Czas wykonania: ${(end - start).toFixed(2)} ms`);
  });
});
