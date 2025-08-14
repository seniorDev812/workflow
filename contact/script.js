/**
 * Lead Generation Form Handler
 * Manages the contact form with product requirements and auto-suggestions
 */

class LeadGenerationForm {
    constructor() {
        this.form = document.getElementById('lead-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.loading = document.getElementById('loading');
        this.btnText = document.querySelector('.seen-contact-btn-text');
        this.successMessage = document.getElementById('success-message');
        this.addRowBtn = document.getElementById('add-row-btn');
        this.tbody = document.getElementById('requirements-tbody');
        
        this.rowCounter = 0;
        this.suggestions = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.addInitialRow();
        this.loadProductSuggestions();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.addRowBtn.addEventListener('click', () => this.addRow());
        
        this.form.addEventListener('input', (e) => this.validateField(e.target));
        this.form.addEventListener('blur', (e) => this.validateField(e.target));
    }

    addInitialRow() {
        this.addRow();
    }

    addRow() {
        this.rowCounter++;
        const row = document.createElement('tr');
        row.className = 'requirement-row';
        row.dataset.rowId = this.rowCounter;
        
        row.innerHTML = `
            <td>
                <input type="text" name="productName[]" class="product-name-input" placeholder="Enter product name">
            </td>
            <td>
                <div class="relative">
                    <input type="text" name="partNumber[]" class="part-number-input" placeholder="Enter part number" autocomplete="off">
                    <div class="seen-contact-suggestions-dropdown" id="suggestions-${this.rowCounter}"></div>
                </div>
            </td>
            <td>
                <input type="number" name="quantity[]" class="quantity-input" placeholder="Qty" min="1">
            </td>
            <td>
                <input type="text" name="leadTime[]" class="lead-time-input" placeholder="e.g., 2-3 weeks">
            </td>
            <td>
                ${this.rowCounter > 1 ? '<button type="button" class="seen-contact-remove-row-btn" onclick="leadForm.removeRow(this)"><i class="fas fa-trash"></i></button>' : ''}
            </td>
        `;
        
        this.tbody.appendChild(row);
        
        const partNumberInput = row.querySelector('.part-number-input');
        const suggestionsDropdown = row.querySelector('.seen-contact-suggestions-dropdown');
        
        partNumberInput.addEventListener('input', (e) => this.handlePartNumberInput(e, suggestionsDropdown));
        partNumberInput.addEventListener('focus', () => this.showSuggestions(suggestionsDropdown, partNumberInput.value));
        partNumberInput.addEventListener('blur', () => setTimeout(() => this.hideSuggestions(suggestionsDropdown), 200));
        
        this.updateRemoveButtons();
    }

    removeRow(button) {
        const row = button.closest('tr');
        row.remove();
        this.updateRemoveButtons();
    }

    updateRemoveButtons() {
        const rows = this.tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const removeBtn = row.querySelector('.seen-contact-remove-row-btn');
            if (removeBtn) {
                removeBtn.style.display = index === 0 ? 'none' : 'block';
            }
        });
    }

    loadProductSuggestions() {
        this.suggestions = [
            { partNumber: 'PN001', name: 'Industrial Sensor Module', category: 'Sensors' },
            { partNumber: 'PN002', name: 'Control Panel Display', category: 'Displays' },
            { partNumber: 'PN003', name: 'Power Supply Unit', category: 'Power' },
            { partNumber: 'PN004', name: 'Communication Module', category: 'Communication' },
            { partNumber: 'PN005', name: 'Motor Controller', category: 'Controllers' },
            { partNumber: 'PN006', name: 'Temperature Sensor', category: 'Sensors' },
            { partNumber: 'PN007', name: 'Pressure Transmitter', category: 'Sensors' },
            { partNumber: 'PN008', name: 'Flow Meter', category: 'Measurement' },
            { partNumber: 'PN009', name: 'Valve Actuator', category: 'Actuators' },
            { partNumber: 'PN010', name: 'PLC Module', category: 'Controllers' }
        ];
    }

    handlePartNumberInput(event, dropdown) {
        const value = event.target.value;
        this.showSuggestions(dropdown, value);
    }

    showSuggestions(dropdown, query) {
        if (!query.trim()) {
            this.hideSuggestions(dropdown);
            return;
        }

        const filtered = this.suggestions.filter(item => 
            item.partNumber.toLowerCase().includes(query.toLowerCase()) ||
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length === 0) {
            this.hideSuggestions(dropdown);
            return;
        }

        dropdown.innerHTML = filtered.map(item => `
                            <div class="seen-contact-suggestion-item" data-part-number="${item.partNumber}" data-name="${item.name}">
                <div class="font-medium">${item.partNumber}</div>
                <div class="text-sm text-gray-600">${item.name}</div>
            </div>
        `).join('');

        dropdown.style.display = 'block';

        dropdown.querySelectorAll('.seen-contact-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const partNumber = item.dataset.partNumber;
                const name = item.dataset.name;
                const row = dropdown.closest('tr');
                
                row.querySelector('.part-number-input').value = partNumber;
                row.querySelector('.product-name-input').value = name;
                
                this.hideSuggestions(dropdown);
            });
        });
    }

    hideSuggestions(dropdown) {
        dropdown.style.display = 'none';
    }

    validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (!errorElement) return;

        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'tel':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                isValid = phoneRegex.test(value.replace(/\s/g, ''));
                errorMessage = 'Please enter a valid phone number';
                break;
            default:
                if (field.hasAttribute('required')) {
                    isValid = value.length > 0;
                    errorMessage = `Please enter your ${field.placeholder || field.name}`;
                }
        }

        if (!isValid && value.length > 0) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        } else {
            field.classList.remove('error');
            errorElement.classList.remove('show');
        }
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            this.validateField(field);
            if (field.classList.contains('error')) {
                isValid = false;
            }
        });

        const productRows = this.tbody.querySelectorAll('tr');
        let hasProduct = false;

        productRows.forEach(row => {
            const partNumber = row.querySelector('.part-number-input').value.trim();
            const quantity = row.querySelector('.quantity-input').value.trim();
            
            if (partNumber && quantity) {
                hasProduct = true;
            }
        });

        if (!hasProduct) {
            alert('Please add at least one product requirement');
            isValid = false;
        }

        return isValid;
    }

    async handleSubmit(event) {
        event.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        this.setLoading(true);

        try {
            const formData = this.collectFormData();
            await this.submitForm(formData);
            
            this.showSuccess();
            this.form.reset();
            this.resetProductTable();
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error submitting your request. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    collectFormData() {
        const formData = new FormData(this.form);
        const data = {
            contact: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                company: formData.get('company'),
                country: formData.get('country'),
                phone: formData.get('phone'),
                email: formData.get('email')
            },
            requirements: []
        };

        const productNames = formData.getAll('productName[]');
        const partNumbers = formData.getAll('partNumber[]');
        const quantities = formData.getAll('quantity[]');
        const leadTimes = formData.getAll('leadTime[]');

        for (let i = 0; i < productNames.length; i++) {
            if (partNumbers[i] && quantities[i]) {
                data.requirements.push({
                    name: productNames[i],
                    partNumber: partNumbers[i],
                    quantity: quantities[i],
                    leadTime: leadTimes[i]
                });
            }
        }

        return data;
    }

    async submitForm(data) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Form data to submit:', data);
    }

    setLoading(loading) {
        if (loading) {
            this.submitBtn.disabled = true;
            this.loading.classList.add('show');
            this.btnText.style.display = 'none';
        } else {
            this.submitBtn.disabled = false;
            this.loading.classList.remove('show');
            this.btnText.style.display = 'inline-flex';
        }
    }

    showSuccess() {
        this.successMessage.classList.add('show');
        setTimeout(() => {
            this.successMessage.classList.remove('show');
        }, 5000);
    }

    resetProductTable() {
        this.tbody.innerHTML = '';
        this.rowCounter = 0;
        this.addInitialRow();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.leadForm = new LeadGenerationForm();
});
