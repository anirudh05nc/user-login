document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const API_BASE_URL = 'https://user-login-1-vxok.onrender.com'; // Use your actual URL
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const localApiUrl = 'http://localhost:5000';
    
    // DOM Elements
    const loginForm = document.getElementById('login');
    const signupForm = document.getElementById('signup');
    const loginFormWrapper = document.getElementById('login-form');
    const signupFormWrapper = document.getElementById('signup-form');
    const successMessage = document.getElementById('success-message');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');

    // Helper functions
    const showError = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.error-message');
        field.style.borderColor = '#e74c3c';
        errorElement.textContent = message;
    };

    const clearErrors = () => {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('input').forEach(input => {
            input.style.borderColor = '#ddd';
        });
    };

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const apiRequest = async (endpoint, data) => {
        const url = isLocalDev ? `${localApiUrl}${endpoint}` : `${API_BASE_URL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    };

    // Event listeners
    showSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginFormWrapper.style.display = 'none';
        signupFormWrapper.style.display = 'block';
        clearErrors();
    });

    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signupFormWrapper.style.display = 'none';
        loginFormWrapper.style.display = 'block';
        clearErrors();
    });

    logoutBtn.addEventListener('click', function() {
        successMessage.style.display = 'none';
        loginFormWrapper.style.display = 'block';
        loginForm.reset();
    });

    // Login form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        
        let isValid = true;
        
        if (!email) {
            showError('login-email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('login-email', 'Please enter a valid email');
            isValid = false;
        }
        
        if (!password) {
            showError('login-password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('login-password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (isValid) {
            try {
                const data = await apiRequest('/login', { email, password });
                
                if (data.success) {
                    loginFormWrapper.style.display = 'none';
                    successMessage.style.display = 'block';
                } else {
                    showError('login-password', data.message || 'Login failed');
                }
            } catch (error) {
                showError('login-password', 'Network error. Please try again.');
            }
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();
        
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value.trim();
        const confirmPassword = document.getElementById('signup-confirm-password').value.trim();
        
        let isValid = true;
        
        if (!name) {
            showError('signup-name', 'Name is required');
            isValid = false;
        }
        
        if (!email) {
            showError('signup-email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('signup-email', 'Please enter a valid email');
            isValid = false;
        }
        
        if (!password) {
            showError('signup-password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('signup-password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        if (!confirmPassword) {
            showError('signup-confirm-password', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('signup-confirm-password', 'Passwords do not match');
            isValid = false;
        }
        
        if (isValid) {
            try {
                const data = await apiRequest('/signup', { name, email, password });
                
                if (data.success) {
                    signupFormWrapper.style.display = 'none';
                    loginFormWrapper.style.display = 'block';
                    signupForm.reset();
                    alert('Account created successfully! Please login.');
                } else {
                    showError('signup-email', data.message || 'Registration failed');
                }
            } catch (error) {
                showError('signup-email', 'Network error. Please try again.');
            }
        }
    });
});