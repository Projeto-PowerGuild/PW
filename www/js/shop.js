function updatePageControls() {
    document.getElementById("currentPage").innerText = `Page ${currentPage}`;
    document.getElementById("prevButton").disabled = currentPage === 1;
}

document.getElementById("nextButton").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage += 1;
        getGames(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.getElementById("prevButton").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        getMovies(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});