// Content script that runs on all pages
console.log('Smart Application Copilot: Content script loaded');

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'detectFields') {
    const fields = detectFormFields();
    sendResponse({ fields });
  }
  return true;
});

// Auto-detect when page loads
window.addEventListener('load', () => {
  const formCount = document.querySelectorAll('form').length;
  if (formCount > 0) {
    console.log(`Found ${formCount} forms on this page`);
  }
});