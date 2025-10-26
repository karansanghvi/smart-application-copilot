// dashboard.js

// Display user name
document.addEventListener('DOMContentLoaded', async () => {
    // Load user profile data
    const profileId = await getStoredProfileId();
    
    if (profileId) {
        loadUserName(profileId);
    }
});

// Get stored profile ID from Chrome storage
async function getStoredProfileId() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['profileId'], (result) => {
            resolve(result.profileId || null);
        });
    });
}

// Load and display user name
async function loadUserName(profileId) {
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${profileId}/autofill`);
        const data = await response.json();
        
        if (data.success) {
            const userName = data.data.firstName || 'User';
            document.getElementById('userName').textContent = userName;
        }
    } catch (error) {
        console.error('Error loading user name:', error);
    }
}

