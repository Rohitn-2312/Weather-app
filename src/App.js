import React, { useEffect, useState } from 'react';
import coldBg from "./assets/cold2.png";
import hotBg from "./assets/hot.png";
import Descriptions from "./components/Descriptions";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("Paris");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg); // Initial background set to hotBg
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      // Dynamic background image based on temperature
      const threshold = units === "metric" ? 20 : 68; // 20°C = 68°F
      setBg(data.temp > threshold ? hotBg : coldBg); // Hot background if temperature is above threshold, else cold background
    };
    fetchWeatherData();
  }, [units, city]);

  // Function to handle unit conversion
  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C"; // Change button text
    setUnits(isCelsius ? "metric" : "imperial"); // Change units
  };

  // Function to handle city change on pressing Enter
  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`} style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <CommonCard darkMode={darkMode}>
              {/* Input for city */}
              <div className={`section section__inputs ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                <input
                  className="input"
                  onKeyDown={enterKeyPressed}
                  type="text"
                  name="city"
                  placeholder="Enter City..."
                />
                {/* Buttons for unit conversion and dark mode toggle */}
                <div className="buttons">
                  <button onClick={handleUnitsClick}>°F</button>
                  <button onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
                </div>
              </div>
              {/* Section for temperature */}
              <div className={`section section__temperature ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                <div className="icon">
                  <h3>{`${weather.name}, ${weather.country}`}</h3>
                  <img src={weather.iconURL} alt="weatherIcon" />
                  <h3>{weather.description}</h3>
                </div>
                <div className="temperature">
                  <h1>{`${weather.temp.toFixed()} °${units === "metric" ? "C" : "F"}`}</h1>
                </div>
              </div>
              {/* Bottom description */}
              <Descriptions weather={weather} units={units} darkMode={darkMode} />
            </CommonCard>
          </div>
        )}
      </div>
    </div>
  );
}

// Common card component for styling
const CommonCard = ({ darkMode, children }) => {
  return (
    <div className={`card ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {children}
    </div>
  );
}

export default App;
