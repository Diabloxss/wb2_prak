// Event-Listener für das Kontaktformular hinzufügen
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    // Formulardaten in ein JSON-Objekt umwandeln
    const formData = new FormData(this);
    const jsonData = JSON.stringify(Object.fromEntries(formData));

    // Anfrage an den Server senden
    fetch('http://192.168.0.53:8000/api/contact', { // Passen Sie die URL bei Bedarf an
        method: 'POST',
        body: jsonData,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server antwortete mit Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Erfolgsmeldung anzeigen
        alert('Vielen Dank für Ihre Nachricht! Wir melden uns bald bei Ihnen.');
        console.log('Serverantwort:', data);

        // Formularfelder leeren
        document.getElementById('contact-form').reset();
    })
    .catch(error => {
        // Fehlerbehandlung
        console.error('Fehler:', error);
        alert('Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es später erneut.');
    });
});