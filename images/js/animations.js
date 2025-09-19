/**
 * Greta Iovene Website Animations
 * Comprehensive animation system using GSAP and ScrollTrigger
 */

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animation configuration
const ANIMATION_CONFIG = {
    duration: {
        fast: 0.4,
        normal: 0.8,
        slow: 1.2
    },
    easing: {
        smooth: "power2.out",
        fade: "power1.out"
    },
    stagger: {
        small: 0.1,
        medium: 0.15,
        large: 0.2
    }
};

// Utility functions
const utils = {
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Generate random delay
    randomDelay: (min = 0, max = 0.5) => {
        return Math.random() * (max - min) + min;
    }
};

// Text Animation Classes
class TextAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupTextReveals();
        this.setupTypewriterEffect();
        this.setupTextGlitch();
    }

    setupTextReveals() {
        // Hero text reveal animation
        gsap.timeline()
            .fromTo(".hero-headlines h1", 
                { 
                    y: 30, 
                    opacity: 0
                },
                { 
                    y: 0, 
                    opacity: 1,
                    duration: ANIMATION_CONFIG.duration.normal,
                    ease: ANIMATION_CONFIG.easing.fade,
                    stagger: ANIMATION_CONFIG.stagger.small
                }
            )
            .fromTo(".hero-subtitle p",
                {
                    y: 20,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: ANIMATION_CONFIG.duration.normal,
                    ease: ANIMATION_CONFIG.easing.fade
                },
                "-=0.4"
            );

        // Philosophy section text animation
        ScrollTrigger.create({
            trigger: ".philosophy-text",
            start: "top 80%",
            end: "bottom 20%",
            animation: gsap.timeline()
                .fromTo(".top-text, .bottom-text",
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade, stagger: ANIMATION_CONFIG.stagger.small }
                )
                .fromTo(".main-text",
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade },
                    "-=0.2"
                )
                .fromTo(".join-our-text",
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade },
                    "-=0.3"
                )
                .fromTo(".mindful-definition",
                    { y: 15, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade },
                    "-=0.2"
                )
        });

        // Core values section text animation
        ScrollTrigger.create({
            trigger: ".page-intro-text-wrapper",
            start: "top 70%",
            animation: gsap.timeline()
                .fromTo(".page-intro-title-small",
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade, stagger: ANIMATION_CONFIG.stagger.small }
                )
                .fromTo(".chakra-orizzontali .div-block-10, .chakra-orizzontali .div-block-11, .chakra-orizzontali .div-block-12, .chakra-orizzontali > div:not(.div-block-10):not(.div-block-11):not(.div-block-12), .chakra-orizzontali .div-block-13, .chakra-orizzontali .div-block-14, .chakra-orizzontali .div-block-15",
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade, stagger: ANIMATION_CONFIG.stagger.medium },
                    "-=0.2"
                )
        });
    }

    setupTypewriterEffect() {
        // Typewriter effect for specific elements
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            ScrollTrigger.create({
                trigger: element,
                start: "top 80%",
                onEnter: () => {
                    this.typewriterEffect(element, text);
                }
            });
        });
    }

    typewriterEffect(element, text, speed = 50) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    setupTextGlitch() {
        // Glitch effect for special text elements
        const glitchElements = document.querySelectorAll('.glitch-text');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                gsap.to(element, {
                    duration: 0.1,
                    repeat: 5,
                    yoyo: true,
                    skewX: 10,
                    skewY: 2,
                    ease: "power2.inOut"
                });
            });
        });
    }
}

