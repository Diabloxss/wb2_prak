document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindere das Standardformularverhalten

    const vorname = document.getElementById('vorname').value;
    const nachname = document.getElementById('nachname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    // Passwortabgleich überprüfen
    if (password !== confirmPassword) {
        alert('Die Passwörter stimmen nicht überein.');
        return;
    }

    // Senden der Registrierungsdaten an das Backend
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Benutzer erfolgreich registriert') {
            alert('Registrierung erfolgreich!');
            window.location.href = 'login.html'; // Weiterleitung zur Login-Seite
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Fehler bei der Registrierung:', error);
        alert('Fehler bei der Registrierung. Bitte versuchen Sie es später erneut.');
    });
});
