document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent the form from submitting the traditional way

            // In a real application, you would validate the email and password here.
            // For this example, we'll just assume the login is successful.

            // Set the login flag in localStorage
            localStorage.setItem('foodUserLogin', 'true');

            // Redirect the user back to the main page
            window.location.href = 'index.html';
        });
    }
});
