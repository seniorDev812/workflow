// Lenis Smooth Scrolling Configuration
let lenis;

// Initialize Lenis smooth scrolling with optimized settings
function initLenis() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
        try {
            lenis = new Lenis({
                duration: 0.6, // Reduced from default for faster scrolling
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1.5, // Increased for faster wheel scrolling
                smoothTouch: false, // Disable smooth scrolling on touch devices for better performance
                touchMultiplier: 2,
                infinite: false,
                lerp: 0.1, // Linear interpolation for smoother animation
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);
            
            // Add keyboard shortcut to toggle Lenis (Ctrl/Cmd + Shift + S)
            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
                    e.preventDefault();
                    if (lenis) {
                        lenis.destroy();
                        lenis = null;
                        console.log('Lenis smooth scrolling disabled');
                    } else {
                        initLenis();
                        console.log('Lenis smooth scrolling enabled');
                    }
                }
            });
            
            console.log('Lenis smooth scrolling initialized with optimized settings');
        } catch (error) {
            console.warn('Failed to initialize Lenis:', error);
            lenis = null;
        }
    } else {
        console.log('Lenis not available or reduced motion preferred');
    }
}

// Job data
const jobsData = [
    {
        id: 1,
        title: "Senior Software Engineer",
        department: "engineering",
        location: "remote",
        type: "full-time",
        salary: "$120,000 - $150,000",
        description: "We are looking for a Senior Software Engineer to join our team and help build innovative solutions.",
        requirements: "5+ years of experience in software development, proficiency in JavaScript, Python, and cloud technologies.",
        responsibilities: "Lead technical projects, mentor junior developers, collaborate with cross-functional teams.",
        postedDate: "2024-01-15"
    },
    {
        id: 2,
        title: "Product Manager",
        department: "product",
        location: "hybrid",
        type: "full-time",
        salary: "$100,000 - $130,000",
        description: "Join our product team to drive the development of cutting-edge solutions.",
        requirements: "3+ years of product management experience, strong analytical skills, excellent communication.",
        responsibilities: "Define product strategy, work with engineering teams, analyze market trends.",
        postedDate: "2024-01-10"
    },
    {
        id: 3,
        title: "UX Designer",
        department: "design",
        location: "onsite",
        type: "full-time",
        salary: "$80,000 - $110,000",
        description: "Create beautiful and intuitive user experiences for our products.",
        requirements: "2+ years of UX design experience, proficiency in Figma, user research skills.",
        responsibilities: "Design user interfaces, conduct user research, collaborate with development teams.",
        postedDate: "2024-01-08"
    },
    {
        id: 4,
        title: "Marketing Specialist",
        department: "marketing",
        location: "remote",
        type: "part-time",
        salary: "$50,000 - $70,000",
        description: "Help us grow our brand and reach new customers through innovative marketing strategies.",
        requirements: "2+ years of marketing experience, social media expertise, content creation skills.",
        responsibilities: "Develop marketing campaigns, manage social media, create content.",
        postedDate: "2024-01-05"
    },
    {
        id: 5,
        title: "Data Scientist",
        department: "engineering",
        location: "hybrid",
        type: "full-time",
        salary: "$110,000 - $140,000",
        description: "Analyze complex data sets to drive business decisions and product improvements.",
        requirements: "3+ years of data science experience, Python/R proficiency, machine learning expertise.",
        responsibilities: "Build predictive models, analyze data trends, present insights to stakeholders.",
        postedDate: "2024-01-03"
    },
    {
        id: 6,
        title: "Customer Success Manager",
        department: "sales",
        location: "remote",
        type: "full-time",
        salary: "$70,000 - $90,000",
        description: "Ensure customer satisfaction and drive product adoption through excellent service.",
        requirements: "2+ years of customer success experience, strong communication skills, technical aptitude.",
        responsibilities: "Onboard new customers, provide support, drive product adoption.",
        postedDate: "2024-01-01"
    }
];

// Global variables
let currentPage = 1;
let jobsPerPage = 6;
let filteredJobs = [...jobsData];
let currentSlideIndex = 0;
let slideInterval;
const slideDuration = 5000; // 5 seconds

// Initialize the application
function initializeApp() {
    initLenis(); // Initialize Lenis smooth scrolling
    initializeSlider();
    initializeJobSearch();
    initializeFormHandling();
    displayJobs();
    displayPagination();
    
    // Add scroll indicator
    addScrollIndicator();
}

// Initialize job search and filtering
function initializeJobSearch() {
    const searchInput = document.getElementById('job-search');
    const departmentFilter = document.getElementById('department-filter');
    const locationFilter = document.getElementById('location-filter');
    const typeFilter = document.getElementById('type-filter');

    // Add event listeners with debouncing
    searchInput.addEventListener('input', debounce(performSearch, 300));
    departmentFilter.addEventListener('change', performSearch);
    locationFilter.addEventListener('change', performSearch);
    typeFilter.addEventListener('change', performSearch);
}

