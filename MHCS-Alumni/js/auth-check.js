// ===== AUTHENTICATION CHECK =====
// Check if user is logged in before accessing protected pages

const checkUserAuthentication = () => {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const userName = localStorage.getItem('userName');
    
    return {
        isLoggedIn: isLoggedIn === 'true',
        userName: userName || 'Guest'
    };
};

const requireLogin = (redirectPage = '../login.html') => {
    const auth = checkUserAuthentication();
    
    if (!auth.isLoggedIn) {
        // Show login prompt modal
        showLoginPrompt(redirectPage);
        return false;
    }
    return true;
};

const showLoginPrompt = (redirectPage) => {
    const overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 3rem 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 77, 184, 0.3);
        text-align: center;
        animation: slideInUp 0.4s ease-out;
    `;
    
    modal.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔐</div>
        <h2 style="color: #004db8; font-size: 1.8rem; margin-bottom: 1rem;">Login Required</h2>
        <p style="color: #666; font-size: 1rem; margin-bottom: 2rem; line-height: 1.6;">
            You need to be logged in to access this feature. Please log in with your alumni account to continue.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <a href="${redirectPage}" class="btn btn-primary" style="flex: 1; text-align: center; padding: 0.85rem 1.5rem;">
                Go to Login
            </a>
            <button onclick="document.getElementById('auth-overlay').remove()" class="btn btn-secondary" style="flex: 1; padding: 0.85rem 1.5rem; background: #f0f6ff; color: #004db8; border: 2px solid #004db8;">
                Cancel
            </button>
        </div>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
};

const logoutUser = () => {
    // Create loading overlay for logout
    const logoutOverlay = document.createElement('div');
    logoutOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 26, 77, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        backdrop-filter: blur(5px);
        animation: fadeIn 0.3s ease;
    `;
    
    logoutOverlay.innerHTML = `
        <div style="position: relative; width: 100px; height: 100px;">
            <style>
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 20px rgba(0, 102, 255, 0.7), inset 0 0 10px rgba(0, 102, 255, 0.4); opacity: 1; }
                    50% { transform: translate(-50%, -50%) scale(1.2); box-shadow: 0 0 35px rgba(0, 102, 255, 0.9), inset 0 0 15px rgba(0, 102, 255, 0.6); opacity: 0.8; }
                }
                .logout-spinner {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 6px solid transparent;
                    border-top-color: #0066ff;
                    border-right-color: #0066ff;
                    border-radius: 50%;
                    animation: spin 1.2s linear infinite;
                    box-shadow: 0 0 35px rgba(0, 102, 255, 0.5);
                }
                .logout-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 16px;
                    height: 16px;
                    background: linear-gradient(135deg, #0066ff, #004db8);
                    border-radius: 50%;
                    box-shadow: 0 0 20px rgba(0, 102, 255, 0.7), inset 0 0 10px rgba(0, 102, 255, 0.4);
                    animation: pulse 1.2s ease-in-out infinite;
                    z-index: 1;
                }
            </style>
            <div class="logout-spinner"></div>
            <div class="logout-center"></div>
        </div>
    `;
    
    document.body.appendChild(logoutOverlay);
    
    // Clear auth data
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userBatch');
    
    // Redirect after animation
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1500);
};

const loginUser = (userName, userEmail) => {
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
};

const updateUserProfile = (profileData) => {
    if (localStorage.getItem('userLoggedIn') === 'true') {
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        return true;
    }
    return false;
};

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    const auth = checkUserAuthentication();
    
    // Update UI to show logged in user
    const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (auth.isLoggedIn) {
        if (loginBtn) loginBtn.innerHTML = `👤 ${auth.userName}`;
        if (logoutBtn) logoutBtn.style.display = 'block';
    }
});
