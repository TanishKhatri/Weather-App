//Function to Control the Weather-API, returns the object for displaying the weather

async function getWeatherObjectFromAPI(chosenCity) {
  try {
    const currWeatherResponse = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${chosenCity}?unitGroup=metric&key=JGPVJ3TGWWGEJ3LPNP2H2CKEM`
    );
    const currWeatherObject = await currWeatherResponse.json();
    return currWeatherObject;
  } catch (error) {
    throw new Error(`Failed to query API, Error: ${error}`);
  }
}

export { getWeatherObjectFromAPI };
