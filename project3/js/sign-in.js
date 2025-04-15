document.getElementById('signinBtn').addEventListener('click', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u =>
        u.email === email &&
        u.password === password
    );

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        document.querySelector('.successSignIn').style.display = 'block';
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } else {
        document.querySelector('.alertError').style.display = 'flex';
        document.querySelector('.error').style.display = 'block';
    }
});