// Element Animation Classes
class ElementAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupCardAnimations();
        this.setupButtonAnimations();
        this.setupImageAnimations();
        this.setupChakraAnimations();
    }

    setupCardAnimations() {
        // Service cards animation
        ScrollTrigger.create({
            trigger: ".cards-grid",
            start: "top 75%",
            animation: gsap.timeline()
                .fromTo(".div-block-226",
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade, stagger: ANIMATION_CONFIG.stagger.medium }
                )
        });

        // Core values cards animation
        ScrollTrigger.create({
            trigger: ".chakra-verticali",
            start: "top 70%",
            animation: gsap.timeline()
                .fromTo(".div-block-628",
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade, stagger: ANIMATION_CONFIG.stagger.large }
                )
        });

        // Card hover animations
        const cards = document.querySelectorAll('.div-block-226, .div-block-628');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: ANIMATION_CONFIG.duration.fast,
                    y: -5,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: ANIMATION_CONFIG.duration.fast,
                    y: 0,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });
        });
    }

    setupButtonAnimations() {
        // Book call button animation
        const bookButton = document.querySelector('.book-call-button');
        if (bookButton) {
            gsap.fromTo(bookButton,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade, delay: 0.8 }
            );

            // Button hover animation
            bookButton.addEventListener('mouseenter', () => {
                gsap.to(bookButton, {
                    duration: ANIMATION_CONFIG.duration.fast,
                    y: -2,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
                gsap.to(bookButton.querySelector('.button-arrow'), {
                    duration: ANIMATION_CONFIG.duration.fast,
                    x: 4,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });

            bookButton.addEventListener('mouseleave', () => {
                gsap.to(bookButton, {
                    duration: ANIMATION_CONFIG.duration.fast,
                    y: 0,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
                gsap.to(bookButton.querySelector('.button-arrow'), {
                    duration: ANIMATION_CONFIG.duration.fast,
                    x: 0,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });
        }

        // Learn more links animation
        const learnMoreLinks = document.querySelectorAll('.link-2-2');
        learnMoreLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link.querySelector('.line-l2-2'), {
                    duration: ANIMATION_CONFIG.duration.normal,
                    scaleX: 1.1,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
                gsap.to(link.querySelector('.text-l2-2'), {
                    duration: ANIMATION_CONFIG.duration.fast,
                    x: 3,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });

            link.addEventListener('mouseleave', () => {
                gsap.to(link.querySelector('.line-l2-2'), {
                    duration: ANIMATION_CONFIG.duration.normal,
                    scaleX: 1,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
                gsap.to(link.querySelector('.text-l2-2'), {
                    duration: ANIMATION_CONFIG.duration.fast,
                    x: 0,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });
        });
    }

    setupImageAnimations() {
        // Hero video animation
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            gsap.fromTo(heroVideo,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade, delay: 0.6 }
            );
        }

        // Service images animation
        ScrollTrigger.create({
            trigger: ".cards-section",
            start: "top 80%",
            animation: gsap.timeline()
                .fromTo(".image-20",
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade, stagger: ANIMATION_CONFIG.stagger.medium }
                )
        });

        // Chakra images animation
        ScrollTrigger.create({
            trigger: ".chakra-orizzontali",
            start: "top 70%",
            animation: gsap.timeline()
                .fromTo(".image-13",
                    { y: 15, opacity: 0 },
                    { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.fade, stagger: ANIMATION_CONFIG.stagger.small }
                )
        });
    }

    setupChakraAnimations() {
        // Simple chakra animations
        const chakraElements = document.querySelectorAll('.div-block-635');
        
        chakraElements.forEach((chakra, index) => {
            // Simple entrance animation
            gsap.fromTo(chakra,
                { y: 20, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: ANIMATION_CONFIG.duration.normal, 
                    ease: ANIMATION_CONFIG.easing.fade,
                    delay: index * ANIMATION_CONFIG.stagger.small
                }
            );

            // Subtle hover animation
            chakra.addEventListener('mouseenter', () => {
                gsap.to(chakra, {
                    duration: ANIMATION_CONFIG.duration.fast,
                    y: -5,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });

            chakra.addEventListener('mouseleave', () => {
                gsap.to(chakra, {
                    duration: ANIMATION_CONFIG.duration.fast,
                    y: 0,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });
        });
    }
}

// Scroll Animations Class
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallaxEffects();
        this.setupSectionTransitions();
        this.setupProgressIndicators();
    }

    setupParallaxEffects() {
        // Hero section parallax
        gsap.to(".hero-video", {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: ".main-hero-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Philosophy section parallax
        gsap.to(".philosophy-text", {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: ".philosophy-section",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    setupSectionTransitions() {
        // Smooth section transitions
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top 90%",
                end: "bottom 10%",
                onEnter: () => {
                    gsap.to(section, {
                        duration: ANIMATION_CONFIG.duration.normal,
                        opacity: 1,
                        ease: ANIMATION_CONFIG.easing.smooth
                    });
                },
                onLeave: () => {
                    gsap.to(section, {
                        duration: ANIMATION_CONFIG.duration.fast,
                        opacity: 0.7,
                        ease: ANIMATION_CONFIG.easing.smooth
                    });
                }
            });
        });
    }

    setupProgressIndicators() {
        // Reading progress indicator
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #572C57, #FDF5E6);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                progressBar.style.width = `${self.progress * 100}%`;
            }
        });
    }
}

// Loading Animations Class
class LoadingAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupPageLoadAnimation();
        this.setupLoadingStates();
    }

    setupPageLoadAnimation() {
        // Page load animation
        gsap.timeline()
            .fromTo("body",
                { opacity: 0 },
                { opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.smooth }
            )
            .fromTo(".navbar-5",
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.smooth },
                "-=0.3"
            );
    }

    setupLoadingStates() {
        // Loading states for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                gsap.fromTo(img,
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: ANIMATION_CONFIG.duration.fast, ease: ANIMATION_CONFIG.easing.smooth }
                );
            });
        });
    }
}

