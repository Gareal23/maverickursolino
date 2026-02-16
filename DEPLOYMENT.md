# MHCS Alumni Website - Deployment Guide

## 🚀 Deployment & Launch Instructions

This guide provides step-by-step instructions for deploying the MHCS Alumni website to production.

---

## Phase 1: Pre-Deployment Preparation (1-2 weeks)

### 1.1 Content Review & Updates

**Critical Information to Update:**
- [ ] Organization name & logo
- [ ] Address and contact details
- [ ] Email addresses (currently test@mhcsalumni.org)
- [ ] Phone numbers and office hours
- [ ] Social media URLs
- [ ] Faculty/staff photos and bios
- [ ] Historic photos and gallery items
- [ ] Alumni testimonials and spotlights
- [ ] Event dates and details
- [ ] Donation project information

### 1.2 Image Preparation

**Required Images:**
```
assets/
├── logo.png (200x60px or 300x90px)
├── favicon.ico
├── og-image.jpg (1200x630px for social media)
├── hero-bg.jpg (1920x1080px or larger)
├── gallery/ (12+ images, min 800x600px)
├── alumni/ (5+ profile photos)
├── events/ (3+ event photos)
└── facilities/ (5+ campus photos)
```

**Image Optimization:**
```bash
# Using ImageMagick (if available)
convert gallery.jpg -quality 85 -resize 1920x1440 optimized.jpg

# Recommended tools:
# - TinyPNG/TinyJPG (online)
# - ImageOptim (macOS)
# - FileOptimizer (Windows)
```

### 1.3 Testing Checklist

**Browser Compatibility:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Feature Testing:**
- [ ] All navigation links work
- [ ] Forms submit without errors
- [ ] Images load correctly
- [ ] Animations play smoothly
- [ ] Responsive design on all devices
- [ ] Print preview looks good
- [ ] Page load speeds are acceptable

**Performance Testing:**
```
Acceptable speeds:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
```

### 1.4 Security Review

- [ ] Remove test/demo content
- [ ] Verify no hardcoded passwords
- [ ] Check for sensitive information exposure
- [ ] Review form validation
- [ ] Check HTTPS requirements
- [ ] Update security headers

---

## Phase 2: Domain & Hosting Setup (1 week)

### 2.1 Domain Registration

1. **Choose domain registrar:**
   - GoDaddy
   - Namecheap
   - Domain.com
   - No-IP (free options)

2. **Register domain:**
   ```
   Examples: mhcsalumni.org, mhcs-alumni.com
   Cost: $10-15/year
   ```

3. **DNS Configuration:**
   - Point nameservers to hosting provider
   - Set A record to hosting IP
   - Set up www CNAME record

### 2.2 Hosting Selection

**Options suitable for this website:**

**Option A: Shared Hosting (Recommended for cost)**
```
Providers: Bluehost, SiteGround, Hostinger, HostGator
Cost: $5-15/month
Space: 50GB+
Bandwidth: Unlimited
Includes: Free SSL, Email hosting
Setup: Upload files via FTP/cPanel
```

**Option B: Cloud Hosting (Recommended for scalability)**
```
Providers: AWS, Google Cloud, Azure, DigitalOcean
Cost: $5-20/month
Space: As needed
Bandwidth: Pay-per-use
Setup: Via cloud console/CLI
```

**Option C: Static Site Hosting (Recommended for simplicity)**
```
Providers: Netlify, Vercel, GitHub Pages
Cost: Free-$10/month
Setup: GitHub integration or drag-and-drop
Deploy: Automatic on push
```

### 2.3 Installation

**For Shared Hosting (cPanel):**
```
1. Log into cPanel
2. Click "File Manager"
3. Navigate to public_html
4. Upload files (or use Git)
5. Ensure index.html is in root
6. Create assets/ and pages/ folders
7. Upload all directories
```

**For Cloud Hosting (DigitalOcean example):**
```bash
# Connect via SSH
ssh root@your_server_ip

# Navigate to web root
cd /var/www/html

# Clone or upload files
git clone https://github.com/your-repo.git .

# Set permissions
chmod -R 755 /var/www/html
chown -R www-data:www-data /var/www/html
```

**For Static Hosting (Netlify):**
```
1. Create Netlify account
2. Connect GitHub repository
3. Set build command: (none - leave empty)
4. Set publish directory: mhcs-alumni
5. Click Deploy
6. Configure domain in Domain Settings
```

### 2.4 SSL Certificate Setup

