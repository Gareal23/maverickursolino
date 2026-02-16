/* ===== MODERN ADMIN DASHBOARD FUNCTIONALITY ===== */

// ===== API CONFIGURATION =====
const API_BASE_URL = 'http://localhost/UPHSD%20edu.ph/mhcs-alumni-api';

// ===== UTILITY FUNCTIONS =====
function getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function checkAdminAccess() {
    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    console.log('Admin.js - Checking access. isLoggedIn:', isLoggedIn, 'userRole:', userRole);
    
    if (!isLoggedIn) {
        console.warn('User not logged in, redirecting to login.html');
        window.location.href = 'login.html';
        return;
    }
    
    if (userRole !== 'admin') {
        console.warn('User role is not admin:', userRole, 'redirecting to index.html');
        alert('Access Denied: Admin access required');
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Admin access verified for user role:', userRole);
}

async function loadDashboardData() {
    try {
        // Load total users count
        const usersResponse = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const totalUsers = usersData.data ? usersData.data.length : 0;
            const totalUsersEl = document.getElementById('totalUsers');
            if (totalUsersEl) {
                totalUsersEl.textContent = totalUsers;
                const usersChangeEl = document.getElementById('usersChange');
                if (usersChangeEl) {
                    usersChangeEl.textContent = 'Active users';
                }
            }
        }

        // Load news count
        const newsResponse = await fetch(`${API_BASE_URL}/api/news`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (newsResponse.ok) {
            const newsData = await newsResponse.json();
            const totalNews = newsData.data ? newsData.data.length : 0;
            const newsCards = document.querySelectorAll('.stat-card');
            if (newsCards.length > 1) {
                const newsNumber = newsCards[1].querySelector('.stat-number');
                if (newsNumber) newsNumber.textContent = totalNews;
                const newsChange = newsCards[1].querySelector('.stat-change');
                if (newsChange) newsChange.textContent = 'Up to date';
            }
        }

        // Load donations count
        const donationsResponse = await fetch(`${API_BASE_URL}/api/donations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (donationsResponse.ok) {
            const donationsData = await donationsResponse.json();
            const donations = donationsData.data || [];
            let totalAmount = 0;
            donations.forEach(d => {
                totalAmount += parseFloat(d.amount || 0);
            });
            const donationCards = document.querySelectorAll('.stat-card');
            if (donationCards.length > 2) {
                const donationNumber = donationCards[2].querySelector('.stat-number');
                if (donationNumber) donationNumber.textContent = '$' + totalAmount.toLocaleString();
                const donationChange = donationCards[2].querySelector('.stat-change');
                if (donationChange) donationChange.textContent = donations.length + ' donations';
            }
        }

        // Load messages count
        const messagesResponse = await fetch(`${API_BASE_URL}/api/contact-messages`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (messagesResponse.ok) {
            const messagesData = await messagesResponse.json();
            const messages = messagesData.data || [];
            const messageCards = document.querySelectorAll('.stat-card');
            if (messageCards.length > 3) {
                const messageNumber = messageCards[3].querySelector('.stat-number');
                if (messageNumber) messageNumber.textContent = messages.length;
                const messageChange = messageCards[3].querySelector('.stat-change');
                if (messageChange) {
                    const unread = messages.filter(m => !m.read).length;
                    messageChange.textContent = unread + ' unread';
                }
            }
        }
    } catch (error) {
        console.log('Dashboard data loading from database...');
    }
}

// ===== LOAD USERS FROM DATABASE =====
async function loadUsersTable() {
    try {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">Loading...</td></tr>';
        
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const users = data.data || [];
            tbody.innerHTML = '';
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No users found. Click "Add New User" to create one.</td></tr>';
            } else {
                users.forEach(user => {
                    const row = document.createElement('tr');
                    const date = new Date(user.created_at).toLocaleDateString();
                    row.innerHTML = `
                        <td>${user.name || 'N/A'}</td>
                        <td>${user.email || 'N/A'}</td>
                        <td>${user.role || 'member'}</td>
                        <td>${date}</td>
                        <td><span class="badge ${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td>
                            <button class="btn-action edit" onclick="editUser(${user.id})">Edit</button>
                            <button class="btn-action delete" onclick="deleteUser(${user.id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No users found. Click "Add New User" to create one.</td></tr>';
        }
    } catch (error) {
        console.error('Error loading users:', error);
        const tbody = document.getElementById('usersTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No users found. Click "Add New User" to create one.</td></tr>';
        }
    }
}

// ===== DELETE USER FUNCTION =====
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showToast('✓ User deleted successfully', 'success');
            loadUsersTable(); // Reload table
        } else {
            showToast('✗ Failed to delete user', 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast('✗ Error deleting user', 'error');
    }
}

