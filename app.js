//DOM elements
const search = document.getElementById("search");
const form = document.getElementById("form");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("error-message");
const cityName = document.getElementById("city-name");
const today = document.getElementById("today");
const hourly = document.getElementById("hourly");

//Variables
let searchValue;
let apiData;

//Insert spinner
const getSpinner = () => {
  spinner.innerHTML = `<div class="spinner"> </div>`;
};
getSpinner();

//Async function working with Geolocation
const success = async ({ coords }) => {
  const { latitude, longitude } = coords;
  console.log(latitude, longitude, coords);

  //talk to the weather api

  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=febe8f629f51dada769cb8d3fd1062da`
  );

  apiData = data;
  console.log(apiData);
  console.log(apiData.city.name);
  console.log(apiData.list[0].weather[0].main);

  //get data and update the DOM
  removeSpinner();
  updateLocation();
  updateTodayCard();
  updateHourlyCard();
};

const error = (error) => {
  console.log(error);
  errorMessage.innerHTML = `<p class="error">Unable to retrieve your location. Please refresh the page or add your location manually.</p>`;
};

const config = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 2000,
};

navigator.geolocation.getCurrentPosition(success, error, config);

//Update the page and remove spinner
const removeSpinner = () => {
  spinner.remove();
  errorMessage.innerHTML = ``;
};

const updateLocation = () => {
  cityName.innerHTML = `<p class="location">${apiData.city.name}, ${apiData.city.country}</p>`;
};

const updateTodayCard = () => {
  const element = apiData.list[0];
  const todayWeather = `<div class="today-card">  
            <div class="today-weather-info">
            <p class="today-temp">${Math.round(
              element.main.temp - 273.15
            )}&#8451</p>
            <div class="today-weather-icon"><img src="https://openweathermap.org/img/wn/${
              element.weather[0].icon
            }@2x.png"></div>
            <p class="today-description">${element.weather[0].description}</p>
            </div>
            </div> `;
  today.innerHTML = todayWeather;
};

const updateHourlyCard = () => {
  const hourlyData = apiData.list.slice(0, 5);
  const hourlyWeather = hourlyData.map((element) => {
    return `<div class="hourly-weather-info"> 
        <p class="hours">${new Date(element.dt * 1000)
          .getHours()
          .toLocaleString()}:00</p>
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${
          element.weather[0].icon
        }@2x.png"></div>
        <p class="temp">${Math.round(element.main.temp - 273.15)}&#176;</p>
        </div>`;
  });

  hourly.innerHTML = `<div class="hourly-card">
    <h3 class="card-title">Hourly Forecast</h3>
    <div class="hourly-weather-card">${hourlyWeather.join("")}</div>
    </div>`;
};

const getData = async () => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=febe8f629f51dada769cb8d3fd1062da`
    );
    apiData = data;
    console.log(apiData);
    removeSpinner();
    updateLocation();
    updateTodayCard();
    updateHourlyCard();
  } catch (error) {
    if (searchValue === "") {
      console.log("Empty form");
      errorMessage.innerHTML = `<p class="error">Please enter your location.</p>`;
      cityName.innerHTML = ``;
      today.innerHTML = ``;
      hourly.innerHTML = ``;
    } else {
      console.log("API said no!");
      errorMessage.innerHTML = `<p class="error">Unable to retrieve your location. Please try again.</p>`;
      cityName.innerHTML = ``;
      today.innerHTML = ``;
      hourly.innerHTML = ``;
    }
  }
};

//User's input
search.addEventListener("input", (e) => {
  e.preventDefault();
  searchValue = e.target.value;
  console.log(searchValue);
  getData();
});

search.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchValue = e.target.value;
    console.log(searchValue);
    getData();
    form.reset();
  }
});
