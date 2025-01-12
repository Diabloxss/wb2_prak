document.addEventListener("DOMContentLoaded", () => {
    updateCartTotalPrice();
    renderCart();
    

    // Add event listener to the cart container once
    const cartContainer = document.getElementById("cart-container");
    cartContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("increment-btn")) {
            const productId = parseInt(event.target.dataset.productId, 10);
            updateQuantity(productId, 1); // Increment by 1
        } else if (event.target.classList.contains("decrement-btn")) {
            const productId = parseInt(event.target.dataset.productId, 10);
            updateQuantity(productId, -1); // Decrement by 1
        } else if (event.target.classList.contains("remove-btn")) {
            const productId = parseInt(event.target.dataset.productId, 10);
            removeFromCart(productId); // Remove the product
        }
    });
});


function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = "";

    // Define VAT rate (19%)
    const VAT_RATE = 0.19;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Der Warenkorb ist leer.</p>";
        return;
    }

    let total = 0;
    let totalVAT = 0;

    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        const itemVAT = itemTotal * VAT_RATE;

        total += itemTotal;
        totalVAT += itemVAT;

        cartContainer.innerHTML += `
            <div class="cart-item">
                <!-- Product Name -->
                <h3>${item.name}</h3>
                <!-- Price -->
                <p>Preis: ${item.price.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</p>
                <!-- Quantity Controls -->
                <div class="quantity-controls">
                    <button class="decrement-btn" data-product-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increment-btn" data-product-id="${item.id}">+</button>
                </div>
                <!-- Total Price -->
                <p>Gesamt: ${itemTotal.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</p>
                <!-- Remove Button -->
                <button class="remove-btn" data-product-id="${item.id}">Entfernen</button>
            </div>
        `;
        updateCartTotalPrice();
    });

    // Add total summary including VAT
    cartContainer.innerHTML += `
        <div class="cart-total">
            <p>Gesamtsumme: ${total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</p>
            <p>Enthaltene MwSt.: ${totalVAT.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</p>
        </div>
    `;
}


function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productIndex = cart.findIndex((item) => item.id === productId);

    if (productIndex !== -1) {
        cart[productIndex].quantity += change;

        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1); // Remove product if quantity is zero
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        updateCartTotalPrice();
    }
}

function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.id !== productId);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    renderCart();
    updateCartTotalPrice();
}

    // Update the total price in the navigation bar
const updateCartTotalPrice = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cartTotalElement = document.getElementById("cart-total");
    if (cartTotalElement) {
        cartTotalElement.textContent = `${total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`;
    }
}

