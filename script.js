// Performance Optimized JavaScript for SugarMute Presell Page
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        animationDuration: 300,
        scrollOffset: 100,
        lazyLoadThreshold: 0.1,
        debounceDelay: 250
    };

    // Utility Functions
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Intersection Observer for animations
    class AnimationObserver {
        constructor() {
            this.observer = null;
            this.init();
        }

        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver(
                    this.handleIntersection.bind(this),
                    {
                        threshold: 0.1,
                        rootMargin: '0px 0px -50px 0px'
                    }
                );
                this.observeElements();
            }
        }

        observeElements() {
            const elements = document.querySelectorAll(
                '.problem-item, .testimonial, .ingredient, .benefit-item'
            );
            elements.forEach(el => this.observer.observe(el));
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // Smooth scrolling for anchor links
    class SmoothScroll {
        constructor() {
            this.init();
        }

        init() {
            document.addEventListener('click', (e) => {
                if (e.target.matches('a[href^="#"]')) {
                    e.preventDefault();
                    this.scrollToElement(e.target.getAttribute('href'));
                }
            });
        }

        scrollToElement(selector) {
            const element = document.querySelector(selector);
            if (element) {
                const offsetTop = element.offsetTop - CONFIG.scrollOffset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    // CTA Button tracking and optimization
    class CTATracker {
        constructor() {
            this.buttons = document.querySelectorAll('.cta-button');
            this.init();
        }

        init() {
            this.buttons.forEach(button => {
                this.addClickTracking(button);
                this.addHoverEffects(button);
            });
        }

        addClickTracking(button) {
            button.addEventListener('click', (e) => {
                // Track CTA clicks for analytics
                this.trackEvent('cta_click', {
                    button_text: button.textContent.trim(),
                    button_class: button.className,
                    url: button.href || 'internal'
                });

                // Add loading state for external links
                if (button.href && button.href.includes('sugarnix.com')) {
                    this.addLoadingState(button);
                }
            });
        }

        addHoverEffects(button) {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px) scale(1.02)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        }

        addLoadingState(button) {
            const originalText = button.innerHTML;
            button.innerHTML = `
                <span class="loading-spinner"></span>
                Redirecionando...
            `;
            button.classList.add('loading');
            button.style.pointerEvents = 'none';

            // Remove loading state after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('loading');
                button.style.pointerEvents = 'auto';
            }, 2000);
        }

        trackEvent(eventName, data) {
            // Google Analytics 4 tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, data);
            }

            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', data);
            }

            // Console log for debugging
            console.log('Event tracked:', eventName, data);
        }
    }

    // Scroll progress indicator
    class ScrollProgress {
        constructor() {
            this.progressBar = null;
            this.init();
        }

        init() {
            this.createProgressBar();
            this.addScrollListener();
        }

        createProgressBar() {
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'scroll-progress';
            this.progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #22c55e, #16a34a);
                z-index: 1000;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(this.progressBar);
        }

        addScrollListener() {
            const updateProgress = throttle(() => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.body.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                this.progressBar.style.width = scrollPercent + '%';
            }, 16); // ~60fps

            window.addEventListener('scroll', updateProgress);
        }
    }

    // Performance monitoring
    class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            this.measurePageLoad();
            this.measureInteractionDelay();
            this.setupWebVitals();
        }

        measurePageLoad() {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log('Page load time:', loadTime + 'ms');
                
                // Track load time
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        name: 'load',
                        value: loadTime
                    });
                }
            });
        }

        measureInteractionDelay() {
            let firstInteraction = false;
            const interactionEvents = ['click', 'keydown', 'touchstart'];

            interactionEvents.forEach(event => {
                document.addEventListener(event, () => {
                    if (!firstInteraction) {
                        firstInteraction = true;
                        const interactionDelay = Date.now() - performance.timing.navigationStart;
                        console.log('First interaction delay:', interactionDelay + 'ms');
                    }
                }, { once: true });
            });
        }

        setupWebVitals() {
            // Core Web Vitals measurement
            if ('web-vital' in window) {
                // This would be implemented with web-vitals library
                console.log('Web Vitals monitoring enabled');
            }
        }
    }

    // Mobile optimization
    class MobileOptimizer {
        constructor() {
            this.init();
        }

        init() {
            this.optimizeTouchEvents();
            this.preventZoomOnInput();
            this.addMobileMenu();
        }

        optimizeTouchEvents() {
            // Add touch feedback to interactive elements
            const touchElements = document.querySelectorAll('.cta-button, .problem-item, .testimonial');
            
            touchElements.forEach(element => {
                element.addEventListener('touchstart', () => {
                    element.style.transform = 'scale(0.98)';
                }, { passive: true });

                element.addEventListener('touchend', () => {
                    element.style.transform = '';
                }, { passive: true });
            });
        }

        preventZoomOnInput() {
            // Prevent zoom on input focus (iOS Safari)
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                );
            }
        }

        addMobileMenu() {
            // Add hamburger menu for mobile if needed
            const header = document.querySelector('.header');
            if (window.innerWidth <= 768 && header) {
                this.createMobileMenu(header);
            }
        }

        createMobileMenu(header) {
            const menuButton = document.createElement('button');
            menuButton.className = 'mobile-menu-toggle';
            menuButton.innerHTML = '☰';
            menuButton.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--primary-green);
            `;
            
            header.querySelector('.container').appendChild(menuButton);
        }
    }

    // Form validation and optimization (if forms are added)
    class FormOptimizer {
        constructor() {
            this.forms = document.querySelectorAll('form');
            this.init();
        }

        init() {
            this.forms.forEach(form => {
                this.addValidation(form);
                this.optimizeInputs(form);
            });
        }

        addValidation(form) {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateInput(input);
                });

                input.addEventListener('input', debounce(() => {
                    this.validateInput(input);
                }, CONFIG.debounceDelay));
            });
        }

        validateInput(input) {
            const value = input.value.trim();
            const isValid = this.checkValidity(input, value);
            
            if (isValid) {
                input.style.borderColor = '#22c55e';
                input.classList.remove('error');
            } else {
                input.style.borderColor = '#ef4444';
                input.classList.add('error');
            }
        }

        checkValidity(input, value) {
            const type = input.type;
            const required = input.hasAttribute('required');

            if (required && !value) return false;

            switch (type) {
                case 'email':
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                case 'tel':
                    return /^[\+]?[1-9][\d]{0,15}$/.test(value);
                default:
                    return true;
            }
        }

        optimizeInputs(form) {
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                // Add autocomplete attributes
                if (input.type === 'email') {
                    input.setAttribute('autocomplete', 'email');
                } else if (input.type === 'tel') {
                    input.setAttribute('autocomplete', 'tel');
                }

                // Add input mode for mobile
                if (input.type === 'tel') {
                    input.setAttribute('inputmode', 'tel');
                } else if (input.type === 'email') {
                    input.setAttribute('inputmode', 'email');
                }
            });
        }
    }

    // Error handling
    class ErrorHandler {
        constructor() {
            this.init();
        }

        init() {
            window.addEventListener('error', this.handleError.bind(this));
            window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
        }

        handleError(event) {
            console.error('JavaScript error:', event.error);
            // Could send to error tracking service
        }

        handlePromiseRejection(event) {
            console.error('Unhandled promise rejection:', event.reason);
            // Could send to error tracking service
        }
    }

    // Initialize all modules when DOM is ready
    function init() {
        try {
            // Initialize core modules
            new AnimationObserver();
            new SmoothScroll();
            new CTATracker();
            new ScrollProgress();
            new PerformanceMonitor();
            new MobileOptimizer();
            new FormOptimizer();
            new ErrorHandler();

            // Add loading styles
            document.body.classList.add('loaded');
            
            console.log('SugarMute presell page initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Add CSS for loading spinner
    const style = document.createElement('style');
    style.textContent = `
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .loaded {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        body:not(.loaded) {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

})();
