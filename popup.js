chrome.storage.local.get(['profileCompleted'], (result) => {
  if (result.profileCompleted) {
    // User has profile, show the detect/fill interface
    showMainInterface();
  } else {
    // User needs to complete onboarding, open in new tab
    chrome.tabs.create({ url: 'onboarding.html' });
    window.close();
  }
});

function showMainInterface() {
  // Create the UI for users who have completed setup
  document.body.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="margin: 0 0 15px 0; color: #2563eb;">Application Copilot</h2>
      
      <div id="status" style="padding: 10px; border-radius: 6px; margin-bottom: 15px; font-size: 14px; background: #dbeafe; color: #1e40af;">
        Click "Detect Form" to find fillable fields
      </div>

      <button id="detectBtn" style="width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; margin-bottom: 10px;">
        🔍 Detect Form Fields
      </button>
      
      <button id="fillBtn" disabled style="width: 100%; padding: 12px; background: #9ca3af; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: not-allowed; margin-bottom: 10px;">
        ✨ Auto-Fill Application
      </button>
      
      <button id="settingsBtn" style="width: 100%; padding: 12px; background: #f3f4f6; color: #374151; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">
        ⚙️ Edit Profile
      </button>

      <div style="font-size: 12px; color: #6b7280; margin-top: 10px;">
        <span id="fieldCount">No fields detected yet</span>
      </div>
    </div>
  `;

  // Now set up the event listeners
  setupEventListeners();
}

function setupEventListeners() {
  let detectedFields = [];
  
  const detectBtn = document.getElementById('detectBtn');
  const fillBtn = document.getElementById('fillBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const status = document.getElementById('status');
  const fieldCount = document.getElementById('fieldCount');

  // Detect button click
  detectBtn.addEventListener('click', async () => {
    status.textContent = 'Scanning page...';
    status.style.background = '#dbeafe';
    status.style.color = '#1e40af';
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: detectFormFields
      });
      
      detectedFields = results[0].result;
      
      if (detectedFields.length > 0) {
        status.textContent = `Found ${detectedFields.length} fillable fields!`;
        status.style.background = '#dcfce7';
        status.style.color = '#166534';
        fieldCount.textContent = `${detectedFields.length} fields detected`;
        fillBtn.disabled = false;
        fillBtn.style.background = '#2563eb';
        fillBtn.style.cursor = 'pointer';
      } else {
        status.textContent = 'No form fields found on this page';
        status.style.background = '#dbeafe';
        status.style.color = '#1e40af';
      }
    } catch (error) {
      status.textContent = 'Error detecting fields';
      console.error(error);
    }
  });

  // Fill button click
  fillBtn.addEventListener('click', async () => {
    status.textContent = 'Filling form...';
    
    try {
      // Get user profile from storage
      chrome.storage.local.get(['userProfile'], async (result) => {
        const profile = result.userProfile;
        
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: fillFormFields,
          args: [detectedFields, profile]
        });
        
        status.textContent = 'Form filled successfully!';
        status.style.background = '#dcfce7';
        status.style.color = '#166534';
      });
    } catch (error) {
      status.textContent = 'Error filling form';
      console.error(error);
    }
  });

  // Settings button click
  settingsBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'profile-form.html' });
  });
}

// This function runs in the page context
function detectFormFields() {
  const fields = [];
  
  function getFieldLabel(input) {
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return label.textContent.trim();
    }
    
    const parentLabel = input.closest('label');
    if (parentLabel) return parentLabel.textContent.trim();
    
    const prevSibling = input.previousElementSibling;
    if (prevSibling && prevSibling.tagName === 'LABEL') {
      return prevSibling.textContent.trim();
    }
    
    return input.name || input.placeholder || 'Unknown field';
  }
  
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach((input, index) => {
    if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button') {
      return;
    }
    
    const fieldInfo = {
      id: input.id || `field_${index}`,
      name: input.name || '',
      type: input.type || input.tagName.toLowerCase(),
      placeholder: input.placeholder || '',
      label: getFieldLabel(input),
      value: input.value || '',
      required: input.required || false
    };
    
    fields.push(fieldInfo);
    
    input.style.outline = '2px solid #3b82f6';
    input.style.outlineOffset = '2px';
  });
  
  return fields;
}

// This function runs in the page context
function fillFormFields(fields, profile) {
  // Map profile data to form fields
  const fieldMapping = {
    'first name': profile.firstName,
    'last name': profile.lastName,
    'email': profile.email,
    'phone': profile.phone,
    'linkedin': profile.linkedin,
    'github': profile.github,
    'portfolio': profile.portfolio,
    'location': profile.location,
    'city': profile.location,
    'current company': profile.currentCompany,
    'company': profile.currentCompany,
    'current position': profile.currentTitle,
    'position': profile.currentTitle,
    'title': profile.currentTitle,
    'years of experience': profile.totalExperience,
    'experience': profile.totalExperience,
    'notice period': profile.noticePeriod
  };
  
  fields.forEach(field => {
    let input;
    if (field.id && field.id.startsWith('field_')) {
      const index = parseInt(field.id.split('_')[1]);
      const inputs = document.querySelectorAll('input, textarea, select');
      input = inputs[index];
    } else {
      input = document.getElementById(field.id) || document.querySelector(`[name="${field.name}"]`);
    }
    
    if (!input) return;
    
    const fieldText = (field.label + ' ' + field.name + ' ' + field.placeholder).toLowerCase();
    
    for (const [key, value] of Object.entries(fieldMapping)) {
      if (fieldText.includes(key) && value) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  });
}