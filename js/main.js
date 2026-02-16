// ===== SMOOTH SCROLL TO PAGES =====\nconst setupSmoothPageNavigation = () => {\n    const contactLinks = document.querySelectorAll('.smooth-contact');\n    \n    contactLinks.forEach(link => {\n        link.addEventListener('click', (e) => {\n            // First fade out\n            document.body.style.opacity = '0';\n            document.body.style.transition = 'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';\n            \n            setTimeout(() => {\n                window.location.href = link.getAttribute('href');\n            }, 500);\n        });\n    });\n};\n\n// ===== PAGE LOAD & TRANSITION EFFECTS =====
const setupPageTransitions = () => {
    // Fade in page on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);
    
    // Smooth transition when clicking links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only add transition for same-domain navigation (exclude external links)
            if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                // Check if it's not an anchor link
                if (!href.startsWith('#')) {
                    e.preventDefault();
                    
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                }
            }
        });
    });
};

// ===== UTILITIES =====
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in-section, .card, .spotlight-item, .testimonial, .gallery-item, .feature-item');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for child items in sections
                const delay = index * 0.1;
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(el => {
        observer.observe(el);
    });
};

// ===== SMOOTH SCROLL ANCHOR LINKS =====
const smoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// ===== MODERN NAVBAR WITH AUTO TEXT COLOR =====
const setupModernNavbar = () => {
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    
    if (!header) return;
    
    const updateNavbarStyle = () => {
        const scrollPosition = window.scrollY;
        
        // Determine if we're in the hero section (light background)
        const heroElement = document.querySelector('.hero');
        if (heroElement) {
            const heroBottom = heroElement.offsetTop + heroElement.offsetHeight;
            
            if (scrollPosition < heroBottom - 100) {
                // In hero section - use light text style
                header.classList.add('light-text');
                header.classList.remove('dark-nav');
                header.classList.add('light-nav');
            } else {
                // Below hero - use dark text style
                header.classList.remove('light-text');
                header.classList.add('dark-nav');
                header.classList.remove('light-nav');
            }
        }
        
        // Add subtle shadow when scrolled
        if (scrollPosition > 50) {
            header.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
        }
    };
    
    window.addEventListener('scroll', updateNavbarStyle);
    updateNavbarStyle(); // Call once on load
};\n\n// ===== MOBILE MENU TOGGLE =====\nconst setupMobileMenu = () => {\n    const hamburger = document.querySelector('.hamburger');\n    const navLinks = document.querySelector('.nav-links');\n    \n    if (hamburger && navLinks) {\n        hamburger.addEventListener('click', (e) => {\n            e.stopPropagation();\n            navLinks.classList.toggle('active');\n            hamburger.classList.toggle('active');\n        });\n        \n        // Close menu when link is clicked\n        navLinks.querySelectorAll('a').forEach(link => {\n            link.addEventListener('click', () => {\n                navLinks.classList.remove('active');\n                hamburger.classList.remove('active');\n            });\n        });\n        \n        // Close menu when clicking outside\n        document.addEventListener('click', (e) => {\n            if (!e.target.closest('header')) {\n                navLinks.classList.remove('active');\n                hamburger.classList.remove('active');\n            }\n        });\n    }\n};

// ===== ACTIVE NAVIGATION LINK =====
const setActiveNavLink = () => {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + 100;
        
        navLinks.forEach(link => {
            const sectionId = link.getAttribute('href');
            if (!sectionId || sectionId === '#') return;
            
            const section = document.querySelector(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
    updateActiveLink();
};

// ===== PARALLAX EFFECT =====
const parallaxEffect = () => {
    const parallaxElements = document.querySelectorAll('.hero, .parallax-section');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(el => {
            const scrollPosition = window.scrollY;
            const elementPosition = el.offsetTop;
            const elementHeight = el.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Only apply parallax when element is in or near viewport
            if (scrollPosition < elementPosition + elementHeight && scrollPosition + viewportHeight > elementPosition) {
                const distance = scrollPosition - elementPosition;
                el.style.backgroundPosition = `center ${distance * 0.6}px`;
            }
        });
    });
};

// ===== COUNTER ANIMATION =====
const animateCounters = () => {
    const counters = document.querySelectorAll('[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 20;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 30);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
};

// ===== MODAL FUNCTIONALITY =====
const setupModal = () => {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('active');
        });
    });
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
};

// ===== FORM HANDLING =====
const setupFormHandling = () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic form validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Show success message
                const formContainer = form.closest('.form-container') || form.parentElement;
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.style.cssText = `
                    background: #d4edda;
                    color: #155724;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    animation: slideInUp 0.3s ease-out;
                `;
                successMsg.textContent = 'Thank you! Your submission has been received.';
                
                form.insertAdjacentElement('afterend', successMsg);
                form.style.display = 'none';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successMsg.remove();
                }, 3000);
            }
        });
    });
};

// ===== PROGRESS BAR ANIMATION =====
const animateProgressBars = () => {
    const progressBars = document.querySelectorAll('[data-progress]');
    
    progressBars.forEach(bar => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const targetWidth = bar.getAttribute('data-progress');
                bar.style.transition = 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                bar.style.width = targetWidth + '%';
                observer.unobserve(bar);
            }
        }, { threshold: 0.5 });
        
        observer.observe(bar);
    });
};

