document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.projects-track');
    const cards = Array.from(document.querySelectorAll('.card'));
    const prevBtn = document.getElementById('prev-case');
    const nextBtn = document.getElementById('next-case');
    const currentSlideEl = document.querySelector('.current-slide');
    const totalSlidesEl = document.querySelector('.total-slides');
    
    let currentIndex = 0;
    const totalSlides = cards.length;
    
    // Initialize total slides count
    if (totalSlidesEl) {
        totalSlidesEl.textContent = totalSlides;
    }
    
    // Set initial positions for all cards
    function updateCards() {
        cards.forEach((card, index) => {
            const pos = index - currentIndex;
            card.setAttribute('data-pos', pos);
            
            // Add/remove active class for better performance
            if (pos === 0) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
            
            // Update ARIA attributes for accessibility
            card.setAttribute('aria-hidden', pos !== 0);
            card.setAttribute('tabindex', pos === 0 ? '0' : '-1');
        });
        
        // Update pagination
        if (currentSlideEl) {
            currentSlideEl.textContent = currentIndex + 1;
        }
        
        // Update button states
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= totalSlides - 1;
        
        // Trigger reflow for smooth transitions
        void track.offsetHeight;
    }
    
    // Navigation functions
    function goToIndex(newIndex) {
        // Clamp the index to valid range
        newIndex = Math.max(0, Math.min(newIndex, totalSlides - 1));
        
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateCards();
            
            // Focus the new active card for better keyboard navigation
            const activeCard = cards[currentIndex];
            if (activeCard) {
                activeCard.focus({ preventScroll: true });
            }
        }
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToIndex(currentIndex - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToIndex(currentIndex + 1);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToIndex(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToIndex(currentIndex + 1);
        }
    });
    
    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - go to previous
                goToIndex(currentIndex - 1);
            } else {
                // Swipe left - go to next
                goToIndex(currentIndex + 1);
            }
        }
    }
    
    // Add touch event listeners
    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Initialize
    updateCards();
    
    // Auto-center on scroll
    let isScrolling = false;
    
    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const trackRect = track.getBoundingClientRect();
                const trackCenter = trackRect.left + trackRect.width / 2;
                
                // Find the card closest to the center
                let closestCard = null;
                let minDistance = Infinity;
                
                cards.forEach(card => {
                    const cardRect = card.getBoundingClientRect();
                    const cardCenter = cardRect.left + cardRect.width / 2;
                    const distance = Math.abs(cardCenter - trackCenter);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCard = card;
                    }
                });
                
                // If we found a closest card, update the current index
                if (closestCard) {
                    const newIndex = cards.indexOf(closestCard);
                    if (newIndex !== -1 && newIndex !== currentIndex) {
                        currentIndex = newIndex;
                        updateCards();
                    }
                }
                
                isScrolling = false;
            });
            
            isScrolling = true;
        }
    }
    
    // Add scroll event listener
    track.addEventListener('scroll', handleScroll, { passive: true });
});
