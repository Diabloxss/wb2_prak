document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Verhindere das Standardformularverhalten

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Senden der Login-Daten an das Backend
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login erfolgreich!');
            window.location.href = 'profilseite.html'; // Weiterleitung zur Profilseite
        } else {
            alert('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
        }
    })
    .catch(error => {
        console.error('Fehler beim Login:', error);
        alert('Fehler beim Login. Bitte versuchen Sie es später erneut.');
    });
});