// ===== GALLERY ARROW NAVIGATION =====
const setupGalleryArrowNavigation = () => {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;
    
    const galleryArrow = gallerySection.querySelector('.section-arrow');
    const galleryGrid = gallerySection.querySelector('.gallery-grid');
    const galleryItems = Array.from(gallerySection.querySelectorAll('.gallery-item'));
    
    if (!galleryArrow || !galleryGrid || galleryItems.length === 0) return;
    
    let currentIndex = 0;
    let isScrolling = false;
    
    // Function to scroll gallery
    const scrollGallery = (direction) => {
        if (isScrolling) return;
        isScrolling = true;
        
        const itemWidth = galleryItems[0].offsetWidth;
        const gap = 24; // from CSS
        const totalScroll = itemWidth + gap;
        
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % galleryItems.length;
        } else {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        }
        
        const scrollAmount = currentIndex * totalScroll;
        
        galleryGrid.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        // Add highlight effect
        galleryItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.style.transform = 'scale(1.05)';
                item.style.opacity = '1';
            } else {
                item.style.transform = 'scale(1)';
                item.style.opacity = '0.8';
            }
        });
        
        setTimeout(() => {
            isScrolling = false;
        }, 600);
    };
    
    // Click arrow to navigate
    galleryArrow.addEventListener('click', () => {
        scrollGallery('next');
    });
    
    // Keyboard navigation (Arrow Right: next, Arrow Left: previous)
    document.addEventListener('keydown', (e) => {
        if (gallerySection.offsetParent === null) return; // Check if visible
        
        if (e.key === 'ArrowRight') {
            scrollGallery('next');
        } else if (e.key === 'ArrowLeft') {
            scrollGallery('prev');
        }
    });
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    galleryGrid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    const handleSwipe = () => {
        if (touchStartX - touchEndX > 50) {
            // Swiped left
            scrollGallery('next');
        }
        if (touchEndX - touchStartX > 50) {
            // Swiped right
            scrollGallery('prev');
        }
    };
};
const setupGalleryLightbox = () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imageSrc = item.querySelector('img')?.src || '';
            const imageAlt = item.querySelector('img')?.alt || 'Gallery Image';
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
                animation: fadeInUp 0.3s ease-out;
                backdrop-filter: blur(5px);
            `;
            
            const lightboxContent = document.createElement('div');
            lightboxContent.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
                animation: slideInUp 0.3s ease-out;
            `;
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = imageAlt;
            img.style.cssText = `
                max-width: 100%;
                max-height: 80vh;
                object-fit: cover;
                border-radius: 10px;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                font-size: 2rem;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            closeBtn.addEventListener('mouseover', () => {
                closeBtn.style.color = '#0074d9';
            });
            closeBtn.addEventListener('mouseout', () => {
                closeBtn.style.color = 'white';
            });
            closeBtn.addEventListener('click', () => {
                lightbox.remove();
            });
            
            lightboxContent.appendChild(img);
            lightboxContent.appendChild(closeBtn);
            lightbox.appendChild(lightboxContent);
            
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    lightbox.remove();
                }
            });
            
            document.body.appendChild(lightbox);
        });
    });
};

// ===== PAGE LOAD ANIMATION =====
const pageLoadAnimation = () => {
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.body.style.transition = 'all 0.6s ease-out';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
};

// ===== SCROLL PROGRESS BAR =====
const setupScrollProgress = () => {
    const progressBar = document.querySelector('.scroll-progress');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
};

// ===== NAVBAR SCROLL EFFECT =====
const setupNavbarScrollEffect = () => {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        
        if (scrollTop > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 61, 122, 0.2)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 61, 122, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
};

// ===== LAZY LOAD IMAGES =====
const setupLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// ===== TAB FUNCTIONALITY =====
const setupTabs = () => {
    const tabButtons = document.querySelectorAll('[data-tab-button]');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab-button');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.querySelector(`[data-tab-content="${tabName}"]`)?.classList.add('active');
        });
    });
};

// ===== ACCORDION FUNCTIONALITY =====
const setupAccordion = () => {
    const accordionButtons = document.querySelectorAll('[data-accordion-button]');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-accordion-button');
            const content = document.querySelector(`[data-accordion-content="${target}"]`);
            
            if (!content) return;
            
            const isActive = content.classList.contains('active');
            
            // Close all other accordions
            document.querySelectorAll('[data-accordion-content]').forEach(ac => {
                ac.classList.remove('active');
            });
            accordionButtons.forEach(btn => btn.classList.remove('active'));
            
            // Toggle current accordion
            if (!isActive) {
                content.classList.add('active');
                button.classList.add('active');
            }
        });
    });
};

// ===== DROPDOWN MENU =====
const setupDropdowns = () => {
    const dropdowns = document.querySelectorAll('[data-dropdown]');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('[data-dropdown-trigger]');
        const menu = dropdown.querySelector('[data-dropdown-menu]');
        
        if (trigger && menu) {
            trigger.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
            
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    menu.classList.remove('active');
                }
            });
        }
    });
};

// ===== PROJECT FILTER =====
const setupProjectFilters = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.style.animation = 'fadeInUp 0.6s ease-out backwards';
                        card.style.animationDelay = `${index * 0.1}s`;
                    }, 100);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
};

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', () => {
    setupPageTransitions();
    setupSmoothPageNavigation();
    setupModernNavbar();
    animateOnScroll();
    smoothScroll();
    setupMobileMenu();
    setActiveNavLink();
    parallaxEffect();
    animateCounters();
    setupModal();
    setupFormHandling();
    animateProgressBars();
    setupGalleryArrowNavigation();
    setupGalleryLightbox();
    setupScrollProgress();
    setupNavbarScrollEffect();
    setupLazyLoading();
    setupTabs();
    setupAccordion();
    setupDropdowns();
    setupProjectFilters();
});

// Re-animate sections when window is resized
window.addEventListener('resize', () => {
    animateOnScroll();
});

// Add smooth scroll behavior
if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}
