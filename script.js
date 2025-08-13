    const apiKey = '492346f5518d85dcefba5299c31abd2c'; // Replace with your API key

    const loader = document.getElementById("loader");
    const resultDiv = document.getElementById("weatherResult");

    function getEmoji(weather) {
      const main = weather.toLowerCase();
      if (main.includes("cloud")) return "⛅";
      if (main.includes("rain")) return "🌧️";
      if (main.includes("clear")) return "☀️";
      if (main.includes("storm")) return "⛈️";
      if (main.includes("snow")) return "❄️";
      return "🌡️";
    }

    async function fetchWeather(url) {
      try {
        loader.style.display = "block";
        resultDiv.innerHTML = "";

        const response = await fetch(url);
        const data = await response.json();

        loader.style.display = "none";

        if (data.cod === "404") {
          resultDiv.textContent = "City not found .";
        }
        else if (data.cod === "400") {
          resultDiv.textContent = " data  fetching error  .";
        }
        else {
          const { temp, humidity } = data.main;
          const { speed } = data.wind;
          const name = data.name;
          const weather = data.weather[0].main;
          const emoji = getEmoji(weather);

          resultDiv.innerHTML = `
            <div class="emoji">${emoji}</div>
            <strong>${name}</strong><br>
            🌡️ Temp: ${temp}°C<br>
            💧 Humidity: ${humidity}%<br>
            💨 Wind: ${speed} m/s
          `;
        }
      } catch (error) {
        loader.style.display = "none";
        resultDiv.textContent = "Something went wrong.";
        console.error(error);
      }
    }

    function getWeather() {
      const city = document.getElementById('cityInput').value;
      if (!city) return alert("Please enter a city name.");
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      fetchWeather(url);
    }

    function getCurrentLocationWeather() {
      if (!navigator.geolocation) {
        alert("Geolocation not supported.");
        return;
      }

      loader.style.display = "block";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
          fetchWeather(url);
        },
        () => {
          loader.style.display = "none";
          alert("Unable to retrieve location.");
        }
      );
    }
