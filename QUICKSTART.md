# MHCS Alumni Website - Quick Start Guide

## 🚀 NEW! Modern Login & Admin Dashboard

Your MHCS Alumni portal now includes a **professional login system** and **complete admin dashboard**!

### 🎯 Quick Access Links

#### For Users (Public Pages)
1. **Homepage**: `index.html` → Click "Sign In" button to access login
2. **Login Page**: `login.html`
3. **Create Account**: Click "Create New Account" on login page
4. **Other Pages**: About, Programs, Directory, News, Gallery, etc.

#### For Admins (Admin Dashboard)
1. **Login**: Access `login.html`
2. **Demo Login**: 
   - Email/Username: `admin@mhcs.edu.ph` (or any username)
   - Password: `correct`
3. **Admin Dashboard**: `admin.html` (automatically redirected after login)

---

## 🎨 What's New

### ✨ Modern Login Page
- Professional gradient design (purple to blue)
- Email/Username input flexibility
- Password visibility toggle (eye icon)
- "Create Account" link
- "Forgot Password?" link (appears only when password is wrong)
- Smooth animations and transitions
- Fully mobile responsive

### 👨‍💼 Complete Admin Dashboard
- **Dashboard**: View statistics, recent activity, and quick actions
- **User Management**: Add, edit, delete users
- **News & Updates**: Create and manage posts
- **Events & Reunions**: Organize events
- **Gallery**: Upload and manage photos
- **Donations**: Track all donations
- **Messages**: View and reply to contact forms
- **Settings**: Configure admin account and site settings

---

## 🔐 Getting Started

### Step 1: Access the login page
Navigate to: `http://localhost/UPHSD%20edu.ph/MHCS-Alumni/login.html`

### Step 2: Test with Admin Credentials
```
Email/Username: MHCS_Alumni
Password: MHCS0010010
```

### Step 3: Explore the Admin Dashboard
After successful login, you'll see the admin dashboard with:
- Navigation sidebar with all admin features
- Statistics cards showing key metrics
- Quick action buttons
- Management sections for all content

### Step 4: Try Mobile View
Resize browser window to test responsive design on:
- **Desktop** (1920px+)
- **Laptop** (1024px)
- **Tablet** (768px)
- **Mobile** (480px)

## 📝 Essential Information to Add

Before going live, update these with actual content:

### 1. **Logo & Images**
- Place MHCS logo in `assets/` folder
- Update references in HTML files
- Add actual photos to gallery

### 2. **Contact Information**
- Update email addresses in `pages/contact.html`
- Add phone numbers
- Update office address and hours
- Add social media links

### 3. **Event Details**
- Update reunion dates in `pages/reunions.html`
- Add organizing committee names
- Update venue information
- Set registration deadlines

### 4. **Donation Information**
- Update bank account details in `pages/donate.html`
- Set correct project targets
- Add PayPal/payment processor info
- Update GCash number

### 5. **Alumni Information**
- Add batch representatives in `pages/directory.html`
- Update chapter contact information
- Add featured alumni profiles
- Update statistics

### 6. **Content**
- Update mission and vision in `pages/about.html`
- Add rector/principal message
- Update programs details in `pages/programs.html`
- Add Facebook group/page links

## 🎨 Customization Tips

### Change Colors
Edit `css/styles.css` - Look for the `:root` section:
```css
--primary-blue: #003d7a;      /* Change these values */
--accent-blue: #0074d9;
```

### Update Text Content
Each HTML file contains the page content. Simply edit the text in any HTML file and save.

### Add New Sections
Copy an existing card/section HTML structure and modify it. The CSS will automatically apply the styles.

### Modify Animations
Edit animation timing in `css/styles.css`:
- Change duration: `0.8s` to `1s` or `0.5s`
- Change timing: `ease-out` to `linear` or `ease-in-out`

## 📱 Browser Testing

Test on different browsers:
- ✓ Chrome/Chromium
- ✓ Firefox
- ✓ Safari
- ✓ Edge
- ✓ Mobile browsers

## 🔗 Important Links in the Website

