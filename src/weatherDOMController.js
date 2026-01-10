//Populates the weather Data inside the weatherDiv and weatherTimeline
//Controls the Search Input
import { format } from "date-fns";
import { getWeatherObjectFromAPI } from "./weatherAPIController.js";
import { factoryFunctionForWeekWeatherList } from "./weatherObjectMaker";
import { te } from "date-fns/locale";

async function getWeatherData(cityName) {
  try {
    let cityWeather = await getWeatherObjectFromAPI(cityName);
    return factoryFunctionForWeekWeatherList(cityWeather);
  } catch (errorMessage) {
    throw new Error(errorMessage);
  }
}

function addEventListenersToSearch() {
  const searchInput = document.querySelector("#searchInput");
  const searchButton = document.querySelector(".searchButton");
  const form = document.querySelector("form.searchContainer");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  searchButton.addEventListener("click", () => {
    if (searchInput.checkValidity()) {
      const cityName = searchInput.value;
      const errorText = document.querySelector(".errorText");
      const loadingIcon = document.querySelector(".loadingIcon");
      loadingIcon.classList.remove("hidden");
      getWeatherData(cityName).then((list) => {
        errorText.classList.add("hidden");
        populateDataInWeatherDiv(list).then(() => {
          loadingIcon.classList.add("hidden");
        });
      }).catch((error) => {
        errorText.textContent = "Bad Query, Process Failed";
        errorText.classList.remove("hidden");
        loadingIcon.classList.add("hidden");
      });
    }
  });
}

addEventListenersToSearch();

// Data List format:
/*
  [
    {
      date,
      temp,
      humidity,
      windDirection,
      precipitation,
      description,
      icon,
      windSpeed
    },
    {
      ...
    }
  ]
 */
async function populateDataInWeatherDiv(dataList) {
  const weatherDiv = document.querySelector("div.weatherDiv");
  weatherDiv.innerHTML = `<div class="errorText hidden"></div>`;
  const dayObject = dataList[0];
  const chosenDayInfo = await populateChosenDiv(dayObject);
  weatherDiv.appendChild(chosenDayInfo);

  //Populating Timeline
  const dayTimeline = document.createElement("div");
  dayTimeline.classList.add("dayTimeline");

  console.log(dataList);

  for (const day of dataList) {
    const timelineDiv = document.createElement("div");
    timelineDiv.classList.add("timelineDiv");
    
    const timelineDay = document.createElement("p");
    timelineDay.classList.add("timelineDay");
    timelineDay.textContent = format(day.date, "d MMM");
    timelineDiv.appendChild(timelineDay);

    const timelineIconDiv = document.createElement("div");
    timelineIconDiv.classList.add("timelineIconDiv");

    const timelineIcon = document.createElement("img");
    timelineIcon.classList.add("timelineIcon");
    const timelineIconSVG = await import(`./assets/WeatherIcons/SVG/4th Set - Color/${day.icon}.svg`);
    timelineIcon.src = timelineIconSVG.default;

    timelineIconDiv.appendChild(timelineIcon);

    timelineDiv.appendChild(timelineIconDiv);

    const timelineTemp = document.createElement("div");
    timelineTemp.classList.add("timelineTemp", "tempSelection", "celsius");
    timelineTemp.textContent = `${day.temp}\u00B0 C`;
    timelineDiv.appendChild(timelineTemp);
    dayTimeline.appendChild(timelineDiv);

    //Timeline Div Event Listeners
    timelineDiv.addEventListener("click", async () => {
      const newChosenDayInfo = await populateChosenDiv(day);
      dayTimeline.before(newChosenDayInfo);
    });
  };

  weatherDiv.appendChild(dayTimeline);
}

