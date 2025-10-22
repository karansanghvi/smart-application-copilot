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