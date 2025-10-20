// 3D Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('projectsTrack');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.card'));
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    const gap = parseInt(getComputedStyle(track).gap || '48');
    
    // Calculate card width including gap
    const cardW = () => cards[0] ? (cards[0].getBoundingClientRect().width + gap) : 0;

    // Pointer events for drag functionality
    track.addEventListener('pointerdown', (e) => {
        isDown = true;
        track.style.cursor = 'grabbing';
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.setPointerCapture(e.pointerId);
    }, { passive: true });

    track.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2; // Scroll multiplier
        track.scrollLeft = scrollLeft - walk;
        updateTransforms();
    }, { passive: false });

    const handlePointerUp = () => {
        isDown = false;
        track.style.cursor = 'grab';
        snapToClosest();
    };

    track.addEventListener('pointerup', handlePointerUp);
    track.addEventListener('pointerleave', handlePointerUp);
    track.addEventListener('pointercancel', handlePointerUp);

    // Wheel event for horizontal scrolling
    track.addEventListener('wheel', (e) => {
        e.preventDefault();
        track.scrollLeft += e.deltaY * 1.6;
        updateTransforms();
        debounceSnap();
    }, { passive: false });

    // Touch action for mobile
    track.style.touchAction = 'pan-x';

    // Update card transforms based on position
    function updateTransforms() {
        const viewportCenter = window.innerWidth / 2;
        
        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + (rect.width / 2);
            const offset = (cardCenter - viewportCenter) / viewportCenter; // -1 to 1
            const clamped = Math.max(Math.min(offset, 1), -1);

            // Calculate transforms
            const scale = 1 - Math.abs(clamped) * 0.14;
            const rotateY = clamped * -12;
            const translateZ = -Math.abs(clamped) * 140;
            const translateX = clamped * 36;
            const opacity = 1 - Math.abs(clamped) * 0.18;

            // Apply transforms with GSAP if available, or directly
            if (window.gsap) {
                gsap.to(card, { 
                    duration: 0.55, 
                    ease: "power3.out",
                    scale: scale, 
                    rotationY: rotateY, 
                    z: translateZ, 
                    x: translateX, 
                    opacity: opacity 
                });
            } else {
                card.style.transform = `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
                card.style.opacity = opacity;
            }

            // Update active state
            if (Math.abs(clamped) < 0.12) {
                card.classList.add('center');
                card.classList.remove('inactive');
            } else {
                card.classList.remove('center');
                card.classList.add('inactive');
            }
        });
    }

    // Snap to nearest card
    function snapToClosest() {
        const viewportCenter = window.innerWidth / 2;
        let closestIdx = 0;
        let minDist = Infinity;

        cards.forEach((card, idx) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + (rect.width / 2);
            const dist = Math.abs(cardCenter - viewportCenter);
            
            if (dist < minDist) {
                minDist = dist;
                closestIdx = idx;
            }
        });

        const targetCard = cards[closestIdx];
        const targetScrollLeft = targetCard.offsetLeft - ((window.innerWidth - targetCard.offsetWidth) / 2);
        
        if (window.gsap && window.gsap.to) {
            gsap.to(track, { 
                duration: 0.7, 
                ease: "power3.out", 
                scrollTo: { x: targetScrollLeft, autoKill: false },
                onUpdate: updateTransforms
            });
        } else {
            track.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });
        }
    }

    // Debounce snap function
    let snapTimeout;
    function debounceSnap() {
        clearTimeout(snapTimeout);
        snapTimeout = setTimeout(snapToClosest, 180);
    }

    // Initialize
    function init() {
        // Add padding to start and end for better centering
        const sidePadding = Math.max((window.innerWidth - cards[0].offsetWidth) / 2, 24);
        track.style.paddingLeft = `${sidePadding}px`;
        track.style.paddingRight = `${sidePadding}px`;
        
        // Initial transform
        updateTransforms();
    }

    // Event listeners
    window.addEventListener('resize', () => {
        init();
        updateTransforms();
    });

    track.addEventListener('scroll', () => {
        if (!isDown) {
            requestAnimationFrame(updateTransforms);
        }
    }, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            track.scrollBy({ left: cardW(), behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
            track.scrollBy({ left: -cardW(), behavior: 'smooth' });
        }
    });

    // Initialize
    setTimeout(init, 100);
});
