/**
 * MHCS Alumni - Authentication Manager
 * Comprehensive authentication and role-based access control
 * Handles navigation updates, redirects, and session validation
 */

class AuthManager {
    constructor() {
        this.authToken = localStorage.getItem('authToken');
        this.userRole = localStorage.getItem('userRole');
        this.isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        this.userName = localStorage.getItem('userName');
        this.userEmail = localStorage.getItem('userEmail');
        this.userId = localStorage.getItem('userId');
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.isLoggedIn && this.authToken;
    }

    /**
     * Check if user is admin
     */
    isAdmin() {
        return this.userRole === 'admin';
    }

    /**
     * Check if user is regular member
     */
    isMember() {
        return this.userRole === 'member' || this.userRole === 'user';
    }

    /**
     * Get current user data
     */
    getCurrentUser() {
        return {
            id: this.userId,
            name: this.userName,
            email: this.userEmail,
            role: this.userRole,
            token: this.authToken,
            isLoggedIn: this.isLoggedIn
        };
    }

    /**
     * Update navigation bar based on auth status and role
     */
    updateNavigation() {
        // Get navbar elements
        const loginBtn = document.querySelector('.cta-login, [data-btn-login]');
        const signupBtn = document.querySelector('.cta-signin, [data-btn-signup]');
        const navLoginBtn = document.querySelector('.nav-links .login-btn');
        const navSignupBtn = document.querySelector('.nav-links .signup-btn');
        const authSeparator = document.querySelector('.auth-separator');
        const navLinks = document.querySelector('.nav-links');
        const ctaButtonsGroup = document.querySelector('.cta-buttons-group');

        if (!this.isLoggedIn) {
            // NOT LOGGED IN: Show login/signup, hide everything else
            if (loginBtn) loginBtn.style.display = 'block';
            if (signupBtn) signupBtn.style.display = 'block';
            if (navLoginBtn) navLoginBtn.style.display = 'block';
            if (navSignupBtn) navSignupBtn.style.display = 'block';
            if (authSeparator) authSeparator.style.display = 'block';

            // Remove any existing user/logout buttons
            this._removeUserButtons(navLinks, ctaButtonsGroup);
        } else {
            // LOGGED IN: Hide login/signup
            if (loginBtn) loginBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (navLoginBtn) navLoginBtn.style.display = 'none';
            if (navSignupBtn) navSignupBtn.style.display = 'none';
            if (authSeparator) authSeparator.style.display = 'none';

            // Add user and logout buttons
            this._addUserButtons(navLinks, ctaButtonsGroup);
        }
    }

    /**
     * Remove user/logout buttons from navbar
     */
    _removeUserButtons(navLinks, ctaGroup) {
        const existingLogout = document.querySelector('.logout-btn, [data-logout]');
        const existingUserDisplay = document.querySelector('.user-display-btn, [data-user-btn]');

        if (existingLogout) existingLogout.closest('li')?.remove();
        if (existingUserDisplay) existingUserDisplay.closest('li')?.remove();

        if (ctaGroup) {
            const logoutInCta = ctaGroup.querySelector('.cta-logout, [data-logout]');
            if (logoutInCta) logoutInCta.remove();
        }
    }

