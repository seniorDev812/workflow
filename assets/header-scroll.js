// Scroll-based header background color functionality
document.addEventListener('DOMContentLoaded', function() {
    const headerBottom = document.querySelector('.header-bottom');
    const bannerField = document.querySelector('.banner-field.relative.overflow-hidden.isolate');
    const carouselField = document.querySelector('.carousel-field.relative.w-full');
    const aboutField = document.querySelector('.about-field');
    const worldMapSection = document.querySelector('.world-map-section');
    const brandsField = document.querySelector('.brands-field');
    const footerField = document.querySelector('.footer-field');
    // Debug element detection
    console.log('Elements found:', {
        headerBottom: !!headerBottom,
        bannerField: !!bannerField,
        carouselField: !!carouselField,
        aboutField: !!aboutField,
        worldMapSection: !!worldMapSection,
        brandsField: !!brandsField
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
    
    // Function to check if element has been passed (completely out of view)
    function hasPassedElement(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.bottom < 0;
    }
    
    // Function to update header background
    function updateHeaderBackground() {
        // Check if banner-field or carousel-field is visible
        const bannerInView = isElementInViewport(bannerField);
        const carouselInView = isElementInViewport(carouselField);
        
        // Check if any of the target sections are visible
        const aboutInView = isElementInViewport(aboutField);
        const worldMapInView = isElementInViewport(worldMapSection);
        const brandsInView = isElementInViewport(brandsField);
        const footerInView = isElementInViewport(footerField);
        
        // Debug logging
  
        // Apply background color if any of the target sections are visible
        // and banner is not visible
        if ((aboutInView || worldMapInView || brandsInView) && !bannerInView) {
            headerBottom.style.backgroundColor = '#5f5f5f';
            headerBottom.style.transition = 'background-color 0.3s ease';
            console.log('Applied background color for:', {
                about: aboutInView,
                worldMap: worldMapInView,
                brands: brandsInView
            });
        } else if (bannerInView) {
            // Return to transparent when banner-field is visible
            headerBottom.style.backgroundColor = 'transparent';
            console.log('Applied transparent background for banner');
        } else if (footerInView && !aboutInView && !worldMapInView && !brandsInView) {
            // Return to transparent when footer is visible AND no target sections are visible
            headerBottom.style.backgroundColor = 'transparent';
         
        } else {
            
            // If no specific conditions are met, keep the current state
        
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
