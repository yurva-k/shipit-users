// Global variables
let apiKey = "dummyapikey"; // Level 1 Bug 2: Should use a valid API key
let weatherDisplay = document.getElementById("weather-display");
let errorDisplay = document.getElementById("error-display");

// Level 1 Bug 1: Missing event listener for Enter key

function getWeather() {
    const city = document.getElementById("city-input").value;
    if (!city) {
        errorDisplay.textContent = "Please enter a city name.";
        return;
    }
    errorDisplay.textContent = "";
    weatherDisplay.innerHTML = "Loading...";

    // Level 2 Bug 1: Typo in API endpoint 'q' is misspelled as 'qq'
    fetch(
        `https://api.openweathermap.org/data/2.5/weather?qq=${city}&appid=${apiKey}&units=metric`
    )
    .then(response => {
        // Level 2 Bug 2: Missing status/error handling for failed HTTP or bad city
        return response.json();
    })
    .then(data => {
        // Level 3 Bug 1: Wrong property used for temperature (uses kelvin instead of metric)
        const temp = data.main.temp_k; // typo should be 'temp'
        const desc = data.weather[0].description;
        const icon = data.weather[0].icon;
        weatherDisplay.innerHTML = `
            <div class="flex flex-col items-center">
                <img src="https://openweathermap.org/img/w/${icon}.png" alt="weather icon" class="mb-2">
                <span class="text-xl font-bold">${temp} °C</span>
                <span class="capitalize">${desc}</span>
            </div>
        `;
        errorDisplay.textContent = "";
    })
    .catch(err => {
        // Level 3 Bug 2: Error message is always 'Network error' - doesn't show actual error
        errorDisplay.textContent = "Network error";
        weatherDisplay.innerHTML = "";
    });
}

// Level 4 Bug 1: Old weather doesn't clear if new search fails
// Level 4 Bug 2: Icons may not match weather condition: icon fetch not validated

// Level 5 Bug 1: No debounce for search; repeated clicks can flood API
// Level 5 Bug 2: No input validation (numbers, script, non-city input allowed)
