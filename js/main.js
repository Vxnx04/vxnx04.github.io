// Modern JavaScript with error handling and performance optimizations

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Loading screen animation
document.addEventListener('DOMContentLoaded', () => {
    try {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('fade-out');
                // Remove from DOM after animation
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            }, 500);
        }
    } catch (error) {
        console.error('Error in loading screen animation:', error);
    }
});

// Mobile sidebar toggle with improved accessibility
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        try {
            const isExpanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
            sidebar.classList.toggle('active');
            sidebarToggle.setAttribute('aria-expanded', !isExpanded);
        } catch (error) {
            console.error('Error in sidebar toggle:', error);
        }
    });
}

// Smooth scrolling with improved performance
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        try {
            e.preventDefault();
            
            // Close mobile sidebar if open
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                sidebarToggle.setAttribute('aria-expanded', 'false');
            }
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Use requestAnimationFrame for smooth animation
                requestAnimationFrame(() => {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            }
        } catch (error) {
            console.error('Error in smooth scrolling:', error);
        }
    });
});

// Back to top button with improved performance
const backToTop = document.getElementById('backToTop');
let scrollTimeout;

if (backToTop) {
    window.addEventListener('scroll', () => {
        try {
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Set new timeout
            scrollTimeout = setTimeout(() => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }, 100); // Debounce scroll events
        } catch (error) {
            console.error('Error in back to top button:', error);
        }
    });

    backToTop.addEventListener('click', (e) => {
        try {
            e.preventDefault();
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        } catch (error) {
            console.error('Error in back to top click:', error);
        }
    });
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    try {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            // No need to do anything as the browser handles it
        } else {
            // Fallback for browsers that don't support lazy loading
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Force image to load
                        img.src = img.src;
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    } catch (error) {
        console.error('Error in lazy loading:', error);
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    try {
        // Skip to main content
        if (e.key === 's' && e.ctrlKey) {
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.focus();
            }
        }
        
        // Close sidebar with Escape key
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            sidebarToggle.setAttribute('aria-expanded', 'false');
        }
    } catch (error) {
        console.error('Error in keyboard navigation:', error);
    }
});

// Add error boundary for dynamic content
window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
    // You can add custom error handling here
});

// Add performance monitoring
if (window.performance) {
    window.addEventListener('load', () => {
        try {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        } catch (error) {
            console.error('Error in performance monitoring:', error);
        }
    });
}

// Add offline detection
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    console.log('You are now online');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    console.log('You are now offline');
});
