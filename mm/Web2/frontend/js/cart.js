document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-container");
    const totalPriceElement = document.getElementById("total-price");
    const taxAmountElement = document.getElementById("tax-amount");

    const TAX_RATE = 0.19; // 19% VAT

    // Load the cart from localStorage
    const loadCart = () => {
        return JSON.parse(localStorage.getItem("cart")) || [];
    };

    // Save the cart back to localStorage
    const saveCart = (cart) => {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    // Render the cart items
    const renderCart = () => {
        const cart = loadCart();
        cartContainer.innerHTML = ""; // Clear previous content

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Ihr Warenkorb ist leer.</p>";
            totalPriceElement.textContent = "Gesamt: 0,00€";
            taxAmountElement.textContent = "Enthaltene MwSt.: 0,00€";
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            // Create cart item element
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Preis: ${item.price.toFixed(2)}€</p>
                    <p>
                        Menge: 
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        ${item.quantity}
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </p>
                    <p>Gesamt: ${itemTotal.toFixed(2)}€</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Entfernen</button>
            `;

            cartContainer.appendChild(cartItem);
        });

        const taxAmount = total * TAX_RATE;
        totalPriceElement.textContent = `Gesamt: ${total.toFixed(2)}€`;
        taxAmountElement.textContent = `Enthaltene MwSt.: ${taxAmount.toFixed(2)}€`;
    };

    // Update the quantity of a product in the cart
    const updateQuantity = (productId, change) => {
        const cart = loadCart();
        const product = cart.find(item => item.id === productId);

        if (product) {
            product.quantity += change;

            if (product.quantity <= 0) {
                // Remove the product if quantity drops to 0 or less
                removeFromCart(productId);
                return;
            }

            // Save the updated cart
            saveCart(cart);
            renderCart();
        }
    };

    // Remove a product from the cart
    const removeFromCart = (productId) => {
        let cart = loadCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        renderCart();
    };

    // Clear the entire cart
    const clearCart = () => {
        if (confirm("Möchten Sie den Warenkorb wirklich leeren?")) {
            localStorage.removeItem("cart");
            renderCart();
        }
    };

    // Attach clear cart button functionality
    const clearCartButton = document.getElementById("clear-cart-button");
    if (clearCartButton) {
        clearCartButton.addEventListener("click", clearCart);
    }

    // Initial rendering of the cart
    renderCart();
});
