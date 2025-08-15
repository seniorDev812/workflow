// Contact Page - Scroll-based header background color functionality
// Initialize immediately on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact page header scroll script loaded - initializing immediately');
    
    // Initialize header scroll functionality immediately
    initializeHeaderScroll();
    
    // Function to initialize header scroll functionality
    function initializeHeaderScroll() {
        console.log('Contact page header scroll script initialized');
        
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
        const mainField = document.querySelector('.main-field');
        const footerField = document.querySelector('.footer-field');
        
        // Debug element detection
        console.log('Contact page elements found:', {
            headerBottom: !!headerBottom,
            mainField: !!mainField,
            footerField: !!footerField
        });
        
        if (!headerBottom) {
            console.log('Header bottom element not found');
            return;
        }
        
        console.log('Contact page header scroll functionality initialized');
        
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
        
        // Function to update header background for contact page
        function updateHeaderBackground() {
            // Check if main section is visible
            const mainInView = isElementInViewport(mainField);
            
            // Check if footer is visible
            const footerInView = isElementInViewport(footerField);
            
            // Debug logging
            console.log('Contact page scroll update:', {
                main: mainInView,
                footer: footerInView
            });

            // Apply background color logic for contact page
            if (mainInView) {
                // Main section (main-field home-animation) is visible - always use #5f5f5f
                headerBottom.classList.add('bg-active');
                headerBottom.classList.remove('bg-transparent');
                headerBottom.style.setProperty('--header-bg-color', '#5f5f5f');
                headerBottom.style.backgroundColor = '#5f5f5f';
                console.log('Applied background color #5f5f5f for main-field home-animation section');
            } else if (footerInView && !mainInView) {
                // Footer is visible and main section is not - make header transparent
                headerBottom.classList.remove('bg-active');
                headerBottom.classList.add('bg-transparent');
                headerBottom.style.setProperty('--header-bg-color', 'transparent');
                headerBottom.style.backgroundColor = 'transparent';
                console.log('Applied transparent background for footer section');
            } else {
                // Default state - add background for better readability
                headerBottom.classList.add('bg-active');
                headerBottom.classList.remove('bg-transparent');
                headerBottom.style.setProperty('--header-bg-color', '#5f5f5f');
                headerBottom.style.backgroundColor = '#5f5f5f';
                console.log('Applied default background color #5f5f5f');
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
     
        document.body.appendChild(debugIndicator);
        
        // Update debug indicator
        function updateDebugIndicator() {
            const isActive = headerBottom.classList.contains('bg-active');
            const isTransparent = headerBottom.classList.contains('bg-transparent');
            
      
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
    }
});
