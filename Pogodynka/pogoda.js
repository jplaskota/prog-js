//in
const searchCity = document.querySelector("[data-search]");
const add = document.querySelector("[data-add]");
const format = document.querySelector("[data-format]");
const saved = document.querySelector("[data-saved]");
const err = document.querySelector("[data-err]");
const daysBox = document.querySelector("[data-days]");
const hoursBox = document.querySelector("[data-hours");

//out (current)
const city = document.querySelector("[data-city]");
const temp = document.querySelector("[data-temp]");
const desc = document.querySelector("[data-desc]");
const tempMin = document.querySelector("[data-temp-min]");
const tempMax = document.querySelector("[data-temp-max]");

let savedCity = [];

window.addEventListener("load", async (e) => {
  console.log("page is fully loaded");
  setInterval(loadSaved, 300000);
  loadSaved();

  await changeCurrent(
    JSON.parse(localStorage.getItem("pin")) ||
      (savedCity.length > 0 ? savedCity[0] : "Kraków")
  );
});

// load saved cities from local storage and render them
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

// search city by name
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
    if (savedCity.length >= 10) {
      console.log("All slots occupied");
      error("All slots occupied");
      return;
    }

    for (let i = 0; i < savedCity.length; i++) {
      if (savedCity[i] === city.textContent) {
        console.log("City already saved");
        error("City already saved");
        return;
      }
    }
  }

  savedCity.push(city.textContent);

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

// error notification
async function error(message) {
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
async function remove(cityName) {
  const index = savedCity.indexOf(cityName);
  console.log(index);

  if (index > -1) {
    savedCity.splice(index, 1);
    console.log("Delete");
    localStorage.setItem("city", JSON.stringify(savedCity));
    loadSaved();
  }
}

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
        error("City not found");
        throw new Error("City not found");
      }
    })
    .catch((err) => console.log(err));

  return {
    name: city.name,
    list: list,
  };
}

// download hours data by city name
async function getHours(cityName) {
  const { list } = await fetch(
    "https://pro.openweathermap.org/data/2.5/forecast/hourly?q=" +
      cityName +
      "&cnt=6&mode=json&units=metric&appid=e56ebc4991608107818d622503afefbe",
    { method: "GET" }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        error("Error with hours fetch");
        throw new Error("Error with hours fetch");
      }
    })
    .catch((err) => console.log(err));

  return {
    hours: list,
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

  daysBox.innerHTML = "";
  hoursBox.innerHTML = "";

  const { hours } = await getHours(cityName);

  function pad(d) {
    return d < 10 ? "0" + d.toString() : d.toString();
  }

  // add 5 next hours
  for (let i = 1; i < 6; i++) {
    const box = document.createElement("div");
    box.classList.add("hour");
    hoursBox.appendChild(box);

    const hour = document.createElement("p");
    hour.textContent = pad((new Date().getHours() + i) % 24);
    box.appendChild(hour);

    const img = document.createElement("img");
    img.src = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${hours[i].weather[0].icon}.svg`;
    box.appendChild(img);

    const temp = document.createElement("p");
    temp.textContent = hours[i].main.temp.toFixed(0) + "°";
    box.appendChild(temp);
  }

  // add 5 next days of weekend
  for (let i = 1; i < 6; i++) {
    const box = document.createElement("div");
    box.classList.add("day", "bgc");
    daysBox.appendChild(box);

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

// render saved cities
async function renderCity(cityName) {
  const { name, list } = await getWeather(cityName);

  const cityContainer = document.createElement("div");
  cityContainer.classList.add("saved", "bgc");
  saved.appendChild(cityContainer);

  // change current city
  cityContainer.addEventListener("click", (e) => {
    localStorage.setItem("pin", JSON.stringify(name));
    changeCurrent(name);
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
    remove(name);
    cityContainer.remove();
  });

  const box = document.createElement("div");
  box.classList.add("savedBox");
  cityContainer.appendChild(box);

  const cityNameBox = document.createElement("div");
  cityNameBox.classList.add("city");
  cityNameBox.textContent = name;
  box.appendChild(cityNameBox);

  const cityTemp = document.createElement("div");
  cityTemp.classList.add("temp");
  cityTemp.textContent = list[0].temp.day.toFixed(0) + "°";
  box.appendChild(cityTemp);

  const cityImgBox = document.createElement("div");
  cityImgBox.classList.add("cityImgBox");
  cityContainer.appendChild(cityImgBox);

  const img = document.createElement("img");
  img.src = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${list[0].weather[0].icon}.svg`;
  cityImgBox.appendChild(img);
}

// [max 30 days weather forecast]
// https://pro.openweathermap.org/data/2.5/forecast/climate?q={city name}&cnt={number of days}&mode=json&units=metric&appid={API key}

// [hourly forecast]
// https://pro.openweathermap.org/data/2.5/forecast/hourly?q={city name}&cnt={number of hours}&mode=json&units=metric&appid={API key}

// e56ebc4991608107818d622503afefbe