**For Shared Hosting:**
- Most providers include free Let's Encrypt SSL
- Enable via cPanel → AutoSSL
- Force HTTPS via .htaccess

**For Cloud Hosting:**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

**Update HTML:**
```html
<!-- Force HTTPS redirect -->
<meta http-equiv="refresh" content="0; url=https://yourdomain.com">
</head>
```

---

## Phase 3: Backend Integration (1-2 weeks)

### 3.1 Form Submission Handler

**Option A: Formspree (Simple, Free)**

Add to form:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <button type="submit">Send</button>
</form>
```

Advantages: No backend needed, emails sent directly

**Option B: EmailJS (JavaScript-based)**

Add script to `<head>`:
```html
<script type="text/javascript"
    src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/index.min.js">
</script>
<script type="text/javascript">
    emailjs.init('YOUR_PUBLIC_KEY');
</script>
```

Update form:
```javascript
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    emailjs.sendForm('mail_service', 'template_id', this);
});
```

**Option C: Backend Service (Comprehensive)**

Create Node.js endpoint:
```javascript
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    await transporter.sendMail({
        from: email,
        to: process.env.ADMIN_EMAIL,
        subject: `New message from ${name}`,
        text: message
    });
    
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server running...'));
```

Update form in JavaScript:
```javascript
async function submitForm(formData) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    return response.json();
}
```

### 3.2 Donation Processing

**Stripe Integration:**

```html
<script src="https://js.stripe.com/v3/"></script>

<form id="donation-form">
    <input type="number" id="amount" placeholder="Amount in PHP" required>
    <div id="card-element"></div>
    <button type="submit">Donate Now</button>
</form>

<script>
    const stripe = Stripe('pk_live_YOUR_PUBLISHABLE_KEY');
    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element');
    
    document.getElementById('donation-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const { token } = await stripe.createToken(cardElement);
        
        fetch('/charge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: document.getElementById('amount').value,
                token: token.id
            })
        });
    });
</script>
```

**PayPal Integration:**

```html
<div id="paypal-button-container"></div>

<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>
<script>
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: '10.00' }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed: ' + details.id);
            });
        }
    }).render('#paypal-button-container');
</script>
```

### 3.3 Alumni Directory Database

**Option A: Firebase (Free tier available)**

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
    apiKey: "YOUR_API_KEY",
    projectId: "YOUR_PROJECT_ID",
    // ... other config
});

const db = getFirestore(firebaseApp);

// Add alumni
db.collection("alumni").add({
    name: "John Doe",
    batch: 2015,
    profession: "Engineer",
    email: "john@example.com",
    photo: "url"
});

// Query alumni
db.collection("alumni")
    .where("batch", "==", 2015)
    .get()
    .then(snapshot => {
        snapshot.forEach(doc => console.log(doc.data()));
    });
```

**Option B: MongoDB Atlas (Free tier available)**

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://user:pass@cluster.mongodb.net/alumni');

const alumniSchema = new mongoose.Schema({
    name: String,
    batch: Number,
    profession: String,
    email: String,
    photo: String
});

const Alumni = mongoose.model('Alumni', alumniSchema);

// Add
await Alumni.create({ name: "John", batch: 2015 });

// Find
await Alumni.find({ batch: 2015 });
```

### 3.4 Event Registration System

**Option A: Google Forms Integration**

```html
<iframe src="https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform" 
        width="100%" height="500" frameborder="0" marginheight="0" marginwidth="0">
    Loading form...
</iframe>
```

**Option B: Custom Database**

```javascript
// Add registration
db.collection("registrations").add({
    eventId: "reunion_2024",
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    registrationDate: new Date()
});

// List attendees
db.collection("registrations")
    .where("eventId", "==", "reunion_2024")
    .get()
    .then(snapshot => {
        const attendees = snapshot.docs.map(doc => doc.data());
        console.log(`${attendees.length} registered`);
    });
