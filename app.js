// Configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzjTpucb16r_I-SIX7jLzSFBGP1RQ9VroWh0pKNFCQJggHmS4yg2cqZX0QK9pdqsqAsEg/exec';

// PWA Install Prompt
let deferredPrompt;
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');
const closeBanner = document.getElementById('closeBanner');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBanner.style.display = 'flex';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('PWA installed');
  }
  
  deferredPrompt = null;
  installBanner.style.display = 'none';
});

closeBanner.addEventListener('click', () => {
  installBanner.style.display = 'none';
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed:', err);
      });
  });
}

// Online/Offline Detection
const offlineIndicator = document.getElementById('offlineIndicator');

window.addEventListener('online', () => {
  offlineIndicator.style.display = 'none';
});

window.addEventListener('offline', () => {
  offlineIndicator.style.display = 'block';
});

if (!navigator.onLine) {
  offlineIndicator.style.display = 'block';
}

// Show/hide data type section based on "worked with data" answer
document.getElementById('dataYes').addEventListener('change', function() {
  if (this.checked) {
    document.getElementById('dataTypeSection').style.display = 'block';
  }
});

document.getElementById('dataNo').addEventListener('change', function() {
  if (this.checked) {
    document.getElementById('dataTypeSection').style.display = 'none';
  }
});

// Form submission
document.getElementById('enrollmentForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submitBtn');
  const messageDiv = document.getElementById('message');
  
  // Check online status
  if (!navigator.onLine) {
    messageDiv.className = 'message error';
    messageDiv.textContent = 'You are offline. Please check your internet connection and try again.';
    messageDiv.style.display = 'block';
    window.scrollTo(0, 0);
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  
  // Collect form data
  const formData = {
    fullName: this.fullName.value,
    phoneNumber: this.phoneNumber.value,
    email: this.email.value,
    homeAddress: this.homeAddress.value,
    education: this.education.value,
    ownLaptop: this.ownLaptop.value,
    os: this.os.value || '',
    excelVersion: this.excelVersion.value || '',
    computerComfort: this.computerComfort.value || '',
    excelDuration: this.excelDuration.value || '',
    excelFeatures: Array.from(this.querySelectorAll('input[name="excelFeatures"]:checked')).map(cb => cb.value),
    workedWithData: this.workedWithData.value || '',
    dataType: Array.from(this.querySelectorAll('input[name="dataType"]:checked')).map(cb => cb.value),
    datasetSize: this.datasetSize.value || '',
    motivation: this.motivation.value || '',
    postCourseGoals: this.postCourseGoals.value,
    industry: this.industry.value || '',
    excelUse: this.excelUse.value || '',
    learningMode: this.learningMode.value || '',
    classTime: this.classTime.value || '',
    practiceHours: this.practiceHours.value || '',
    excelConfidence: this.excelConfidence.value || '',
    excelChallenge: this.excelChallenge.value,
    canUseIF: this.canUseIF.value || '',
    canUsePivot: this.canUsePivot.value || '',
    canUseLookup: this.canUseLookup.value || '',
    howHeard: this.howHeard.value,
    expectations: this.expectations.value
  };
  
  try {
    // Submit to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires no-cors
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    // Note: With no-cors, we can't read the response
    // So we assume success if no error was thrown
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Enrollment';
    
    messageDiv.className = 'message success';
    messageDiv.textContent = '✓ Enrollment submitted successfully! We will contact you soon.';
    messageDiv.style.display = 'block';
    document.getElementById('enrollmentForm').reset();
    
    // Scroll to top to show success message
    window.scrollTo(0, 0);
    
  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Enrollment';
    
    messageDiv.className = 'message error';
    messageDiv.textContent = 'An error occurred. Please try again or contact us directly.';
    messageDiv.style.display = 'block';
    
    console.error('Submission error:', error);
  }
});
