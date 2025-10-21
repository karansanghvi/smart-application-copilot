// Background service worker
console.log('Smart Application Copilot: Background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // Set default settings
  chrome.storage.sync.set({
    autoDetect: true,
    highlightFields: true
  });
});

// Listen for tab updates (optional: auto-detect on job sites)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if it's a known job application site
    const jobSites = [
      'greenhouse.io',
      'lever.co',
      'workday.com',
      'taleo.net',
      'smartrecruiters.com',
      'myworkdayjobs.com'
    ];
    
    const isJobSite = jobSites.some(site => tab.url.includes(site));
    
    if (isJobSite) {
      console.log('Job application site detected:', tab.url);
      // Could send notification or auto-activate extension
    }
  }
});