// Career Page - Optimized JavaScript
// Performance optimizations, better error handling, and modern practices

// Configuration
const CONFIG = {
    SLIDE_DURATION: 5000,
    JOBS_PER_PAGE: 6,
    SEARCH_DEBOUNCE: 300,
    ANIMATION_DURATION: 300,
    SCROLL_OFFSET: 100,
    MAX_VISIBLE_PAGES: 5
};

// State management
const state = {
    currentPage: 1,
    filteredJobs: [],
    currentSlideIndex: 0,
    slideInterval: null,
    isInitialized: false
};

// Job data with better structure and more realistic content
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
        postedDate: "2024-01-15",
        skills: ["JavaScript", "Python", "React", "Node.js", "AWS"],
        benefits: ["Health Insurance", "401k", "Remote Work", "Flexible Hours"]
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
        postedDate: "2024-01-10",
        skills: ["Product Strategy", "Analytics", "User Research", "Agile"],
        benefits: ["Health Insurance", "401k", "Stock Options", "Professional Development"]
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
        postedDate: "2024-01-08",
        skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
        benefits: ["Health Insurance", "401k", "Design Tools", "Conference Budget"]
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
        postedDate: "2024-01-05",
        skills: ["Social Media", "Content Creation", "Analytics", "Campaign Management"],
        benefits: ["Flexible Hours", "Remote Work", "Professional Development"]
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
        postedDate: "2024-01-03",
        skills: ["Python", "R", "Machine Learning", "SQL", "Statistics"],
        benefits: ["Health Insurance", "401k", "Remote Work", "Conference Budget"]
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
        postedDate: "2024-01-01",
        skills: ["Customer Service", "Communication", "Product Knowledge", "Analytics"],
        benefits: ["Health Insurance", "401k", "Remote Work", "Performance Bonuses"]
    }
];

// Utility functions
const utils = {
    // Debounce function with better performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Safe DOM element selection
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    },

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Display name mappings
const displayMappings = {
    categories: {
        'engineering': 'Engineering',
        'product': 'Product',
        'design': 'Design',
        'marketing': 'Marketing',
        'sales': 'Sales'
    },
    locations: {
        'remote': 'Remote',
        'hybrid': 'Hybrid',
        'onsite': 'On-site'
    },
    types: {
        'full-time': 'Full-time',
        'part-time': 'Part-time',
        'contract': 'Contract',
        'internship': 'Internship'
    }
};



// Job management system
class JobManager {
    constructor() {
        this.jobs = [...jobsData];
        this.filteredJobs = [...jobsData];
        this.currentPage = 1;
        this.init();
    }

    init() {
        this.bindEvents();
        this.displayJobs();
        this.displayPagination();
    }

