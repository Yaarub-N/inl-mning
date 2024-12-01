const themeSwitch = document.getElementById("theme-switch");

themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-theme", themeSwitch.checked);
});

// Replace this with your actual API key
const apiKey = "8b406db3f50e5fb0c6d569894cf3b50b";

// Function to fetch weather data based on latitude and longitude
async function fetchWeatherData(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`; // Using metric units for Celsius

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
    } else {
      console.error("Error fetching weather data:", data);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Function to display weather data
function displayWeather(data) {
  const weatherElement = document.querySelector(".weather");

  // Extract necessary data from the API response
  const weatherDescription = data.weather[0].description;
  const temperature = data.main.temp.toFixed(1); // Rounded temperature
  const iconCode = data.weather[0].icon;

  // Construct the HTML to display the weather

  weatherElement.innerHTML = `
    <span>${weatherDescription} - ${temperature}°C</span>
    <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weatherDescription}" />
  `;
}

// Example coordinates (latitude and longitude for Province of Turin, Italy)
const lat = 59.334591; // Latitude for Province of Turin
const lon = 18.06324; // Longitude for Province of Turin

// Fetch and display weather data on page load
window.onload = () => {
  fetchWeatherData(lat, lon);
};
