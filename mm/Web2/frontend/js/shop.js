let products = []; 

document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("product-grid");
    const searchInput = document.getElementById("search-bar");
    const priceRange = document.getElementById("price-range");
    const searchButton = document.getElementById("search-button");

    

    // Fetch products from server
    const fetchProducts = async (minPrice, maxPrice, search) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}&search=${search}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            products = await response.json();
            console.log("Products to render:", products);
            renderProducts(products);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };
    

    // Render products dynamically
    const renderProducts = (products) => {
        productGrid.innerHTML = ""; // Clear previous content
    
        if (products.length === 0) {
            productGrid.innerHTML = "<p>Keine Produkte gefunden.</p>";
            return;
        }
    
        products.forEach(product => {
            productGrid.innerHTML += `
                <div class="product-card">
                    <img src="${product.image_url}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>${product.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</p>
                    <button class="detail-btn" onclick="window.location.href='Produktseite.html'">Details</button>
                    <button class="add-btn" onclick="addToCart(${product.id})">hinzufügen</button>
                </div>
            `;
        });
        
    };
    

    // Event Listeners for search and filters
    searchButton.addEventListener("click", () => {
        const searchValue = searchInput.value;
        const priceValue = priceRange.value;
        console.log("Search Value:", searchValue, "Price Value:", priceValue); // Debug
        fetchProducts(0, priceValue, searchValue);
    });

    priceRange.addEventListener("input", () => {
        const priceValue = priceRange.value;
        document.getElementById("price-range-value").textContent = `0-${priceValue}€`;
            // Trigger fetch with updated price range
        fetchProducts(0, priceValue, searchInput.value);
    });

    // Initial fetch
    fetchProducts(0, 100, "");

    updateCartTotalPrice()
}); 



function addToCart(productId) {
    console.log(`Adding product to cart with ID: ${productId}`);

    // Load the current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Find the product details in the global `products` array
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error("Produkt konnte nicht gefunden werden.");
        return;
    }

    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        // Increment the quantity if the product exists
        existingProduct.quantity += 1;
    } else {
        // Add the product to the cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
        });
    }

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update the cart total price in the navigation bar
    updateCartTotalPrice();

    console.log(`${product.name} wurde erfolgreich in den Warenkorb gelegt.`);
}





    // Update the total price in the navigation bar
const updateCartTotalPrice = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cartTotalElement = document.getElementById("cart-total");
    if (cartTotalElement) {
        cartTotalElement.textContent = `${total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`;
    }

    
};



