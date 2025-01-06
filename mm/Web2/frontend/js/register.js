const apiRegisterUrl = 'http://localhost:8000/api/users/register';

$('#registerForm').submit((event) => {
    event.preventDefault();
    const vorname = $('#vorname').val();
    const nachname = $('#nachname').val();
    const email = $('#email').val();
    const password = $('#password').val();

    $.post(apiRegisterUrl, { vorname, nachname, email, password }, (response) => {
        $('#message').text('Registrierung erfolgreich!').css('color', 'green');
     }).fail((xhr) => {
        $('#message').text(xhr.responseJSON.error).css('color', 'red');
        console.log(xhr.responseJSON.error);
    });
});
