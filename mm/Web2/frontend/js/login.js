const apiLoginUrl = 'http://localhost:8000/api/users/login';

$('#loginForm').submit((event) => {
    event.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();

    $.post(apiLoginUrl, { email, password }, (response) => {
        $('#message').text(response.message).css('color', 'green');
    }).fail((xhr) => {
        $('#message').text(xhr.responseJSON.error).css('color', 'red');
    });
});
