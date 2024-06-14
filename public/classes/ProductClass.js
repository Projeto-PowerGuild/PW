class Products {
    constructor(id, name, description, price, discount, releaseDate, genre, image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.discount = discount;
        this.releaseDate = releaseDate;
        this.genre = genre;
        this.image = image;
    }

    static async fetchTrendingGame() {
        try {
            const response = await fetch('/api/trending');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const game = await response.json();
            return new Products(
                game.id,
                game.name,
                game.description,
                game.price,
                game.discount,
                game.releaseDate,
                game.genre,
                game.image
            );
        } catch (error) {
            console.error('Error fetching the trending game:', error.message, error.stack);
            return null;
        }
    }

    static async displayTrendingGame() {
        const trendingGame = await Products.fetchTrendingGame();
        if (trendingGame) {
            document.getElementById('trendingGameImage').style.backgroundImage = 'url(' + trendingGame.image + ')';
            document.getElementById('trendingGameTitle').textContent = trendingGame.name;
            document.getElementById('trendingGamePrice').textContent = `$${trendingGame.price.toFixed(2)}`;
            document.getElementById('trendingGameDiscount').textContent = `${trendingGame.discount}% Off`;
        }
    }

    static async fetchProductDetails(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.description || 'No description available';
        } catch (error) {
            console.error(`Error fetching details for product ${productId}:`, error.message, error.stack);
            return null;
        }
    }

    static truncateText(text, maxLength) {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    }

    static async fetchProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            const products = await Promise.all(data.results.map(async game => {
                let description = await Products.fetchProductDetails(game.id);
                
                description = description.split('\n').find(line => /^[a-zA-Z0-9]/.test(line)) || 'No description available';
                description = Products.truncateText(description, 200);

                return new Products(
                    game.id,
                    game.name,
                    description,
                    Math.floor(Math.random() * 60) + 20,
                    Math.floor(Math.random() * 50),
                    game.released,
                    game.genres.map(genre => genre.name).join(', '),
                    game.background_image || 'ASSETS/Movies/images.png'
                );
            }));

            return products;
        } catch (error) {
            console.error('Error fetching the products:', error.message, error.stack);
            return [];
        }
    }

    static displayProducts(products) {
        const productList = document.getElementById('productList');

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';

            productDiv.addEventListener('click', () => {
                window.location.href = `www/html/gamesPage.html?id=${product.id}`;
            });

            const productName = document.createElement('h2');
            productName.textContent = product.name;

            const productImage = document.createElement('div');
            productImage.className = 'productImg';
            productImage.style.background = `url(${product.image}) center/cover no-repeat`;

            const productPrice = document.createElement('p');
            productPrice.textContent = `Price: $${product.price.toFixed(2)} `;

            const priceDiscountSpan = document.createElement('span');
            priceDiscountSpan.textContent = '/';
            priceDiscountSpan.className = 'price-discount-span';
            
            const productDiscount = document.createElement('p');
            productDiscount.textContent = `${product.discount}% Off`;
            productDiscount.className = 'product-discount'

            const priceDiscount = document.createElement('div');
            priceDiscount.className = 'price-discount';
            priceDiscount.appendChild(productPrice);
            priceDiscount.appendChild(priceDiscountSpan);
            priceDiscount.appendChild(productDiscount);


            const productGenre = document.createElement('p');
            productGenre.textContent = `${product.genre}`;

            productImage.appendChild(productName);
            productDiv.appendChild(productImage);
            productDiv.appendChild(priceDiscount);
            productDiv.appendChild(productGenre);
            productList.appendChild(productDiv);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Products.displayTrendingGame();
    Products.fetchProducts().then(products => {
        Products.displayProducts(products);
    });
});