Update these in the footer and throughout:
- Facebook Page: `https://www.facebook.com/[your-page]`
- Twitter/X: `https://www.twitter.com/[your-handle]`
- Instagram: `https://www.instagram.com/[your-handle]`
- YouTube: `https://www.youtube.com/[your-channel]`

## 📧 Form Handling

Currently forms show success messages. To actually process submissions:

1. **Contact Form** (`pages/contact.html`):
   - Integrate with email service (Formspree, EmailJS, or backend)
   - Add CSRF protection
   - Validate server-side

2. **Donation Form** (`pages/donate.html`):
   - Integrate with payment processor (Stripe, PayPal)
   - Implement secure payment handling
   - Track donation receipts

3. **Directory Forms** (`pages/directory.html`):
   - Connect to database for alumni records
   - Implement authentication
   - Add profile management features

4. **Event Registration** (`pages/reunions.html`):
   - Connect to event management system
   - Send confirmation emails
   - Track attendance

## 🔒 Security Recommendations

Before going live:
1. Install SSL certificate (HTTPS)
2. Implement form validation and sanitization
3. Add CSRF tokens to all forms
4. Rate limit form submissions
5. Backup database regularly
6. Monitor for spam submissions
7. Update contact info securely

## 📊 Analytics Setup

Consider adding:
- Google Analytics for traffic tracking
- Form submission tracking
- User behavior analysis
- Page performance monitoring

## 🎯 Next Steps

1. **Gather Content**
   - Collect photos (8-15 high quality images)
   - Write mission/vision statements
   - Get alumni stories and achievements
   - Gather event details

2. **Update Information**
   - Add all email addresses
   - Update phone numbers
   - Set correct links
   - Add social media

3. **Test Everything**
   - Test all links and forms
   - Check mobile responsiveness
   - Verify animations smooth
   - Test browser compatibility

4. **Deploy**
   - Set up hosting (if not using XAMPP)
   - Configure domain name
   - Install SSL certificate
   - Set up email system

5. **Launch & Promote**
   - Announce launch to alumni
   - Share on social media
   - Send newsletter with link
   - Update existing communications

## 🆘 Troubleshooting

### Animations Not Showing
- Check if JavaScript is enabled
- Verify `js/main.js` is loaded
- Check browser console for errors

### CSS Not Applied
- Clear browser cache (Ctrl+Shift+Delete)
- Verify `css/styles.css` is linked correctly
- Check file paths are correct

### Forms Not Working
- Check console for JavaScript errors
- Verify form validation rules
- Ensure form handler is configured

### Images Not Showing
- Verify image paths are correct
- Check file permissions
- Test image file format

## 📚 File Reference

```
index.html              → Home page (Alumni Hub)
pages/
  ├─ directory.html    → Alumni Directory
  ├─ reunions.html     → Reunions & Events
  ├─ donate.html       → Giving & Donations
  ├─ gallery.html      → Photo Gallery
  ├─ news.html         → News & Updates
  ├─ about.html        → About MHCS
  ├─ programs.html     → Formation Programs
  ├─ admissions.html   → Admissions Info
  └─ contact.html      → Contact & Support
css/
  └─ styles.css        → All styling & animations
js/
  └─ main.js           → All interactivity
assets/                 → Images & media files
README.md              → Full documentation
```

## 💡 Pro Tips

1. **Use Real Photos**: Replace placeholder colored divs with actual images
2. **Keep Content Fresh**: Regularly update news and events
3. **Engage Alumni**: Feature alumni stories and achievements
4. **Mobile First**: Always test on mobile devices
5. **Fast Loading**: Optimize images before uploading
6. **Secure Forms**: Always validate and sanitize user input
7. **Backup Regularly**: Keep backups of important data
8. **Monitor Analytics**: Track what content alumni engage with

## 📞 Support Resources

- W3Schools: `https://www.w3schools.com/`
- MDN Web Docs: `https://developer.mozilla.org/`
- CSS-Tricks: `https://css-tricks.com/`
- Stack Overflow: `https://stackoverflow.com/`

---

**Website Status**: ✅ Ready for Customization
**Last Updated**: February 2026
**Version**: 1.0

Enjoy your new MHCS Alumni website! 🎓
