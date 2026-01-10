import { parseISO } from "date-fns";

function factoryFunctionForWeekWeatherList(dataFromAPI) {
  //Return a List that has the specific needed data form API
  const daysList = [];
  const numberOfDays = 7;

  for (let i = 0; i < numberOfDays; i++) {
    const dayObject = {};
    dayObject.date = parseISO(dataFromAPI.days[i].datetime);
    dayObject.temp = dataFromAPI.days[i].temp;
    dayObject.humidity = dataFromAPI.days[i].humidity;
    dayObject.windDirection = dataFromAPI.days[i].winddir;
    dayObject.precipitation = dataFromAPI.days[i].precip;
    dayObject.description = dataFromAPI.days[i].description;
    dayObject.icon = dataFromAPI.days[i].icon;
    dayObject.windSpeed = dataFromAPI.days[i].windspeed;
    daysList.push(dayObject);
  }
  return daysList;
}

export { factoryFunctionForWeekWeatherList };
