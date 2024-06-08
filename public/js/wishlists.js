class Wishlists {
    constructor(id, addedDate, userId, productId) {
        this.id = id;
        this.addedDate = addedDate;
        this.userId = userId;
        this.productId = productId;
    }

    static async fetchGamesById(rows) {
        const apiKey = 'af44d7146ee947279a58c62db9ff347e';
        const gamesData = [];

        for (let i = 0; i < rows.length; i++) {
            const id = rows[i].productId;
            const rawgUrl = `https://api.rawg.io/api/games/${id}?key=${apiKey}`;

            try {
                const response = await fetch(rawgUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                gamesData.push(data);
            } catch (error) {
                console.error(`Error fetching product ${id}:`, error.message, error.stack);
            }
        }
        return gamesData;
    }

    static async getAllGamesById() {
        try {
            const [rows] = await query("SELECT * FROM platforms");
            console.log("Query Result:", rows); // Log query result
            const gamesData = await Wishlists.fetchGamesById(rows);
            return gamesData;
        } catch (error) {
            console.error("Error fetching platforms:", error);
            throw error;
        }
    }

    static displayProducts(products) {
        const productList = document.getElementById('productList');
        productList.innerHTML = ''; // Clear existing content

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';

            productDiv.addEventListener('click', () => {
                window.location.href = `www/html/gamesPage.html?id=${product.id}`;
            });

            const productName = document.createElement('h2');
            productName.textContent = product.name;

            const productImage = document.createElement('img');
            productImage.src = product.image;

            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;

            const productPrice = document.createElement('p');
            productPrice.textContent = `Price: $${product.price.toFixed(2)}`;

            const productDiscount = document.createElement('p');
            productDiscount.textContent = `Discount: ${product.discount}%`;

            const productLaunchDate = document.createElement('p');
            productLaunchDate.textContent = `Launch Date: ${product.released}`;

            const productGenre = document.createElement('p');
            productGenre.textContent = `Genre: ${product.genres.map(genre => genre.name).join(', ')}`;

            productDiv.appendChild(productName);
            productDiv.appendChild(productImage);
            productDiv.appendChild(productDescription);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(productDiscount);
            productDiv.appendChild(productLaunchDate);
            productDiv.appendChild(productGenre);
            productList.appendChild(productDiv);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Wishlists.getAllGamesById().then(products => {
        Wishlists.displayProducts(products);
    }).catch(error => {
        console.error('Error displaying products:', error);
    });
});
