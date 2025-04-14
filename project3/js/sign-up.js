document.getElementById('signupBtn').addEventListener('click', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Kiểm tra email tồn tại
    const emailExists = users.some(u => u.email === email);

    if (emailExists) {
        showError('Email đã tồn tại!');
        return;
    }

    // Tạo user mới theo cấu trúc dữ liệu của bạn
    const newUser = {
        id: Date.now(),
        username,
        email,
        password, // Trong thực tế, cần hash password trước khi lưu
        created_at: new Date().toISOString(),
        boards: []
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Hiển thị thông báo và chuyển hướng
    alert('Đăng ký thành công!');
    window.location.href = 'sign-in.html';
});


function showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `<div class="error-message">${message}</div>`;
    errorContainer.style.display = 'block';
    setTimeout(() => errorContainer.style.display = 'none', 3000);
}