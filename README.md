# Bible Chat - Waitlist Landing Page

A beautiful, responsive waitlist landing page for the Bible Chat AI-powered app. Built with modern web technologies and featuring a stunning design inspired by the provided Figma mockup.

## ✨ Features

- **Modern Design**: Dark gradient background with glassmorphism effects
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Email Validation**: Real-time email validation with visual feedback
- **Silent Submission**: Background email saving without opening new tabs
- **Google Sheets Integration**: Automatic email collection in Google Sheets
- **Smooth Animations**: Elegant fade-in animations and transitions
- **Success Page**: Beautiful confirmation page after email submission
- **Accessibility**: Full keyboard navigation and screen reader support
- **Loading States**: Visual feedback during form submission
- **Error Handling**: Graceful error handling with user-friendly messages
- **Scrolling Banner**: Animated text banner showcasing app features

## 🚀 Quick Start

### For Local Development
1. **Clone the repository**
2. **Start a local server**: 
   - Using npm: `npm start` or `npm run dev`
   - Using Python: `python3 -m http.server 8000`
3. **Open**: `http://localhost:8000/index.html`

### For Production Deployment
1. **Upload files** to your hosting service (Netlify, Vercel, GitHub Pages, etc.)
2. **Configure Google Sheets** (see setup below)
3. **Update `config.js`** with your Google Apps Script URL
4. **Deploy and test!**

## 📁 Project Structure

```
bible-chat-waitlist/
├── index.html          # Main landing page
├── success.html        # Success confirmation page
├── styles.css          # All styling and responsive design
├── script.js           # Form functionality and Google Sheets integration
├── config.js           # Configuration (add your Google Apps Script URL here)
├── package.json        # Project configuration and scripts
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## 📊 Google Sheets Integration

### Quick Setup:
1. **Create a Google Sheet** with columns: Email, Timestamp, Source, User Agent
2. **Go to Extensions → Apps Script**
3. **Copy this code into Apps Script**:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    
    let email, source, userAgent;
    
    if (e && e.parameter) {
      email = e.parameter.email;
      source = e.parameter.source || 'waitlist';
      userAgent = e.parameter.userAgent || 'unknown';
    }
    
    const timestamp = new Date();
    
    if (!email || !isValidEmail(email)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invalid email address'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Check for duplicates
    const emailColumn = sheet.getRange('A:A').getValues();
    for (let i = 1; i < emailColumn.length; i++) {
      if (emailColumn[i][0] === email) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'Email already registered'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    sheet.appendRow([email, timestamp, source, userAgent]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Email added successfully',
      email: email
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Server error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'Bible Chat Waitlist API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

4. **Deploy as Web App**: Deploy → New deployment → Web app → Execute as "Me" → Access "Anyone"
5. **Copy the Web App URL**
6. **Update `config.js`** with your URL:

```javascript
GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
```

## 🌐 Deployment Options

### Netlify (Recommended)
1. **Drag and drop** your project folder to Netlify
2. **Your site is live!** Netlify provides HTTPS automatically

### Vercel
1. **Connect your GitHub repository**
2. **Deploy automatically** with each commit

### GitHub Pages
1. **Push to GitHub repository**
2. **Enable Pages** in repository settings
3. **Select source branch**

### Other Hosting
Any static hosting service works: AWS S3, Firebase Hosting, etc.

## ⚙️ Configuration

### Email Messages
Customize messages in `config.js`:
```javascript
ERROR_MESSAGES: {
    INVALID_EMAIL: 'Please enter a valid email address.',
    DUPLICATE_EMAIL: 'This email is already registered for updates.',
    NETWORK_ERROR: 'Please check your internet connection and try again.',
    GENERIC_ERROR: 'Something went wrong. Please try again.'
}
```

### Analytics Integration
Add your analytics code to `script.js`:
```javascript
function trackEvent(eventName, properties = {}) {
    // Google Analytics 4
    gtag('event', eventName, properties);
    
    // Or other analytics services
    analytics.track(eventName, properties);
}
```

## 📊 Confirmed Working Features:

- ✅ **Email Collection** - Saves to Google Sheets silently
- ✅ **Email Validation** - Real-time validation  
- ✅ **Duplicate Prevention** - Won't save same email twice
- ✅ **Silent Submission** - No new tabs or redirects
- ✅ **Timestamp Tracking** - Records submission time
- ✅ **Source Tracking** - Tracks where emails came from
- ✅ **Beautiful UI** - Your Figma design fully implemented
- ✅ **Responsive Design** - Works on all devices
- ✅ **Success Page** - Beautiful confirmation after submission

## 🔧 Browser Support

**Fully Supported:**
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

**Graceful Degradation:**
- Internet Explorer 11 (basic functionality)
- Older mobile browsers

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Built with ❤️ for the Bible Chat community**

Ready for production deployment! 🚀 