```

---

## Phase 4: Optimization & Performance (1 week)

### 4.1 CSS Minification

**Using online tools:**
1. Visit cssnano.co
2. Paste css/styles.css content
3. Download minified version
4. Replace original or create styles.min.css

**Using npm:**
```bash
npm install -g csso-cli
csso styles.css -o styles.min.css
```

Update HTML:
```html
<link rel="stylesheet" href="css/styles.min.css">
```

### 4.2 JavaScript Minification

**Using online tools:**
1. Visit minify-js.com
2. Paste js/main.js content
3. Download minified version
4. Use in production

**Using npm:**
```bash
npm install -g terser
terser main.js -o main.min.js
```

### 4.3 Image Optimization

**Batch processing (Windows PowerShell):**
```powershell
# Requires ImageMagick installed
$images = Get-ChildItem assets/*.jpg

foreach ($image in $images) {
    & magick "$image" -quality 85 -resize 1920x1440 "optimized_$($image.Name)"
}
```

**Online batch tools:**
- Bulk Resize Photos
- Online-Convert
- TinyPNG Batch

### 4.4 Performance Testing

**Google PageSpeed Insights:**
1. Visit pagespeed.web.dev
2. Enter your domain
3. Analyze performance
4. Follow recommendations

**Lighthouse (Chrome DevTools):**
1. Open DevTools (F12)
2. Click Lighthouse
3. Generate report
4. Target: 90+ score

**GTmetrix:**
1. Visit gtmetrix.com
2. Run analysis
3. Compare metrics over time

---

## Phase 5: Monitoring & Maintenance (Ongoing)

### 5.1 Error Monitoring

**Setup Google Analytics:**

Add to `<head>` in each HTML file:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
</script>
```

**Setup error tracking:**
```javascript
// Send errors to monitoring service
window.addEventListener('error', (event) => {
    fetch('/api/log-error', {
        method: 'POST',
        body: JSON.stringify({
            message: event.message,
            stack: event.error.stack,
            url: window.location.href,
            timestamp: new Date()
        })
    });
});
```

### 5.2 Backup Strategy

**Automated backups:**
- Daily automatic backups (most hosts offer)
- Weekly manual download
- Monthly offsite storage

**File structure to backup:**
```
/mhcs-alumni/
├── index.html
├── css/
├── js/
├── assets/
└── pages/
```

**Database backup (if applicable):**
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/alumni" -o ./backup

# MySQL backup
mysqldump -u user -p database > backup.sql
```

### 5.3 Security Maintenance

**Monthly tasks:**
- [ ] Check for outdated dependencies
- [ ] Review access logs
- [ ] Update SSL certificate (automatic)
- [ ] Test form security
- [ ] Verify backups work

**Security headers (.htaccess for Apache):**
```apache
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

### 5.4 Content Updates

**Quarterly:**
- [ ] Update news/announcements
- [ ] Refresh gallery photos
- [ ] Update alumni spotlights
- [ ] Revise event information
- [ ] Check all external links

**Annually:**
- [ ] Full site audit
- [ ] Performance review
- [ ] Security assessment
- [ ] Content refresh
- [ ] Design updates if needed

---

## Troubleshooting Deployment Issues

### Issue: "404 Not Found" on pages

**Solution:**
- Ensure index.html is in root directory
- Confirm pages/ folder is uploaded
- Check .htaccess for rewriting rules
- Verify file paths use correct case (Linux is case-sensitive)

### Issue: "Mixed Content" warning (HTTPS/HTTP mix)

**Solution:**
```html
<!-- Add to <head> -->
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

Or update all image/script URLs to use HTTPS.

### Issue: Animations not working

**Solution:**
- Check browser console for JavaScript errors (F12)
- Verify CSS file is loaded (check Network tab)
- Clear browser cache (Ctrl+Shift+Delete)
- Test on different browser

### Issue: Forms not submitting

**Solution:**
- Check backend endpoint is accessible
- Verify form field names match backend
- Check browser console for errors
- Test with hardcoded test data
- Verify CORS if cross-origin

### Issue: Images not loading

**Solution:**
- Verify image file paths
- Check image file permissions (644 recommended)
- Ensure image formats supported (JPG, PNG, WebP)
- Optimize file sizes
- Use absolute paths with domain

---

## Post-Launch Checklist

- [ ] Domain resolves to website
- [ ] SSL certificate shows green lock
- [ ] All pages load without errors
- [ ] Forms work and submit correctly
- [ ] Mobile view is responsive
- [ ] Images display correctly
- [ ] Animations are smooth
- [ ] Navigation links all work
- [ ] Footer information is accurate
- [ ] Google Analytics tracking works
- [ ] Search engines can crawl (robots.txt)
- [ ] Sitemap submitted to Google Search Console

---

## Support & Documentation

**Keep these documents updated:**
1. README.md (project overview)
2. CONFIG.md (customization)
3. This deployment guide

**Contact information for help:**
- Host support team (for server issues)
- Domain registrar (for DNS issues)
- Development team (for code issues)

---

**Last Updated**: February 2026
**Deployment Status**: Ready for Production
**Maintenance Cycle**: Quarterly reviews, monthly security checks

For live support, contact your hosting provider or development team.
