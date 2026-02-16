# MHCS Alumni Website - Configuration Guide

## 🔧 Configuration & Customization

This guide covers detailed configuration options and customization opportunities for the MHCS Alumni website.

---

## 1. CSS COLOR CUSTOMIZATION

### Primary Colors
Edit the `:root` section in `css/styles.css`:

```css
:root {
    --primary-blue: #003d7a;        /* Main dark blue */
    --light-blue: #0056b3;          /* Secondary blue */
    --accent-blue: #0074d9;         /* Bright accent */
    --sky-blue: #87ceeb;            /* Light sky blue */
    --light-accent: #e7f0ff;        /* Very light background */
    --dark-bg: #0f172a;             /* Dark background */
    --white: #ffffff;               /* Pure white */
    --gray-100: #f8f9fa;            /* Light gray */
    --gray-200: #e9ecef;            /* Medium gray */
    --gray-dark: #2c3e50;           /* Dark gray */
}
```

### Alternative Color Schemes

**Green Theme**:
```css
--primary-blue: #1b5e20;
--light-blue: #2e7d32;
--accent-blue: #43a047;
--sky-blue: #81c784;
```

**Purple Theme**:
```css
--primary-blue: #4a148c;
--light-blue: #6a1b9a;
--accent-blue: #7b1fa2;
--sky-blue: #9c27b0;
```

**Red/Corporate Theme**:
```css
--primary-blue: #b71c1c;
--light-blue: #c62828;
--accent-blue: #d32f2f;
--sky-blue: #e53935;
```

---

## 2. ANIMATION CUSTOMIZATION

### Base Animation Speed
All animations use CSS variables. To globally change speed:

```css
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

Options:
- Slow: `0.8s` (for dramatic effect)
- Medium: `0.3s` - `0.5s` (recommended)
- Fast: `0.1s` - `0.2s` (snappy feel)

### Animation Effects

**Fade In (entrance)**:
```css
animation: fadeInUp 1s ease-out;
```

Available entrance animations:
- `fadeInUp` - Fade in from bottom
- `fadeInDown` - Fade in from top
- `slideInLeft` - Slide from left
- `slideInRight` - Slide from right

**Timing Functions**:
- `ease-out` - Slow start, fast end
- `ease-in-out` - Smooth both ends
- `linear` - Constant speed
- `ease` - Default natural feeling

### Parallax Speed
Adjust parallax effect speed in `js/main.js`:
```javascript
el.style.backgroundPosition = `center ${distance * 0.5}px`;
// Change 0.5 to adjust speed (0.3 = slower, 0.7 = faster)
```

---

## 3. HTML STRUCTURE CUSTOMIZATION

### Adding New Sections

**Basic Card Section**:
```html
<section class="white-bg">
    <div class="container">
        <div class="section-title">
            <h2>Your Title Here</h2>
            <p>Subtitle/description</p>
        </div>
        <div class="grid">
            <div class="card fade-in-section">
                <!-- Content here -->
            </div>
        </div>
    </div>
</section>
```

**Grid Layouts**:
- `.grid` - Auto-responsive (3 columns)
- `.grid-3` - Forces 3 columns
- `.grid-2` - Forces 2 columns
- Custom: `grid-template-columns`

### Component Classes

**Cards**:
```html
<div class="card">
    <h3 class="card-title">Title</h3>
    <p class="card-text">Content</p>
    <a href="#" class="card-link">Link →</a>
</div>
```

**Buttons**:
```html
<a href="#" class="btn btn-primary">Primary</a>
<a href="#" class="btn btn-secondary">Secondary</a>
<a href="#" class="btn btn-outline">Outline</a>
```

**Forms**:
```html
<form>
    <div class="form-group">
        <label for="field">Label</label>
        <input type="text" id="field" required>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

---

## 4. RESPONSIVE BREAKPOINTS

Current breakpoints in `css/styles.css`:

```css
@media (max-width: 768px) {
    /* Tablet and below */
}

@media (max-width: 480px) {
    /* Mobile devices */
}
```

### Adding Custom Breakpoints

```css
/* Large desktop */
@media (min-width: 1400px) {
    section { padding: 8rem 2rem; }
}

/* Small tablet */
@media (max-width: 600px) {
    .hero-content h1 { font-size: 1.5rem; }
}
```

