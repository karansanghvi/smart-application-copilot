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

// Add autofill button functionality
function addAutofillButton() {
    const mainDiv = document.querySelector('.main');
    
    const autofillSection = document.createElement('div');
    autofillSection.className = 'autofill-section';
    autofillSection.innerHTML = `
        <h2>Quick Actions</h2>
        <button id="autofillBtn" class="autofill-btn">
            🚀 Autofill Current Page
        </button>
        <p class="autofill-hint">Click to automatically fill job application forms on the current page</p>
    `;
    
    mainDiv.appendChild(autofillSection);
    
    // Add click event
    document.getElementById('autofillBtn').addEventListener('click', triggerAutofill);
}

// Trigger autofill on current active tab
// Trigger autofill on a selected tab
async function triggerAutofill() {
    const button = document.getElementById('autofillBtn');
    button.textContent = '⏳ Getting tabs...';
    button.disabled = true;
    
    try {
        // Get profile ID
        const profileId = await getStoredProfileId();
        
        if (!profileId) {
            alert('Please set up your profile first!');
            button.textContent = '🚀 Autofill Current Page';
            button.disabled = false;
            return;
        }
        
        // Get current tab to exclude it
        const currentTab = await chrome.tabs.getCurrent();
        const currentTabId = currentTab?.id;
        
        // Get ALL tabs
        const tabs = await chrome.tabs.query({ currentWindow: true });
        
        console.log('All tabs:', tabs.map(t => ({ id: t.id, title: t.title, url: t.url })));
        
        // Filter out extension pages, chrome pages, and dashboard itself
        const appTabs = tabs.filter(tab => {
            if (!tab.url) return false;
            if (tab.url.startsWith('chrome://')) return false;
            if (tab.url.startsWith('chrome-extension://')) return false;
            if (tab.id === currentTabId) return false; // Exclude dashboard
            return true;
        });
        
        console.log('Filtered app tabs:', appTabs.map(t => ({ id: t.id, title: t.title, url: t.url })));
        
        if (appTabs.length === 0) {
            alert('No web pages found to autofill! Please open a job application form first.');
            button.textContent = '🚀 Autofill Current Page';
            button.disabled = false;
            return;
        }
        
        // Prioritize tabs with job-related URLs
        let targetTab = appTabs.find(tab => 
            tab.url.includes('greenhouse') || 
            tab.url.includes('lever') || 
            tab.url.includes('linkedin.com/jobs') ||
            tab.url.includes('indeed.com') ||
            tab.url.includes('workday')
        );
        
        // If no job site found, use the most recent non-dashboard tab
        if (!targetTab) {
            targetTab = appTabs[0];
        }
        
        button.textContent = '⏳ Filling...';
        
        console.log('Target tab selected:', targetTab.id, targetTab.title);
        
        // Fetch profile data
        const response = await fetch(`http://localhost:3000/api/profiles/${profileId}/autofill`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Failed to fetch profile data');
        }
        
        // Send message to content script to fill form
        chrome.tabs.sendMessage(targetTab.id, {
            action: 'autofill',
            profileData: data.data
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error:', chrome.runtime.lastError);
                alert('Could not autofill that page. Make sure the content script is loaded!');
            } else if (response && response.success) {
                alert(`✅ Successfully filled ${response.fieldsFilledCount} out of ${response.totalFields} fields!`);
                // Switch to that tab so user can see the results
                chrome.tabs.update(targetTab.id, { active: true });
            } else {
                alert('❌ No fields found to fill on this page');
            }
            
            button.textContent = '🚀 Autofill Current Page';
            button.disabled = false;
        });
        
    } catch (error) {
        console.error('Autofill error:', error);
        alert('Error during autofill: ' + error.message);
        button.textContent = '🚀 Autofill Current Page';
        button.disabled = false;
    }
}

// Initialize autofill button when page loads
document.addEventListener('DOMContentLoaded', () => {
    addAutofillButton();
});