async function populateChosenDiv(dayObject) {
  const checkIfDivAlreadyMade = document.querySelector(".chosenDayInfo");
  if (checkIfDivAlreadyMade) {
    checkIfDivAlreadyMade.remove();
  }
  const chosenDayInfo = document.createElement("div");
  chosenDayInfo.classList.add("chosenDayInfo");

  const dayAndIcon = document.createElement("div");
  dayAndIcon.classList.add("dayAndIcon");

  const chosenDayDate = document.createElement("div");
  chosenDayDate.classList.add("chosenDayDate");

  const dateAndDay = document.createElement("h1");
  dateAndDay.classList.add("dateAndDay");
  dateAndDay.textContent = format(dayObject.date, "do MMMM yyyy, EEEE");
  chosenDayDate.appendChild(dateAndDay);

  const dayDescription = document.createElement("div");
  dayDescription.classList.add("dayDescription");
  dayDescription.textContent = dayObject.description;
  chosenDayDate.appendChild(dayDescription);

  const dayCity = document.createElement("div");
  dayCity.classList.add("dayCity");
  dayCity.textContent = capitalize(dayObject.resolvedAddress);
  chosenDayDate.appendChild(dayCity);

  dayAndIcon.appendChild(chosenDayDate);

  const rightSideFlexContainer = document.createElement("div");
  rightSideFlexContainer.classList.add("rightSideFlexContainer");

  const chosenDayIcon = document.createElement("div");
  chosenDayIcon.classList.add("chosenDayIcon");

  const weatherImage = document.createElement("img");
  weatherImage.classList.add("weatherImage");
  console.log(dayObject.icon);
  const weatherImageIcon = await import(
    `./assets/WeatherIcons/SVG/4th Set - Color/${dayObject.icon}.svg`
  );
  weatherImage.src = weatherImageIcon.default;
  chosenDayIcon.appendChild(weatherImage);

  rightSideFlexContainer.appendChild(chosenDayIcon);

  const temperatureSelector = document.createElement("button");
  temperatureSelector.classList.add("temperatureSelector");
  temperatureSelector.textContent = "F";

  //Temperature Selector Event Listener
  temperatureSelector.addEventListener("click", () => {
    const tempSelectionAll = document.querySelectorAll(".tempSelection");
    tempSelectionAll.forEach((tempDiv) => {
      const temperature = Number.parseFloat(tempDiv.textContent);
      if (tempDiv.classList.contains("celsius")) {
        const newTemperature = (temperature*9/5) + 32;
        tempDiv.textContent = `${newTemperature.toFixed(1)}\u00B0 F`;
        tempDiv.classList.remove("celsius");
        tempDiv.classList.add("fahrenheit");
      } else {
        const newTemperature = (temperature-32)*5/9;
        tempDiv.textContent = `${newTemperature.toFixed(1)}\u00B0 C`;
        tempDiv.classList.remove("fahrenheit");
        tempDiv.classList.add("celsius");
      }
    });
  });

  rightSideFlexContainer.appendChild(temperatureSelector);

  dayAndIcon.appendChild(rightSideFlexContainer);

  chosenDayInfo.appendChild(dayAndIcon);

  const chosenDayMetrics = document.createElement("div");
  chosenDayMetrics.classList.add("chosenDayMetrics");

  const chosenDayMetricContainerTemp = document.createElement("div");
  chosenDayMetricContainerTemp.classList.add("chosenDayMetricContainer");

  const metricTitleTemp = document.createElement("p");
  metricTitleTemp.classList.add("metricTitle");
  metricTitleTemp.textContent = "Temperature";
  chosenDayMetricContainerTemp.appendChild(metricTitleTemp);

  const metricIconContainerTemp = document.createElement("div");
  metricIconContainerTemp.classList.add("metricIconContainer");

  const temperatureIcon = document.createElement("img");
  temperatureIcon.classList.add("temperatureIcon");
  const temperatureIconImage = await import(
    "./assets/metricIcons/temperature-half-svgrepo-com.svg"
  );
  temperatureIcon.src = temperatureIconImage.default;
  metricIconContainerTemp.appendChild(temperatureIcon);

  chosenDayMetricContainerTemp.appendChild(metricIconContainerTemp);

  const metricTemp = document.createElement("p");
  metricTemp.classList.add("metric", "tempSelection", "celsius");
  metricTemp.textContent = `${dayObject.temp.toFixed(1)}\u00B0 C`; //\u00B0 is the symbol for degree

  chosenDayMetricContainerTemp.appendChild(metricTemp);

  chosenDayMetrics.appendChild(chosenDayMetricContainerTemp);

  const chosenDayMetricContainerHumidity = document.createElement("div");
  chosenDayMetricContainerHumidity.classList.add("chosenDayMetricContainer");

  const metricTitleHumidity = document.createElement("p");
  metricTitleHumidity.classList.add("metricTitle");
  metricTitleHumidity.textContent = "Humidity";
  chosenDayMetricContainerHumidity.appendChild(metricTitleHumidity);

  const metricIconContainerHumidity = document.createElement("div");
  metricIconContainerHumidity.classList.add("metricIconContainer");

  const droplet = document.createElement("img");
  droplet.classList.add("droplet");
  const dropletIcon = await import("./assets/metricIcons/drop-svgrepo-com.svg");
  droplet.src = dropletIcon.default;
  metricIconContainerHumidity.appendChild(droplet);

  chosenDayMetricContainerHumidity.appendChild(metricIconContainerHumidity);

  const metricHumidity = document.createElement("p");
  metricHumidity.classList.add("metric");
  metricHumidity.textContent = `${dayObject.humidity.toFixed(1)}%`;
  chosenDayMetricContainerHumidity.appendChild(metricHumidity);

  chosenDayMetrics.appendChild(chosenDayMetricContainerHumidity);

  const chosenDayMetricContainerPrecipitation = document.createElement("div");
  chosenDayMetricContainerPrecipitation.classList.add(
    "chosenDayMetricContainer"
  );

  const metricTitlePrecipitation = document.createElement("p");
  metricTitlePrecipitation.classList.add("metricTitle");
  metricTitlePrecipitation.textContent = "Precipitation";
  chosenDayMetricContainerPrecipitation.appendChild(metricTitlePrecipitation);

  const metricIconContainerPrecipitation = document.createElement("div");
  metricIconContainerHumidity.classList.add("metricIconContainer");

  const umbrella = document.createElement("img");
  umbrella.classList.add("umbrella");
  const umbrellaIcon = await import(
    "./assets/metricIcons/umbrella-svgrepo-com.svg"
  );
  umbrella.src = umbrellaIcon.default;
  metricIconContainerPrecipitation.appendChild(umbrella);

  chosenDayMetricContainerPrecipitation.appendChild(
    metricIconContainerPrecipitation
  );

  const metricPrecipitation = document.createElement("p");
  metricPrecipitation.classList.add("metric");
  metricPrecipitation.textContent = `${dayObject.precipitation.toFixed(1)}mm`;
  chosenDayMetricContainerPrecipitation.appendChild(metricPrecipitation);

  chosenDayMetrics.appendChild(chosenDayMetricContainerPrecipitation);

  const chosenDayMetricContainerWind = document.createElement("div");
  chosenDayMetricContainerWind.classList.add(
    "chosenDayMetricContainer",
    "Wind"
  );

  const metricTitleWind = document.createElement("p");
  metricTitleWind.classList.add("metricTitle");
  metricTitleWind.textContent = "Wind Speed";
  chosenDayMetricContainerWind.appendChild(metricTitleWind);

  const metricIconContainerWind = document.createElement("div");
  metricIconContainerWind.classList.add("metricIconContainer");

  const windIcon = document.createElement("img");
  windIcon.classList.add("windIcon");
  const windIconImage = await import(
    "./assets/metricIcons/wind-svgrepo-com.svg"
  );
  windIcon.src = windIconImage.default;
  metricIconContainerWind.appendChild(windIcon);

  chosenDayMetricContainerWind.appendChild(metricIconContainerWind);

  const metricWindSpeed = document.createElement("p");
  metricWindSpeed.classList.add("metric");
  metricWindSpeed.textContent = `${dayObject.windSpeed.toFixed(1)}km/h`;
  chosenDayMetricContainerWind.appendChild(metricWindSpeed);

  const windDirectionContainer = document.createElement("div");
  windDirectionContainer.classList.add("windDirectionContainer");

  const windDirection = document.createElement("p");
  windDirection.classList.add("windDirection");
  windDirection.textContent = degreesToDirection(dayObject.windDirection);
  windDirectionContainer.appendChild(windDirection);

  const windDirectionIcon = document.createElement("div");
  windDirectionIcon.classList.add("windDirectionIcon");

  const arrow = document.createElement("img");
  arrow.classList.add("arrow");
  arrow.style.transform = `rotate(${dayObject.windDirection}deg)`;
  const arrowIcon = await import(
    "./assets/metricIcons/arrow-narrow-up-svgrepo-com.svg"
  );
  arrow.src = arrowIcon.default;
  windDirectionIcon.appendChild(arrow);

  windDirectionContainer.appendChild(arrow);

  chosenDayMetricContainerWind.appendChild(windDirectionContainer);

  chosenDayMetrics.appendChild(chosenDayMetricContainerWind);

  chosenDayInfo.appendChild(chosenDayMetrics);

  return chosenDayInfo;
}

function degreesToDirection(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
}

function capitalize(str = "") {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const weatherDomController = {};
