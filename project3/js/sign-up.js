document.getElementById('signupBtn').addEventListener('click', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Email không hợp lệ!');
        return;
    }

    if (password.length < 8) {
        showError('Mật khẩu phải có ít nhất 8 ký tự!');
        return;
    }

    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
        showError('Email đã tồn tại!');
        return;
    }

    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        created_at: new Date().toISOString(),
        boards: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Đăng ký thành công!');
    window.location.href = 'sign-in.html';
});

function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    errorContainer.style.display = 'block';
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 3000);
}
