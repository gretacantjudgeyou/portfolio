class Carousel3D {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel-3d-track');
    this.cards = Array.from(container.querySelectorAll('.carousel-3d-card'));
    this.prevBtn = container.querySelector('.carousel-arrow.prev');
    this.nextBtn = container.querySelector('.carousel-arrow.next');
    this.dots = container.querySelectorAll('.carousel-dot');
    
    // Configuration
    this.config = {
      cardWidth: 400,
      padding: 40,
      perspective: 2000,
      maxRotation: 20, // degrees
      maxScale: 1.1,
      minScale: 0.85,
      zOffset: 150, // pixels
      snapDuration: 0.6,
      snapEase: 'power3.out',
      dragResistance: 1.5,
      wheelSensitivity: 0.8,
    };
    
    // State
    this.scrollPos = 0;
    this.targetScroll = 0;
    this.isDragging = false;
    this.startX = 0;
    this.scrollStart = 0;
    this.animationId = null;
    this.activeIndex = 0;
    
    this.init();
  }
  
  init() {
    if (!this.track || this.cards.length === 0) return;
    
    // Set up track
    this.trackWidth = (this.config.cardWidth + this.config.padding) * this.cards.length;
    this.track.style.width = `${this.trackWidth}px`;
    
    // Set initial positions
    this.updateCardPositions(0);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initial render
    this.animate();
    
    // Center the active card
    this.snapToClosest(true);
  }
  
  setupEventListeners() {
    // Mouse events
    this.track.addEventListener('mousedown', this.onDragStart.bind(this));
    window.addEventListener('mousemove', this.onDragMove.bind(this));
    window.addEventListener('mouseup', this.onDragEnd.bind(this));
    
    // Touch events
    this.track.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    window.addEventListener('touchend', this.onDragEnd.bind(this));
    
    // Wheel event
    this.track.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigate(-1));
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigate(1));
    }
    
    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToIndex(index));
    });
    
    // Window resize
    window.addEventListener('resize', this.onResize.bind(this));
  }
  
  // Calculate the target scroll position for a given card index
  getScrollForIndex(index) {
    const containerWidth = this.container.offsetWidth;
    const cardWidth = this.config.cardWidth + this.config.padding;
    const maxScroll = this.trackWidth - containerWidth;
    
    // Center the selected card
    let scroll = (index * cardWidth) - ((containerWidth - cardWidth) / 2) + (this.config.padding / 2);
    
    // Clamp to bounds
    return Math.max(0, Math.min(scroll, maxScroll));
  }
  
  // Update card positions based on current scroll position
  updateCardPositions(deltaTime = 0) {
    const containerCenter = this.container.offsetWidth / 2;
    const cardWidth = this.config.cardWidth + this.config.padding;
    
    this.cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + (cardRect.width / 2) - this.container.getBoundingClientRect().left;
      
      // Calculate distance from center (-1 to 1)
      const distanceFromCenter = (cardCenter - containerCenter) / (containerCenter * 0.8);
      const absDistance = Math.min(Math.abs(distanceFromCenter), 1);
      
      // Calculate 3D transforms
      const rotationY = distanceFromCenter * this.config.maxRotation;
      const scale = this.config.minScale + 
                   (1 - this.config.minScale) * (1 - absDistance);
      
      // Apply 3D transforms with GSAP for smooth animation
      gsap.to(card, {
        rotationY: rotationY,
        scale: scale,
        z: -Math.abs(distanceFromCenter) * this.config.zOffset,
        filter: `brightness(${1 - (absDistance * 0.3)})`,
        duration: deltaTime * 0.001, // Convert ms to seconds
        ease: 'power2.out',
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        overwrite: 'auto',
        force3D: true
      });
      
      // Update z-index for proper layering
      const zIndex = 100 - Math.round(absDistance * 50);
      card.style.zIndex = zIndex;
    });
    
    // Update active dot
    this.updateActiveDot();
  }
  
  // Update the active dot indicator
  updateActiveDot() {
    if (!this.dots.length) return;
    
    const containerCenter = this.container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;
    
    this.cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + (cardRect.width / 2);
      const distance = Math.abs(cardCenter - containerCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    if (closestIndex !== this.activeIndex) {
      this.activeIndex = closestIndex;
      
      // Update dots
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.activeIndex);
      });
      
      // Emit custom event
      this.container.dispatchEvent(new CustomEvent('slideChange', {
        detail: { index: this.activeIndex }
      }));
    }
  }
  
  // Snap to the closest card
  snapToClosest(instant = false) {
    const containerCenter = this.container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;
    
    this.cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + (cardRect.width / 2);
      const distance = Math.abs(cardCenter - containerCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    
    this.goToIndex(closestIndex, instant);
  }
  
  // Navigate to a specific card index
  goToIndex(index, instant = false) {
    const targetScroll = this.getScrollForIndex(index);
    
    if (instant) {
      this.scrollPos = targetScroll;
      this.targetScroll = targetScroll;
      this.track.scrollLeft = targetScroll;
      this.updateCardPositions();
    } else {
      this.targetScroll = targetScroll;
      
      // Smooth scroll to target
      gsap.to(this.track, {
        scrollLeft: targetScroll,
        duration: this.config.snapDuration,
        ease: this.config.snapEase,
        onUpdate: () => {
          this.scrollPos = this.track.scrollLeft;
          this.updateCardPositions();
        }
      });
    }
    
    // Update active dot
    this.activeIndex = index;
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
  
  // Navigate to next/previous card
  navigate(direction) {
    const newIndex = Math.max(0, Math.min(this.activeIndex + direction, this.cards.length - 1));
    if (newIndex !== this.activeIndex) {
      this.goToIndex(newIndex);
    }
  }
  
  // Handle drag start
  onDragStart(e) {
    this.isDragging = true;
    this.startX = e.pageX - this.track.offsetLeft;
    this.scrollStart = this.track.scrollLeft;
    this.track.style.cursor = 'grabbing';
    this.track.style.scrollBehavior = 'auto';
    
    // Cancel any ongoing animations
    gsap.killTweensOf(this.track);
    
    e.preventDefault();
  }
  
  // Handle drag move
  onDragMove(e) {
    if (!this.isDragging) return;
    
    const x = e.pageX - this.track.offsetLeft;
    const walk = (x - this.startX) * this.config.dragResistance;
    this.track.scrollLeft = this.scrollStart - walk;
    this.scrollPos = this.track.scrollLeft;
    
    // Update card positions
    this.updateCardPositions();
    
    e.preventDefault();
  }
  
  // Handle drag end
  onDragEnd() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.track.style.cursor = 'grab';
    this.snapToClosest();
  }
  
  // Handle touch start
  onTouchStart(e) {
    this.onDragStart({
      pageX: e.touches[0].pageX,
      preventDefault: () => e.preventDefault()
    });
  }
  
  // Handle touch move
  onTouchMove(e) {
    if (!this.isDragging) return;
    
    this.onDragMove({
      pageX: e.touches[0].pageX,
      preventDefault: () => e.preventDefault()
    });
  }
  
  // Handle mouse wheel
  onWheel(e) {
    // Only handle wheel events when mouse is over the carousel
    if (!this.track.contains(e.target) && !this.container.contains(e.target)) return;
    
    // Prevent page scroll
    e.preventDefault();
    
    // Apply horizontal scroll based on vertical wheel movement
    const delta = e.deltaY * this.config.wheelSensitivity;
    this.targetScroll = this.track.scrollLeft + delta;
    
    // Clamp to bounds
    const maxScroll = this.track.scrollWidth - this.track.clientWidth;
    this.targetScroll = Math.max(0, Math.min(this.targetScroll, maxScroll));
    
    // Apply scroll
    this.track.scrollLeft = this.targetScroll;
    this.scrollPos = this.targetScroll;
    
    // Update card positions
    this.updateCardPositions();
    
    // Debounce snap
    clearTimeout(this.snapTimeout);
    this.snapTimeout = setTimeout(() => {
      this.snapToClosest();
    }, 100);
  }
  
  // Handle window resize
  onResize() {
    // Recalculate dimensions
    this.trackWidth = (this.config.cardWidth + this.config.padding) * this.cards.length;
    this.track.style.width = `${this.trackWidth}px`;
    
    // Update positions
    this.goToIndex(this.activeIndex, true);
  }
  
  // Animation loop
  animate() {
    // Smooth scroll interpolation
    if (!this.isDragging) {
      const diff = this.targetScroll - this.scrollPos;
      if (Math.abs(diff) > 0.5) {
        this.scrollPos += diff * 0.2;
        this.track.scrollLeft = this.scrollPos;
      }
    }
    
    // Update card positions
    this.updateCardPositions();
    
    // Continue animation loop
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  // Clean up
  destroy() {
    // Remove event listeners
    window.removeEventListener('mousemove', this.onDragMove);
    window.removeEventListener('mouseup', this.onDragEnd);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onDragEnd);
    window.removeEventListener('resize', this.onResize);
    
    // Stop animation loop
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Reset styles
    this.track.style.width = '';
    this.track.style.cursor = '';
    this.track.style.scrollBehavior = '';
    
    // Reset card transforms
    this.cards.forEach(card => {
      gsap.set(card, {
        rotationY: 0,
        scale: 1,
        z: 0,
        filter: 'none',
        clearProps: 'all'
      });
    });
  }
}

// Initialize all carousels on the page
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel-3d-container');
  carousels.forEach(container => {
    // Create and store the carousel instance
    const carousel = new Carousel3D(container);
    
    // Make it accessible via data attribute
    container.carouselInstance = carousel;
    
    // Optional: Expose carousel to window for debugging
    if (!window.carousels) window.carousels = [];
    window.carousels.push(carousel);
  });
});

// Export for module usage if needed
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Carousel3D;
}
