// Scroll-based header background color functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Header scroll script loaded successfully');
    
    // Add CSS to ensure our styles take precedence
    const style = document.createElement('style');
    style.textContent = `
        .header-bottom {
            transition: background-color 0.3s ease !important;
        }
        .header-bottom[style*="background-color"] {
            background-color: var(--header-bg-color) !important;
        }
    `;
    document.head.appendChild(style);
    
    const headerBottom = document.querySelector('.header-bottom');
    const footerField = document.querySelector('.footer-field');
    
    // Debug element detection
    console.log('Elements found:', {
        headerBottom: !!headerBottom,
        footerField: !!footerField
    });
    
    if (!headerBottom) {
        console.log('Header bottom element not found');
        return;
    }
    
    // Function to check if element is in viewport
    function isElementInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Function to update header background
    function updateHeaderBackground() {
        // Check if footer is visible
        const footerInView = isElementInViewport(footerField);
        
        // Debug logging
        console.log('Scroll update - Footer in view:', footerInView);

        // Apply background color based on footer visibility
        if (footerInView) {
            // Transparent when footer is visible
            headerBottom.style.setProperty('--header-bg-color', 'transparent');
            headerBottom.style.backgroundColor = 'transparent';
            headerBottom.style.transition = 'background-color 0.3s ease';
            console.log('Applied transparent background for footer');
        } else {
            // Gray background for all other cases
            headerBottom.style.setProperty('--header-bg-color', '#5f5f5f');
            headerBottom.style.backgroundColor = '#5f5f5f';
            headerBottom.style.transition = 'background-color 0.3s ease';
            console.log('Applied gray background for other sections');
        }
    }
  
    // Function to initialize scroll functionality after animations complete
    function initializeScrollFunctionality() {
        console.log('Header scroll functionality initialized after animations');
        
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
    }
    
    // Wait for all animations and moving operations to complete
    // Method 1: Wait for window load event (images, stylesheets, etc.)
    window.addEventListener('load', function() {
        console.log('Window loaded, waiting for animations...');
        
        // Method 2: Additional delay to ensure all CSS animations complete
        setTimeout(function() {
            console.log('Animation delay completed, initializing scroll functionality');
            initializeScrollFunctionality();
        }, 2000); // 2 second delay to ensure all animations complete
    });
    
    // Method 3: Alternative - wait for specific animation classes to be removed
    // Uncomment if you have specific animation classes
    /*
    function waitForAnimations() {
        const animatedElements = document.querySelectorAll('.animate, .moving, .logo-animation');
        if (animatedElements.length === 0) {
            console.log('No animation classes found, initializing immediately');
            initializeScrollFunctionality();
        } else {
            console.log('Animation classes detected, waiting...');
            setTimeout(waitForAnimations, 100);
        }
    }
    waitForAnimations();
    */
});
