document.getElementById("guestForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    const guestData = {
        vorname: document.getElementById("vorname").value,
        nachname: document.getElementById("nachname").value,
        email: document.getElementById("email").value,
        street: document.getElementById("street").value,
        zip_code: document.getElementById("zip_code").value,
        city: document.getElementById("city").value,
    };

    try {
        const response = await fetch("http://localhost:8000/api/guests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(guestData),
        });

        if (response.ok) {
            // Redirect to bestellbestaetigung.html after a successful POST request
            window.location.href = "bestellbestaetigung.html";
        } else {
            const error = await response.json();
            alert(`Fehler: ${error.nachricht}`);
        }
    } catch (err) {
        console.error("Fehler beim Speichern:", err);
        alert("Ein Fehler ist aufgetreten.");
    }
});
