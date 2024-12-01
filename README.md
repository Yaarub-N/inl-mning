### README: Weather and Theme Toggle Web Application

---

## **Introduction**
This is a responsive web application that offers a **dark/light theme toggle** and displays real-time weather data for a specified location. The project is built using **HTML**, **CSS**, and **JavaScript**, with weather data fetched from the [OpenWeatherMap API](https://openweathermap.org/).

---

## **Features**
### 1. **Theme Switching**
- **Light and Dark Modes**: Users can toggle between light and dark themes using a switch button.
- **Dynamic Styling**: Changes are applied instantly, with smooth transitions.

### 2. **Weather Information**
- Displays real-time weather data, including:
  - Description (e.g., "clear sky")
  - Temperature (in Celsius)
  - Weather icon representing the current condition
- Uses Stockholm's latitude and longitude as the default location.

### 3. **Responsive Design**
- Optimized for various screen sizes, ensuring a seamless experience on desktops, tablets, and smartphones.

---

## **Technologies Used**
### 1. **HTML**
- Semantic structure for content.
- Includes placeholders for theme toggle and weather display.

### 2. **CSS**
- Custom properties (`:root`) for easy theme management.
- Smooth transitions for theme switching and interactive elements.
- Responsive design for better user experience.

### 3. **JavaScript**
- **Theme Toggle**: Implements a checkbox to switch between light and dark themes dynamically.
- **Weather Fetching**: 
  - Uses the Fetch API to get data from OpenWeatherMap.
  - Displays the weather with icons and a description.

---

## **Setup and Usage**

### 1. **Clone the Repository**
```bash
git clone https://github.com/your-username/weather-theme-toggle.git
cd weather-theme-toggle
```

### 2. **Replace API Key**
- Go to [OpenWeatherMap API](https://openweathermap.org/api) and generate an API key.
- Replace the placeholder `apiKey` in the JavaScript file:
  ```javascript
  const apiKey = "your-api-key";
  ```

### 3. **Open the Project**
- Open the `index.html` file in your browser to view the application.

---

## **Code Overview**
### **HTML Structure**
- Contains sections for:
  - Navigation menu
  - Weather display
  - Theme toggle
- Example:
  ```html
  <input type="checkbox" id="theme-switch" />
  <label for="theme-switch">Toggle Dark Mode</label>
  <div class="weather"></div>
  ```

### **CSS Highlights**
- **Variables**: 
  - Define theme-related properties like background color, text color, and box shadows.
  - Easily toggled between light and dark themes via the `.dark-theme` class.
- **Responsive Design**: 
  - Media queries adjust layout for smaller screens.
  - Example: Mobile-friendly menu.

### **JavaScript Functionality**
- **Theme Toggle**: 
  - Listens to changes on the theme switch checkbox and applies the `.dark-theme` class to the `<body>`.
  - Example:
    ```javascript
    themeSwitch.addEventListener("change", () => {
      document.body.classList.toggle("dark-theme", themeSwitch.checked);
    });
    ```
- **Weather Fetching**:
  - Fetches data using latitude and longitude.
  - Updates the DOM with a description, temperature, and weather icon.
  - Example:
    ```javascript
    async function fetchWeatherData(lat, lon) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      displayWeather(data);
    }
    ```

---

## **Screenshots**
### 1. **Light Theme**
![Skärmbild 2024-12-01 181303](https://github.com/user-attachments/assets/912a5953-95e9-4a8f-8cdc-386fb708c330)

### 2. **Dark Theme**
![Skärmbild 2024-12-01 181248](https://github.com/user-attachments/assets/6c05051b-77a4-4630-b806-92ae3015133b)

---

## **Future Enhancements**
- **Geolocation Support**: Dynamically fetch weather based on the user's location.
- **Unit Toggle**: Allow users to switch between Celsius and Fahrenheit.


---


---

## **Acknowledgments**
- [OpenWeatherMap API](https://openweathermap.org/)
- Icons from OpenWeatherMap for accurate weather representation.

---

Feel free to update this file with additional details as your project evolves! Let me know if you need further enhancements or customization.
