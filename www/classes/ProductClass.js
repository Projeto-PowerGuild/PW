class Products {
    constructor(id, name, description, discount, price, quantity, launchDate, type, category, developersId, suppliersId, image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.discount = discount;
        this.price = price;
        this.quantity = quantity;
        this.launchDate = launchDate;
        this.type = type;
        this.category = category;
        this.developersId = developersId;
        this.suppliersId = suppliersId;
        this.image = image;
    }

    static fetchProducts() {
        return fetch('../json/products.json')
            .then(response => response.json())
            .then(data => {
                return data.map(product => new Products(
                    product.id,
                    product.name,
                    product.description,
                    product.discount,
                    product.price,
                    product.quantity,
                    product.release_date,
                    product.type,
                    product.category,
                    product.developersId,
                    product.suppliersId,
                    product.image
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

            const productDiscount = document.createElement('p');
            productDiscount.textContent = `Discount: ${product.discount}%`;

            const productLaunchDate = document.createElement('p');
            productLaunchDate.textContent = `Launch Date: ${product.launchDate}`;

            const productCategory = document.createElement('p');
            productCategory.textContent = `Category: ${product.category}`;

            productDiv.appendChild(productName);
            productDiv.appendChild(productImage);
            productDiv.appendChild(productDescription);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(productDiscount);
            productDiv.appendChild(productLaunchDate);
            productDiv.appendChild(productCategory);
            productList.appendChild(productDiv);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Products.fetchProducts().then(products => {
        Products.displayProducts(products);
    });
});