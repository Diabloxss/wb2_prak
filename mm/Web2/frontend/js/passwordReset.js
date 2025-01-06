const apiPasswordResetUrl = 'http://localhost:8000/api/password-reset';

$('#passwordResetForm').submit((event) => {
    event.preventDefault();
    const email = $('#email').val();

    // Simuliere den API-Aufruf
    $.post(apiPasswordResetUrl, { email }, (response) => {
        $('#message').text('Eine Email wurde gesendet, falls die Adresse registriert ist.').css('color', 'green');
    }).fail(() => {
        $('#message').text('Fehler beim Senden der Email. Bitte versuchen Sie es erneut.').css('color', 'red');
    });
});
