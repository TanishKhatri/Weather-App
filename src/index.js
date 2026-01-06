import "./styles.css";
console.log("It Works");

async function getWeatherObject(chosenCity) {
  try {
    const currWeatherResponse = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${chosenCity}?key=JGPVJ3TGWWGEJ3LPNP2H2CKEM`
    );
    const currWeatherObject = await currWeatherResponse.json();
    return currWeatherObject;
  } catch(error) {
    console.log(error);
  }
}

getWeatherObject("delhi").then((result) => {console.log(result)});