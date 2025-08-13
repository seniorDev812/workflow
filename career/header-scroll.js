// Career Page - Scroll-based header background color functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Career page header scroll script loaded successfully');
    
    // Add CSS to ensure our styles take precedence
    const style = document.createElement('style');
    style.textContent = `
        .header-bottom {
            transition: background-color 0.3s ease !important;
        }
        .header-bottom[style*="background-color"] {
            background-color: var(--header-bg-color) !important;
        }
        .header-bottom.bg-active {
            background-color: #5f5f5f !important;
        }
        .header-bottom.bg-transparent {
            background-color: transparent !important;
        }
    `;
    document.head.appendChild(style);
    
    const headerBottom = document.querySelector('.header-bottom');
    const heroSection = document.querySelector('.hero');
    const currentPositionsSection = document.querySelector('#current-positions');
    const contactSection = document.querySelector('.contact-section');
    const footerField = document.querySelector('.footer-field');
    
    // Debug element detection
    console.log('Career page elements found:', {
        headerBottom: !!headerBottom,
        heroSection: !!heroSection,
        currentPositionsSection: !!currentPositionsSection,
        contactSection: !!contactSection,
        footerField: !!footerField
    });
    
    if (!headerBottom) {
        console.log('Header bottom element not found');
        return;
    }
    
    console.log('Career page header scroll functionality initialized');
    
    // Function to check if element is in viewport
    function isElementInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Function to check if element has been passed (completely out of view)
    function hasPassedElement(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.bottom < 0;
    }
    
    // Function to update header background for career page
    function updateHeaderBackground() {
        // Check if hero section is visible
        const heroInView = isElementInViewport(heroSection);
        
        // Check if job positions section is visible
        const positionsInView = isElementInViewport(currentPositionsSection);
        
        // Check if contact section is visible
        const contactInView = isElementInViewport(contactSection);
        
        // Check if footer is visible
        const footerInView = isElementInViewport(footerField);
        
        // Debug logging
        console.log('Career page scroll update:', {
            hero: heroInView,
            positions: positionsInView,
            contact: contactInView,
            footer: footerInView
        });

        // Apply background color logic for career page
        if (heroInView) {
            // Hero section is visible - keep header transparent
            headerBottom.classList.remove('bg-active');
            headerBottom.classList.add('bg-transparent');
            headerBottom.style.setProperty('--header-bg-color', 'transparent');
            headerBottom.style.backgroundColor = 'transparent';
            console.log('Applied transparent background for hero section');
        } else if (positionsInView || contactInView) {
            // Job positions or contact section is visible - add background
            headerBottom.classList.add('bg-active');
            headerBottom.classList.remove('bg-transparent');
            headerBottom.style.setProperty('--header-bg-color', '#5f5f5f');
            headerBottom.style.backgroundColor = '#5f5f5f';
            console.log('Applied background color for content sections');
        } else if (footerInView && !positionsInView && !contactInView) {
            // Footer is visible and no content sections are visible - transparent
            headerBottom.classList.remove('bg-active');
            headerBottom.classList.add('bg-transparent');
            headerBottom.style.setProperty('--header-bg-color', 'transparent');
            headerBottom.style.backgroundColor = 'transparent';
            console.log('Applied transparent background for footer');
        } else {
            // Default state - add background for better readability
            headerBottom.classList.add('bg-active');
            headerBottom.classList.remove('bg-transparent');
            headerBottom.style.setProperty('--header-bg-color', '#5f5f5f');
            headerBottom.style.backgroundColor = '#5f5f5f';
            console.log('Applied default background color');
        }
    }
    
    // Add scroll event listener with throttling for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateHeaderBackground();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Initial check
    updateHeaderBackground();
    
    // Also update on window resize
    window.addEventListener('resize', function() {
        setTimeout(updateHeaderBackground, 100);
    });
    
    // Add visual indicator for debugging (remove in production)
    const debugIndicator = document.createElement('div');
    debugIndicator.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 9999;
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(debugIndicator);
    
    // Update debug indicator
    function updateDebugIndicator() {
        const isActive = headerBottom.classList.contains('bg-active');
        const isTransparent = headerBottom.classList.contains('bg-transparent');
        
        if (isActive) {
         
            debugIndicator.style.background = 'rgba(95, 95, 95, 0.9)';
        } else if (isTransparent) {
          
            debugIndicator.style.background = 'rgba(0, 0, 0, 0.8)';
        } else {
            debugIndicator.textContent = 'Header: Default';
            debugIndicator.style.background = 'rgba(0, 0, 0, 0.8)';
        }
    }
    
    // Update debug indicator when header changes
    const originalUpdateHeaderBackground = updateHeaderBackground;
    updateHeaderBackground = function() {
        originalUpdateHeaderBackground();
        updateDebugIndicator();
    };
    
    // Hide debug indicator after 5 seconds
    setTimeout(() => {
        debugIndicator.style.opacity = '0.3';
    }, 5000);
});
