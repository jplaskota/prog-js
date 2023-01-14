//in
const searchCity = document.querySelector("[data-search]");
const add = document.querySelector("[data-add]");
const format = document.querySelector("[data-format]");
const saved = document.querySelector("[data-saved]");

//out
const city = document.querySelector("[data-city]");
const temp = document.querySelector("[data-temp]");
const desc = document.querySelector("[data-desc]");
const tempMin = document.querySelector("[data-temp-min]");
const tempMax = document.querySelector("[data-temp-max]");

let savedCity = [];

window.addEventListener("load", (e) => {
  console.log("page is fully loaded");
  loadSaved();
});

async function loadSaved() {
  savedCity = JSON.parse(localStorage.getItem("city")) || [];
  console.log("Loaded city: " + savedCity.length);

  saved.innerHTML = "";

  if (savedCity.length > 0) {
    for (let i = 0; i < savedCity.length; i++) {
      renderCity(savedCity[i]);
    }
  }
}

window.addEventListener("keypress", async (e) => {
  if (e.code === "Enter") {
    searchCity.blur();
    console.log("Saved: " + savedCity.length);

    if (searchCity.textContent === "") {
      console.log("No city name");
      return;
    }

    const { main, name, weather } = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        searchCity.textContent +
        "&appid=9872a8ba6858e932cea3bacb69631da1",
      { method: "GET" }
    )
      .then((res) => {
        if (res.ok) {
          searchCity.textContent = null;
          return res.json();
        } else {
          console.log("City not found");
          return;
        }
      })
      .catch((err) => console.log(err));

    console.log("Searched city: " + name);

    city.textContent = name;
    temp.textContent = (main.temp - 273.15).toFixed(0) + "°";
    desc.textContent = weather[0].description;
    tempMin.textContent = "↓ " + (main.temp_min - 273.15).toFixed(0) + "°";
    tempMax.textContent = "↑ " + (main.temp_max - 273.15).toFixed(0) + "°";
  }
});

add.addEventListener("click", (e) => {
  if (city.textContent === "") {
    console.log("No city name");
    return;
  }

  if (savedCity.length > 0) {
    for (let i = 0; i < savedCity.length; i++) {
      if (savedCity[i].name === city.textContent) {
        console.log("City already saved");
        return;
      }
    }
  }

  savedCity.push({
    name: city.textContent,
  });

  localStorage.setItem("city", JSON.stringify(savedCity));
  loadSaved();

  console.log("City saved: " + city.textContent);
});

format.addEventListener("click", (e) => {
  savedCity.length = 0;
  localStorage.clear();
  loadSaved();
  saved.innerHTML = "";
  console.log("Local storage cleared. Length: " + savedCity.length);
});

async function getWeather(city) {
  const { main, name, weather } = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=9872a8ba6858e932cea3bacb69631da1",
    { method: "GET" }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log("City not found");
        return;
      }
    })
    .catch((err) => console.log(err));

  return {
    name: name,
    temp: (main.temp - 273.15).toFixed(0) + "°",
    weather: weather,
  };
}

async function renderCity(city) {
  const { name, temp, weather } = await getWeather(city.name);

  const cityContainer = document.createElement("div");
  cityContainer.classList.add("saved", "bgc");
  saved.appendChild(cityContainer);

  const box = document.createElement("div");
  box.classList.add("savedBox");
  cityContainer.appendChild(box);

  const cityName = document.createElement("div");
  cityName.classList.add("city");
  cityName.textContent = name;
  box.appendChild(cityName);

  const cityTemp = document.createElement("div");
  cityTemp.classList.add("temp");
  cityTemp.textContent = temp;
  box.appendChild(cityTemp);

  const img = document.createElement("img");
  img.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  cityContainer.appendChild(img);
}

// TODO: function to get weather data from API (obj problem ...) (to check...)
// TODO: find better looking icons

// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// 9872a8ba6858e932cea3bacb69631da1
