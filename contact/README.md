# Lead Generation Form

A modern, responsive lead generation form for collecting product inquiries and contact information.

## Features

### 📋 Contact Information
- **First Name** (required)
- **Last Name** (required)
- **Company Name** (required)
- **Country** (required) - Dropdown with 200+ countries
- **Phone Number** (required) - International format support
- **Email Address** (required) - Email validation

### 📦 Product Requirements Table
- **Product Name** - Auto-populated from part number selection
- **Part Number** - Auto-suggest with product database integration
- **Quantity** - Numeric input with minimum value of 1
- **Lead Time** - Text input for delivery timeline
- **Dynamic Rows** - Add/remove multiple product requirements

### 🎯 Key Functionality
- **Real-time Validation** - Instant feedback on form fields
- **Auto-suggestions** - Product search as you type
- **Responsive Design** - Works on all device sizes
- **Modern UI/UX** - Clean, professional interface
- **Loading States** - Visual feedback during submission
- **Success Messages** - Confirmation after successful submission

## File Structure

```
contact/
├── README.md          # This documentation
├── script.js          # Form functionality and validation
└── styles.css         # Custom styling for the form
```

## Usage

### Basic Implementation
```html
<!-- Include the form in your HTML -->
<link href="./contact/styles.css" rel="stylesheet">
<script src="./contact/script.js"></script>
```

### Form Data Structure
The form collects data in the following format:

```javascript
{
  contact: {
    firstName: "John",
    lastName: "Doe",
    company: "ABC Corporation",
    country: "United States",
    phone: "+1234567890",
    email: "john.doe@example.com"
  },
  requirements: [
    {
      name: "Industrial Sensor Module",
      partNumber: "PN001",
      quantity: "5",
      leadTime: "2-3 weeks"
    }
  ]
}
```

## Configuration

### Product Database
Update the product suggestions in `script.js`:

```javascript
loadProductSuggestions() {
    this.suggestions = [
        { partNumber: 'PN001', name: 'Industrial Sensor Module', category: 'Sensors' },
        { partNumber: 'PN002', name: 'Control Panel Display', category: 'Displays' },
        // Add your products here
    ];
}
```

### API Integration
Replace the mock submission in `script.js`:

```javascript
async submitForm(data) {
    const response = await fetch('/api/lead-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Failed to submit form');
    }
    
    return response.json();
}
```

## Styling Customization

### CSS Variables
The form uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #13171F;
    --accent-color: #F6941E;
    --success-color: #10B981;
    --error-color: #EF4444;
    /* ... more variables */
}
```

### Responsive Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 640px - 767px
- **Small Mobile**: Below 640px

## Validation Rules

### Required Fields
- All contact information fields are required
- At least one product requirement must be added

### Field Validation
- **Email**: Must be a valid email format
- **Phone**: Must be a valid international phone number
- **Quantity**: Must be a positive number
- **Part Number**: Auto-suggestions available from product database

## Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## Accessibility Features

- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - ARIA labels and semantic HTML
- **Focus Management** - Clear focus indicators
- **High Contrast Mode** - Support for high contrast preferences
- **Reduced Motion** - Respects user motion preferences

## Performance Optimizations

- **Debounced Input** - Prevents excessive API calls
- **Lazy Loading** - Suggestions load on demand
- **Minimal DOM Manipulation** - Efficient updates
- **CSS Transitions** - Hardware-accelerated animations

## Security Considerations

- **Input Sanitization** - All user inputs are sanitized
- **CSRF Protection** - Include CSRF tokens in API calls
- **Rate Limiting** - Implement on the server side
- **Data Validation** - Server-side validation required

## Troubleshooting

### Common Issues

1. **Form not submitting**
   - Check browser console for JavaScript errors
   - Verify all required fields are filled
   - Ensure API endpoint is accessible

2. **Auto-suggestions not working**
   - Verify product database is loaded
   - Check network connectivity for API calls
   - Ensure JavaScript is enabled

3. **Styling issues**
   - Verify CSS files are loaded correctly
   - Check for CSS conflicts with existing styles
   - Ensure Tailwind CSS is included

### Debug Mode
Enable debug logging by adding to the console:

```javascript
// In browser console
window.leadForm.debug = true;
```

## Contributing

1. Follow the existing code style
2. Add comments for complex logic
3. Test on multiple devices and browsers
4. Update documentation for new features

## License

This form is part of the main project and follows the same licensing terms.