// Perform search and filtering
function performSearch() {
    const searchTerm = document.getElementById('job-search').value.toLowerCase();
    const department = document.getElementById('department-filter').value;
    const location = document.getElementById('location-filter').value;
    const type = document.getElementById('type-filter').value;

    filteredJobs = jobsData.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                            job.description.toLowerCase().includes(searchTerm) ||
                            job.department.toLowerCase().includes(searchTerm);
        
        const matchesDepartment = department === '' || job.department === department;
        const matchesLocation = location === '' || job.location === location;
        const matchesType = type === '' || job.type === type;

        return matchesSearch && matchesDepartment && matchesLocation && matchesType;
    });

    currentPage = 1;
    displayJobs();
    displayPagination();
}

// Debounce function for search input
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

// Display jobs on current page
function displayJobs() {
    const jobsContainer = document.getElementById('jobs-container');
    const loadingState = document.getElementById('loading');
    const noResults = document.getElementById('no-results');

    // Show loading state with animation
    loadingState.style.display = 'block';
    loadingState.style.opacity = '0';
    setTimeout(() => {
        loadingState.style.opacity = '1';
    }, 10);
    
    jobsContainer.innerHTML = '';

    // Simulate loading delay with better UX
    setTimeout(() => {
        // Fade out loading state
        loadingState.style.opacity = '0';
        setTimeout(() => {
            loadingState.style.display = 'none';
        }, 300);

        if (filteredJobs.length === 0) {
            noResults.style.display = 'block';
            noResults.style.opacity = '0';
            setTimeout(() => {
                noResults.style.opacity = '1';
            }, 10);
            return;
        }

        noResults.style.display = 'none';

        const startIndex = (currentPage - 1) * jobsPerPage;
        const endIndex = startIndex + jobsPerPage;
        const jobsToShow = filteredJobs.slice(startIndex, endIndex);

        // Animate job cards appearance
        jobsToShow.forEach((job, index) => {
            const jobCard = createJobCard(job);
            jobCard.style.opacity = '0';
            jobCard.style.transform = 'translateY(20px)';
            jobsContainer.appendChild(jobCard);
            
            // Stagger animation
            setTimeout(() => {
                jobCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                jobCard.style.opacity = '1';
                jobCard.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
}

// Create job card element
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="job-header">
            <h3>${job.title}</h3>
            <span class="job-type ${job.type}">${getTypeDisplayName(job.type)}</span>
        </div>
        <div class="job-meta">
            <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${getLocationDisplayName(job.location)}</span>
            <span class="job-department"><i class="fas fa-building"></i> ${getCategoryDisplayName(job.department)}</span>
        </div>
        <p class="job-description">${job.description}</p>
        <div class="job-footer">
            <span class="job-salary">${job.salary}</span>
            <button class="view-details" onclick="showJobDetails(${job.id})">View Details</button>
        </div>
    `;
    return card;
}

// Display pagination
function displayPagination() {
    const paginationInfo = document.getElementById('pagination-info');
    const pageNumbers = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    const startIndex = (currentPage - 1) * jobsPerPage + 1;
    const endIndex = Math.min(currentPage * jobsPerPage, filteredJobs.length);

    // Update pagination info
    paginationInfo.textContent = `Showing ${startIndex}-${endIndex} of ${filteredJobs.length} jobs`;

    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Generate page numbers
    pageNumbers.innerHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changePage(i);
        pageNumbers.appendChild(pageBtn);
    }
}

// Change page
function changePage(page) {
    currentPage = page;
    displayJobs();
    displayPagination();
    
    // Use Lenis for smooth scrolling if available, otherwise use native smooth scroll
    const targetElement = document.getElementById('current-positions');
    if (targetElement) {
        const targetTop = targetElement.offsetTop - 100;
        if (lenis) {
            lenis.scrollTo(targetTop, { duration: 1 });
        } else {
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
    }
}

// Initialize form handling
function initializeFormHandling() {
    const resumeForm = document.getElementById('resume-form');
    
    resumeForm.addEventListener('submit', handleFormSubmit);
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const position = formData.get('position');
    const message = formData.get('message');
    const resume = formData.get('resume');

    // Basic validation
    if (!name || !email || !position) {
        alert('Please fill in all required fields.');
        return;
    }

    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert('Thank you for your application! We will get back to you soon.');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Show job details modal
function showJobDetails(jobId) {
    const job = jobsData.find(j => j.id === jobId);
    if (!job) return;

    const modal = document.getElementById('job-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${job.title}</h2>
            <button class="close-modal" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="job-details-section">
                <h3>Job Overview</h3>
                <p>${job.description}</p>
            </div>
            <div class="job-details-section">
                <h3>Requirements</h3>
                <p>${job.requirements}</p>
            </div>
            <div class="job-details-section">
                <h3>Responsibilities</h3>
                <p>${job.responsibilities}</p>
            </div>
            <div class="job-details-grid">
                <div class="detail-item">
                    <strong>Department:</strong>
                    <span>${getCategoryDisplayName(job.department)}</span>
                </div>
                <div class="detail-item">
                    <strong>Location:</strong>
                    <span>${getLocationDisplayName(job.location)}</span>
                </div>
                <div class="detail-item">
                    <strong>Type:</strong>
                    <span>${getTypeDisplayName(job.type)}</span>
                </div>
                <div class="detail-item">
                    <strong>Salary:</strong>
                    <span>${job.salary}</span>
                </div>
                <div class="detail-item">
                    <strong>Posted:</strong>
                    <span>${new Date(job.postedDate).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="apply-btn" onclick="scrollToApplication()">Apply Now</button>
            <button class="close-btn" onclick="closeModal()">Close</button>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('job-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Scroll to application form
function scrollToApplication() {
    closeModal();
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
        if (lenis) {
            lenis.scrollTo(contactSection, { duration: 1 });
        } else {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize image slider
function initializeSlider() {
    const slides = document.querySelectorAll('.background-slide');
    if (slides.length === 0) return;

    // Set initial slide
    slides[currentSlideIndex].style.opacity = '1';
    
    // Start auto-slide
    startAutoSlide();
    
    // Add hover pause functionality
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', pauseAutoSlide);
        hero.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Update images on window resize
    window.addEventListener('resize', debounce(updateSliderImages, 250));
    
    // Initial image update
    updateSliderImages();
}

// Start auto-slide
function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        changeSlide();
    }, slideDuration);
}

// Pause auto-slide
function pauseAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// Change slide
function changeSlide() {
    const slides = document.querySelectorAll('.background-slide');
    if (slides.length === 0) return;

    slides[currentSlideIndex].style.opacity = '0';
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].style.opacity = '1';
    
    updateSliderImages();
}

// Update slider images based on screen size
function updateSliderImages() {
    const slides = document.querySelectorAll('.background-slide');
    const isMobile = window.innerWidth <= 768;
    
    slides.forEach(slide => {
        const desktopImage = slide.getAttribute('data-desktop');
        const mobileImage = slide.getAttribute('data-mobile');
        
        if (isMobile && mobileImage) {
            slide.style.backgroundImage = `url(${mobileImage})`;
        } else if (desktopImage) {
            slide.style.backgroundImage = `url(${desktopImage})`;
        }
    });
}

// Utility functions for display names
function getCategoryDisplayName(category) {
    const categories = {
        'engineering': 'Engineering',
        'product': 'Product',
        'design': 'Design',
        'marketing': 'Marketing',
        'sales': 'Sales'
    };
    return categories[category] || category;
}

function getLocationDisplayName(location) {
    const locations = {
        'remote': 'Remote',
        'hybrid': 'Hybrid',
        'onsite': 'On-site'
    };
    return locations[location] || location;
}

function getTypeDisplayName(type) {
    const types = {
        'full-time': 'Full-time',
        'part-time': 'Part-time',
        'contract': 'Contract',
        'internship': 'Internship'
    };
    return types[type] || type;
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('job-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Add scroll indicator to show Lenis status
function addScrollIndicator() {
    // Create indicator element
    const indicator = document.createElement('div');
    indicator.id = 'scroll-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        cursor: pointer;
        transition: opacity 0.3s ease;
        opacity: 0.7;
    `;
    indicator.textContent = lenis ? 'Smooth Scroll: ON' : 'Smooth Scroll: OFF';
    
    // Add click handler to toggle
    indicator.addEventListener('click', function() {
        if (lenis) {
            lenis.destroy();
            lenis = null;
            indicator.textContent = 'Smooth Scroll: OFF';
        } else {
            initLenis();
            indicator.textContent = lenis ? 'Smooth Scroll: ON' : 'Smooth Scroll: OFF';
        }
    });
    
    // Add hover effect
    indicator.addEventListener('mouseenter', function() {
        indicator.style.opacity = '1';
    });
    
    indicator.addEventListener('mouseleave', function() {
        indicator.style.opacity = '0.7';
    });
    
    // Hide indicator after 3 seconds
    setTimeout(() => {
        indicator.style.opacity = '0.3';
    }, 3000);
    
    document.body.appendChild(indicator);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Initialize slider when window is loaded (for images)
window.addEventListener('load', () => {
    initializeSlider();
});
