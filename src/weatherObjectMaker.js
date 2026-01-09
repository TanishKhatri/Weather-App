import { parseISO } from "date-fns";

function factoryFunctionForWeekWeatherList(dataFromAPI) {
  //Return a List that has the specific needed data form API
  const daysList = [];
  dataFromAPI.days.forEach((day) => {
    const dayObject = {};
    dayObject.date = parseISO(day.datetime);
    dayObject.temp = day.temp;
    dayObject.humidity = day.humidity;
    dayObject.windDirection = day.winddir;
    dayObject.precipitation = day.precip;
    dayObject.description = day.description;
    dayObject.icon = day.icon;
    dayObject.windSpeed = day.windspeed;
    daysList.push(dayObject);
  });
  return daysList;
}

export { factoryFunctionForWeekWeatherList };
