class Products {
    constructor(id, name, description, discount, price, quantity, launchDate, type, category, developersId, suppliersId) {
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
                    product.launch_date,
                    product.Type,
                    product.category,
                    product.fk_developers_id,
                    product.fk_suppliers_id,
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

            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;

            const productPrice = document.createElement('p');
            productPrice.textContent = `Price: $${product.price.toFixed(2)}`;

            const productDiscount = document.createElement('p');
            productDiscount.textContent = `Discount: ${product.discount}%`;

            const productQuantity = document.createElement('p');
            productQuantity.textContent = `Quantity: ${product.quantity}`;

            productDiv.appendChild(productName);
            productDiv.appendChild(productDescription);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(productDiscount);
            productDiv.appendChild(productQuantity);

            productList.appendChild(productDiv);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Products.fetchProducts().then(products => {
        Products.displayProducts(products);
    });
});