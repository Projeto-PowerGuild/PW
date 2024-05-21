class Products {
    constructor(id, name, description, price, releaseDate, genre, image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price; // Randomly generated for demonstration purposes
        this.releaseDate = releaseDate;
        this.genre = genre;
        this.image = image;
    }

    static fetchProducts() {
        const rawgUrl = 'https://api.rawg.io/api/games';
        const apiKey = 'af44d7146ee947279a58c62db9ff347e';

        return fetch(`${rawgUrl}?key=${apiKey}&page_size=10`)
            .then(response => response.json())
            .then(data => {
                return data.results.map(game => new Products(
                    game.id,
                    game.name,
                    game.description || 'No description available',
                    Math.floor(Math.random() * 60) + 20,
                    game.released,
                    game.genres.map(genre => genre.name).join(', '),
                    game.background_image || 'ASSETS/placeholder-image.png'
                ));
            })
            .catch(error => {
                console.error('Error fetching the products:', error);
                return [];
            });
    }

    static displayProducts(products) {
        const productList = document.getElementById('productList');

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';

            const productName = document.createElement('h2');
            productName.textContent = product.name;

            const productImage = document.createElement('img');
            productImage.src = product.image;

            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;

            const productPrice = document.createElement('p');
            productPrice.textContent = `Price: $${product.price.toFixed(2)}`;

            const productLaunchDate = document.createElement('p');
            productLaunchDate.textContent = `Launch Date: ${product.releaseDate}`;

            const productGenre = document.createElement('p');
            productGenre.textContent = `Genre: ${product.genre}`;

            productDiv.appendChild(productName);
            productDiv.appendChild(productImage);
            productDiv.appendChild(productDescription);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(productLaunchDate);
            productDiv.appendChild(productGenre);
            productList.appendChild(productDiv);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Products.fetchProducts().then(products => {
        Products.displayProducts(products);
    });
});
