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

const lat = 59.334591;
const lon = 18.06324;

window.onload = () => {
  fetchWeatherData(lat, lon);
};

// validering
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent form submission

    // Get form fields
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const message = document.getElementById("message");

    // Get error message elements
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const messageError = document.getElementById("messageError");

    let isValid = true;

    // Name validation
    if (name.value.trim().length < 2) {
      nameError.classList.add("visible");
      isValid = false;
    } else {
      nameError.classList.remove("visible");
    }

    // Email validation
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email.value.trim())) {
      emailError.classList.add("visible");
      isValid = false;
    } else {
      emailError.classList.remove("visible");
    }

    // Phone validation
    const phonePattern = /^[0-9]+$/;
    if (
      !phonePattern.test(phone.value.trim()) ||
      phone.value.trim().length < 10
    ) {
      phoneError.classList.add("visible");
      isValid = false;
    } else {
      phoneError.classList.remove("visible");
    }

    // Message validation
    if (message.value.trim() === "") {
      messageError.classList.add("visible");
      isValid = false;
    } else {
      messageError.classList.remove("visible");
    }

    if (isValid) {
      message.classList.add("success");
      message.value =
        "Thank you for your message! I will get back to you shortly.";
      name.value = "";
      email.value = "";
      phone.value = "";
    }
  });
});
