// DOM Elements
const form = document.getElementById('waitlist-form');
const emailInput = document.getElementById('email');
const submitBtn = document.querySelector('.submit-btn');
const errorMessage = document.getElementById('error-message');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Form submission handler
form?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Clear previous errors
    hideError();
    
    // Validate email
    if (!email) {
        showError('Please enter your email address');
        emailInput.focus();
        return;
    }
    
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address');
        emailInput.focus();
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Submit to Google Sheets
        console.log('🔄 Attempting to submit email to Google Sheets:', email);
        const result = await submitEmailToGoogleSheets(email);
        console.log('✅ Google Sheets submission successful:', result);
        
        // Store email for success page
        localStorage.setItem('submittedEmail', email);
        
        // Track successful submission
        trackEvent('waitlist_signup_success', { email: email });
        
        // Redirect to success page
        window.location.href = `success.html?email=${encodeURIComponent(email)}`;
        
    } catch (error) {
        console.error('Submission error:', error);
        
        // Show user-friendly error messages
        const config = window.BIBLE_CHAT_CONFIG || {};
        const errorMessages = config.ERROR_MESSAGES || {};
        
        let errorMessage = errorMessages.GENERIC_ERROR || 'Something went wrong. Please try again.';
        
        if (error.message.includes('Google Apps Script URL')) {
            errorMessage = 'Service is being set up. Please try again later.';
        } else if (error.message.includes('Email already registered')) {
            errorMessage = errorMessages.DUPLICATE_EMAIL || 'This email is already registered for updates.';
        } else if (error.message.includes('Invalid email')) {
            errorMessage = errorMessages.INVALID_EMAIL || 'Please enter a valid email address.';
        } else if (!navigator.onLine) {
            errorMessage = errorMessages.NETWORK_ERROR || 'Please check your internet connection and try again.';
        }
        
        showError(errorMessage);
        trackEvent('waitlist_signup_error', { error: error.message });
        setLoadingState(false);
    }
});

// Submit email to Google Sheets via hidden form submission
async function submitEmailToGoogleSheets(email) {
    // Get URL from config
    const config = window.BIBLE_CHAT_CONFIG || {};
    const GOOGLE_APPS_SCRIPT_URL = config.GOOGLE_APPS_SCRIPT_URL;
    
    // If URL is not set, show helpful error
    if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        throw new Error('Please configure your Google Apps Script URL in config.js.');
    }
    
    console.log('📡 Submitting to Google Apps Script via hidden form:', GOOGLE_APPS_SCRIPT_URL);
    console.log('📧 Email:', email);
    
    return new Promise((resolve, reject) => {
        try {
            // Create a hidden iframe to handle the response
            const iframe = document.createElement('iframe');
            iframe.name = 'hiddenFrame';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Create a hidden form for submission
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = GOOGLE_APPS_SCRIPT_URL;
            form.target = 'hiddenFrame'; // Submit to hidden iframe
            form.style.display = 'none';
            
            // Add form fields
            const emailInput = document.createElement('input');
            emailInput.name = 'email';
            emailInput.value = email;
            form.appendChild(emailInput);
            
            const sourceInput = document.createElement('input');
            sourceInput.name = 'source';
            sourceInput.value = 'waitlist-form';
            form.appendChild(sourceInput);
            
            const userAgentInput = document.createElement('input');
            userAgentInput.name = 'userAgent';
            userAgentInput.value = navigator.userAgent;
            form.appendChild(userAgentInput);
            
            const timestampInput = document.createElement('input');
            timestampInput.name = 'timestamp';
            timestampInput.value = new Date().toISOString();
            form.appendChild(timestampInput);
            
            // Add to DOM and submit
            document.body.appendChild(form);
            console.log('📝 Form created and submitting...');
            form.submit();
            
            // Clean up form and iframe
            setTimeout(() => {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
            }, 2000);
            
            // Wait a moment to ensure submission, then resolve
            setTimeout(() => {
                console.log('✅ Form submitted successfully - check your Google Sheet!');
                resolve({
                    success: true,
                    message: 'Email submitted successfully',
                    email: email
                });
            }, 500);
            
        } catch (error) {
            console.error('❌ Error creating form submission:', error);
            reject(error);
        }
    });
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.animation = 'fadeInUp 0.3s ease';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
}

// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        form.classList.add('loading');
        submitBtn.disabled = true;
        emailInput.disabled = true;
    } else {
        form.classList.remove('loading');
        submitBtn.disabled = false;
        emailInput.disabled = false;
    }
}

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Submit form with Enter key when focused on email input
    if (e.key === 'Enter' && document.activeElement === emailInput) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
    
    // Escape key to clear errors
    if (e.key === 'Escape') {
        hideError();
    }
});

// Enhanced email validation with real-time feedback
emailInput?.addEventListener('input', function() {
    const email = this.value.trim();
    const inputContainer = this.closest('.input-container');
    
    // Add visual feedback
    if (email.length > 0) {
        if (emailRegex.test(email)) {
            inputContainer.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        } else {
            inputContainer.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        }
    } else {
        inputContainer.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }
    
    // Clear error on input
    if (errorMessage.style.display === 'block') {
        hideError();
    }
});

// Reset border color on focus
emailInput?.addEventListener('focus', function() {
    const inputContainer = this.closest('.input-container');
    inputContainer.style.borderColor = 'rgba(255, 255, 255, 0.3)';
});

// Analytics and tracking
function trackEvent(eventName, properties = {}) {
    console.log(`Analytics Event: ${eventName}`, properties);
    // Add your analytics integration here
}

// Track page views
document.addEventListener('DOMContentLoaded', function() {
    const page = window.location.pathname.includes('success') ? 'success' : 'landing';
    trackEvent('page_view', { page });
});

// Track form interactions
emailInput?.addEventListener('focus', () => trackEvent('email_input_focus'));
form?.addEventListener('submit', () => trackEvent('form_submit_attempt')); 