// Paste this in console to verify logging is working
console.log('═══════════════════════════════════════════════════════════');
console.log('🧪 TEST LOG - If you can see this, logging is working!');
console.log('═══════════════════════════════════════════════════════════');

// dashboard.js - Complete Updated Version with Detailed Logging

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', async () => {
    // Load user profile data
    const profileId = await getStoredProfileId();
    
    if (profileId) {
        loadUserName(profileId);
        // Uncomment below to run API tests on page load
        // await testAutofillAPI(profileId);
    } else {
        console.log('⚠️ No profile ID found. Please complete onboarding first.');
    }

    // Setup modal functionality
    setupTabsModal();
});

// ==================== STORAGE & PROFILE ====================

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

// ==================== MODAL FUNCTIONALITY ====================

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
                        <button class="autofill-tab-btn" data-tab-id="${tab.id}">
                            ✨ Autofill
                        </button>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        tabsList.innerHTML = html;

        // Add click handlers for "Autofill" buttons
        document.querySelectorAll('.autofill-tab-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const tabId = parseInt(btn.dataset.tabId);
                await autofillTabForm(tabId, btn);
            });
        });

    } catch (error) {
        console.error('Error loading tabs:', error);
        tabsList.innerHTML = '<p class="error">Failed to load tabs. Please try again.</p>';
    }
}

// ==================== AUTOFILL FUNCTIONALITY ====================

