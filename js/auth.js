/* ===== AUTH FUNCTIONALITY ===== */

// ===== API CONFIGURATION =====
const API_BASE_URL = 'http://localhost/UPHSD%20edu.ph/mhcs-alumni-api';

// ===== LOADING SPINNER FUNCTIONS =====
function showLoadingSpinner() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

function hideLoadingSpinner() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotForm = document.getElementById('forgotForm');
const resetForm = document.getElementById('resetForm');

const loginCard = document.getElementById('loginCard');
const registerCard = document.getElementById('registerCard');
const forgotCard = document.getElementById('forgotCard');
const resetCard = document.getElementById('resetCard');

const createAccountBtn = document.getElementById('createAccountBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const backToLoginBtn2 = document.getElementById('backToLoginBtn2');
const backToLoginBtn3 = document.getElementById('backToLoginBtn3');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const togglePasswordBtn = document.getElementById('togglePassword');

const errorMessage = document.getElementById('errorMessage');
const registerError = document.getElementById('registerError');
const forgotMessage = document.getElementById('forgotMessage');
const resetMessage = document.getElementById('resetMessage');
const forgotPasswordSection = document.getElementById('forgotPasswordSection');

const inputPassword = document.getElementById('password');

// ===== SHOW/HIDE FORMS =====
createAccountBtn.addEventListener('click', () => {
    loginCard.style.display = 'none';
    registerCard.style.display = 'block';
});

backToLoginBtn.addEventListener('click', () => {
    registerCard.style.display = 'none';
    loginCard.style.display = 'block';
    loginForm.reset();
    errorMessage.style.display = 'none';
    forgotPasswordSection.style.display = 'none';
});

backToLoginBtn2.addEventListener('click', () => {
    forgotCard.style.display = 'none';
    loginCard.style.display = 'block';
    forgotForm.reset();
    forgotMessage.style.display = 'none';
});

backToLoginBtn3.addEventListener('click', () => {
    resetCard.style.display = 'none';
    loginCard.style.display = 'block';
    resetForm.reset();
    resetMessage.style.display = 'none';
});

forgotPasswordBtn.addEventListener('click', () => {
    loginCard.style.display = 'none';
    forgotCard.style.display = 'block';
});

// ===== TOGGLE PASSWORD VISIBILITY =====
togglePasswordBtn.addEventListener('click', () => {
    const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    inputPassword.setAttribute('type', type);
    togglePasswordBtn.innerHTML = type === 'password' ? '<span class="eye-icon">👁️</span>' : '<span class="eye-icon">🙈</span>';
});

// Generic password visibility toggle function (for reset form)
function togglePasswordVisibility(fieldId) {
    event.preventDefault();
    const field = document.getElementById(fieldId);
    const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
    field.setAttribute('type', type);
}

// ===== LOGIN FORM SUBMISSION =====
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailOrUsername = document.getElementById('emailOrUsername').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Validation
    if (!emailOrUsername || !password) {
        let details = '';
        if (!emailOrUsername) details += '<p>❌ Email or Username is empty</p>';
        if (!password) details += '<p>❌ Password is empty</p>';
        showErrorModal('Missing Information', 'Please fill in all required fields:', details);
        return;
    }
    
    // Admin credentials - REMOVED (using database only)
    // Mock user for testing - REMOVED (using database only)
    
    showLoadingSpinner();
    
    // Call API to login - use database
    fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailOrUsername,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingSpinner();
        
        if (data.success || data.data) {
            // Login successful - handle nested data structure from API
            const responseData = data.data || data;
            const user = responseData.user || {};
            const token = responseData.token || data.token;
            
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('authToken', token);
            localStorage.setItem('userName', user.name || emailOrUsername);
            localStorage.setItem('userEmail', user.email || emailOrUsername);
            localStorage.setItem('userRole', user.role || 'member');
            localStorage.setItem('userId', user.id);
            
            // Log role for debugging
            console.log('User role:', user.role);
            console.log('Is admin:', user.role === 'admin');
            
            // Redirect based on role - immediately hide spinner and redirect
            hideLoadingSpinner();
            const redirectURL = (user.role === 'admin') ? 'admin.html' : 'index.html';
            console.log('Redirecting to:', redirectURL);
            
            window.location.href = redirectURL;
        } else {
            // Login failed
            showErrorModal('Login Failed', data.message || 'Invalid email or password', '<p>❌ Please check your credentials and try again</p>');
        }
    })
    .catch(error => {
        hideLoadingSpinner();
        console.error('Login error:', error);
        showErrorModal('Connection Error', 'Unable to connect to server', '<p>❌ Please check your internet connection and try again</p>');
    });
});

