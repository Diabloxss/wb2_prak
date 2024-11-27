// common.js - Gemeinsame Funktionen für dynamische Aktualisierung des Warenkorbs

// Diese Funktion aktualisiert die Warenkorb-Summe dynamisch auf allen Seiten
async function updateCartTotal() {
    try {
        const response = await fetch('http://localhost:3000/cart');
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen des Warenkorbs');
        }
        const cart = await response.json();
        let total = 0;

        // Berechnen der Gesamtsumme basierend auf den Produktpreisen und Mengen
        cart.forEach(item => {
            const product = getProductById(item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        });

        // Die Gesamtsumme im Navigationsmenü aktualisieren
        const cartTotalElement = document.getElementById('cart-total');
        if (cartTotalElement) {
            cartTotalElement.innerText = `${total.toFixed(2)}€`;
        }
    } catch (error) {
        console.error('Es gab ein Problem beim Aktualisieren der Warenkorb-Summe:', error);
    }
}

// Diese Funktion holt Produktinformationen anhand der ID
function getProductById(productId) {
    // Produkte müssen für die Berechnung bekannt sein
    const products = [
        { id: 1, name: 'Chocolate Whey Protein', price: 29.99 },
        { id: 2, name: 'Strawberry Whey Protein', price: 39.99 },
        { id: 3, name: 'Vanilla Protein Shake', price: 44.99 },
        { id: 4, name: 'Vanilla Whey Protein', price: 49.99 },
        { id: 5, name: 'Whey Protein', price: 59.99 }
    ];
    return products.find(product => product.id === productId);
}

// Funktion zum Aktualisieren der Menge eines Produkts auf der Produktseite
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity += change;

    // Sicherstellen, dass die Menge mindestens 1 bleibt
    if (currentQuantity < 1) {
        currentQuantity = 1;
    }
    quantityInput.value = currentQuantity;

    // Optional: Preis dynamisch aktualisieren
    updateCartTotal();
}

// Funktion zum Hinzufügen eines Produkts zum Warenkorb
async function addToCart() {
    try {
        const productId = 2; // Beispiel-ID für "Strawberry Whey Protein"
        const quantity = parseInt(document.getElementById('quantity').value);
        
        const response = await fetch('http://localhost:3000/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
            throw new Error('Fehler beim Hinzufügen zum Warenkorb');
        }

        console.log("Produkt wurde erfolgreich zum Warenkorb hinzugefügt.");
        
        // Warenkorb-Summe aktualisieren, nachdem ein Produkt hinzugefügt wurde
        updateCartTotal();
    } catch (error) {
        console.error('Es gab ein Problem beim Hinzufügen zum Warenkorb:', error);
    }
}

// Automatische Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    updateCartTotal(); // Aktualisiert den Warenkorb bei Seitenladeereignis
});