---

## 5. TYPOGRAPHY CUSTOMIZATION

### Font Stack
Currently using system fonts:
```css
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
```

### Google Fonts Integration

Add to `<head>` in HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

Update CSS:
```css
body {
    font-family: 'Inter', sans-serif;
}

h1, h2, h3 {
    font-family: 'Playfair Display', serif;
}
```

### Font Sizing Scale

```css
/* Recommended sizing */
h1 { font-size: 2.5rem - 4rem; }    /* Page titles */
h2 { font-size: 2rem - 2.8rem; }    /* Section titles */
h3 { font-size: 1.3rem - 1.8rem; }  /* Card titles */
p  { font-size: 0.95rem - 1.1rem; } /* Body text */
```

---

## 6. SPACING & LAYOUT

### Container Width
```css
.container {
    max-width: 1400px;              /* Adjust as needed */
    margin: 0 auto;
    padding: 0 2rem;
}
```

### Padding Scale
```css
:root {
    --spacing-1: 0.5rem;   /* 8px */
    --spacing-2: 1rem;     /* 16px */
    --spacing-3: 1.5rem;   /* 24px */
    --spacing-4: 2rem;     /* 32px */
    --spacing-5: 3rem;     /* 48px */
}
```

### Gap Between Items
```css
.grid {
    gap: 2rem;              /* Change spacing */
}
```

---

## 7. SHADOW CUSTOMIZATION

### Shadow Depth Levels

```css
--shadow-sm: 0 2px 8px rgba(0, 61, 122, 0.1);
--shadow-md: 0 8px 24px rgba(0, 61, 122, 0.15);
--shadow-lg: 0 16px 48px rgba(0, 61, 122, 0.2);
```

### Custom Shadow

```css
box-shadow: 0 4px 20px rgba(0, 61, 122, 0.3);
           /* X  Y  Blur  Spread Color */
```

---

## 8. BORDER RADIUS CUSTOMIZATION

```css
/* Rounded corners */
border-radius: 15px;        /* Cards */
border-radius: 50%;         /* Circular elements */
border-radius: 10px 10px 0 0;   /* Top corners only */
```

### Global Border Radius

Add to `:root`:
```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 15px;
--radius-xl: 20px;
```

---

## 9. BANNER & HERO CUSTOMIZATION

### Change Hero Height
```css
.hero {
    min-height: 100vh;      /* Full viewport */
    /* or */
    min-height: 80vh;       /* 80% of viewport */
    /* or */
    min-height: 600px;      /* Fixed height */
}
```

### Add Background Image
```css
.hero {
    background: linear-gradient(135deg, var(--primary-blue) 0%, var(--light-blue) 100%),
                url('../assets/banner.jpg');
    background-size: cover;
    background-position: center;
    background-blend-mode: overlay;
}
```

---

## 10. FORM CUSTOMIZATION

### Input Styling

```css
input, textarea, select {
    padding: 0.9rem 1rem;
    border: 2px solid var(--gray-200);
    border-radius: 10px;
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(0, 116, 217, 0.1);
}
```

### Custom Error Styling

Add to form validation:
```css
input:invalid {
    border-color: #dc3545;
    background: rgba(220, 53, 69, 0.05);
}

.error-message {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 0.25rem;
}
```

---

## 11. NAVIGATION CUSTOMIZATION

### Sticky Header

Already implemented in `header` - adjust height:
```css
header {
    padding: 1rem 2rem;     /* Change padding */
    top: 0;                 /* Stick to top */
}
```

### Nav Link Underline

Currently uses bottom border. Change to:
```css
.nav-links a::after {
    content: '';
    width: 0;
    height: 3px;            /* Thickness */
    background: linear-gradient(...);
}
```

### Active Link Color

```css
.nav-links a.active {
    color: var(--primary-blue);
}

.nav-links a.active::after {
    width: 100%;
}
```

---

## 12. GLASSMORPHISM CUSTOMIZATION

### Adjust Blur Effect

```css
.card {
    backdrop-filter: blur(10px);    /* Change to blur(20px) for more */
    background: rgba(255, 255, 255, 0.7);  /* Opacity: 0.5-0.9 */
    border: 1px solid rgba(255, 255, 255, 0.2);
}
```

