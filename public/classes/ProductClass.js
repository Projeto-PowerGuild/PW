class Products {
    constructor(id, name, description, price, discount, releaseDate, genre, image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.discount = discount;
        this.releaseDate = releaseDate;
        this.genre = genre;
        this.image = image
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
            // document.getElementById('trendingGameImage').src = trendingGame.image;
            document.getElementById('trendingGameImage').style.backgroundImage = 'url(' + trendingGame.image + ')';
            document.getElementById('trendingGameTitle').textContent = trendingGame.name;
            document.getElementById('trendingGamePrice').textContent = `$${trendingGame.price.toFixed(2)}`;
            document.getElementById('trendingGameDiscount').textContent = `${trendingGame.discount}% Off`;
            // document.getElementById('trendingGameDescription').textContent = trendingGame.description;
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

            // const productDescription = document.createElement('p');
            // productDescription.textContent = product.description;

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

            // const productLaunchDate = document.createElement('p');
            // productLaunchDate.textContent = `Launch Date: ${product.releaseDate}`;

            const productGenre = document.createElement('p');
            productGenre.textContent = `${product.genre}`;

            /* const productplatforms = document.createElement('p');
            productplatforms.textContent = `${product.platforms}`; */

            productImage.appendChild(productName);
            productDiv.appendChild(productImage);
            productDiv.appendChild(priceDiscount);
            // productDiv.appendChild(productDescription);
            // productDiv.appendChild(productLaunchDate);
            productDiv.appendChild(productGenre);
            // productDiv.appendChild(productplatforms);
            productList.appendChild(productDiv);
        });
    }
}

// document.addEventListener('DOMContentLoaded', () => {
//     Products.displayTrendingGame();
//     Products.fetchProducts().then(products => {
//         Products.displayProducts(products);
//     }); 
// });

document.addEventListener('DOMContentLoaded', async () => {
    Products.displayTrendingGame()
    const products = await Products.fetchProducts()

    const urlParams = new URLSearchParams(window.location.search)
    const filter = urlParams.get('filter')
    const search = urlParams.get('search')
    let filteredProducts = products

    if (filter) {
        filteredProducts = products.filter(product => product.genre.toLowerCase().includes(filter.toLowerCase()))
    }

    if (search) {
        filteredProducts = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
    }

    Products.displayProducts(filteredProducts)
})

async function test(str) {
    window.location.href = window.location.pathname + "?filter=" + str
}

async function searchGame(str) {
    str = document.getElementById('search-game').value
    window.location.href = window.location.pathname + "?filter=" + str
}