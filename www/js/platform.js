function loadShopContent() {
    fetch("/platforms")
    .then(response => response.json())
    .then(platforms => {
        console.log("Received platforms: ", platforms);
        const ul = document.createElement('ul');
        platforms.forEach(platform => {
            const li = document.createElement('li');
            li.textContent = platform.nome;
            ul.appendChild(li);
        });
        document.getElementById("mainContent").appendChild(ul);
    })
    .catch(error => console.error("Error loading shop content:", error));
}

document.addEventListener("DOMContentLoaded", function() {
    loadShopContent();
});