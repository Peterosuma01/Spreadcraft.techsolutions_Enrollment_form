// Configuration - UPDATE THIS WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
const CONFIG = {
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbyuzzCXXhGuRQEZA4Sx9jbUiTkEEtP3ZCrfWjue48De50g3wsFtNuQ44oIApV9I0EcI0A/exec'
};

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

// PWA Install Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installPrompt').style.display = 'flex';
});

document.getElementById('installBtn').addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    deferredPrompt = null;
    document.getElementById('installPrompt').style.display = 'none';
  }
});

// Conditional section visibility
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
    // Check if we're online
    if (!navigator.onLine) {
      // Store data locally if offline
      saveToLocalStorage(formData);
      showMessage('You are offline. Your enrollment has been saved and will be submitted when you reconnect.', 'success');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Enrollment';
      return;
    }
    
    // Submit to Google Apps Script
    const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    // Note: no-cors mode doesn't allow reading response
    // So we assume success if no error is thrown
    showMessage('Enrollment submitted successfully! We will contact you soon.', 'success');
    this.reset();
    window.scrollTo(0, 0);
    
    // Clear any stored offline data
    localStorage.removeItem('pendingEnrollment');
    
  } catch (error) {
    console.error('Error:', error);
    saveToLocalStorage(formData);
    showMessage('There was an issue submitting your enrollment. Your data has been saved and will be submitted when connection is restored.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Enrollment';
  }
});

// Helper function to show messages
function showMessage(text, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
  
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 10000);
}

// Save to localStorage for offline support
function saveToLocalStorage(data) {
  const enrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
  enrollments.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('pendingEnrollments', JSON.stringify(enrollments));
}

// Check for pending enrollments when online
window.addEventListener('online', async () => {
  const pendingEnrollments = JSON.parse(localStorage.getItem('pendingEnrollments') || '[]');
  
  if (pendingEnrollments.length > 0) {
    showMessage('Connection restored. Submitting pending enrollments...', 'success');
    
    for (const enrollment of pendingEnrollments) {
      try {
        await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(enrollment)
        });
      } catch (error) {
        console.error('Failed to submit pending enrollment:', error);
      }
    }
    
    localStorage.removeItem('pendingEnrollments');
    showMessage('All pending enrollments have been submitted!', 'success');
  }
});
