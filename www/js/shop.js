  const { page = 1 } = req.query; 
  const rawgUrl = 'https://api.rawg.io/api/games';
  const apiKey = 'af44d7146ee947279a58c62db9ff347e';

const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("movies");
const form = document.getElementById("search-form");
const search = document.getElementById("search");


async function getGames(page) {
    let url = rawgUrl + `?api_key=${apiKey}&page=${page}`;

    if (currentSearchTerm) {
        url = `${SEARCHAPI}${currentSearchTerm}&page=${page}`;
    }   else {
        url = `${rawgUrl}?api_key=${apiKey}&page=${page}`;
    }
    const resp = await fetch(url);
    const respData = await resp.json();
    totalPages = respData.total_pages; 

    console.log(respData);

    showGames(respData.results);
    updatePageControls();

    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error(`API call failed: ${resp.status}`);
        }
        const respData = await resp.json();
        totalPages = respData.total_pages;
        console.log(respData);
        showMovies(respData.results);
        updatePageControls();
    } catch (error) {
        console.error("Failed to fetch movies:", error);
    }
}

function showGames(movies) {
    main.innerHTML = "";

    movies.forEach((game) => {
        const { id, poster_path, title, vote_average } = game;

        const movieLink = document.createElement("a");
        movieLink.href = `eachMoviee.html?gameId=${id}`; 
        movieLink.classList.add("game");

        const formattedVoteAverage = parseFloat(vote_average).toFixed(1);

        movieLink.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${formattedVoteAverage}</span>
            </div>
        `;

        main.appendChild(movieLink);
    });
}


function updatePageControls() {
    document.getElementById("currentPage").innerText = `Page ${currentPage}`;
    document.getElementById("prevButton").disabled = currentPage === 1;
}

document.getElementById("nextButton").addEventListener("click", () => {
    
        currentPage += 1;
        getGames(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    
});

document.getElementById("prevButton").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        getMovies(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});