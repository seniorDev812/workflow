// Products Page - Header background color functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Header scroll script loaded');
    
    // Check if we're on the products page
    const seiHero = document.querySelector('.sei-hero');
    const isProductsPage = !!seiHero;
    
    if (!isProductsPage) {
        console.log('Not products page, skipping header scroll functionality');
        return;
    }
    
    console.log('Products page detected, initializing header scroll');
    
    // Add CSS to ensure our styles take precedence
    const style = document.createElement('style');
    style.textContent = `
        .header-bottom {
            transition: background-color 0.3s ease !important;
        }
        .header-bottom.bg-transparent {
            background-color: transparent !important;
        }
        .header-bottom.bg-active {
            background-color: #5f5f5f !important;
        }
    `;
    document.head.appendChild(style);
    
    const headerBottom = document.querySelector('.header-bottom');
    
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
        const heroInView = isElementInViewport(seiHero);
        
        if (heroInView) {
            // sei-hero section is visible - make header transparent
            headerBottom.classList.remove('bg-active');
            headerBottom.classList.add('bg-transparent');
            headerBottom.style.backgroundColor = 'transparent';
            console.log('Applied transparent background for sei-hero section');
        } else {
            // sei-hero section is not visible - make header opaque
            headerBottom.classList.add('bg-active');
            headerBottom.classList.remove('bg-transparent');
            headerBottom.style.backgroundColor = '#5f5f5f';
            console.log('Applied opaque background #5f5f5f when sei-hero is not visible');
        }
    }
    
    // Set initial state immediately
    const heroInView = isElementInViewport(seiHero);
    if (heroInView) {
        headerBottom.classList.remove('bg-active');
        headerBottom.classList.add('bg-transparent');
        headerBottom.style.backgroundColor = 'transparent';
        console.log('Initial state: Applied transparent background for sei-hero section');
    } else {
        headerBottom.classList.add('bg-active');
        headerBottom.classList.remove('bg-transparent');
        headerBottom.style.backgroundColor = '#5f5f5f';
        console.log('Initial state: Applied opaque background #5f5f5f');
    }
    
    // Add scroll event listener with throttling
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
    
    // Also update on window resize
    window.addEventListener('resize', function() {
        setTimeout(updateHeaderBackground, 100);
    });
    
    // Force update every 100ms for the first 2 seconds to prevent other scripts from overriding
    let forceUpdateCount = 0;
    const forceUpdateInterval = setInterval(function() {
        updateHeaderBackground();
        forceUpdateCount++;
        if (forceUpdateCount >= 20) { // 2 seconds (20 * 100ms)
            clearInterval(forceUpdateInterval);
        }
    }, 100);
    
    console.log('Header scroll functionality initialized for products page');
});
