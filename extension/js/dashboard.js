// dashboard.js

// Display user name
document.addEventListener('DOMContentLoaded', async () => {
    // Load user profile data
    const profileId = await getStoredProfileId();
    
    if (profileId) {
        loadUserName(profileId);
    }

    setupTabsModal();
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

// Setup tabs modal functionality
function setupTabsModal() {
    const modal = document.getElementById('tabsModal');
    const btn = document.getElementById('showTabsBtn');
    const closeBtn = document.querySelector('.close-modal');

    // Open modal and load tabs
    btn.addEventListener('click', async () => {
        modal.style.display = 'block';
        await loadOpenTabs();
    });

    // Close modal when X is clicked
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Load and display open tabs
async function loadOpenTabs() {
    const tabsList = document.getElementById('tabsList');
    tabsList.innerHTML = '<p class="loading">Loading tabs...</p>';

    try {
        // Query all tabs
        const tabs = await chrome.tabs.query({});
        
        if (tabs.length === 0) {
            tabsList.innerHTML = '<p class="no-tabs">No open tabs found.</p>';
            return;
        }

        // Group tabs by window
        const tabsByWindow = {};
        tabs.forEach(tab => {
            if (!tabsByWindow[tab.windowId]) {
                tabsByWindow[tab.windowId] = [];
            }
            tabsByWindow[tab.windowId].push(tab);
        });

        // Build HTML for tabs
        let html = '';
        Object.keys(tabsByWindow).forEach((windowId, index) => {
            const windowTabs = tabsByWindow[windowId];
            html += `
                <div class="window-group">
                    <h3 class="window-title">Window ${index + 1} (${windowTabs.length} tabs)</h3>
                    <div class="tabs-container">
            `;

            windowTabs.forEach(tab => {
                const favicon = tab.favIconUrl || 'icons/icon (Custom).png';
                const title = tab.title || 'Untitled';
                const url = tab.url || '';
                const isActive = tab.active ? 'active-tab' : '';
                
                html += `
                    <div class="tab-item ${isActive}" data-tab-id="${tab.id}">
                        <img src="${favicon}" alt="favicon" class="tab-favicon" onerror="this.src='icons/icon (Custom).png'">
                        <div class="tab-info">
                            <div class="tab-title">${escapeHtml(title)}</div>
                            <div class="tab-url">${escapeHtml(url)}</div>
                        </div>
                        <button class="goto-tab-btn" data-tab-id="${tab.id}">Go to Tab</button>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        tabsList.innerHTML = html;

        // Add click handlers for "Go to Tab" buttons
        document.querySelectorAll('.goto-tab-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const tabId = parseInt(btn.dataset.tabId);
                await goToTab(tabId);
            });
        });

        // Add click handlers for tab items
        document.querySelectorAll('.tab-item').forEach(item => {
            item.addEventListener('click', async () => {
                const tabId = parseInt(item.dataset.tabId);
                await goToTab(tabId);
            });
        });

    } catch (error) {
        console.error('Error loading tabs:', error);
        tabsList.innerHTML = '<p class="error">Failed to load tabs. Please try again.</p>';
    }
}

// Navigate to a specific tab
async function goToTab(tabId) {
    try {
        await chrome.tabs.update(tabId, { active: true });
        const tab = await chrome.tabs.get(tabId);
        await chrome.windows.update(tab.windowId, { focused: true });
        
        // Close modal after navigation
        document.getElementById('tabsModal').style.display = 'none';
    } catch (error) {
        console.error('Error navigating to tab:', error);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Test autofill API with correct parameters
async function testAutofillAPI(profileId) {
    console.log('🧪 Testing Autofill API...');
    
    try {
        // Test 1: AI Health Check
        const healthResponse = await fetch('http://localhost:3000/api/autofill/ai-health');
        const healthData = await healthResponse.json();
        console.log('✅ AI Health:', healthData);
        
        // Test 2: Get Single Field Value
        const fieldResponse = await fetch('http://localhost:3000/api/autofill/get-field-value', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: parseInt(profileId),  // Changed from profileId to userId
                formFieldLabel: 'What is your first name?'  // Changed to formFieldLabel
            })
        });
        const fieldData = await fieldResponse.json();
        console.log('✅ Field Value:', fieldData);
        
        // Test 3: Get Multiple Values
        const multipleResponse = await fetch('http://localhost:3000/api/autofill/get-multiple-values', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: parseInt(profileId),  // Changed from profileId to userId
                formFields: [  // Changed to array of label strings
                    'What is your first name?',
                    'Enter your email address',
                    'Phone number',
                    'Current job title',
                    'LinkedIn profile URL'
                ]
            })
        });
        const multipleData = await multipleResponse.json();
        console.log('✅ Multiple Values:', multipleData);
        
        // Display results in UI
        displayTestResults({ healthData, fieldData, multipleData });
        
    } catch (error) {
        console.error('❌ Autofill API Test Failed:', error);
    }
}

// Display test results in the dashboard (keep the same)
function displayTestResults(results) {
    const mainDiv = document.querySelector('.main');
    
    const resultsHtml = `
        <div style="margin-top: 30px; padding: 20px; background: rgba(139, 92, 246, 0.1); border-radius: 8px;">
            <h2>🧪 Autofill API Test Results</h2>
            
            <div style="margin-top: 15px;">
                <h3>AI Health Status:</h3>
                <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(results.healthData, null, 2)}</pre>
            </div>
            
            <div style="margin-top: 15px;">
                <h3>Single Field Value:</h3>
                <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(results.fieldData, null, 2)}</pre>
            </div>
            
            <div style="margin-top: 15px;">
                <h3>Multiple Field Values:</h3>
                <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(results.multipleData, null, 2)}</pre>
            </div>
        </div>
    `;
    
    mainDiv.insertAdjacentHTML('beforeend', resultsHtml);
}

// Keep the rest of your existing functions
document.addEventListener('DOMContentLoaded', async () => {
    const profileId = await getStoredProfileId();
    
    if (profileId) {
        loadUserName(profileId);
        
        // Run autofill API test
        await testAutofillAPI(profileId);
    } else {
        console.log('⚠️ No profile ID found. Please complete onboarding first.');
    }
});

async function getStoredProfileId() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['profileId'], (result) => {
            resolve(result.profileId || null);
        });
    });
}

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