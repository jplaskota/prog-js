const searchCity = document.querySelector("[data-search]");
const city = document.querySelector("[data-city]");

window.addEventListener("load", (e) => {
  console.log("page is fully loaded");
});

window.addEventListener("keypress", (e) => {
  if (e.code === "Enter") {
    console.log("Enter pressed");
    searchCity.blur();
    city.textContent = searchCity.textContent;

    const data = fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Kraków&appid=9872a8ba6858e932cea3bacb69631da1",
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((data) => console.log(data));
  }
});

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// 9872a8ba6858e932cea3bacb69631da1