// Autofill form on selected tab
async function autofillTabForm(tabId, buttonElement) {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = '⏳ Processing...';
    buttonElement.disabled = true;

    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 AUTOFILL PROCESS STARTED');
    console.log('═══════════════════════════════════════════════════════════');

    try {
        // Get profile ID
        const profileId = await getStoredProfileId();
        if (!profileId) {
            throw new Error('No profile found. Please complete onboarding first.');
        }

        console.log(`📋 Profile ID: ${profileId}`);

        // Step 1: Get tab info and switch to it
        const tab = await chrome.tabs.get(tabId);
        
        console.log('\n📑 TAB INFORMATION:');
        console.log('─────────────────────────────────────────────────────────');
        console.log(`   Tab ID: ${tab.id}`);
        console.log(`   Title: ${tab.title}`);
        console.log(`   URL: ${tab.url}`);
        console.log(`   Window ID: ${tab.windowId}`);
        console.log(`   Active: ${tab.active}`);
        console.log('─────────────────────────────────────────────────────────');
        
        // Check if URL is restricted
        if (isRestrictedUrl(tab.url)) {
            throw new Error('Cannot autofill on this page. Chrome extension pages and system pages are restricted.');
        }

        await chrome.tabs.update(tabId, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
        console.log('✅ Switched to target tab');

        // Wait for tab to be ready
        await sleep(500);

        // Step 2: Ensure content script is injected
        buttonElement.textContent = '💉 Preparing page...';
        console.log('\n💉 PREPARING PAGE:');
        console.log('─────────────────────────────────────────────────────────');
        try {
            await ensureContentScriptInjected(tabId);
            console.log('✅ Content script ready');
        } catch (error) {
            console.error('❌ Content script injection failed:', error);
            throw new Error('Failed to prepare the page. Try refreshing the page first.');
        }
        console.log('─────────────────────────────────────────────────────────');

        // Wait a bit after injection
        await sleep(300);

        // Step 3: Detect form fields on the page
        buttonElement.textContent = '🔍 Detecting fields...';
        console.log('\n🔍 DETECTING FORM FIELDS:');
        console.log('─────────────────────────────────────────────────────────');
        let detectResponse;
        
        try {
            detectResponse = await sendMessageWithRetry(tabId, { 
                action: 'detectFields' 
            }, 3);
        } catch (error) {
            console.error('❌ Field detection failed:', error);
            throw new Error('Cannot communicate with page. Try refreshing the page first.');
        }

        if (!detectResponse || !detectResponse.success || !detectResponse.fields || detectResponse.fields.length === 0) {
            console.warn('⚠️ No form fields found');
            throw new Error('No form fields found on this page.');
        }

        const fields = detectResponse.fields;
        console.log(`✅ Detected ${fields.length} form fields\n`);

        // Log each detected field
        console.log('📝 DETECTED FIELDS DETAILS:');
        fields.forEach((field, index) => {
            console.log(`\n   Field #${index + 1}:`);
            console.log(`      Type: ${field.type}`);
            console.log(`      Name: ${field.name || 'N/A'}`);
            console.log(`      ID: ${field.id || 'N/A'}`);
            console.log(`      Label: ${field.label || 'N/A'}`);
            console.log(`      Placeholder: ${field.placeholder || 'N/A'}`);
            console.log(`      Autocomplete: ${field.autocomplete || 'N/A'}`);
            console.log(`      Selector: ${field.selector}`);
            console.log(`      Required: ${field.required}`);
            console.log(`      Current Value: ${field.value ? '"' + field.value + '"' : 'empty'}`);
        });
        console.log('─────────────────────────────────────────────────────────');

        // Step 4: Get field labels for AI matching
        buttonElement.textContent = '🤖 Matching fields...';
        console.log('\n🤖 AI FIELD MATCHING:');
        console.log('─────────────────────────────────────────────────────────');
        
        const fieldLabels = fields.map(field => {
            return field.label || field.placeholder || field.name || field.id || 'unknown';
        });

        console.log('📤 Sending field labels to AI service:');
        fieldLabels.forEach((label, index) => {
            console.log(`   ${index + 1}. "${label}"`);
        });

        // Step 5: Call backend API to get matched values
        console.log('\n🌐 Calling backend API...');
        const apiStartTime = Date.now();
        
        const response = await fetch('http://localhost:3000/api/autofill/get-multiple-values', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: parseInt(profileId),
                formFields: fieldLabels
            })
        });

        const matchData = await response.json();
        const apiDuration = Date.now() - apiStartTime;
        
        console.log(`✅ API Response received in ${apiDuration}ms`);
        
        if (!matchData.success) {
            console.error('❌ API Error:', matchData.error);
            throw new Error(matchData.error || 'Failed to match fields');
        }

        console.log('\n📊 MATCHING RESULTS SUMMARY:');
        console.log(`   Total Fields: ${matchData.data.total}`);
        console.log(`   Fields Matched: ${matchData.data.matched}`);
        console.log(`   Fields with Values: ${matchData.data.with_values}`);
        console.log('─────────────────────────────────────────────────────────');

        // Step 6: Prepare data for autofill
        buttonElement.textContent = '✍️ Filling form...';
        console.log('\n✍️ PREPARING AUTOFILL DATA:');
        console.log('─────────────────────────────────────────────────────────');
        
        const fillData = [];
        const matchedFields = [];
        const unmatchedFields = [];
        const fieldsWithoutValues = [];
        
        matchData.data.results.forEach((result, index) => {
            const fieldInfo = {
                index: index + 1,
                label: result.formFieldLabel,
                matchedTo: result.matched_field,
                confidence: result.confidence,
                hasValue: result.has_value,
                value: result.value,
                selector: fields[index].selector
            };

            if (result.has_value && result.value) {
                fillData.push({
                    selector: fields[index].selector,
                    value: result.value,
                    fieldLabel: result.formFieldLabel
                });
                matchedFields.push(fieldInfo);
            } else if (!result.has_value) {
                fieldsWithoutValues.push(fieldInfo);
            } else {
                unmatchedFields.push(fieldInfo);
            }
        });

        // Log matched fields that WILL be filled
        console.log('\n✅ FIELDS THAT WILL BE FILLED:');
        if (matchedFields.length > 0) {
            matchedFields.forEach(field => {
                console.log(`\n   Field #${field.index}: "${field.label}"`);
                console.log(`      ↳ Matched to: ${field.matchedTo}`);
                console.log(`      ↳ Confidence: ${(field.confidence * 100).toFixed(1)}%`);
                console.log(`      ↳ Value: "${field.value}"`);
                console.log(`      ↳ Selector: ${field.selector}`);
            });
        } else {
            console.log('   (None)');
        }

        // Log fields that were matched but have no value in profile
        console.log('\n⚠️ FIELDS MATCHED BUT NO VALUE IN PROFILE:');
        if (fieldsWithoutValues.length > 0) {
            fieldsWithoutValues.forEach(field => {
                console.log(`\n   Field #${field.index}: "${field.label}"`);
                console.log(`      ↳ Matched to: ${field.matchedTo}`);
                console.log(`      ↳ Confidence: ${(field.confidence * 100).toFixed(1)}%`);
                console.log(`      ↳ Status: No value in profile`);
            });
        } else {
            console.log('   (None)');
        }

        // Log unmatched fields
        console.log('\n❌ FIELDS NOT MATCHED:');
        if (unmatchedFields.length > 0) {
            unmatchedFields.forEach(field => {
                console.log(`\n   Field #${field.index}: "${field.label}"`);
                console.log(`      ↳ Attempted match: ${field.matchedTo}`);
                console.log(`      ↳ Confidence: ${(field.confidence * 100).toFixed(1)}%`);
                console.log(`      ↳ Status: Not filled`);
            });
        } else {
            console.log('   (None)');
        }
        console.log('─────────────────────────────────────────────────────────');

        if (fillData.length === 0) {
            console.warn('\n⚠️ WARNING: No matching data found to fill');
            throw new Error('No matching data found to fill.');
        }

        console.log(`\n📝 Preparing to fill ${fillData.length} fields...`);

        // Step 7: Fill the form
        console.log('\n🎯 EXECUTING AUTOFILL:');
        console.log('─────────────────────────────────────────────────────────');
        
        let fillResponse;
        const fillStartTime = Date.now();
        
        try {
            fillResponse = await sendMessageWithRetry(tabId, {
                action: 'autofillForm',
                data: fillData
            }, 2);
        } catch (error) {
            console.error('❌ Autofill execution failed:', error);
            throw new Error('Failed to fill form fields. Please try again.');
        }

        const fillDuration = Date.now() - fillStartTime;
        console.log(`✅ Autofill completed in ${fillDuration}ms`);

        console.log('\n📊 AUTOFILL RESULTS:');
        console.log(`   Fields Filled: ${fillResponse.result.filledCount}`);
        console.log(`   Fields Attempted: ${fillResponse.result.totalFields}`);
        console.log(`   Success Rate: ${((fillResponse.result.filledCount / fillResponse.result.totalFields) * 100).toFixed(1)}%`);
        
        if (fillResponse.result.errors && fillResponse.result.errors.length > 0) {
            console.log('\n⚠️ ERRORS DURING FILLING:');
            fillResponse.result.errors.forEach(error => {
                console.log(`   - ${error}`);
            });
        }
        console.log('─────────────────────────────────────────────────────────');

        // Success!
        buttonElement.textContent = '✅ Done!';
        buttonElement.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        console.log('\n✅ AUTOFILL PROCESS COMPLETED SUCCESSFULLY');
        console.log('═══════════════════════════════════════════════════════════\n');
        
        // Show success message
        showNotification(
            `Successfully filled ${fillResponse.result.filledCount} out of ${fillData.length} fields!`,
            'success'
        );

        // Close modal after a delay
        setTimeout(() => {
            document.getElementById('tabsModal').style.display = 'none';
        }, 2000);

    } catch (error) {
        console.error('\n❌ AUTOFILL PROCESS FAILED');
        console.error('═══════════════════════════════════════════════════════════');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        console.error('═══════════════════════════════════════════════════════════\n');
        
        buttonElement.textContent = '❌ Failed';
        buttonElement.style.background = '#ef4444';
        
        showNotification(error.message, 'error');
        
        // Reset button after delay
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.background = '';
            buttonElement.disabled = false;
        }, 3000);
    }
}

