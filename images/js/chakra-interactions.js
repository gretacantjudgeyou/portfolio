/**
 * Modern Chakra Icons Interactive Effects
 * Enhanced user experience with magnetic field effects and dynamic interactions
 */

class ChakraInteractions {
    constructor() {
        this.chakras = [];
        this.isInitialized = false;
        this.mousePosition = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Find all chakra elements
        const chakraElements = document.querySelectorAll('.philosophy-section .div-block-635');
        
        if (chakraElements.length === 0) {
            // Retry after a short delay if elements aren't found
            setTimeout(() => this.setup(), 500);
            return;
        }

        this.chakras = Array.from(chakraElements);
        this.bindEvents();
        this.createRippleElements();
        this.startMagneticField();
        this.isInitialized = true;
    }

    bindEvents() {
        // Mouse tracking for magnetic field effect
        document.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.updateMagneticField();
        });

        // Individual chakra interactions
        this.chakras.forEach((chakra, index) => {
            // Click effect with ripple
            chakra.addEventListener('click', (e) => {
                this.createRippleEffect(e, chakra, index);
                this.triggerChakraActivation(chakra, index);
            });

            // Enhanced hover effects
            chakra.addEventListener('mouseenter', () => {
                this.onChakraHover(chakra, index);
            });

            chakra.addEventListener('mouseleave', () => {
                this.onChakraLeave(chakra, index);
            });

            // Touch support for mobile
            chakra.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.createRippleEffect(e, chakra, index);
                this.triggerChakraActivation(chakra, index);
            });
        });
    }

    createRippleElements() {
        this.chakras.forEach(chakra => {
            const rippleContainer = document.createElement('div');
            rippleContainer.className = 'chakra-ripple-container';
            rippleContainer.style.cssText = `
                position: absolute;
                inset: 0;
                border-radius: 50%;
                overflow: hidden;
                pointer-events: none;
                z-index: 10;
            `;
            chakra.appendChild(rippleContainer);
        });
    }

    createRippleEffect(event, chakra, index) {
        const rippleContainer = chakra.querySelector('.chakra-ripple-container');
        const ripple = document.createElement('div');
        
        // Get click/touch position relative to chakra
        const rect = chakra.getBoundingClientRect();
        const x = (event.clientX || event.touches[0].clientX) - rect.left;
        const y = (event.clientY || event.touches[0].clientY) - rect.top;
        
        // Chakra-specific colors
        const colors = [
            '#FF6B6B', '#4ECDC4', '#96CEB4', '#FDCB6E', 
            '#A29BFE', '#FD79A8', '#00B894'
        ];
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, ${colors[index]}40, ${colors[index]}20, transparent);
            transform: scale(0);
            animation: ripple 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            left: ${x - 60}px;
            top: ${y - 60}px;
            width: 120px;
            height: 120px;
            pointer-events: none;
        `;
        
        rippleContainer.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
    }

    triggerChakraActivation(chakra, index) {
        // Add activation class for special effects
        chakra.classList.add('chakra-activated');
        
        // Create energy burst effect
        this.createEnergyBurst(chakra, index);
        
        // Trigger neighboring chakras with delay
        setTimeout(() => {
            this.triggerNeighboringChakras(index);
        }, 200);
        
        // Remove activation class
        setTimeout(() => {
            chakra.classList.remove('chakra-activated');
        }, 1500);
    }

    createEnergyBurst(chakra, index) {
        const burst = document.createElement('div');
        const colors = [
            '#FF6B6B', '#4ECDC4', '#96CEB4', '#FDCB6E', 
            '#A29BFE', '#FD79A8', '#00B894'
        ];
        
        burst.style.cssText = `
            position: absolute;
            inset: -40px;
            border-radius: 50%;
            background: conic-gradient(from 0deg, ${colors[index]}60, transparent, ${colors[index]}60);
            animation: energy-burst 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            pointer-events: none;
            z-index: -1;
        `;
        
        chakra.appendChild(burst);
        
        setTimeout(() => {
            if (burst.parentNode) {
                burst.parentNode.removeChild(burst);
            }
        }, 1200);
    }

    triggerNeighboringChakras(activeIndex) {
        const neighbors = [
            (activeIndex - 1 + 7) % 7,
            (activeIndex + 1) % 7
        ];
        
        neighbors.forEach((neighborIndex, delay) => {
            setTimeout(() => {
                const neighbor = this.chakras[neighborIndex];
                if (neighbor) {
                    neighbor.style.transform += ' scale(1.1)';
                    neighbor.style.filter += ' brightness(1.3)';
                    
                    setTimeout(() => {
                        neighbor.style.transform = neighbor.style.transform.replace(' scale(1.1)', '');
                        neighbor.style.filter = neighbor.style.filter.replace(' brightness(1.3)', '');
                    }, 300);
                }
            }, delay * 100);
        });
    }

    onChakraHover(chakra, index) {
        // Pause orbit animation on hover
        const orbitContainer = document.querySelector('.philosophy-section .div-block-637');
        if (orbitContainer) {
            orbitContainer.style.animationPlayState = 'paused';
        }
        
        // Add hover glow to neighboring chakras
        this.highlightNeighbors(index, true);
    }

    onChakraLeave(chakra, index) {
        // Resume orbit animation
        const orbitContainer = document.querySelector('.philosophy-section .div-block-637');
        if (orbitContainer) {
            orbitContainer.style.animationPlayState = 'running';
        }
        
        // Remove hover glow from neighbors
        this.highlightNeighbors(index, false);
    }

    highlightNeighbors(activeIndex, highlight) {
        const neighbors = [
            (activeIndex - 1 + 7) % 7,
            (activeIndex + 1) % 7
        ];
        
        neighbors.forEach(neighborIndex => {
            const neighbor = this.chakras[neighborIndex];
            if (neighbor) {
                if (highlight) {
                    neighbor.style.filter += ' brightness(1.2) saturate(1.3)';
                    neighbor.style.transform += ' scale(1.05)';
                } else {
                    neighbor.style.filter = neighbor.style.filter.replace(' brightness(1.2) saturate(1.3)', '');
                    neighbor.style.transform = neighbor.style.transform.replace(' scale(1.05)', '');
                }
            }
        });
    }

    updateMagneticField() {
        if (!this.isInitialized) return;
        
        this.chakras.forEach((chakra, index) => {
            const rect = chakra.getBoundingClientRect();
            const chakraCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            
            const distance = Math.sqrt(
                Math.pow(this.mousePosition.x - chakraCenter.x, 2) + 
                Math.pow(this.mousePosition.y - chakraCenter.y, 2)
            );
            
            // Magnetic attraction effect within 200px
            if (distance < 200) {
                const attraction = Math.max(0, (200 - distance) / 200);
                const angle = Math.atan2(
                    this.mousePosition.y - chakraCenter.y,
                    this.mousePosition.x - chakraCenter.x
                );
                
                const offsetX = Math.cos(angle) * attraction * 15;
                const offsetY = Math.sin(angle) * attraction * 15;
                
                chakra.style.transform += ` translate(${offsetX}px, ${offsetY}px)`;
                chakra.style.filter += ` brightness(${1 + attraction * 0.3})`;
                
                // Reset after a short delay
                setTimeout(() => {
                    chakra.style.transform = chakra.style.transform.replace(` translate(${offsetX}px, ${offsetY}px)`, '');
                    chakra.style.filter = chakra.style.filter.replace(` brightness(${1 + attraction * 0.3})`, '');
                }, 100);
            }
        });
    }

    startMagneticField() {
        // Create ambient energy field animation
        const philosophySection = document.querySelector('.philosophy-section');
        if (!philosophySection) return;
        
        const energyField = document.createElement('div');
        energyField.className = 'ambient-energy-field';
        energyField.style.cssText = `
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(253,245,230,0.05) 0%, transparent 70%);
            animation: ambient-pulse 20s ease-in-out infinite;
            pointer-events: none;
            z-index: 0;
        `;
        
        philosophySection.appendChild(energyField);
    }
}

// Additional CSS animations for JavaScript effects
const additionalStyles = `
    @keyframes energy-burst {
        0% { transform: scale(0) rotate(0deg); opacity: 1; }
        50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
        100% { transform: scale(3) rotate(360deg); opacity: 0; }
    }
    
    @keyframes ambient-pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
    }
    
    .chakra-activated {
        animation-play-state: paused !important;
        transform: scale(1.3) !important;
        filter: brightness(1.5) saturate(1.8) !important;
    }
    
    .chakra-activated::before {
        opacity: 1 !important;
        animation-duration: 0.5s !important;
    }
    
    .chakra-activated::after {
        opacity: 1 !important;
        transform: scale(1.5) !important;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the chakra interactions
new ChakraInteractions();
