// Constants
const TAX_RATE = 0.19; // 19% VAT

// Fetch product details by ID dynamically
async function getProductById(productId) {
    try {
        const response = await fetch(`http://localhost:8000/api/products/gib/${productId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch product with ID ${productId}`);
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

// Load cart from localStorage
function loadCart() {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
}

// Update the total cart price
async function updateCartTotal() {
    try {
        const cart = loadCart();
        let total = 0;

        for (const item of cart) {
            const product = await getProductById(item.id);
            if (product) {
                total += product.price * item.quantity;
            }
        }

        const cartTotalElement = document.getElementById('cart-total');
        if (cartTotalElement) {
            cartTotalElement.innerText = `${total.toFixed(2)}€`;
        }
    } catch (error) {
        console.error('Error updating cart total:', error);
    }
}

// Add a product to the cart
async function addToCart(productId, quantity = 1) {
    try {
        const product = await getProductById(productId);
        if (!product) {
            alert('Produkt konnte nicht hinzugefügt werden. Bitte versuchen Sie es erneut.');
            return;
        }

        const cart = loadCart();
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${quantity}x ${product.name} wurde dem Warenkorb hinzugefügt.`);
        updateCartTotal();
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}

// Remove a product from the cart
function removeFromCart(productId) {
    let cart = loadCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartTotal();
}

// Adjust the quantity of a product in the cart
async function updateQuantity(productId, change) {
    const cart = loadCart();
    const product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity += change;

        if (product.quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartTotal();
    }
}

// Render the cart dynamically
async function renderCart() {
    const cartContainer = document.getElementById("cart-container");
    const cart = loadCart();
    cartContainer.innerHTML = ""; // Clear previous content

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Ihr Warenkorb ist leer.</p>";
        return;
    }

    let total = 0;

    for (const item of cart) {
        const product = await getProductById(item.id);
        if (!product) continue;

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <div class="cart-item-details">
                <h3>${product.name}</h3>
                <p>Preis: ${product.price.toFixed(2)}€</p>
                <p>Menge: 
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    ${item.quantity}
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </p>
                <p>Gesamt: ${itemTotal.toFixed(2)}€</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Entfernen</button>
        `;

        cartContainer.appendChild(cartItem);
    }

    const totalPriceElement = document.getElementById("total-price");
    const taxAmountElement = document.getElementById("tax-amount");

    const taxAmount = total * TAX_RATE;
    totalPriceElement.textContent = `Gesamt: ${total.toFixed(2)}€`;
    taxAmountElement.textContent = `Enthaltene MwSt.: ${taxAmount.toFixed(2)}€`;
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartTotal();
    renderCart();
});
