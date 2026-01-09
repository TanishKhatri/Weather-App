//Function to Control the Weather-API, returns the object for displaying the weather

async function getWeatherObject(chosenCity) {
  try {
    const currWeatherResponse = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${chosenCity}?key=JGPVJ3TGWWGEJ3LPNP2H2CKEM`
    );
    const currWeatherObject = await currWeatherResponse.json();
    return currWeatherObject;
  } catch (error) {
    console.log(error);
  }
}

const weatherAPIController = { getWeatherObject };

export { weatherAPIController };
