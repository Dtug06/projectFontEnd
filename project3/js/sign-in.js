document.addEventListener('DOMContentLoaded', function () {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signinBtn = document.getElementById('signinBtn');
    const errorContainer = document.querySelector('.error');
    const errorAlert = document.querySelector('.alertError');

    function showError(message) {
        errorContainer.style.display = 'block';
        errorAlert.style.display = 'block'
    }

    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const errors = [];
        errorContainer.style.display = 'none';
        if (!email) {
            errors.push('Vui lòng nhập email');
        }
        if (!password) {
            errors.push('Vui lòng nhập mật khẩu');
        }

        return { errors, email, password };
    }

    function handleLogin(e) {
        e.preventDefault();

        const { errors, email, password } = validateForm();
        if (errors.length > 0) {
            return showError(errors.join('<br>'));
        }
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = existingUsers.find(user => user.email === email && user.password === password);

        if (!user) {
            return showError('Email hoặc mật khẩu không tồn tại');
        }
        window.location.href = 'dashboard.html'; // Đổi đường dẫn nếu cần
    }
    signinBtn.addEventListener('click', handleLogin);
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin(e);
    });
});