// Testimonial Animations Class
class TestimonialAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupTestimonialSlides();
        this.setupTestimonialCards();
    }

    setupTestimonialSlides() {
        // Testimonial slider animations
        ScrollTrigger.create({
            trigger: ".uui-section_testimonial17",
            start: "top 70%",
            animation: gsap.timeline()
                .fromTo(".uui-testimonial18_slide",
                    { x: 100, opacity: 0, scale: 0.9 },
                    { x: 0, opacity: 1, scale: 1, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.smooth, stagger: ANIMATION_CONFIG.stagger.medium }
                )
        });

        // Horizontal testimonial animations
        ScrollTrigger.create({
            trigger: ".section-19",
            start: "top 70%",
            animation: gsap.timeline()
                .fromTo(".testimonial-card",
                    { y: 80, opacity: 0, rotationX: 45 },
                    { y: 0, opacity: 1, rotationX: 0, duration: ANIMATION_CONFIG.duration.normal, ease: ANIMATION_CONFIG.easing.back }
                )
        });
    }

    setupTestimonialCards() {
        // Testimonial card hover animations
        const testimonialCards = document.querySelectorAll('.uui-testimonial18_content, .testimonial-card');
        
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: ANIMATION_CONFIG.duration.fast,
                    scale: 1.02,
                    y: -5,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: ANIMATION_CONFIG.duration.fast,
                    scale: 1,
                    y: 0,
                    ease: ANIMATION_CONFIG.easing.smooth
                });
            });
        });
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupReducedMotion();
    }

    setupIntersectionObserver() {
        // Use Intersection Observer for better performance
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that need animation
        const animatedElements = document.querySelectorAll('.div-block-226, .div-block-628, .chakra-orizzontali > div');
        animatedElements.forEach(el => observer.observe(el));
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.globalTimeline.timeScale(0.1);
        }
    }
}

// Main Animation Controller
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startAnimations());
        } else {
            this.startAnimations();
        }
    }

    startAnimations() {
        // Initialize all animation classes
        new LoadingAnimations();
        new TextAnimations();
        new ElementAnimations();
        new ScrollAnimations();
        new TestimonialAnimations();
        new PerformanceOptimizer();

        // Setup global event listeners
        this.setupGlobalListeners();
    }

    setupGlobalListeners() {
        // Resize handler
        window.addEventListener('resize', utils.debounce(() => {
            ScrollTrigger.refresh();
        }, 250));

        // Scroll performance optimization
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// Initialize animations when script loads
new AnimationController();

// Export for potential external use
window.GretaAnimations = {
    AnimationController,
    TextAnimations,
    ElementAnimations,
    ScrollAnimations,
    LoadingAnimations,
    TestimonialAnimations,
    PerformanceOptimizer,
    utils,
    ANIMATION_CONFIG
};
