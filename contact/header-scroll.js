// Contact Page - Scroll-based header background color functionality
// Wait for page to be fully displayed after logo animation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact page header scroll script loaded - waiting for page to be displayed');
    
    // Function to initialize header scroll functionality
    function initializeHeaderScroll() {
        console.log('Contact page header scroll script initialized after page display');
        
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
    
    // Function to check if page is fully displayed
    function checkPageDisplayed() {
        const preloader = document.querySelector('.preloader');
        const mainField = document.querySelector('.main-field');
        
        // Check if preloader is hidden or not visible
        const preloaderHidden = !preloader || 
                               preloader.style.display === 'none' || 
                               preloader.style.opacity === '0' ||
                               preloader.classList.contains('is-stop');
        
        // Check if main content is visible and has content
        const mainVisible = mainField && 
                           mainField.offsetHeight > 0 && 
                           mainField.style.display !== 'none' &&
                           mainField.style.visibility !== 'hidden';
        
        // Check if body has active class (animation complete)
        const bodyActive = document.body.classList.contains('active');
        
        console.log('Page display check:', {
            preloaderHidden,
            mainVisible,
            bodyActive,
            preloaderExists: !!preloader,
            mainExists: !!mainField
        });
        
        return preloaderHidden && mainVisible;
    }
    
    // Wait for the page to be fully loaded
    window.addEventListener('load', function() {
        console.log('Page loaded, checking for page display');
        
        // Check periodically if page is displayed
        function waitForPageDisplay() {
            if (checkPageDisplayed()) {
                console.log('Page is fully displayed, initializing header scroll');
                initializeHeaderScroll();
            } else {
                // Check again in 200ms
                setTimeout(waitForPageDisplay, 200);
            }
        }
        
        // Start checking
        waitForPageDisplay();
        
        // Fallback: if page doesn't display within 10 seconds, initialize anyway
        setTimeout(function() {
            if (!checkPageDisplayed()) {
                console.log('Page display timeout reached, initializing header scroll anyway');
                initializeHeaderScroll();
            }
        }, 10000);
    });
});