    bindEvents() {
        const searchInput = utils.getElement('#job-search');
        const departmentFilter = utils.getElement('#department-filter');
        const locationFilter = utils.getElement('#location-filter');
        const typeFilter = utils.getElement('#type-filter');

        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce(() => this.performSearch(), CONFIG.SEARCH_DEBOUNCE));
        }
        if (departmentFilter) {
            departmentFilter.addEventListener('change', () => this.performSearch());
        }
        if (locationFilter) {
            locationFilter.addEventListener('change', () => this.performSearch());
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.performSearch());
        }
    }

    performSearch() {
        const searchTerm = utils.getElement('#job-search')?.value.toLowerCase() || '';
        const department = utils.getElement('#department-filter')?.value || '';
        const location = utils.getElement('#location-filter')?.value || '';
        const type = utils.getElement('#type-filter')?.value || '';

        this.filteredJobs = this.jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                                job.description.toLowerCase().includes(searchTerm) ||
                                job.department.toLowerCase().includes(searchTerm) ||
                                job.skills?.some(skill => skill.toLowerCase().includes(searchTerm));
            
            const matchesDepartment = !department || job.department === department;
            const matchesLocation = !location || job.location === location;
            const matchesType = !type || job.type === type;

            return matchesSearch && matchesDepartment && matchesLocation && matchesType;
        });

        this.currentPage = 1;
        this.displayJobs();
        this.displayPagination();
    }

    displayJobs() {
        const jobsContainer = utils.getElement('#jobs-container');
        const loadingState = utils.getElement('#loading');
        const noResults = utils.getElement('#no-results');

        if (!jobsContainer) return;

        // Show loading state
        if (loadingState) {
            loadingState.style.display = 'block';
            loadingState.style.opacity = '0';
            setTimeout(() => loadingState.style.opacity = '1', 10);
        }
        
        jobsContainer.innerHTML = '';

        // Simulate loading delay for better UX
        setTimeout(() => {
            // Hide loading state
            if (loadingState) {
                loadingState.style.opacity = '0';
                setTimeout(() => loadingState.style.display = 'none', CONFIG.ANIMATION_DURATION);
            }

            if (this.filteredJobs.length === 0) {
                if (noResults) {
                    noResults.style.display = 'block';
                    noResults.style.opacity = '0';
                    setTimeout(() => noResults.style.opacity = '1', 10);
                }
                return;
            }

            if (noResults) noResults.style.display = 'none';

            const startIndex = (this.currentPage - 1) * CONFIG.JOBS_PER_PAGE;
            const endIndex = startIndex + CONFIG.JOBS_PER_PAGE;
            const jobsToShow = this.filteredJobs.slice(startIndex, endIndex);

            // Animate job cards appearance with better performance
            jobsToShow.forEach((job, index) => {
                const jobCard = this.createJobCard(job);
                jobCard.style.opacity = '0';
                jobCard.style.transform = 'translateY(20px)';
                jobsContainer.appendChild(jobCard);
                
                // Stagger animation with requestAnimationFrame for better performance
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        jobCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        jobCard.style.opacity = '1';
                        jobCard.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            });
        }, CONFIG.ANIMATION_DURATION);
    }

    createJobCard(job) {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
            <div class="job-header">
                <h3>${this.escapeHtml(job.title)}</h3>
                <span class="job-type ${job.type}">${displayMappings.types[job.type] || job.type}</span>
            </div>
            <div class="job-meta">
                <span class="job-location">
                    <i class="fas fa-map-marker-alt" aria-hidden="true"></i> 
                    ${displayMappings.locations[job.location] || job.location}
                </span>
                <span class="job-department">
                    <i class="fas fa-building" aria-hidden="true"></i> 
                    ${displayMappings.categories[job.department] || job.department}
                </span>
            </div>
            <p class="job-description">${this.escapeHtml(job.description)}</p>
            <div class="job-footer">
                <span class="job-salary">${this.escapeHtml(job.salary)}</span>
                <button class="view-details" onclick="jobManager.showJobDetails(${job.id})" aria-label="View details for ${this.escapeHtml(job.title)}">
                    View Details
                </button>
            </div>
        `;
        return card;
    }

    displayPagination() {
        const paginationInfo = utils.getElement('#pagination-info');
        const pageNumbers = utils.getElement('#page-numbers');
        const prevBtn = utils.getElement('#prev-page');
        const nextBtn = utils.getElement('#next-page');

        if (!paginationInfo || !pageNumbers || !prevBtn || !nextBtn) return;

        const totalPages = Math.ceil(this.filteredJobs.length / CONFIG.JOBS_PER_PAGE);
        const startIndex = (this.currentPage - 1) * CONFIG.JOBS_PER_PAGE + 1;
        const endIndex = Math.min(this.currentPage * CONFIG.JOBS_PER_PAGE, this.filteredJobs.length);

        // Update pagination info
        paginationInfo.textContent = `Showing ${startIndex}-${endIndex} of ${this.filteredJobs.length} jobs`;

        // Update button states
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;

        // Generate page numbers with better UX
        pageNumbers.innerHTML = '';
        const maxVisiblePages = CONFIG.MAX_VISIBLE_PAGES;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.setAttribute('aria-label', `Go to page ${i}`);
            pageBtn.onclick = () => this.changePage(i);
            pageNumbers.appendChild(pageBtn);
        }
    }

    changePage(page) {
        this.currentPage = page;
        this.displayJobs();
        this.displayPagination();
        
        // Scroll to jobs section
        const targetElement = utils.getElement('#current-positions');
        if (targetElement) {
            window.scrollTo({ 
                top: targetElement.offsetTop - CONFIG.SCROLL_OFFSET
            });
        }
    }

    showJobDetails(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) return;

        const modal = utils.getElement('#job-modal');
        if (!modal) return;

        // Update modal title
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = this.escapeHtml(job.title);
        }

        // Update meta badges
        const locationBadge = modal.querySelector('.meta-badge.location span');
        const typeBadge = modal.querySelector('.meta-badge.type span');
        const departmentBadge = modal.querySelector('.meta-badge.department span');
        
        if (locationBadge) locationBadge.textContent = displayMappings.locations[job.location] || job.location;
        if (typeBadge) typeBadge.textContent = displayMappings.types[job.type] || job.type;
        if (departmentBadge) departmentBadge.textContent = displayMappings.categories[job.department] || job.department;

        // Update job description
        const jobDescription = modal.querySelector('#modal-job-description');
        if (jobDescription) {
            jobDescription.innerHTML = `<p>${this.escapeHtml(job.description)}</p>`;
        }

        // Update requirements
        const jobRequirements = modal.querySelector('#modal-job-requirements');
        if (jobRequirements) {
            jobRequirements.innerHTML = `<p>${this.escapeHtml(job.requirements)}</p>`;
        }

        // Update benefits
        const jobBenefits = modal.querySelector('#modal-job-benefits');
        if (jobBenefits) {
            if (job.benefits && job.benefits.length > 0) {
                jobBenefits.innerHTML = `<ul class="benefits-list">${job.benefits.map(benefit => `<li>${this.escapeHtml(benefit)}</li>`).join('')}</ul>`;
            } else {
                jobBenefits.innerHTML = '<p>Benefits information will be provided during the interview process.</p>';
            }
        }

        // Update job details grid
        const jobDetailsGrid = modal.querySelector('#modal-job-details');
        if (jobDetailsGrid) {
            jobDetailsGrid.innerHTML = `
                <div class="detail-item">
                    <strong>Department</strong>
                    <span>${displayMappings.categories[job.department] || job.department}</span>
                </div>
                <div class="detail-item">
                    <strong>Location</strong>
                    <span>${displayMappings.locations[job.location] || job.location}</span>
                </div>
                <div class="detail-item">
                    <strong>Type</strong>
                    <span>${displayMappings.types[job.type] || job.type}</span>
                </div>
                <div class="detail-item">
                    <strong>Salary</strong>
                    <span>${this.escapeHtml(job.salary)}</span>
                </div>
                <div class="detail-item">
                    <strong>Posted</strong>
                    <span>${utils.formatDate(job.postedDate)}</span>
                </div>
            `;
        }

        // Add skills section if skills exist
        const modalSections = modal.querySelector('.modal-sections');
        if (modalSections && job.skills && job.skills.length > 0) {
            // Check if skills section already exists
            let skillsSection = modalSections.querySelector('.skills-section');
            if (!skillsSection) {
                skillsSection = document.createElement('div');
                skillsSection.className = 'modal-section skills-section';
                skillsSection.innerHTML = `
                    <h3 class="section-title">
                        <i class="fas fa-code"></i>
                        Skills
                    </h3>
                    <div class="section-content">
                        <div class="skills-list"></div>
                    </div>
                `;
                // Insert before the job details section
                const jobDetailsSection = modalSections.querySelector('.modal-section:last-child');
                if (jobDetailsSection) {
                    modalSections.insertBefore(skillsSection, jobDetailsSection);
                }
            }
            
            const skillsList = skillsSection.querySelector('.skills-list');
            if (skillsList) {
                skillsList.innerHTML = job.skills.map(skill => `<span class="skill-tag">${this.escapeHtml(skill)}</span>`).join('');
            }
        } else {
            // Remove skills section if it exists but no skills
            const skillsSection = modalSections?.querySelector('.skills-section');
            if (skillsSection) {
                skillsSection.remove();
            }
        }

        // Bind event listeners
        this.bindModalEvents(modal);

        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Focus management for accessibility
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
    }

    bindModalEvents(modal) {
        // Close modal events
        const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.closeModal());
        });

        // Apply button event
        const applyButton = modal.querySelector('.apply-btn');
        if (applyButton) {
            applyButton.addEventListener('click', () => this.scrollToApplication());
        }

        // Close on overlay click
        const overlay = modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }

        // Prevent background scrolling when scrolling inside modal
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('wheel', (e) => {
                e.stopPropagation();
            }, { passive: true });
        }

        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.addEventListener('wheel', (e) => {
                e.stopPropagation();
            }, { passive: true });
        }

        // Prevent touch scrolling on background
        modal.addEventListener('touchmove', (e) => {
            e.stopPropagation();
        }, { passive: true });
    }

    closeModal() {
        const modal = utils.getElement('#job-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    scrollToApplication() {
        this.closeModal();
        const contactSection = utils.getElement('#contact-section');
        if (contactSection) {
            window.scrollTo({ 
                top: contactSection.offsetTop - CONFIG.SCROLL_OFFSET
            });
        }
    }

    // Security: Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Image slider with better performance
class ImageSlider {
    constructor() {
        this.currentSlideIndex = 0;
        this.slideInterval = null;
        this.slides = [];
        this.init();
    }

    init() {
        this.slides = document.querySelectorAll('.background-slide');
        if (this.slides.length === 0) return;

        // Set initial slide
        this.slides[this.currentSlideIndex].style.opacity = '1';
        
        this.startAutoSlide();
        this.bindEvents();
        this.updateSliderImages();
    }

    bindEvents() {
        const hero = utils.getElement('.hero');
        if (hero) {
            hero.addEventListener('mouseenter', () => this.pauseAutoSlide());
            hero.addEventListener('mouseleave', () => this.startAutoSlide());
        }
        
        // Optimized resize handler
        window.addEventListener('resize', utils.debounce(() => this.updateSliderImages(), 250));
    }

    startAutoSlide() {
        if (this.slideInterval) clearInterval(this.slideInterval);
        this.slideInterval = setInterval(() => this.changeSlide(), CONFIG.SLIDE_DURATION);
    }

    pauseAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }

    changeSlide() {
        if (this.slides.length === 0) return;

        this.slides[this.currentSlideIndex].style.opacity = '0';
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
        this.slides[this.currentSlideIndex].style.opacity = '1';
        
        this.updateSliderImages();
    }

    updateSliderImages() {
        const isMobile = window.innerWidth <= 768;
        
        this.slides.forEach(slide => {
            const desktopImage = slide.getAttribute('data-desktop');
            const mobileImage = slide.getAttribute('data-mobile');
            
            if (isMobile && mobileImage) {
                slide.style.backgroundImage = `url(${mobileImage})`;
            } else if (desktopImage) {
                slide.style.backgroundImage = `url(${desktopImage})`;
            }
        });
    }
}

// Form handler with better validation and UX
class FormHandler {
    constructor() {
        this.form = null;
        this.init();
    }

    init() {
        this.form = utils.getElement('#resume-form');
        if (this.form) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // File upload preview
        const fileInput = this.form.querySelector('#resume');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileChange(e));
        }
    }

    handleFileChange(e) {
        const file = e.target.files[0];
        const fileUploadContent = this.form.querySelector('.file-upload-content');
        
        if (file && fileUploadContent) {
            const fileName = file.name;
            const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
            
            fileUploadContent.innerHTML = `
                <i class="fas fa-file-alt"></i>
                <span>${fileName}</span>
                <small>${fileSize} MB</small>
            `;
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const formData = new FormData(e.target);
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Simulate form submission with better UX
        setTimeout(() => {
            this.showSuccessMessage();
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    validateForm() {
        const requiredFields = ['name', 'email', 'resume'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!field || !field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        // Email validation
        const emailField = this.form.querySelector('[name="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(field, message) {
        if (!field) return;
        
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.field-error');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        if (!field) return;
        
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showSuccessMessage() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Application Submitted!</h3>
            <p>Thank you for your application. We will review your information and get back to you soon.</p>
        `;
        
        this.form.parentNode.insertBefore(successDiv, this.form);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }
}

