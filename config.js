// 📊 Bible Chat Waitlist Configuration
// Replace the URL below with your Google Apps Script Web App URL

const CONFIG = {
    // 🚨 IMPORTANT: Replace this with your actual Google Apps Script URL
    // Get this URL after deploying your Google Apps Script (see setup-instructions.md)
    GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbx1b4CxmlU6So083bve8SHfqLGZrl4WA5hSAxINHHaeaZ25ofcYHxOUWXIB2wB754w_/exec',
    
    // Optional: Custom success message
    SUCCESS_MESSAGE: 'Thank you for joining the Bible Chat waitlist!',
    
    // Optional: Enable/disable analytics tracking
    ENABLE_ANALYTICS: true,
    
    // Optional: Custom error messages
    ERROR_MESSAGES: {
        INVALID_EMAIL: 'Please enter a valid email address.',
        DUPLICATE_EMAIL: 'This email is already registered for updates.',
        NETWORK_ERROR: 'Please check your internet connection and try again.',
        GENERIC_ERROR: 'Something went wrong. Please try again.'
    },
    
    // Optional: Form behavior settings
    FORM_SETTINGS: {
        ENABLE_DUPLICATE_CHECK: true,
        SUBMISSION_DELAY: 1500, // milliseconds
        AUTO_REDIRECT: true
    }
};

// Make config available globally
window.BIBLE_CHAT_CONFIG = CONFIG; 