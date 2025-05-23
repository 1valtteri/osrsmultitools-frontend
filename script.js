// Fetches the player data from the API based on the player username.
async function fetchPlayer() {
  try {
    document.getElementById("loader").style.display = "block";

    const searchBar = document.getElementById("searchusername");
    searchBar.classList.remove("searchusernameerror");
    const skillNamesEl = document.getElementById("skillNames");
    const activitiesEl = document.getElementById("activities");
    skillNamesEl.innerHTML = "";
    activitiesEl.innerHTML = "";

    const userName = document.getElementById("userName").value;
    const response = await fetch(
      `https://osrsmultitools-api-backend.onrender.com/player/${userName}`
    );

    document.getElementById("loader").style.display = "none";

    if (!response.ok) {
      searchBar.classList.add("searchusernameerror");
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Player not found";
      errorMessage.classList.add("error-message");
      skillNamesEl.appendChild(errorMessage);
      throw new Error("Could not fetch resource");
    }

    const data = await response.json();
    console.log(data);
    const skillSortOrder = [
      1, 4, 15, 3, 17, 14, 2, 16, 11, 5, 18, 8, 6, 13, 12, 7, 10, 9, 21, 19, 20,
      23, 22, 0,
    ];
    const skills = data.skills.sort(
      (a, b) => skillSortOrder.indexOf(a.id) - skillSortOrder.indexOf(b.id)
    );

    skillNamesEl.innerHTML = "";

    for (let { name, level, xp } of skills) {
      const skillBox = document.createElement("div");
      skillBox.classList.add("skill-box");

      const img = document.createElement("img");
      img.src = `icons/${name}.png`;
      img.alt = name;
      img.classList.add("skill-icon");

      const levelText = document.createElement("p");
      if (name == "Overall") {
        levelText.innerText = `${level} / 2277`;
      } else {
        levelText.innerText = `${level} / 99`;
      }

      const clickInfo = document.createElement("div");
      clickInfo.classList.add("click-info");
      clickInfo.innerHTML = `
                Name: ${name}<br>
                Level: ${level}<br>
                XP: ${xp}`;

      skillBox.onclick = () => {
        clickInfo.style.display =
          clickInfo.style.display === "block" ? "none" : "block";
      };

      skillBox.append(img, levelText, clickInfo);
      skillNamesEl.append(skillBox);
    }

    const activities = data.activities.filter((activity) => {
      return activity.score > 0;
    });

    for (let { name, rank, score } of activities) {
      const activityInfo = document.createElement("p");
      activityInfo.innerHTML = `
                <strong>Activity:</strong> ${name}, <strong>rank:</strong> ${rank}, <strong>score:</strong> ${score}`;
      activitiesEl.append(activityInfo);
    }
    console.log(skills);
  } catch (error) {
    console.error(error);
  }
}

// Clears the username input field.
function clearInput() {
  const input = document.getElementById("userName");
  input.value = "";
}

// Displays the search history from local storage in the search history box. 
// Also allows the user to click the search term in the search history box and fills the input field with the clicked search term.
function displaySearchHistory() {
  const searchHistoryContainer = document.getElementById("searchHistory");
  searchHistoryContainer.innerHTML = "";

  const searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searches.forEach((search) => {
    const p = document.createElement("p");
    p.textContent = search;
    p.addEventListener("click", () => {
      document.getElementById("userName").value = search;
    });
    searchHistoryContainer.appendChild(p);
  });
}

// Adds the given input to the search history which is stored in local storage. The search history is limited to 5 searches.
function addToSearchHistory(input) {
  if (input === null || input.trim() === "") {
    return;
  }
  let searches = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!searches.includes(input)) {
    searches.unshift(input);
    searches = searches.slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(searches));
  }
}

// Event: when the user clicks the search button, the player data is fetched from the API and the input is added to search history.
document.getElementById("searchbutton").addEventListener("click", () => {
  fetchPlayer();
  const searchInput = document.getElementById("userName");
  const input = searchInput.value;
  addToSearchHistory(input);
  searchInput.value = "";
  displaySearchHistory();
});

// Event: when the clear input button is clicked, the input field is emptied.
document.getElementById("clearbutton").addEventListener("click", () => {
  clearInput();
});

// Event: the search history can be toggled to be visible or not clicking the toggle button.
document.getElementById("togglehistorybutton").addEventListener("click", () => {
  const searchHistoryContainer = document.getElementById("searchHistory");
  searchHistoryContainer.style.display =
    searchHistoryContainer.style.display === "none" ? "block" : "none";
});

window.addEventListener("DOMContentLoaded", displaySearchHistory);

console.log(searchHistoryList);
