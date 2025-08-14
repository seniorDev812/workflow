// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Cache DOM elements for better performance
let cachedElements = {};

function getCachedElement(selector) {
    if (!cachedElements[selector]) {
        cachedElements[selector] = document.querySelector(selector);
    }
    return cachedElements[selector];
}

function initializeApp() {
    // Initialize accordion functionality
    initializeAccordion();
    
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize layout switching
    initializeLayoutSwitching();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize hide filters
    initializeHideFilters();
    
    // Initialize responsive behavior with throttling
    initializeResponsiveBehavior();
    
    // Ensure sidebar is visible on page load
    ensureSidebarVisibility();
}

// Optimized accordion functionality
function initializeAccordion() {
    const accordionHeaders = document.querySelectorAll('.sei-accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.closest('.sei-accordion-item');
            const accordionContent = accordionItem.querySelector('.sei-accordion-content');
            const isActive = this.classList.contains('active');
            
            // Close all other accordion items
            document.querySelectorAll('.sei-accordion-header').forEach(h => {
                h.classList.remove('active');
                h.closest('.sei-accordion-item').querySelector('.sei-accordion-content').classList.remove('open');
            });
            
            // Toggle current accordion item
            if (!isActive) {
                this.classList.add('active');
                accordionContent.classList.add('open');
            }
        });
    });
    
    // Product specification accordion
    const accordionMains = document.querySelectorAll('.sei-accordion-main');
    
    accordionMains.forEach(main => {
        main.addEventListener('click', function() {
            const panel = this.nextElementSibling;
            const isActive = panel.classList.contains('active');
            
            // Close all other panels
            document.querySelectorAll('.sei-panel').forEach(p => {
                p.classList.remove('active');
                p.classList.remove('opan');
            });
            
            // Remove active class from all accordion mains
            document.querySelectorAll('.sei-accordion-main').forEach(m => {
                m.classList.remove('active');
            });
            
            // Toggle current panel
            if (!isActive) {
                panel.classList.add('active');
                panel.classList.add('opan');
                
                // Add active class to accordion main
                this.classList.add('active');
            } else {
                panel.classList.remove('active');
                panel.classList.remove('opan');
                this.classList.remove('active');
            }
        });
    });
}

// Optimized filter functionality
function initializeFilters() {
    const filterCheckboxes = document.querySelectorAll('.sei-filter-oem-cat-cb');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            handleFilterChange(this);
        });
    });
    
    // Handle "Show All" functionality
    const showAllCheckboxes = document.querySelectorAll('.sei-filter-oem-cat-cb[value="Show All"]');
    showAllCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Uncheck all other checkboxes in the same group
                const group = this.closest('.sei-accordion-content');
                group.querySelectorAll('.sei-filter-oem-cat-cb').forEach(cb => {
                    if (cb !== this) {
                        cb.checked = false;
                    }
                });
            }
        });
    });
}

function handleFilterChange(checkbox) {
    const value = checkbox.value;
    const accordionItem = checkbox.closest('.sei-accordion-item');
    const accordionId = accordionItem.querySelector('.sei-accordion-header').getAttribute('data-id');
    
    if (value === 'Show All') {
        // Show all products for this category
        console.log('Showing all products for category:', accordionId);
        loadProductsForCategory(accordionId, 'all');
    } else {
        // Filter products based on selection
        console.log('Filtering products by:', value, 'in category:', accordionId);
        loadProductsForCategory(accordionId, value);
    }
    
    // In a real implementation, this would trigger an AJAX call to load filtered products
    console.log('Filter changed:', {
        category: accordionId,
        value: value,
        checked: checkbox.checked
    });
}

function loadProductsForCategory(categoryId, filterValue) {
    // This function would make an AJAX call to load products
    // For now, we'll just log the action
    console.log(`Loading products for category ${categoryId} with filter ${filterValue}`);
    
    // Simulate loading delay
    setTimeout(() => {
        console.log('Products loaded successfully');
    }, 500);
}

// Optimized layout switching functionality
function initializeLayoutSwitching() {
    const layoutFilters = document.querySelectorAll('.sei-sw-layout-filter');
    
    layoutFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            const view = this.getAttribute('data-view');
            
            // Remove active class from all filters
            layoutFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Update product list layout
            switchLayout(view);
        });
    });
}

function switchLayout(view) {
    const productList = document.querySelector('.sei-product-list');
    
    if (view === 'list') {
        productList.classList.add('list-view');
    } else {
        productList.classList.remove('list-view');
    }
    
    console.log('Switched to layout:', view);
}