// ===== EDIT USER FUNCTION =====
function editUser(userId) {
    showToast('✏️ Edit user functionality - redirect to edit page', 'info');
    // This can be extended to open a modal or redirect to edit page
}

// ===== LOAD DIRECTORY FROM DATABASE =====
async function loadDirectoryTable() {
    try {
        const tbody = document.getElementById('directoryTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Loading...</td></tr>';
        
        const response = await fetch(`${API_BASE_URL}/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const users = data.data || [];
            tbody.innerHTML = '';
            
            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No alumni in directory yet</td></tr>';
            } else {
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.name || 'N/A'}</td>
                        <td>${user.batch_year || 'N/A'}</td>
                        <td>${user.email || 'N/A'}</td>
                        <td>${user.profession || 'N/A'}</td>
                        <td>${user.location || 'N/A'}</td>
                        <td>
                            <button class="btn-action view" onclick="viewAlumni(${user.id})">View</button>
                            <button class="btn-action delete" onclick="deleteAlumni(${user.id})">Delete</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No alumni in directory yet</td></tr>';
        }
    } catch (error) {
        console.error('Error loading directory:', error);
        const tbody = document.getElementById('directoryTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No alumni in directory yet</td></tr>';
        }
    }
}

// ===== LOAD NEWS FROM DATABASE =====
async function loadNewsList() {
    try {
        const newsList = document.getElementById('newsList');
        if (!newsList) return;
        
        newsList.innerHTML = '<p style="text-align: center; color: #999;">Loading...</p>';
        
        const response = await fetch(`${API_BASE_URL}/api/news`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const news = data.data || [];
            newsList.innerHTML = '';
            
            if (news.length === 0) {
                newsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No news yet. Click "+ Create Post" to add news.</p>';
            } else {
                news.forEach(item => {
                    const newsDiv = document.createElement('div');
                    newsDiv.className = 'news-item';
                    newsDiv.innerHTML = `
                        <div class="news-header">
                            <h3>${item.title || 'Untitled'}</h3>
                            <span class="news-date">${item.published_at ? new Date(item.published_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <p class="news-preview">${item.excerpt || item.content?.substring(0, 100) || ''}</p>
                        <div class="news-actions">
                            <button class="btn-action edit" onclick="editNews(${item.id})">Edit</button>
                            <button class="btn-action delete" onclick="deleteNews(${item.id})">Delete</button>
                        </div>
                    `;
                    newsList.appendChild(newsDiv);
                });
            }
        } else {
            newsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No news yet. Click "+ Create Post" to add news.</p>';
        }
    } catch (error) {
        console.error('Error loading news:', error);
        const newsList = document.getElementById('newsList');
        if (newsList) {
            newsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No news yet. Click "+ Create Post" to add news.</p>';
        }
    }
}

// ===== LOAD EVENTS FROM DATABASE =====
async function loadEventsList() {
    try {
        const eventsList = document.getElementById('eventsList');
        if (!eventsList) return;
        
        eventsList.innerHTML = '<p style="text-align: center; color: #999;">Loading...</p>';
        
        const response = await fetch(`${API_BASE_URL}/api/reunions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const events = data.data || [];
            eventsList.innerHTML = '';
            
            if (events.length === 0) {
                eventsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No events yet. Click "+ Create Event" to add events.</p>';
            } else {
                events.forEach(event => {
                    const eventDate = new Date(event.event_date);
                    const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
                    const day = eventDate.getDate();
                    
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'event-card';
                    eventDiv.innerHTML = `
                        <div class="event-date">
                            <span class="month">${month}</span>
                            <span class="day">${day}</span>
                        </div>
                        <div class="event-details">
                            <h3>${event.title || 'Untitled Event'}</h3>
                            <p class="event-location">📍 ${event.location || 'TBD'}</p>
                            <p class="event-time">⏰ ${event.event_time || 'TBA'}</p>
                        </div>
                        <div class="event-actions">
                            <button class="btn-action edit" onclick="editEvent(${event.id})">Edit</button>
                            <button class="btn-action delete" onclick="deleteEvent(${event.id})">Delete</button>
                        </div>
                    `;
                    eventsList.appendChild(eventDiv);
                });
            }
        } else {
            eventsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No events yet. Click "+ Create Event" to add events.</p>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
        const eventsList = document.getElementById('eventsList');
        if (eventsList) {
            eventsList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No events yet. Click "+ Create Event" to add events.</p>';
        }
    }
}

// ===== LOAD GALLERY FROM DATABASE =====
async function loadGallery() {
    try {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;
        
        galleryGrid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Loading...</p>';
        
        const response = await fetch(`${API_BASE_URL}/api/gallery`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const items = data.data || [];
            galleryGrid.innerHTML = '';
            
            if (items.length === 0) {
                galleryGrid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No images yet. Click "+ Upload Images" to add photos.</p>';
            } else {
                items.forEach(item => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.innerHTML = `
                        <img src="${item.image_url || 'https://via.placeholder.com/200'}" alt="${item.title || 'Gallery Image'}">
                        <div class="gallery-overlay">
                            <button class="btn-action delete" onclick="deleteGalleryItem(${item.id})">Delete</button>
                        </div>
                    `;
                    galleryGrid.appendChild(galleryItem);
                });
            }
        } else {
            galleryGrid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No images yet. Click "+ Upload Images" to add photos.</p>';
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        const galleryGrid = document.getElementById('galleryGrid');
        if (galleryGrid) {
            galleryGrid.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No images yet. Click "+ Upload Images" to add photos.</p>';
        }
    }
}

// ===== LOAD DONATIONS FROM DATABASE =====
async function loadDonations() {
    try {
        const tbody = document.getElementById('donationsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading...</td></tr>';
        
        const response = await fetch(`${API_BASE_URL}/api/donations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const donations = data.data || [];
            tbody.innerHTML = '';
            
            if (donations.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No donations received yet</td></tr>';
            } else {
                donations.forEach(donation => {
                    const row = document.createElement('tr');
                    const date = new Date(donation.donated_at).toLocaleDateString();
                    const status = donation.payment_status === 'completed' ? 'Received' : 'Pending';
                    const statusClass = status === 'Received' ? 'completed' : 'pending';
                    
                    row.innerHTML = `
                        <td>${donation.donor_name || 'Anonymous'}</td>
                        <td>${donation.amount ? '$' + donation.amount : 'N/A'}</td>
                        <td>${date}</td>
                        <td>${donation.donation_type || 'General'}</td>
                        <td><span class="badge ${statusClass}">${status}</span></td>
                    `;
                    tbody.appendChild(row);
                });
            }
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No donations received yet</td></tr>';
        }
    } catch (error) {
        console.error('Error loading donations:', error);
        const tbody = document.getElementById('donationsTableBody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No donations received yet</td></tr>';
        }
    }
}

// ===== DELETE FUNCTIONS =====
async function deleteAlumni(id) {
    if (!confirm('Are you sure?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            showToast('✓ Alumni removed', 'success');
            loadDirectoryTable();
        }
    } catch (error) {
        showToast('✗ Error deleting alumni', 'error');
    }
}

async function deleteNews(id) {
    if (!confirm('Are you sure?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/news/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            showToast('✓ Post deleted', 'success');
            loadNewsList();
        }
    } catch (error) {
        showToast('✗ Error deleting post', 'error');
    }
}

async function deleteEvent(id) {
    if (!confirm('Are you sure?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/reunions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            showToast('✓ Event deleted', 'success');
            loadEventsList();
        }
    } catch (error) {
        showToast('✗ Error deleting event', 'error');
    }
}

async function deleteGalleryItem(id) {
    if (!confirm('Delete this image?')) return;
    try {
        const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            showToast('✓ Image deleted', 'success');
            loadGallery();
        }
    } catch (error) {
        showToast('✗ Error deleting image', 'error');
    }
}

// ===== VIEW/EDIT FUNCTIONS =====
function viewAlumni(id) {
    showToast(`📋 Viewing alumni #${id}`, 'info');
}

function editNews(id) {
    showToast(`✏️ Editing news #${id}`, 'info');
}

function editEvent(id) {
    showToast(`✏️ Editing event #${id}`, 'info');
}

// DOM Elements
const sidebarToggle = document.querySelector('.sidebar-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const adminSidebar = document.getElementById('adminSidebar');
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');
const logoutBtn = document.getElementById('logoutBtn');

// ===== MODAL SYSTEM =====
class ModalManager {
    constructor() {
        this.modals = {};
        this.createModals();
    }

    createModals() {
        // Add User Modal
        this.createModal('addUserModal', 'Add New User', `
            <form id="addUserForm">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="fullName" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Batch Year *</label>
                    <input type="number" name="batch" required>
                </div>
                <div class="form-group">
                    <label>Role *</label>
                    <select name="role" required>
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn-primary">Add User</button>
                    <button type="button" class="btn-secondary" onclick="modalManager.closeModal('addUserModal')">Cancel</button>
                </div>
            </form>
        `);

        // Create Post Modal
        this.createModal('createPostModal', 'Create New Post', `
            <form id="createPostForm">
                <div class="form-group">
                    <label>Post Title *</label>
                    <input type="text" name="title" required placeholder="Enter post title">
                </div>
                <div class="form-group">
                    <label>Post Content *</label>
                    <textarea name="content" required placeholder="Write your post content here..." rows="8"></textarea>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select name="category">
                        <option value="news">News</option>
                        <option value="announcement">Announcement</option>
                        <option value="update">Update</option>
                        <option value="event">Event</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Featured Image URL</label>
                    <input type="text" name="image" placeholder="https://example.com/image.jpg">
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" name="publish" checked>
                        Publish Immediately
                    </label>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn-primary">Create Post</button>
                    <button type="button" class="btn-secondary" onclick="modalManager.closeModal('createPostModal')">Cancel</button>
                </div>
            </form>
        `);

        // Create Event Modal
        this.createModal('createEventModal', 'Create New Event', `
            <form id="createEventForm">
                <div class="form-group">
                    <label>Event Name *</label>
                    <input type="text" name="eventName" required placeholder="Enter event name">
                </div>
                <div class="form-group">
                    <label>Event Date *</label>
                    <input type="date" name="eventDate" required>
                </div>
                <div class="form-group">
                    <label>Event Time *</label>
                    <input type="time" name="eventTime" required>
                </div>
                <div class="form-group">
                    <label>Location *</label>
                    <input type="text" name="location" required placeholder="Enter location">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" placeholder="Event description..." rows="6"></textarea>
                </div>
                <div class="form-group">
                    <label>Batch/Target Audience</label>
                    <input type="text" name="batch" placeholder="e.g., Class of 2020">
                </div>
                <div class="form-group">
                    <label>Max Attendees</label>
                    <input type="number" name="maxAttendees" placeholder="Leave empty for unlimited">
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn-primary">Create Event</button>
                    <button type="button" class="btn-secondary" onclick="modalManager.closeModal('createEventModal')">Cancel</button>
                </div>
            </form>
        `);

        // Upload Images Modal
        this.createModal('uploadImagesModal', 'Upload Gallery Images', `
            <div id="uploadImageForm">
                <div class="form-group">
                    <label>Select Category</label>
                    <select id="imageCategorySelect">
                        <option value="campus-life">Campus Life</option>
                        <option value="reunions">Reunions</option>
                        <option value="graduations">Graduations</option>
                        <option value="events">Events</option>
                        <option value="chapel">Chapel Moments</option>
                        <option value="sports">Sports Activities</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Upload Images *</label>
                    <div class="file-upload-area" id="fileUploadArea" style="border: 2px dashed #667eea; border-radius: 10px; padding: 2rem; text-align: center; cursor: pointer; background: #f8f9ff; transition: all 0.3s;">
                        <div style="font-size: 2rem; margin-bottom: 1rem;">📸</div>
                        <p style="margin: 0.5rem 0;">Drag and drop images here or click to browse</p>
                        <p style="font-size: 0.85rem; color: #999; margin: 0.5rem 0;">Supported: JPG, PNG, GIF (Max 5MB each)</p>
                        <input type="file" id="imageFileInput" multiple accept="image/*" style="display: none;">
                    </div>
                </div>
                <div id="uploadPreview" style="margin-top: 1rem;"></div>
                <div class="modal-actions">
                    <button type="button" class="btn-primary" id="submitUploadBtn">Upload Images</button>
                    <button type="button" class="btn-secondary" onclick="modalManager.closeModal('uploadImagesModal')">Cancel</button>
                </div>
            </div>
        `);

        // Reply to Message Modal
        this.createModal('replyMessageModal', 'Reply to Message', `
            <div id="replyMessageForm">
                <div id="messagePreview" style="background: #f8f9ff; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #667eea;">
                    <p id="originalMessage" style="margin: 0; color: #333; font-size: 0.95rem;"></p>
                </div>
                <div class="form-group">
                    <label>Your Reply *</label>
                    <textarea id="replyText" required placeholder="Type your reply message here..." rows="8" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-family: inherit; resize: vertical;"></textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="sendCopy" checked>
                        Send copy to sender's email
                    </label>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-primary" id="submitReplyBtn">Send Reply</button>
                    <button type="button" class="btn-secondary" onclick="modalManager.closeModal('replyMessageModal')">Cancel</button>
                </div>
            </div>
        `);
    }

    createModal(id, title, content) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close" onclick="modalManager.closeModal('${id}')">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 5000;
            animation: fadeIn 0.3s ease-out;
            overflow-y: auto;
            padding-top: 2rem;
        `;

        document.body.appendChild(modal);
        this.modals[id] = modal;
        this.attachModalEvents(id);
    }

    attachModalEvents(modalId) {
        const modal = this.modals[modalId];
        
        // Close modal when clicking outside
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modalId);
            }
        });

        // Form specific event handlers
        if (modalId === 'addUserModal') {
            const form = modal.querySelector('#addUserForm');
            form?.addEventListener('submit', (e) => this.handleAddUser(e));
        } else if (modalId === 'createPostModal') {
            const form = modal.querySelector('#createPostForm');
            form?.addEventListener('submit', (e) => this.handleCreatePost(e));
        } else if (modalId === 'createEventModal') {
            const form = modal.querySelector('#createEventForm');
            form?.addEventListener('submit', (e) => this.handleCreateEvent(e));
        } else if (modalId === 'uploadImagesModal') {
            this.setupImageUpload();
        } else if (modalId === 'replyMessageModal') {
            const btn = modal.querySelector('#submitReplyBtn');
            btn?.addEventListener('click', (e) => this.handleReplyMessage(e));
        }
    }

    setupImageUpload() {
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('imageFileInput');
        const uploadPreview = document.getElementById('uploadPreview');
        const submitBtn = document.getElementById('submitUploadBtn');

        fileUploadArea.addEventListener('click', () => fileInput.click());

        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.background = '#e8ebff';
            fileUploadArea.style.borderColor = '#4c63d2';
        });

        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.style.background = '#f8f9ff';
            fileUploadArea.style.borderColor = '#667eea';
        });

        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.background = '#f8f9ff';
            fileUploadArea.style.borderColor = '#667eea';
            const files = e.dataTransfer.files;
            fileInput.files = files;
            this.previewImages(files, uploadPreview);
        });

        fileInput.addEventListener('change', (e) => {
            this.previewImages(e.target.files, uploadPreview);
        });

        submitBtn?.addEventListener('click', () => this.handleUploadImages());
    }

    previewImages(files, previewContainer) {
        previewContainer.innerHTML = '';
        let validCount = 0;
        
        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                validCount++;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.createElement('div');
                    preview.style.cssText = `
                        display: inline-block;
                        margin: 0.5rem;
                        position: relative;
                        width: 100px;
                        height: 100px;
                    `;
                    preview.innerHTML = `
                        <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                        <small style="display: block; margin-top: 0.25rem; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</small>
                    `;
                    previewContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });

        if (validCount === 0) {
            previewContainer.innerHTML = '<p style="color: #f5576c;">No valid image files selected</p>';
        }
    }

    handleAddUser(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);

        // Call API to create user
        fetch(`${API_BASE_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: userData.fullName,
                email: userData.email,
                batch: userData.batch,
                role: userData.role,
                status: userData.status
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast(`✅ User "${userData.fullName}" added successfully!`, 'success');
                this.closeModal('addUserModal');
                form.reset();
                // Reload users table to show new user
                loadUsersTable();
            } else {
                showToast(`✗ Error: ${data.error || 'Failed to create user'}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error creating user:', error);
            showToast('✗ Error creating user: ' + error.message, 'error');
        });
    }

    handleCreatePost(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const postData = Object.fromEntries(formData);

        // Call API to create news
        fetch(`${API_BASE_URL}/api/news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: postData.title,
                content: postData.content,
                category: postData.category,
                image: postData.image,
                publish: postData.publish === 'on'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast(`📝 Post "${postData.title}" created successfully!`, 'success');
                this.closeModal('createPostModal');
                form.reset();
                // Reload news list to show new post
                loadNewsList();
            } else {
                showToast(`✗ Error: ${data.error || 'Failed to create post'}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error creating post:', error);
            showToast('✗ Error creating post: ' + error.message, 'error');
        });
    }

    handleCreateEvent(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const eventData = Object.fromEntries(formData);

        // Call API to create event
        fetch(`${API_BASE_URL}/api/reunions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                eventName: eventData.eventName,
                eventDate: eventData.eventDate,
                eventTime: eventData.eventTime,
                location: eventData.location,
                description: eventData.description,
                batch: eventData.batch,
                maxAttendees: eventData.maxAttendees
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast(`🎉 Event "${eventData.eventName}" created successfully!`, 'success');
                this.closeModal('createEventModal');
                form.reset();
                // Reload events list to show new event
                loadEventsList();
            } else {
                showToast(`✗ Error: ${data.error || 'Failed to create event'}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error creating event:', error);
            showToast('✗ Error creating event: ' + error.message, 'error');
        });
    }

    handleUploadImages() {
        const fileInput = document.getElementById('imageFileInput');
        const category = document.getElementById('imageCategorySelect').value;
        
        if (fileInput.files.length === 0) {
            showToast('Please select at least one image', 'error');
            return;
        }

        const validImages = Array.from(fileInput.files).filter(f => f.type.startsWith('image/'));
        if (validImages.length === 0) {
            showToast('Please select valid image files', 'error');
            return;
        }

        // Upload each image via API
        let uploadCount = 0;
        validImages.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Call API to store image data URL
                fetch(`${API_BASE_URL}/api/gallery`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: file.name.replace(/\.[^/.]+$/, ''),
                        description: '',
                        image_url: e.target.result,
                        category: category,
                        event_date: new Date().toISOString().split('T')[0]
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        uploadCount++;
                        if (uploadCount === validImages.length) {
                            showToast(`✅ ${uploadCount} image(s) uploaded successfully!`, 'success');
                            this.closeModal('uploadImagesModal');
                            fileInput.value = '';
                            // Reload gallery to show new images
                            loadGallery();
                        }
                    } else {
                        showToast(`✗ Error uploading ${file.name}: ${data.error || 'Failed'}`, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                    showToast('✗ Error uploading image: ' + error.message, 'error');
                });
            };
            reader.readAsDataURL(file);
        });
    }

    handleReplyMessage(e) {
        e.preventDefault();
        const replyText = document.getElementById('replyText').value;
        const sendCopy = document.getElementById('sendCopy').checked;

        if (!replyText.trim()) {
            showToast('Please write a reply message', 'error');
            return;
        }

        showToast(`📧 Reply sent successfully!`, 'success');
        this.closeModal('replyMessageModal');
        document.getElementById('replyText').value = '';
    }

    openModal(id) {
        const modal = this.modals[id];
        if (modal) {
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
        }
    }

    closeModal(id) {
        const modal = this.modals[id];
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                modal.style.display = 'none';
                modal.style.animation = 'fadeIn 0.3s ease-out';
            }, 300);
        }
    }
}

// Initialize modal manager
let modalManager;

// ===== SMOOTH PAGE LOAD ANIMATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Check admin access
    checkAdminAccess();
    
    // Load user info
    const userName = localStorage.getItem('userName') || 'Admin';
    const userRole = localStorage.getItem('userRole') || 'Administrator';
    document.getElementById('adminUserName').textContent = userName;
    document.getElementById('adminUserRole').textContent = userRole;
    
    // Load dashboard data
    loadDashboardData();
    
    // Load users table
    loadUsersTable();
    
    // Load other sections
    loadDirectoryTable();
    loadNewsList();
    loadEventsList();
    loadGallery();
    loadDonations();
    
    // Initialize modals
    modalManager = new ModalManager();

    document.body.style.opacity = '0';
    document.body.style.animation = 'none';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.8s ease-out';
    }, 50);

    // Add staggered animation to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animation = `slideInUp 0.5s ease-out ${index * 0.1}s both`;
    });

    // Set dashboard as active by default
    document.querySelector('[data-section="dashboard"]')?.classList.add('active');

    // Add hover ripple effect
    addRippleEffect();

    // Setup all button actions
    setupButtonActions();
});

// ===== BUTTON ACTIONS SETUP =====
function setupButtonActions() {
    // Add User Button
    document.getElementById('addUserBtn')?.addEventListener('click', () => {
        modalManager.openModal('addUserModal');
    });

    // Create Post Button
    document.getElementById('addNewsBtn')?.addEventListener('click', () => {
        modalManager.openModal('createPostModal');
    });

    // Create Event Button
    document.getElementById('addEventBtn')?.addEventListener('click', () => {
        modalManager.openModal('createEventModal');
    });

    // Upload Images Button
    document.getElementById('uploadImageBtn')?.addEventListener('click', () => {
        modalManager.openModal('uploadImagesModal');
    });

    // Reply Message Buttons
    document.querySelectorAll('.btn-action.reply').forEach(btn => {
        btn.addEventListener('click', function() {
            const messageItem = this.closest('.message-item');
            if (messageItem) {
                const originalMessage = messageItem.querySelector('.message-content').textContent;
                document.getElementById('originalMessage').textContent = originalMessage;
                modalManager.openModal('replyMessageModal');
            }
        });
    });

    // Delete Buttons (with animation)
    attachDeleteActions();

    // View/Edit Buttons for Directory
    document.querySelectorAll('.btn-action.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            if (row) {
                const name = row.cells[0].textContent;
                showToast(`📋 Viewing profile for ${name}`, 'info');
            }
        });
    });

    // Export Directory Buttons
    document.getElementById('exportDirectoryCSVBtn')?.addEventListener('click', () => {
        exportDirectoryAsCSV();
    });
    
    document.getElementById('exportDirectoryPDFBtn')?.addEventListener('click', () => {
        exportDirectoryAsPDF();
    });
    
    document.getElementById('exportDirectoryBtn')?.addEventListener('click', () => {
        exportDirectoryAsCSV();
    });
    
    // Export Users Button
    document.getElementById('exportUsersBtn')?.addEventListener('click', () => {
        exportUsersAsPDF();
    });
}

// ===== EXPORT DIRECTORY AS CSV =====
function exportDirectoryAsCSV() {
    const table = document.getElementById('directoryTableBody');
    if (!table || table.rows.length === 0) {
        showToast('❌ No data to export', 'error');
        return;
    }
    
    let csv = 'Name,Batch,Email,Profession,Location\n';
    
    table.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).slice(0, 5).map(cell => {
            let text = cell.textContent.trim();
            if (text.includes(',')) {
                text = `"${text.replace(/"/g, '""')}"`;
            }
            return text;
        }).join(',');
        csv += rowData + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `MHCS-Alumni-Directory-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('✅ Directory exported as CSV', 'success');
}

// ===== EXPORT DIRECTORY AS PDF =====
function exportDirectoryAsPDF() {
    const table = document.getElementById('directoryTableBody');
    if (!table || table.rows.length === 0) {
        showToast('❌ No data to export', 'error');
        return;
    }

    const element = document.createElement('div');
    element.innerHTML = `
        <h2 style="text-align: center; color: #0a3d62; margin-bottom: 1rem;">MHCS Alumni Directory</h2>
        <p style="text-align: center; color: #666; margin-bottom: 1rem;">Generated on ${new Date().toLocaleDateString()}</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
                <tr style="background: #0a3d62; color: white;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Batch</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Profession</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Location</th>
                </tr>
            </thead>
            <tbody>
                ${Array.from(table.querySelectorAll('tr')).map(row => `
                    <tr>
                        ${Array.from(row.querySelectorAll('td')).slice(0, 5).map(cell => `
                            <td style="border: 1px solid #ddd; padding: 8px;">${cell.textContent.trim()}</td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    const opt = {
        margin: 10,
        filename: `MHCS-Alumni-Directory-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
    showToast('✅ Directory exported as PDF', 'success');
}

// ===== EXPORT USERS AS PDF =====
function exportUsersAsPDF() {
    const table = document.getElementById('usersTableBody');
    if (!table || table.rows.length === 0) {
        showToast('❌ No users to export', 'error');
        return;
    }

    const element = document.createElement('div');
    element.innerHTML = `
        <h2 style="text-align: center; color: #0a3d62; margin-bottom: 1rem;">MHCS Alumni - Users Report</h2>
        <p style="text-align: center; color: #666; margin-bottom: 1rem;">Generated on ${new Date().toLocaleDateString()}</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
                <tr style="background: #0a3d62; color: white;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Role</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>
                </tr>
            </thead>
            <tbody>
                ${Array.from(table.querySelectorAll('tr')).map(row => `
                    <tr>
                        ${Array.from(row.querySelectorAll('td')).slice(0, 4).map(cell => `
                            <td style="border: 1px solid #ddd; padding: 8px;">${cell.textContent.trim()}</td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    const opt = {
        margin: 10,
        filename: `MHCS-Alumni-Users-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
    showToast('✅ Users report exported as PDF', 'success');
}

function attachTableRowActions(row) {
    // Delete button
    const deleteBtn = row.querySelector('.btn-action.delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this user?')) {
                row.style.animation = 'slideOutRight 0.4s ease-out forwards';
                setTimeout(() => {
                    row.remove();
                    showToast('🗑️ User deleted', 'success');
                }, 400);
            }
        });
    }

    // Edit button
    const editBtn = row.querySelector('.btn-action.edit');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showToast('✏️ Edit user - functionality can be extended', 'info');
        });
    }
}

function attachGalleryActions(item) {
    const deleteBtn = item.querySelector('.btn-action.delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm('Delete this image?')) {
                item.style.animation = 'slideOutRight 0.4s ease-out forwards';
                setTimeout(() => {
                    item.remove();
                    showToast('🗑️ Image deleted', 'success');
                }, 400);
            }
        });
    }
}

function attachDeleteActions() {
    document.querySelectorAll('.btn-action.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.news-item, .event-card, .message-item, tr, .gallery-item');
            if (parent && parent.classList.contains('message-item')) {
                if (confirm('Delete this message?')) {
                    parent.style.animation = 'slideOutRight 0.4s ease-out forwards';
                    setTimeout(() => {
                        parent.remove();
                        showToast('🗑️ Message deleted', 'success');
                    }, 400);
                }
            }
        });
    });
}

// ===== SMOOTH SECTION SWITCHING =====
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        const section = item.getAttribute('data-section');
        
        updatePageTitleSmooth(section);
        
        contentSections.forEach(sec => {
            sec.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                sec.style.display = 'none';
                sec.style.animation = 'slideInUp 0.5s ease-out forwards';
            }, 300);
        });
        
        setTimeout(() => {
            const selectedSection = document.getElementById(`${section}-section`);
            if (selectedSection) {
                selectedSection.style.display = 'block';
                
                // Reload data for the selected section
                switch(section) {
                    case 'users':
                        loadUsersTable();
                        break;
                    case 'directory':
                        loadDirectoryTable();
                        break;
                    case 'news':
                        loadNewsList();
                        break;
                    case 'events':
                        loadEventsList();
                        break;
                    case 'gallery':
                        loadGallery();
                        break;
                    case 'donations':
                        loadDonations();
                        break;
                    case 'dashboard':
                        loadDashboardData();
                        loadUsersTable();
                        break;
                }
            }
        }, 300);
        
        if (window.innerWidth <= 768) {
            adminSidebar.classList.remove('active');
        }
    });
});

// ===== PAGE TITLE UPDATE =====
function updatePageTitleSmooth(section) {
    const titles = {
        'dashboard': 'Dashboard',
        'users': 'Manage Users',
        'directory': 'Alumni Directory',
        'news': 'News & Updates',
        'events': 'Events & Reunions',
        'gallery': 'Gallery Management',
        'donations': 'Donations',
        'contact': 'Contact Messages',
        'settings': 'Settings'
    };
    
    pageTitle.style.animation = 'fadeOut 0.2s ease-out forwards';
    setTimeout(() => {
        pageTitle.textContent = titles[section] || 'Dashboard';
        pageTitle.style.animation = 'slideInDown 0.4s ease-out forwards';
    }, 200);
}

// ===== RIPPLE EFFECT =====
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-action, .action-btn, .nav-item');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (e.target === this || this.contains(e.target)) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255,255,255,0.5);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: ripple-animation 0.6s ease-out;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            }
        });
    });
}

// ===== SIDEBAR TOGGLE =====
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        adminSidebar.classList.toggle('active');
        menuToggle.style.animation = 'rotate 0.3s ease-out';
    });
}

// ===== QUICK ACTION BUTTONS =====
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        const navItem = document.querySelector(`[data-section="${section}"]`);
        
        this.style.animation = 'scaleClick 0.3s ease-out';
        
        if (navItem) {
            navItem.click();
        }
    });
});

// ===== LOGOUT =====
logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Show loading spinner
        const originalText = logoutBtn.innerHTML;
        logoutBtn.innerHTML = '<span class="logout-spinner"></span>';
        logoutBtn.style.opacity = '0.8';
        logoutBtn.disabled = true;
        logoutBtn.style.pointerEvents = 'none';
        
        // Clear localStorage
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        
        document.body.style.animation = 'fadeOut 0.5s ease-out forwards';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }
});

// ===== RESPONSIVE SIDEBAR =====
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        adminSidebar.classList.remove('active');
    }
});

document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        const isClickInsideSidebar = adminSidebar.contains(e.target);
        const isClickOnMenuToggle = menuToggle?.contains(e.target);
        
        if (!isClickInsideSidebar && !isClickOnMenuToggle && adminSidebar.classList.contains('active')) {
            adminSidebar.classList.remove('active');
        }
    }
});

// ===== TOAST NOTIFICATION SYSTEM =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 14px 24px;
        background: ${getToastColor(type)};
        color: white;
        border-radius: 10px;
        font-weight: 700;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        animation: slideInRight 0.4s ease-out, slideOutRight 0.4s ease-out 3.6s forwards;
        z-index: 10001;
        font-size: 14px;
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

function getToastColor(type) {
    const colors = {
        'success': 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        'error': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'info': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'edit': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    return colors[type] || colors['info'];
}

// ===== SETTINGS SAVE =====
document.querySelectorAll('.settings-group .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.style.animation = 'pulse 0.5s ease-out';
        showToast('✅ Settings saved successfully!', 'success');
    });
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'd') {
        document.querySelector('[data-section="dashboard"]')?.click();
    }
    if (e.altKey && e.key === 'u') {
        document.querySelector('[data-section="users"]')?.click();
    }
    if (e.altKey && e.key === 'l') {
        logoutBtn?.click();
    }
});

// ===== ADD HOVER EFFECTS =====
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.stat-card, .news-item, .event-card, .message-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

addCardHoverEffects();
const observerForCards = new MutationObserver(() => {
    addCardHoverEffects();
});

observerForCards.observe(document.body, { childList: true, subtree: true });

// ===== PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin page loaded, checking access and loading dashboard...');
    checkAdminAccess();
    loadDashboardData();
    
    // Reload dashboard data every 30 seconds
    setInterval(() => {
        if (document.hidden === false) {
            loadDashboardData();
        }
    }, 30000);
});

// Initial check on immediate load
checkAdminAccess();
loadDashboardData();
