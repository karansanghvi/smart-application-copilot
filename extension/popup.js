chrome.storage.local.get(['profileCompleted'], (result) => {
  if (result.profileCompleted) {
    // User has profile, show the detect/fill interface
    chrome.tabs.create({ url: 'dashboard.html' });
    window.close();
  } else {
    // User needs to complete onboarding, open in new tab
    chrome.tabs.create({ url: 'onboarding.html' });
    window.close();
  }
});