// Optimized search functionality with debouncing
function initializeSearch() {
    const searchInputs = document.querySelectorAll('.sei-sw-part-filter-search-text');
    const searchButtons = document.querySelectorAll('.sei-sw-part-filter-search-btn');
    
    searchInputs.forEach((input, index) => {
        const searchBtn = searchButtons[index];
        
        // Search on input with debouncing
        const debouncedSearch = debounce(function(query) {
            performSearch(query, input);
        }, 300);
        
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            debouncedSearch(query);
        });
        
        // Search on button click
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                const query = input.value.toLowerCase();
                performSearch(query, input);
            });
        }
        
        // Search on Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.toLowerCase();
                performSearch(query, this);
            }
        });
    });
}

function performSearch(query, inputElement) {
    const accordionContent = inputElement.closest('.sei-accordion-content');
    const checkboxes = accordionContent.querySelectorAll('.sei-checkbox-list li');
    
    checkboxes.forEach(item => {
        const label = item.querySelector('label span');
        const text = label.textContent.toLowerCase();
        
        if (text.includes(query) || query === '') {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    console.log('Searching for:', query);
}

// Optimized mobile menu functionality
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function closeMenu(e) {
                if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                    nav.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.removeEventListener('click', closeMenu);
                }
            });
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const nav = document.querySelector('.nav');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (nav && mobileToggle) {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });
}

// Optimized hide/show filters functionality
function initializeHideFilters() {
    const hideFilterBtn = document.querySelector('.sei-hide-filter-option');
    const sidebar = document.querySelector('.sei-product-filter-sidebar');
    
    if (hideFilterBtn && sidebar) {
        // Ensure sidebar is visible by default
        sidebar.classList.remove('hidden');
        sidebar.style.display = 'block';
        
        hideFilterBtn.addEventListener('click', function() {
            const isHidden = sidebar.classList.contains('hidden');
            
            if (isHidden) {
                sidebar.classList.remove('hidden');
                sidebar.style.display = 'block';
                this.textContent = 'Hide filters';
            } else {
                sidebar.classList.add('hidden');
                sidebar.style.display = 'none';
                this.textContent = 'Show filters';
            }
        });
    }
}

// Optimized responsive behavior with throttling
function initializeResponsiveBehavior() {
    // Handle window resize with throttling
    const throttledResize = throttle(function() {
        handleResize();
    }, 250);
    
    window.addEventListener('resize', throttledResize);
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            handleResize();
        }, 500);
    });
    
    // Initial call
    handleResize();
}

function handleResize() {
    const width = window.innerWidth;
    
    // Ensure sidebar is always visible regardless of screen size
    ensureSidebarVisibility();
    
    // Mobile behavior
    if (width <= 768) {
        enableMobileBehavior();
    } else {
        disableMobileBehavior();
    }
    
    // Tablet behavior
    if (width <= 1024 && width > 768) {
        enableTabletBehavior();
    }
    
    // Desktop behavior
    if (width > 1024) {
        enableDesktopBehavior();
    }
}

// Function to ensure sidebar is always visible
function ensureSidebarVisibility() {
    const sidebar = document.querySelector('.sei-product-filter-sidebar');
    if (sidebar) {
        // Only show if it's not manually hidden by user
        const hideBtn = document.querySelector('.sei-hide-filter-option');
        if (hideBtn && hideBtn.textContent === 'Show filters') {
            // User has manually hidden it, don't interfere
            return;
        }
        
        sidebar.classList.remove('hidden');
        sidebar.style.display = 'block';
    }
}

function enableMobileBehavior() {
    // Ensure sidebar is always visible on mobile
    const sidebar = document.querySelector('.sei-product-filter-sidebar');
    if (sidebar) {
        sidebar.classList.remove('hidden');
        sidebar.style.display = 'block';
    }
    
    // Optimize accordion behavior for mobile
    const accordionHeaders = document.querySelectorAll('.sei-accordion-header');
    accordionHeaders.forEach(header => {
        header.style.minHeight = '44px'; // Better touch target
    });
}

function disableMobileBehavior() {
    // Reset mobile-specific styles
    const accordionHeaders = document.querySelectorAll('.sei-accordion-header');
    accordionHeaders.forEach(header => {
        header.style.minHeight = '52px';
    });
}

function enableTabletBehavior() {
    // Tablet-specific optimizations
    console.log('Tablet mode enabled');
}

function enableDesktopBehavior() {
    // Desktop-specific optimizations
    console.log('Desktop mode enabled');
}

// Touch-friendly interactions for mobile
function initializeTouchInteractions() {
    // Add touch feedback for buttons
    const touchElements = document.querySelectorAll('button, .sei-accordion-header, .sei-accordion-main, .sei-sw-layout-filter');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        element.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
        
        element.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
        });
    });
}

// Initialize touch interactions
document.addEventListener('DOMContentLoaded', function() {
    initializeTouchInteractions();
});

// Export functions for global access
window.handleFilterChange = handleFilterChange;
window.switchLayout = switchLayout;
window.performSearch = performSearch;
window.loadProductsForCategory = loadProductsForCategory;
window.handleResize = handleResize;
