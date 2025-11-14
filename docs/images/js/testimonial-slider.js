/**
 * Testimonial Slider Dot Synchronization
 * Ensures slider dots highlight the active slide correctly
 */

class TestimonialSlider {
    constructor() {
        this.slider = null;
        this.dots = [];
        this.currentSlide = 0;
        this.init();
    }

    init() {
        // Wait for DOM and Webflow to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Find the testimonial slider
        this.slider = document.querySelector('.uui-testimonial18_component');
        
        if (!this.slider) {
            // Retry after a short delay if slider isn't found
            setTimeout(() => this.setup(), 500);
            return;
        }

        // Get all slider dots
        this.dots = Array.from(document.querySelectorAll('.w-slider-dot'));
        
        if (this.dots.length === 0) {
            // Retry if dots aren't found yet
            setTimeout(() => this.setup(), 500);
            return;
        }

        this.bindEvents();
        this.updateActiveDot();
    }

    bindEvents() {
        // Listen for Webflow slider changes
        this.slider.addEventListener('slide', (e) => {
            this.currentSlide = e.detail || 0;
            this.updateActiveDot();
        });

        // Listen for arrow clicks
        const leftArrow = document.querySelector('.uui-testimonial18_arrow.left');
        const rightArrow = document.querySelector('.uui-testimonial18_arrow:not(.left)');
        
        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                setTimeout(() => this.syncWithWebflow(), 100);
            });
        }
        
        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                setTimeout(() => this.syncWithWebflow(), 100);
            });
        }

        // Listen for dot clicks
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.currentSlide = index;
                this.updateActiveDot();
            });
        });

        // Observe DOM changes to catch Webflow's automatic updates
        const observer = new MutationObserver(() => {
            this.syncWithWebflow();
        });

        observer.observe(this.slider, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        // Periodic sync to ensure consistency with faster dot updates
        setInterval(() => {
            this.syncWithWebflow();
        }, 200);
    }

    syncWithWebflow() {
        // Find the currently active slide by checking Webflow's classes
        const slides = document.querySelectorAll('.uui-testimonial18_slide');
        let activeIndex = 0;

        slides.forEach((slide, index) => {
            const slideRect = slide.getBoundingClientRect();
            const sliderRect = this.slider.getBoundingClientRect();
            
            // Check if slide is in view (visible in slider)
            if (slideRect.left >= sliderRect.left - 10 && 
                slideRect.left <= sliderRect.left + 10) {
                activeIndex = index;
            }
        });

        if (activeIndex !== this.currentSlide) {
            this.currentSlide = activeIndex;
            this.updateActiveDot();
        }
    }

    updateActiveDot() {
        // Remove active class from all dots
        this.dots.forEach(dot => {
            dot.classList.remove('w-active');
        });

        // Add active class to current dot
        if (this.dots[this.currentSlide]) {
            this.dots[this.currentSlide].classList.add('w-active');
        }
    }
}

// Initialize the testimonial slider
new TestimonialSlider();