// Check if URL is restricted (cannot inject content scripts)
function isRestrictedUrl(url) {
    const restrictedProtocols = ['chrome:', 'chrome-extension:', 'edge:', 'about:', 'data:', 'file:'];
    const restrictedDomains = ['chrome.google.com/webstore'];
    
    if (!url) return true;
    
    // Check protocols
    for (const protocol of restrictedProtocols) {
        if (url.startsWith(protocol)) {
            return true;
        }
    }
    
    // Check restricted domains
    for (const domain of restrictedDomains) {
        if (url.includes(domain)) {
            return true;
        }
    }
    
    return false;
}

// Ensure content script is injected in the tab
async function ensureContentScriptInjected(tabId) {
    try {
        // Try to ping the content script first
        console.log('   Pinging content script...');
        const response = await Promise.race([
            chrome.tabs.sendMessage(tabId, { action: 'ping' }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1000))
        ]);
        
        // If we get here, content script is already loaded
        console.log('   ✅ Content script already loaded');
        return true;
    } catch (error) {
        // Content script not loaded, inject it
        console.log('   ⚠️ Content script not loaded, injecting...');
        
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
            
            // Wait for script to initialize
            await sleep(500);
            
            console.log('   ✅ Content script injected successfully');
            return true;
        } catch (injectionError) {
            console.error('   ❌ Failed to inject content script:', injectionError);
            throw injectionError;
        }
    }
}

// Send message with retry logic
async function sendMessageWithRetry(tabId, message, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`   Attempt ${attempt}/${maxRetries}: Sending "${message.action}" message...`);
            
            const response = await new Promise((resolve, reject) => {
                chrome.tabs.sendMessage(tabId, message, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            });
            
            console.log(`   ✅ Message "${message.action}" successful`);
            return response;
        } catch (error) {
            console.error(`   ❌ Attempt ${attempt} failed:`, error.message);
            lastError = error;
            
            // Wait before retrying (exponential backoff)
            if (attempt < maxRetries) {
                const waitTime = 500 * attempt;
                console.log(`   ⏳ Waiting ${waitTime}ms before retry...`);
                await sleep(waitTime);
            }
        }
    }
    
    throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

// ==================== UTILITY FUNCTIONS ====================

// Helper function to sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Show notification in dashboard
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 999999;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add this at the end of the file

// On-screen logging for debugging
const logDisplay = document.getElementById('logDisplay');
const toggleLogsBtn = document.getElementById('toggleLogs');

toggleLogsBtn?.addEventListener('click', () => {
    if (logDisplay.style.display === 'none') {
        logDisplay.style.display = 'block';
        toggleLogsBtn.textContent = 'Hide Logs';
    } else {
        logDisplay.style.display = 'none';
        toggleLogsBtn.textContent = 'Show Logs';
    }
});

// Override console.log to also display on screen
const originalLog = console.log;
console.log = function(...args) {
    originalLog.apply(console, args);
    
    if (logDisplay) {
        const logLine = document.createElement('div');
        logLine.textContent = args.join(' ');
        logLine.style.marginBottom = '2px';
        logDisplay.appendChild(logLine);
        logDisplay.scrollTop = logDisplay.scrollHeight;
    }
};