    /**
     * Add user and logout buttons to navbar
     */
    _addUserButtons(navLinks, ctaGroup) {
        // Remove if already exists
        this._removeUserButtons(navLinks, ctaGroup);

        if (!navLinks) return;

        // Create user info button
        const userLi = document.createElement('li');
        userLi.innerHTML = `
            <a href="#" class="auth-link user-display-btn" data-user-btn title="Your Profile" style="color: #004db8; font-weight: 500;">
                👤 ${this.userName}
            </a>
        `;
        navLinks.appendChild(userLi);

        // Create logout button
        const logoutLi = document.createElement('li');
        logoutLi.innerHTML = `
            <a href="#" class="auth-link logout-btn" data-logout style="background: #dc3545; color: white; padding: 8px 16px; border-radius: 5px; cursor: pointer; transition: all 0.3s ease;">
                🚪 Logout
            </a>
        `;
        navLinks.appendChild(logoutLi);

        // Add click handlers
        logoutLi.querySelector('[data-logout]').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        userLi.querySelector('[data-user-btn]').addEventListener('click', (e) => {
            e.preventDefault();
            // Redirect to user profile or dashboard
            if (this.isAdmin()) {
                window.location.href = 'admin.html';
            } else if (this.isMember()) {
                window.location.href = 'index.html';
            }
        });

        // Also update CTA buttons if present
        if (ctaGroup) {
            ctaGroup.innerHTML = `
                <button class="cta-button cta-logout" data-logout style="background: #dc3545; color: white; cursor: pointer;">
                    🚪 Logout
                </button>
            `;
            ctaGroup.querySelector('[data-logout]').addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    /**
     * Logout user
     */
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear all auth data
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            localStorage.removeItem('userBatch');

            // Redirect to home
            window.location.href = 'index.html';
        }
    }

    /**
     * Protect page - require login
     * @param {string} redirectPage - where to redirect if not logged in
     */
    requireLogin(redirectPage = 'login.html') {
        if (!this.isLoggedIn) {
            this._showLoginRequired(redirectPage);
            return false;
        }
        return true;
    }

    /**
     * Protect page - require admin role
     * @param {string} redirectPage - where to redirect if not admin
     */
    requireAdmin(redirectPage = 'index.html') {
        if (!this.isLoggedIn || !this.isAdmin()) {
            this._showAccessDenied(redirectPage);
            return false;
        }
        return true;
    }

    /**
     * Protect page - require member role
     * @param {string} redirectPage - where to redirect if not member
     */
    requireMember(redirectPage = 'login.html') {
        if (!this.isLoggedIn || !this.isMember()) {
            this._showLoginRequired(redirectPage);
            return false;
        }
        return true;
    }

    /**
     * Show login required modal
     */
    _showLoginRequired(redirectPage) {
        const overlay = document.createElement('div');
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
                You need to be logged in to access this page. Please log in with your alumni account to continue.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <a href="${redirectPage}" class="btn btn-primary" style="flex: 1; text-align: center; padding: 0.85rem 1.5rem; background: #004db8; color: white; border-radius: 8px; text-decoration: none;">
                    Go to Login
                </a>
                <button onclick="document.querySelector('[data-auth-overlay]').remove()" style="flex: 1; padding: 0.85rem 1.5rem; background: #f0f6ff; color: #004db8; border: 2px solid #004db8; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600;">
                    Cancel
                </button>
            </div>
        `;

        overlay.setAttribute('data-auth-overlay', 'true');
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show access denied modal
     */
    _showAccessDenied(redirectPage) {
        const overlay = document.createElement('div');
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
            box-shadow: 0 20px 60px rgba(220, 53, 69, 0.3);
            text-align: center;
            animation: slideInUp 0.4s ease-out;
        `;

        modal.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🚫</div>
            <h2 style="color: #dc3545; font-size: 1.8rem; margin-bottom: 1rem;">Access Denied</h2>
            <p style="color: #666; font-size: 1rem; margin-bottom: 2rem; line-height: 1.6;">
                You don't have permission to access this page. The admin area is restricted to authorized administrators only.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <a href="${redirectPage}" style="flex: 1; text-align: center; padding: 0.85rem 1.5rem; background: #004db8; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
                    Go Back Home
                </a>
                <button onclick="document.querySelector('[data-auth-overlay]').remove()" style="flex: 1; padding: 0.85rem 1.5rem; background: #f0f6ff; color: #004db8; border: 2px solid #004db8; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600;">
                    Close
                </button>
            </div>
        `;

        overlay.setAttribute('data-auth-overlay', 'true');
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    /**
     * Initialize on page load
     */
    init() {
        // Update navigation on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.updateNavigation();
        });

        // Also call immediately in case DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.updateNavigation();
            });
        } else {
            this.updateNavigation();
        }
    }
}

// Create global instance
const authManager = new AuthManager();
authManager.init();
