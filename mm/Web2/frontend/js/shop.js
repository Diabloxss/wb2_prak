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
            const products = await response.json();
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
                    <p>${product.price.toFixed(2)}€</p>
                    <button onclick="addToCart(${product.id})">In den Warenkorb</button>
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
}); // Close the DOMContentLoaded function here

// Add to cart (stub)
function addToCart(productId) {
    alert(`Produkt mit ID ${productId} wurde in den Warenkorb gelegt.`);
}
