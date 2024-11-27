// cart.js
document.addEventListener('DOMContentLoaded', () => {
    loadCart(); // Warenkorb laden, wenn die Seite geladen wird
});

// Funktion zum Laden des Warenkorbs
async function loadCart() {
    try {
        const response = await fetch('http://localhost:3000/cart');
        const cart = await response.json();
        const cartContainer = document.getElementById('cart-container');
        cartContainer.innerHTML = ''; // Vorherigen Inhalt löschen
        let total = 0;

        cart.forEach(item => {
            const product = getProductById(item.productId);
            if (product) {
                const itemTotalPrice = product.price * item.quantity;
                total += itemTotalPrice;

                // Produkt-HTML-Code hinzufügen
                cartContainer.innerHTML += `
                    <div class="cart-item" id="cart-item-${item.productId}">
                        <div class="product-image"><img src="${product.img}" alt="${product.name}"></div>
                        <div class="product-details">
                            <h3>${product.name}</h3>
                            <p class="price" id="price-${item.productId}">${itemTotalPrice.toFixed(2)}€</p>
                            <div class="quantity-container">
                                <button onclick="updateLocalQuantity(${item.productId}, -1)">-</button>
                                <input type="text" id="quantity-${item.productId}" value="${item.quantity}" readonly>
                                <button onclick="updateLocalQuantity(${item.productId}, 1)">+</button>
                            </div>
                            <button class="remove-btn" onclick="removeFromCart(${item.productId})">Löschen</button>
                        </div>
                    </div>`;
            }
        });

        // MwSt. und Gesamtpreis berechnen
        const mwst = total * 0.19; // 19% MwSt.
        const totalPriceWithTax = total;

        // Anzeigen der Preise
        document.getElementById('total-price').innerText = `Gesamt: ${totalPriceWithTax.toFixed(2)}€`;
        document.getElementById('tax-amount').innerText = `Enthaltene MwSt.: ${mwst.toFixed(2)}€`;

        // Aktualisierung des Warenkorbs in der Navbar
        document.getElementById('cart-total').innerText = `${totalPriceWithTax.toFixed(2)}€`;
    } catch (error) {
        console.error('Es gab ein Problem beim Laden des Warenkorbs:', error);
    }
}

// Funktion zur lokalen Menge ändern eines Produkts
async function updateLocalQuantity(productId, change) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(quantityInput.value);

    // Menge anpassen (sicherstellen, dass die Menge nicht kleiner als 1 wird)
    currentQuantity += change;
    if (currentQuantity < 1) {
        currentQuantity = 1;
    }

    // Aktualisierte Menge im Eingabefeld setzen
    quantityInput.value = currentQuantity;

    // Preis entsprechend aktualisieren
    const product = getProductById(productId);
    const newTotalPrice = product.price * currentQuantity;
    document.getElementById(`price-${productId}`).innerText = `${newTotalPrice.toFixed(2)}€`;

    // Gesamtbetrag und MwSt. neu berechnen
    updateCartSummary();

    // Warenkorbdaten auf dem Server speichern
    try {
        await saveCart();
        console.log(`Menge für Produkt ID ${productId} erfolgreich aktualisiert und gespeichert.`);
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Menge:', error);
    }
}

// Funktion zur Neuberechnung des Gesamtpreises und MwSt.
function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;

    cartItems.forEach(item => {
        const productId = parseInt(item.id.replace('cart-item-', ''));
        const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
        const product = getProductById(productId);
        total += product.price * quantity;
    });

    // MwSt. und Gesamtpreis berechnen
    const mwst = total * 0.19; // 19% MwSt.
    const totalPriceWithTax = total;

    // Anzeigen der Preise
    document.getElementById('total-price').innerText = `Gesamt: ${totalPriceWithTax.toFixed(2)}€`;
    document.getElementById('tax-amount').innerText = `Enthaltene MwSt.: ${mwst.toFixed(2)}€`;

    // Aktualisierung des Warenkorbs in der Navbar
    document.getElementById('cart-total').innerText = `${totalPriceWithTax.toFixed(2)}€`;
}

// Funktion zum Speichern der aktuellen Änderungen im Warenkorb
async function saveCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    const updatedCart = [];

    cartItems.forEach(item => {
        const productId = parseInt(item.id.replace('cart-item-', ''));
        const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);

        updatedCart.push({ productId, quantity });
    });

    try {
        const response = await fetch('http://localhost:3000/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCart),
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Speichern des Warenkorbs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Warenkorb erfolgreich aktualisiert:', data.message);
    } catch (error) {
        console.error('Es gab ein Problem beim Speichern des Warenkorbs:', error);
    }
}

// Ein Produkt aus dem Warenkorb entfernen
async function removeFromCart(productId) {
    try {
        const response = await fetch(`http://localhost:3000/cart/${productId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Entfernen des Produkts: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Produkt erfolgreich entfernt:', data.message);
        loadCart(); // Warenkorb neu laden, um Änderungen anzuzeigen
    } catch (error) {
        console.error('Es gab ein Problem beim Entfernen des Produkts:', error);
    }
}

// Hilfsfunktion zum Holen des Produkts anhand der ID
function getProductById(productId) {
    const products = [
        { id: 1, name: 'Chocolate Whey Protein', price: 29.99, img: 'images/chocolate_whey_protein.jpg' },
        { id: 2, name: 'Strawberry Whey Protein', price: 39.99, img: 'images/strawberry_whey_protein.jpg' },
        { id: 3, name: 'Vanilla Protein Shake', price: 44.99, img: 'images/Vanilla-Protein-Shake.jpg' },
        { id: 4, name: 'Vanilla Whey Protein', price: 49.99, img: 'images/vanilla_whey_protein.jpg' },
        { id: 5, name: 'Whey Protein', price: 59.99, img: 'images/whey_protein_image.jpg' }
    ];
    return products.find(product => product.id === productId);
}
