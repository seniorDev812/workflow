// Scroll-based header background color functionality
// Initialize immediately on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Header scroll script loaded successfully - initializing immediately');
    
    // Initialize header scroll functionality immediately
    initializeHeaderScroll();
    
    // Function to initialize header scroll functionality
    function initializeHeaderScroll() {
        console.log('Header scroll functionality initialized');
        
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
        const seiProductFilter = document.querySelector('.sei-product-filter');
        const footerField = document.querySelector('.footer-field');
        
        // Debug element detection
        console.log('Elements found:', {
            headerBottom: !!headerBottom,
            seiProductFilter: !!seiProductFilter,
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
            // Check if sei-product-filter is visible
            const productFilterInView = isElementInViewport(seiProductFilter);
            
            // Check if footer is visible
            const footerInView = isElementInViewport(footerField);
            
            // Debug logging
            console.log('Scroll update - Product Filter in view:', productFilterInView, 'Footer in view:', footerInView);

            // Apply background color based on section visibility
            if (productFilterInView) {
                // Gray background when sei-product-filter is visible
                headerBottom.style.setProperty('--header-bg-color', '#5f5f5f');
                headerBottom.style.backgroundColor = '#5f5f5f';
                headerBottom.style.transition = 'background-color 0.3s ease';
                console.log('Applied gray background for sei-product-filter section');
            } else if (footerInView) {
                // Transparent when footer is visible
                headerBottom.style.setProperty('--header-bg-color', 'transparent');
                headerBottom.style.backgroundColor = 'transparent';
                headerBottom.style.transition = 'background-color 0.3s ease';
                console.log('Applied transparent background for footer');
            } else {
                // Default gray background for other sections
                headerBottom.style.setProperty('--header-bg-color', '#5f5f5f');
                headerBottom.style.backgroundColor = '#5f5f5f';
                headerBottom.style.transition = 'background-color 0.3s ease';
                console.log('Applied default gray background for other sections');
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
    }
});
