
window.addEventListener('load', function () {
    const successMessage = sessionStorage.getItem('signupSuccess');
    if (successMessage) {
        const successDiv = document.querySelector('.successSignIn');
        successDiv.textContent = successMessage;
        successDiv.style.display = 'block';
        sessionStorage.removeItem('signupSuccess');
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const signupBtn = document.getElementById('signupBtn');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorContainer = document.getElementById('errorContainer');

    function showError(messages) {
        errorContainer.innerHTML = `
            <div class="error-message">
                ${messages.map(msg => `<p>⚠️ ${msg}</p>`).join('')}
            </div>
        `;
        errorContainer.style.display = 'block';
    }

    function validateForm() {
        const errors = [];
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Clear previous errors
        errorContainer.style.display = 'none';
        if (!username) {
            errors.push('Vui lòng nhập họ và tên');
        }
        if (!email) {
            errors.push('Vui lòng nhập email');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Email không hợp lệ');
        }
        if (!password) {
            errors.push('Vui lòng nhập mật khẩu');
        } else if (password.length < 8) {
            errors.push('Mật khẩu phải có ít nhất 8 ký tự');
        }

        return errors;
    }

    function handleSignup(e) {
        e.preventDefault();

        const errors = validateForm();
        if (errors.length > 0) {
            return showError(errors);
        }
        const newUser = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
        };
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (existingUsers.some(user => user.email === newUser.email)) {
            return showError(['Email này đã được đăng ký']);
        }
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        sessionStorage.setItem('signupSuccess', 'Đăng ký thành công! Vui lòng đăng nhập.');
        window.location.href = 'sign-in.html';
    }
    signupBtn.addEventListener('click', handleSignup);
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSignup(e);
    });
});