// ===== REGISTER FORM SUBMISSION =====
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const regEmail = document.getElementById('regEmail').value.trim();
    const batch = document.getElementById('batch').value;
    const regPassword = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Validation
    if (!firstName || !lastName || !regEmail || !batch || !regPassword || !confirmPassword) {
        showRegisterError('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(regEmail)) {
        showRegisterError('Please enter a valid email address');
        return;
    }
    
    if (regPassword.length < 6) {
        showRegisterError('Password must be at least 6 characters long');
        return;
    }
    
    if (regPassword !== confirmPassword) {
        showRegisterError('Passwords do not match');
        return;
    }
    
    // Registration successful - set localStorage and redirect
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', firstName + ' ' + lastName);
    localStorage.setItem('userEmail', regEmail);
    localStorage.setItem('userBatch', batch);
    localStorage.setItem('userRole', 'member');
    
    showRegisterSuccess('Account created successfully! Logging you in...');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});

// ===== FORGOT PASSWORD FORM SUBMISSION =====
forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const resetEmail = document.getElementById('resetEmail').value.trim();
    
    if (!resetEmail) {
        showForgotError('Please enter your email address');
        return;
    }
    
    if (!isValidEmail(resetEmail)) {
        showForgotError('Please enter a valid email address');
        return;
    }
    
    // Show loading spinner
    showLoadingSpinner();
    
    // Call API to request password reset
    fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: resetEmail
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingSpinner();
        
        if (data.success || data.token) {
            // Store email and token for reset form
            sessionStorage.setItem('resetEmail', resetEmail);
            sessionStorage.setItem('resetToken', data.token);
            // Show reset form instead of going back to login
            forgotCard.style.display = 'none';
            resetCard.style.display = 'block';
            forgotForm.reset();
            forgotMessage.style.display = 'none';
            showResetInfo('Password reset link sent! Enter your new password below.');
        } else {
            // Request failed
            hideLoadingSpinner();
            showForgotError(data.message || 'Could not process password reset. Please try again.');
        }
    })
    .catch(error => {
        hideLoadingSpinner();
        console.error('Forgot password error:', error);
        showForgotError('Connection error. Please check your internet and try again.');
    });
});