// Main application class
class CareerApp {
    constructor() {
        this.jobManager = null;
        this.slider = null;
        this.formHandler = null;
    }

    init() {
        try {
            // Initialize components
            this.jobManager = new JobManager();
            this.slider = new ImageSlider();
            this.formHandler = new FormHandler();
            
            // Set global references
            state.isInitialized = true;
            
            // Bind global events
            this.bindGlobalEvents();
            
            console.log('Career application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize career application:', error);
        }
    }

    bindGlobalEvents() {
        // Modal close events
        document.addEventListener('click', (e) => {
            const modal = utils.getElement('#job-modal');
            if (e.target === modal) {
                this.jobManager.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.jobManager.closeModal();
            }
        });

        // Pagination button events
        const prevBtn = utils.getElement('#prev-page');
        const nextBtn = utils.getElement('#next-page');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.jobManager.currentPage > 1) {
                    this.jobManager.changePage(this.jobManager.currentPage - 1);
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.jobManager.filteredJobs.length / CONFIG.JOBS_PER_PAGE);
                if (this.jobManager.currentPage < totalPages) {
                    this.jobManager.changePage(this.jobManager.currentPage + 1);
                }
            });
        }
    }
}

// Initialize application
let careerApp;
let jobManager;

document.addEventListener('DOMContentLoaded', () => {
    careerApp = new CareerApp();
    careerApp.init();
    jobManager = careerApp.jobManager;
});

// Initialize slider when window is loaded (for images)
window.addEventListener('load', () => {
    if (careerApp && careerApp.slider) {
        careerApp.slider.init();
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}