### Frosted Glass Intensity

```css
/* More transparent */
background: rgba(255, 255, 255, 0.5);

/* More opaque */
background: rgba(255, 255, 255, 0.9);

/* Tinted glass */
background: rgba(100, 150, 200, 0.7);
```

---

## 13. GALLERY CUSTOMIZATION

### Grid Columns

```css
.gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    /* Change 250px for wider (300px) or narrower (200px) items */
}
```

### Image Aspect Ratio

```css
.gallery-item {
    aspect-ratio: 1;    /* 1:1 square */
    /* or */
    aspect-ratio: 16/9; /* Widescreen */
    /* or */
    aspect-ratio: 4/3;  /* Standard */
}
```

---

## 14. JavaScript CONFIGURATION

### Scroll Animation Threshold

In `js/main.js`:
```javascript
const observerOptions = {
    threshold: 0.1,             /* When 10% visible, trigger animation */
    rootMargin: '0px 0px -50px 0px'
};
```

### Disable Specific Features

Comment out in `document.addEventListener`:
```javascript
// animateOnScroll();         // Disable scroll animations
// parallaxEffect();          // Disable parallax
// animateCounters();         // Disable counters
```

---

## 15. SEO OPTIMIZATION

### Update Meta Tags

In each HTML file `<head>`:
```html
<meta name="description" content="Your seminary description">
<meta name="keywords" content="MHCS, seminary, alumni, reunions">
<meta name="author" content="Your Name">
<meta property="og:title" content="MHCS Alumni">
<meta property="og:description" content="Description">
<meta property="og:image" content="image.jpg">
```

### Add Schema Markup

```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Mary Help of Christians Seminary",
    "url": "https://yourdomain.com",
    "logo": "logo.png"
}
</script>
```

---

## 16. PERFORMANCE OPTIMIZATION

### Image Optimization

```html
<!-- Original -->
<img src="image.jpg" alt="Description">

<!-- Optimized -->
<img src="image.jpg" 
     alt="Description"
     loading="lazy"
     width="800"
     height="600">
```

### CSS Optimization

- Remove unused CSS
- Minify before production
- Use CSS variables for efficiency
- Group similar rules

### JavaScript Optimization

- Minify JavaScript before production
- Lazy load images
- Defer non-critical scripts
- Use async for analytics

---

## 17. ACCESSIBILITY IMPROVEMENTS

### Add ARIA Labels

```html
<button aria-label="Open navigation menu">☰</button>
<form aria-label="Contact form">
    <input aria-label="Your email">
</form>
```

### Color Contrast

Ensure text meets WCAG standards (4.5:1 for normal text).

### Keyboard Navigation

Forms and buttons are already keyboard accessible.

---

## Problem Solving

### Common Issues & Solutions

**Colors not changing?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file is linked
- Verify CSS syntax

**Animations feel sluggish?**
- Reduce animation duration
- Check GPU acceleration
- Reduce animation complexity

**Forms not submitting?**
- Check console for errors
- Verify form validation
- Check required fields filled

**Responsive design broken?**
- Test in actual browser, not just resize
- Check media query breakpoints
- Verify container widths

---

## File Organization Best Practices

```
mhcs-alumni/
├── index.html           # Main entry point
├── css/
│   ├── styles.css       # All styles
│   ├── responsive.css   # (Optional) Separate responsive
│   └── print.css        # (Optional) Print styles
├── js/
│   ├── main.js          # Main functionality
│   ├── utils.js         # (Optional) Helper functions
│   └── polyfills.js     # (Optional) Browser compatibility
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
└── pages/
    └── [all page files]
```

---

## Testing Checklist

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Test on mobile (iOS)
- [ ] Test on mobile (Android)
- [ ] Test forms
- [ ] Test links
- [ ] Check alt text on images
- [ ] Verify page load speed
- [ ] Check accessibility
- [ ] Test print view

---

## Production Deployment

1. Minify CSS and JavaScript
2. Optimize all images
3. Set up SSL/HTTPS
4. Configure CDN for assets
5. Enable gzip compression
6. Set proper cache headers
7. Implement security headers
8. Set up monitoring and backups

---

**Last Updated**: February 2026
**Version**: 1.0
**Status**: Production Ready

For questions or support, contact the development team.
