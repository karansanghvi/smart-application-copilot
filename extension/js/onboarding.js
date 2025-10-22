document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.getElementById('getStartedBtn');

    // Check if user has already completed onboarding
    chrome.storage.local.get(['profileCompleted'], (result) => {
        if (result.profileCompleted) {
        // User has already completed setup, redirect to main interface
        // For now, just close this tab and let popup handle it
        window.close();
        }
    });

    // Handle Get Started button click
    getStartedBtn.addEventListener('click', () => {
        // Navigate to profile form
        window.location.href = 'profile-form.html';
    });
});