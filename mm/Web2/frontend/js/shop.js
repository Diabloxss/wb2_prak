document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("product-grid");
    const searchInput = document.getElementById("search-bar");
    const priceRange = document.getElementById("price-range");
    const searchButton = document.getElementById("search-button");

    // Fetch products from server
    const fetchProducts = async (minPrice, maxPrice, search) => {
        try {
            const response = await fetch(`/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}&search=${search}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const products = await response.json();
            console.log("Products to render:", products);
            renderProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error);
        
    };

    // Render products dynamically
    const renderProducts = (products) => {
        const productGrid = document.getElementById("product-grid");
        productGrid.innerHTML = ""; // Clear previous content
    
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
        fetchProducts(0, priceRange.value, searchInput.value);
    });

    priceRange.addEventListener("input", () => {
        document.getElementById("price-range-value").textContent = `0-${priceRange.value}€`;
    });

    // Initial fetch
    fetchProducts(0, 100, "");
});

// Add to cart (stub)
function addToCart(productId) {
    alert(`Produkt mit ID ${productId} wurde in den Warenkorb gelegt.`);
}
