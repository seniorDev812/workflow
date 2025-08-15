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
    const seiHero = document.querySelector('.sei-hero');
    const seiProductFilter = document.querySelector('.sei-product-filter');
    const seiProductsIntro = document.querySelector('.sei-products-intro');
    const footerField = document.querySelector('.footer-field');
    
    // Debug element detection
    console.log('Elements found:', {
        headerBottom: !!headerBottom,
        seiHero: !!seiHero,
        seiProductFilter: !!seiProductFilter,
        seiProductsIntro: !!seiProductsIntro,
        footerField: !!footerField
    });
    
    if (!headerBottom) {
        console.log('Header bottom element not found');
        return;
    }
    
    console.log('Header scroll functionality initialized');
    
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
    
    // Function to update header background
    function updateHeaderBackground() {
        // Check if sei-hero is visible
        const seiHeroInView = isElementInViewport(seiHero);
        
        // Check if any of the target sections are visible
        const productFilterInView = isElementInViewport(seiProductFilter);
        const productsIntroInView = isElementInViewport(seiProductsIntro);
        const footerInView = isElementInViewport(footerField);
        
        // Debug logging
        console.log('Scroll update - SEI Hero in view:', seiHeroInView, 'Product Filter in view:', productFilterInView, 'Products Intro in view:', productsIntroInView, 'Footer in view:', footerInView);

        // Apply background color if any of the target sections are visible
        // and sei-hero is not visible
        if ((productFilterInView || productsIntroInView) && !seiHeroInView) {
            headerBottom.style.setProperty('--header-bg-color', '#5f5f5f');
            headerBottom.style.backgroundColor = '#5f5f5f';
            headerBottom.style.transition = 'background-color 0.3s ease';
            console.log('Applied background color for:', {
                productFilter: productFilterInView,
                productsIntro: productsIntroInView
            });
        } else if (seiHeroInView) {
            // Return to transparent when sei-hero is visible
            headerBottom.style.setProperty('--header-bg-color', 'transparent');
            headerBottom.style.backgroundColor = 'transparent';
            console.log('Applied transparent background for sei-hero');
        } else if (footerInView && !productFilterInView && !productsIntroInView) {
            // Return to transparent when footer is visible AND no target sections are visible
            headerBottom.style.setProperty('--header-bg-color', 'transparent');
            headerBottom.style.backgroundColor = 'transparent';
           
        } else {
            
            // If no specific conditions are met, keep the current state
            console.log('No change to background - Current state maintained');
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
});
