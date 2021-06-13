"use strict";

const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "ee8a1301",
      s: searchTerm,
    },
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
  // console.log(response.data);
};

// fetchData();
const root = document.querySelector(".autocomplete");
root.innerHTML = `
  <label><b>Search for a Movie</b></label>
  <input class="input">
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

let timeoutId;

const onInput = async (event) => {
  // if (timeoutId) {
  //   clearTimeout(timeoutId);
  // }
  // timeoutId = setTimeout(() => {
  const movies = await fetchData(event.target.value);

  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  // console.log(movies);
  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");
  for (let movie of movies) {
    const option = document.createElement("a");
    const imgSRC = movie.Poster === "N/A" ? "" : movie.Poster;

    option.classList.add("dropdown-item");
    option.innerHTML = `
   <img src="${imgSRC}" />
   ${movie.Title}
   `;

    option.addEventListener("click", () => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;
      onMovieSelect(movie);
    });

    resultsWrapper.appendChild(option);
  }
  // }, 500);
};
input.addEventListener("input", debounce(onInput, 500));

document.addEventListener("click", (event) => {
  // console.log(event.target);
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});

const onMovieSelect = async (movie) => {
  // console.log(movie);
  const response = await await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "ee8a1301",
      i: movie.imdbID,
    },
  });
  console.log(response.data);
};
