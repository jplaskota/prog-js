//in
const searchCity = document.querySelector("[data-search]");
const add = document.querySelector("[data-add]");
const format = document.querySelector("[data-format]");
const saved = document.querySelector("[data-saved]");
const err = document.querySelector("[data-err]");
const daysBox = document.querySelector("[data-days]");
const hoursBox = document.querySelector("[data-hours");

//out
const city = document.querySelector("[data-city]");
const temp = document.querySelector("[data-temp]");
const desc = document.querySelector("[data-desc]");
const tempMin = document.querySelector("[data-temp-min]");
const tempMax = document.querySelector("[data-temp-max]");

// TODO place to add own api key
const API_KEY = "...";

let savedCity = [];
let currentCityId;

// TODO language option (en, pl)
let language = "pl";

window.addEventListener("load", async (e) => {
  if (API_KEY.length < 5) {
    console.log("No api key");
    return;
  }

  loadSaved();

  if (savedCity.length > 0) {
    const { city, list } = await getWeatherById(savedCity[0]);
    changeCurrent(city, list);
  } else {
    if (navigator.geolocation) {
      getWeatherByLocation();
    }
  }
});

// load saved cities from local storage and render them
function loadSaved() {
  savedCity = JSON.parse(localStorage.getItem("cities")) || [];
  console.log("Loaded cities: " + savedCity.length);

  saved.innerHTML = "";

  if (savedCity.length > 0) {
    for (let i = 0; i < savedCity.length; i++) {
      renderCity(savedCity[i]);
    }
  }
}

// search city by name
window.addEventListener("keypress", async (e) => {
  if (e.code === "Enter") {
    searchCity.blur();

    if (searchCity.textContent === "") {
      console.log("No city name.");
      return;
    }

    try {
      getWeatherByName(searchCity.textContent);
      searchCity.textContent = "";
    } catch (err) {
      console.error(err);
    }
  }
});

// save city in local storage
add.addEventListener("click", (e) => {
  if (city.textContent === "") {
    console.log("No city name.");
    return;
  }

  if (savedCity.length > 0) {
    if (savedCity.length >= 10) {
      console.log("All slots occupied.");
      error("All slots occupied.");
      return;
    }

    for (let i = 0; i < savedCity.length; i++) {
      if (savedCity[i] === currentCityId) {
        console.log("City already saved.");
        error("City already saved.");
        return;
      }
    }
  }

  savedCity.push(currentCityId);

  localStorage.setItem("cities", JSON.stringify(savedCity));

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
  console.log("Local storage cleared.");
});

// error notification
function error(message) {
  err.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = message;
  err.appendChild(p);
  err.classList.add("animatedErr");

  setTimeout(() => {
    err.classList.remove("animatedErr");
    err.innerHTML = "";
  }, 3000);
}

// delete city from local storage
function remove(_cityId) {
  const index = savedCity.indexOf(_cityId);

  if (index > -1) {
    savedCity.splice(index, 1);
    console.log("Deleted");
    localStorage.setItem("cities", JSON.stringify(savedCity));
    loadSaved();
  }
}

// download weather data by city name
function getWeatherByName(_cityName) {
  const url =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    _cityName +
    "&cnt=6&mode=json&lang=" +
    language +
    "&units=metric&appid=" +
    API_KEY;

  fetch(url, { method: "GET" })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        error("City not found");
        throw new Error("City not found");
      }
    })
    .then((data) => {
      changeCurrent(data.city, data.list);
    })
    .catch((err) => console.log(err));
}

async function getWeatherById(_cityId) {
  const url =
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
    _cityId +
    "&cnt=6&mode=json&lang=" +
    language +
    "&units=metric&appid=" +
    API_KEY;

  const { city, list } = await fetch(url, { method: "GET" })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        error("City not found");
        throw new Error("City not found");
      }
    })
    .catch((err) => console.error(err));

  return { city, list };
}

// download weather data by current location
function getWeatherByLocation() {
  function successCallback(_position) {
    const url =
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      _position.coords.latitude +
      "&lon=" +
      _position.coords.longitude +
      "&cnt=6&mode=json&lang=" +
      language +
      "&units=metric&appid=" +
      API_KEY;

    fetch(url, { method: "GET" })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          error("City not found");
          throw new Error("City not found");
        }
      })
      .then((data) => {
        changeCurrent(data.city, data.list);
      })
      .catch((err) => console.error(err));
  }

  function errorCallback(err) {
    console.error(err);
  }

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

// change the current weather
function changeCurrent(_city, _list) {
  currentCityId = _city.id;

  city.textContent = _city.name;
  temp.textContent = _list[0].main.temp.toFixed(0) + "°";
  desc.textContent = _list[0].weather[0].description;
  tempMin.textContent = "↓ " + _list[0].main.temp_min.toFixed(0) + "°";
  tempMax.textContent = "↑ " + _list[0].main.temp_max.toFixed(0) + "°";

  hoursBox.innerHTML = "";

  function pad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }

  // add 5 more hours forecast (each +3h)
  for (let i = 1; i < 6; i++) {
    const box = document.createElement("div");
    box.classList.add("hour");
    hoursBox.appendChild(box);

    const hour = document.createElement("p");
    hour.textContent = pad((new Date().getHours() + i * 3) % 24);
    box.appendChild(hour);

    const img = document.createElement("img");
    img.src = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${_list[i].weather[0].icon}.svg`;
    box.appendChild(img);

    const temp = document.createElement("p");
    temp.textContent = _list[i].main.temp.toFixed(0) + "°";
    box.appendChild(temp);
  }
}

// render saved cities
async function renderCity(_cityId) {
  const id = _cityId;
  const { city, list } = await getWeatherById(id);

  const cityContainer = document.createElement("div");
  cityContainer.classList.add("saved", "bgc");
  saved.appendChild(cityContainer);

  // change current city
  cityContainer.addEventListener("click", (e) => {
    localStorage.setItem("pin", JSON.stringify(name));
    changeCurrent(city, list);
  });

  const del = document.createElement("div");
  del.classList.add("savedDel");
  cityContainer.appendChild(del);

  const delImg = document.createElement("img");
  delImg.src = "icons/delete.svg";
  del.appendChild(delImg);

  // delete city
  delImg.addEventListener("click", (e) => {
    e.stopPropagation();
    remove(id);
    cityContainer.remove();
  });

  const box = document.createElement("div");
  box.classList.add("savedBox");
  cityContainer.appendChild(box);

  const cityNameBox = document.createElement("div");
  cityNameBox.classList.add("city");
  cityNameBox.textContent = city.name;
  box.appendChild(cityNameBox);

  const cityTemp = document.createElement("div");
  cityTemp.classList.add("temp");
  cityTemp.textContent = list[0].main.temp.toFixed(0) + "°";
  box.appendChild(cityTemp);

  const cityImgBox = document.createElement("div");
  cityImgBox.classList.add("cityImgBox");
  cityContainer.appendChild(cityImgBox);

  const img = document.createElement("img");
  img.src = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${list[0].weather[0].icon}.svg`;
  cityImgBox.appendChild(img);
}

// TODO refresh button