// ===== RESET PASSWORD FORM SUBMISSION =====
if (resetForm) {
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmNewPassword = document.getElementById('confirmNewPassword').value.trim();
        
        if (!newPassword || !confirmNewPassword) {
            showResetError('Please fill in all password fields');
            return;
        }
        
        if (newPassword.length < 6) {
            showResetError('Password must be at least 6 characters long');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            showResetError('Passwords do not match');
            return;
        }
        
        // Show loading spinner
        showLoadingSpinner();
        
        // Call API to reset password
        const resetEmail = sessionStorage.getItem('resetEmail');
        const resetToken = sessionStorage.getItem('resetToken');
        
        fetch(`${API_BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: resetEmail,
                token: resetToken,
                password: newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoadingSpinner();
            
            if (data.success || data.data) {
                // Password reset successful - handle nested data structure
                const responseData = data.data || data;
                const user = responseData.user || {};
                const token = responseData.token || data.token;
                
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('authToken', token);
                localStorage.setItem('userName', user.name || resetEmail.split('@')[0]);
                localStorage.setItem('userEmail', user.email || resetEmail);
                localStorage.setItem('userRole', user.role || 'member');
                localStorage.setItem('userId', user.id);
                
                showResetSuccess('Password has been reset successfully! Logging you in...');
                setTimeout(() => {
                    resetForm.reset();
                    resetCard.style.display = 'none';
                    loginCard.style.display = 'block';
                    resetMessage.style.display = 'none';
                    sessionStorage.removeItem('resetEmail');
                    sessionStorage.removeItem('resetToken');
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                // Password reset failed
                hideLoadingSpinner();
                showResetError(data.message || 'Could not reset password. Please try again.');
            }
        })
        .catch(error => {
            hideLoadingSpinner();
            console.error('Password reset error:', error);
            showResetError('Connection error. Please check your internet and try again.');
        });
    });
}

// ===== ERROR/SUCCESS MESSAGES =====
function showLoginError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.background = '#ffe5e5';
    errorMessage.style.color = '#e74c3c';
}

function showLoginSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.background = '#e5f5e5';
    errorMessage.style.color = '#27ae60';
}

function hideForgotPassword() {
    forgotPasswordSection.style.display = 'none';
}

function showForgotPassword() {
    forgotPasswordSection.style.display = 'block';
}

function showRegisterError(message) {
    registerError.textContent = message;
    registerError.style.display = 'block';
}

function showRegisterSuccess(message) {
    registerError.textContent = message;
    registerError.style.display = 'block';
    registerError.style.background = '#e5f5e5';
    registerError.style.color = '#27ae60';
}

function showForgotError(message) {
    forgotMessage.textContent = message;
    forgotMessage.style.display = 'block';
    forgotMessage.style.background = '#ffe5e5';
    forgotMessage.style.color = '#e74c3c';
}

function showForgotSuccess(message) {
    forgotMessage.textContent = message;
    forgotMessage.style.display = 'block';
    forgotMessage.style.background = '#e5f5e5';
    forgotMessage.style.color = '#27ae60';
}

function showResetError(message) {
    resetMessage.textContent = message;
    resetMessage.style.display = 'block';
    resetMessage.style.background = '#ffe5e5';
    resetMessage.style.color = '#e74c3c';
}

function showResetSuccess(message) {
    resetMessage.textContent = message;
    resetMessage.style.display = 'block';
    resetMessage.style.background = '#e5f5e5';
    resetMessage.style.color = '#27ae60';
}

function showResetInfo(message) {
    resetMessage.textContent = message;
    resetMessage.style.display = 'block';
    resetMessage.style.background = 'linear-gradient(135deg, rgba(0, 102, 255, 0.1) 0%, rgba(0, 77, 184, 0.05) 100%)';
    resetMessage.style.color = '#004db8';
}

// ===== ERROR MODAL FUNCTIONS =====
function showErrorModal(title, message, details = '') {
    const modal = document.getElementById('errorModal');
    const titleEl = document.getElementById('errorModalTitle');
    const messageEl = document.getElementById('errorModalMessage');
    const detailsEl = document.getElementById('errorDetails');
    const forgotLink = document.getElementById('forgotLinkBtn');
    
    titleEl.textContent = '⚠️ ' + title;
    titleEl.style.color = '#ff3b30';
    messageEl.textContent = message;
    detailsEl.innerHTML = details;
    forgotLink.style.display = 'block';
    
    modal.style.display = 'flex';
    modal.style.animation = 'fadeIn 0.3s ease-out';
}

function showSuccessModal(message) {
    const modal = document.getElementById('errorModal');
    const titleEl = document.getElementById('errorModalTitle');
    const messageEl = document.getElementById('errorModalMessage');
    const detailsEl = document.getElementById('errorDetails');
    const forgotLink = document.getElementById('forgotLinkBtn');
    
    titleEl.textContent = '✅ Success';
    titleEl.style.color = '#00a84f';
    messageEl.textContent = message;
    detailsEl.innerHTML = '';
    forgotLink.style.display = 'none';
    
    modal.style.display = 'flex';
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    const titleEl = document.getElementById('errorModalTitle');
    
    modal.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
        modal.style.display = 'none';
        titleEl.style.color = '#ff3b30';
    }, 300);
}

function goToForgotPassword() {
    closeErrorModal();
    setTimeout(() => {
        loginCard.style.display = 'none';
        forgotCard.style.display = 'block';
    }, 300);
}

// ===== NAVBAR UPDATE FUNCTIONS =====
function updateNavbarForLoggedInUser() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    
    if (isLoggedIn) {
        // Hide login/signup buttons
        const loginBtn = document.querySelector('.cta-login');
        const signupBtn = document.querySelector('.cta-signin');
        const navLoginBtn = document.querySelector('.login-btn');
        const navSignupBtn = document.querySelector('.signup-btn');
        
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (navLoginBtn) navLoginBtn.style.display = 'none';
        if (navSignupBtn) navSignupBtn.style.display = 'none';
        
        // Add logout button
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            // Check if logout already exists
            if (!document.querySelector('.logout-btn')) {
                const logoutLi = document.createElement('li');
                logoutLi.innerHTML = `<a href="#" class="auth-link logout-btn" style="background: #dc3545; color: white; padding: 8px 16px; border-radius: 5px; transition: all 0.3s ease;">🚪 ${userName} (Logout)</a>`;
                navLinks.appendChild(logoutLi);
                
                // Add logout event listener
                logoutLi.querySelector('.logout-btn').addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutUser();
                });
            }
        }
        
        // Also add to CTA buttons area
        const ctaButtonsGroup = document.querySelector('.cta-buttons-group');
        if (ctaButtonsGroup) {
            ctaButtonsGroup.innerHTML = `<button class="cta-button cta-logout" style="background: #dc3545; color: white;">🚪 Logout</button>`;
            ctaButtonsGroup.querySelector('.cta-logout').addEventListener('click', logoutUser);
        }
    }
}

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        
        window.location.href = 'index.html';
    }
}

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== PAGE TRANSITIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Update navbar based on login status
    updateNavbarForLoggedInUser();
    
    // Fade in effect
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.8s ease-out';
    }, 50);
});
