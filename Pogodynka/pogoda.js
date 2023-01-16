//in
const searchCity = document.querySelector("[data-search]");
const add = document.querySelector("[data-add]");
const format = document.querySelector("[data-format]");
const days = document.querySelector("[data-days]");
const saved = document.querySelector("[data-saved]");

//out current
const city = document.querySelector("[data-city]");
const temp = document.querySelector("[data-temp]");
const desc = document.querySelector("[data-desc]");
const tempMin = document.querySelector("[data-temp-min]");
const tempMax = document.querySelector("[data-temp-max]");

let savedCity = [];

window.addEventListener("load", (e) => {
  console.log("page is fully loaded");
  setInterval(loadSaved, 300000)
  loadSaved();
});

// load all data with fetch api
async function loadSaved() {
  savedCity = JSON.parse(localStorage.getItem("city")) || [];
  console.log("Loaded city: " + savedCity.length);

  changeCurrent(
    localStorage.getItem("pin") ||
      (savedCity.length > 0 ? savedCity[0].name : "Kraków")
  );

  saved.innerHTML = "";

  if (savedCity.length > 0) {
    for (let i = 0; i < savedCity.length; i++) {
      renderCity(savedCity[i]);
    }
  }
}

// search city by name ("enter" click)
window.addEventListener("keypress", async (e) => {
  if (e.code === "Enter") {
    searchCity.blur();

    if (searchCity.textContent === "") {
      console.log("No city name");
      return;
    }

    changeCurrent(searchCity.textContent);
    searchCity.textContent = "";
  }
});

// save city in local storage
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

  console.log("City saved: " + city.textContent);
  console.log("Saved: " + savedCity.length);
  loadSaved();
});

// delete all storage data
format.addEventListener("click", (e) => {
  savedCity.length = 0;
  localStorage.clear();
  loadSaved();
  saved.innerHTML = "";
  console.log("Local storage cleared. Length: " + savedCity.length);
});

// download weather data by city name
async function getWeather(cityName) {
  const { city, list } = await fetch(
    "https://pro.openweathermap.org/data/2.5/forecast/climate?q=" +
      cityName +
      "&cnt=7&mode=json&units=metric&appid=e56ebc4991608107818d622503afefbe",
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
    .catch((err) => console.log(err.message));

  return {
    name: city.name,
    list: list,
  };
}

// change the current weather
async function changeCurrent(cityName) {
  const { name, list } = await getWeather(cityName);

  city.textContent = name;
  temp.textContent = list[0].temp.day.toFixed(0) + "°";
  desc.textContent = list[0].weather[0].description;
  tempMin.textContent = "↓ " + list[0].temp.min.toFixed(0) + "°";
  tempMax.textContent = "↑ " + list[0].temp.max.toFixed(0) + "°";

  days.innerHTML = "";

  // add 5 next days of weekend
  for (let i = 1; i < 6; i++) {
    const box = document.createElement("div");
    box.classList.add("day", "bgc");
    days.appendChild(box);

    const dataBox = document.createElement("div");
    dataBox.classList.add("dayBox");
    box.appendChild(dataBox);

    const daysWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dayName = document.createElement("div");
    dayName.classList.add("dayName");
    dayName.textContent = daysWeek[(new Date().getDay() + i) % 7];
    dataBox.appendChild(dayName);

    const temp = document.createElement("div");
    temp.classList.add("dayTemp");
    temp.textContent = list[i].temp.day.toFixed(0) + "°";
    dataBox.appendChild(temp);

    const imgBox = document.createElement("div");
    imgBox.classList.add("imgBox");
    box.appendChild(imgBox);

    const img = document.createElement("img");
    img.src = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${list[i].weather[0].icon}.svg`;
    imgBox.appendChild(img);
  }
}

// create box with weather data
async function renderCity(city) {
  const { name, list } = await getWeather(city.name);

  const cityContainer = document.createElement("div");
  cityContainer.classList.add("saved", "bgc");
  saved.appendChild(cityContainer);

  cityContainer.addEventListener("click", (e) => {
    changeCurrent(name);
    localStorage.setItem("pin", name);
  });

  const box = document.createElement("div");
  box.classList.add("savedBox");
  cityContainer.appendChild(box);

  const cityName = document.createElement("div");
  cityName.classList.add("city");
  cityName.textContent = name;
  box.appendChild(cityName);

  const cityTemp = document.createElement("div");
  cityTemp.classList.add("temp");
  cityTemp.textContent = list[0].temp.day.toFixed(0) + "°";
  box.appendChild(cityTemp);

  const img = document.createElement("img");
  img.src = `https://openweathermap.org/img/wn/${list[0].weather[0].icon}@2x.png`;
  cityContainer.appendChild(img);
}

// TODO: find better looking icons

// [max 30 day data]
// https://pro.openweathermap.org/data/2.5/forecast/climate?q={city name}&cnt={number of days}&mode=json&units=metric&appid={API key}


// e56ebc4991608107818d622503afefbe
