// Content script that runs on all pages
console.log('JobFlow: Content script loaded');

// ==================== DROPDOWN VALUE MAPPINGS ====================

const DROPDOWN_MAPPINGS = {
  // Veteran Status Mappings
  veteran_status: {
    'noVeteran': [
      'I am not a protected veteran',
      'I am NOT a protected veteran',
      'Not a Veteran',
      'Not a protected veteran',
      'No',
      'I don\'t wish to answer',
      'not_protected',
      'no_veteran'
    ],
    'iVeteran': [
      'I identify as one or more of the classifications of a protected veteran',
      'I identify as one or more of the classification of a protected veteran',
      'Protected Veteran',
      'Yes, I am a veteran',
      'Yes, I am a protected veteran',
      'Yes',
      'Veteran',
      'protected',
      'is_veteran'
    ],
    'otherVeteran': [
      'Decline to self identify',
      'I decline to self-identify',
      'Prefer not to answer',
      'Decline to answer',
      'I don\'t wish to answer',
      'decline',
      'other'
    ]
  },

  // Hispanic Latino
  hispanicLatino: {
    'yes': [
      'Yes',
      'yes',
      'Hispanic',
      'Latino',
      'Latina',
      'Latinx',
      'Hispanic or Latino',
      'I am Hispanic or Latino',
      'Hispanic/Latino'
    ],
    'no': [
      'No',
      'no',
      'Not Hispanic',
      'Not Latino',
      'Not Hispanic or Latino',
      'I am not Hispanic or Latino',
      'Neither Hispanic nor Latino'
    ],
    'otherHisLat': [
      'Decline',
      'Decline To Self Identify',
      'Decline to Identify',
      'Prefer not to answer',
      'Prefer not to say',
      'Choose not to disclose',
      'I choose not to disclose',
      'decline',
      'prefer not'
    ]
  },

  // Disability Status Mappings
  disability_status: {
    'noDisability': [
      'I don\'t have a disability',
      'I do not have a disability',
      'No, I don\'t have a disability',
      'No disability',
      'No',
      'no_disability',
      'not_disabled'
    ],
    'yesDisability': [
      'Yes, I have a disability',
      'Yes, I have a disability (or previously had a disability)',
      'I have a disability',
      'Yes',
      'has_disability',
      'disabled'
    ],
    'declineDisability': [
      'I don\'t wish to answer',
      'Decline to self identify',
      'Prefer not to answer',
      'Decline to answer',
      'decline',
      'other_disability'
    ]
  },

  // Race/Ethnicity Mappings
  race: {
    'asian': [
      'Asian',
      'Asian (Not Hispanic or Latino)',
      'Asian/Pacific Islander',
      'asian'
    ],
    'white': [
      'White',
      'White (Not Hispanic or Latino)',
      'Caucasian',
      'white'
    ],
    'hispanic': [
      'Hispanic or Latino',
      'Hispanic/Latino',
      'Latino',
      'Hispanic',
      'hispanic'
    ],
    'black': [
      'Black or African American',
      'Black or African American (Not Hispanic or Latino)',
      'African American',
      'Black',
      'black'
    ],
    'american': [
      'American Indian or Alaska Native',
      'American Indian or Alaskan Native',
      'Native American',
      'American Indian',
      'american'
    ],
    'native': [
      'Native Hawaiian or Other Pacific Islander',
      'Pacific Islander',
      'Hawaiian',
      'native'
    ],
    'twoOrMore': [
      'Two or More Races',
      'Two or more races',
      'Two or more races (Not Hispanic or Latino)',
      'Multiple races',
      'twoOrMore',
      'two_or_more'
    ],
    'otherRace': [
      'Decline To Self Identify',
      'Decline to self identify',
      'Prefer not to answer',
      'I don\'t wish to answer',
      'Other',
      'otherRace',
      'decline'
    ]
  },

  // Gender Mappings
  gender: {
    'male': [
      'Male',
      'male',
      'M',
      'Man'
    ],
    'female': [
      'Female',
      'female',
      'F',
      'Woman'
    ],
    'otherGender': [
      'Prefer not to answer',
      'Decline to self identify',
      'Decline',
      'I don\'t wish to answer'
    ]
  },

  // Work Authorization / Visa Sponsorship
  visa_sponsorship_required: {
    'yes': [
      'Yes',
      'yes',
      'Y',
      'true',
      '1',
      'I am authorized',
      'Authorized',
      'I am legally authorized'
    ],
    'no': [
      'No',
      'no',
      'N',
      'false',
      '0',
      'Not authorized',
      'Require sponsorship',
      'I require sponsorship'
    ]
  },

  // F-1/OPT/CPT Status
  student_visa_status: {
    'yes': [
      'Yes',
      'yes',
      'Y',
      'true',
      '1',
      'Currently in F-1 status',
      'Yes, I have work authorization',
      'I am in F-1 status'
    ],
    'no': [
      'No',
      'no',
      'N',
      'false',
      '0',
      'Not in F-1 status',
      'I am not in F-1 status'
    ]
  },

  // H1B/TN/O-1 Status
  sponsored_visa_status: {
    'yes': [
      'Yes',
      'yes',
      'Y',
      'true',
      '1',
      'Currently sponsored',
      'I am sponsored'
    ],
    'no': [
      'No',
      'no',
      'N',
      'false',
      '0',
      'Not sponsored',
      'I am not sponsored'
    ]
  },

  // Non-compete / Restrictive Covenants
  restrictive_bond: {
    'yes': [
      'Yes',
      'yes',
      'Y',
      'true',
      '1'
    ],
    'no': [
      'No',
      'no',
      'N',
      'false',
      '0'
    ]
  },

  // Education Degree Levels
  degree: {
    'highSchool': [
      'High School',
      'High School Diploma',
      'GED',
      'Secondary School',
      'high_school',
      'highschool',
      'secondary'
    ],
    'associateDegree': [
      'Associate Degree',
      'Associate\'s Degree',
      'Associate\'s',
      'Associate',
      'A.A.',
      'A.S.',
      'associate',
      'associates'
    ],
    'bachelorDegree': [
      'Bachelor\'s Degree',
      'Bachelor Degree',
      'Bachelor\'s',
      'Bachelor',
      'B.A.',
      'B.S.',
      'B.Sc.',
      'BS',
      'BA',
      'bachelor',
      'bachelors'
    ],
    'mastersDegree': [
      'Master\'s Degree',
      'Master Degree',
      'Master\'s',
      'Master',
      'M.A.',
      'M.S.',
      'M.Sc.',
      'MS',
      'MA',
      'master',
      'masters'
    ],
    'mbaDegree': [
      'MBA',
      'Master\'s Of Business Administration',
      'Master of Business Administration',
      'M.B.A.',
      'Master Business Administration',
      'mba'
    ],
    'jurisDegree': [
      'JD',
      'Juris Doctor',
      'Juris Doctorate',
      'J.D.',
      'Doctor of Law',
      'Law Degree',
      'juris',
      'law'
    ],
    'doctorOfMedicine': [
      'MD',
      'M.D.',
      'Doctor of Medicine',
      'Medical Doctor',
      'Medicine',
      'medical degree',
      'doctor medicine'
    ],
    'doctorOfPhilosophy': [
      'PhD',
      'Ph.D.',
      'Doctor of Philosophy',
      'Doctorate',
      'Doctoral Degree',
      'phd',
      'doctorate',
      'doctor philosophy'
    ],
    'engineerDegree': [
      'Engineer Degree',
      'Engineering Degree',
      'B.E.',
      'B.Eng.',
      'M.E.',
      'M.Eng.',
      'Bachelor of Engineering',
      'Master of Engineering',
      'engineer',
      'engineering'
    ],
    'otherDegree': [
      'Other',
      'Professional Degree',
      'Vocational',
      'Certificate',
      'Diploma',
      'other'
    ]
  },

  // Employment Type
  employment_type: {
    'fullTime': [
      'Full-time',
      'Full Time',
      'Full-Time',
      'FT',
      'Permanent',
      'full_time',
      'fulltime'
    ],
    'partTime': [
      'Part-time',
      'Part Time',
      'Part-Time',
      'PT',
      'part_time',
      'parttime'
    ],
    'contract': [
      'Contract',
      'Contractor',
      'Contract Work',
      'contract'
    ],
    'intern': [
      'Intern',
      'Internship',
      'intern'
    ],
    'freelance': [
      'Freelance',
      'Freelancer',
      'Self-Employed',
      'freelance'
    ]
  },

  // Years of Experience
  years_experience: {
    '0-1': [
      '0-1 years',
      'Less than 1 year',
      '0-1',
      'Entry Level',
      '< 1 year'
    ],
    '1-3': [
      '1-3 years',
      '1-3',
      '1 to 3 years'
    ],
    '3-5': [
      '3-5 years',
      '3-5',
      '3 to 5 years'
    ],
    '5-10': [
      '5-10 years',
      '5-10',
      '5 to 10 years'
    ],
    '10+': [
      '10+ years',
      'More than 10 years',
      '10-15 years',
      '15+ years'
    ]
  },

  // Current Status (Student/Employed)
  current_status: {
    'student': [
      'Student',
      'Full-time Student',
      'Currently a Student',
      'student'
    ],
    'employed': [
      'Employed',
      'Currently Employed',
      'Working',
      'employed'
    ],
    'unemployed': [
      'Unemployed',
      'Not Currently Employed',
      'Seeking Employment',
      'unemployed'
    ],
    'selfEmployed': [
      'Self-Employed',
      'Freelance',
      'Entrepreneur',
      'self_employed'
    ]
  },

  // Salary Range
  salary_range: {
    'under50k': [
      'Under $50,000',
      'Less than $50k',
      '< $50,000',
      '$0 - $50,000'
    ],
    '50k-75k': [
      '$50,000 - $75,000',
      '$50k - $75k',
      '50-75k'
    ],
    '75k-100k': [
      '$75,000 - $100,000',
      '$75k - $100k',
      '75-100k'
    ],
    '100k-150k': [
      '$100,000 - $150,000',
      '$100k - $150k',
      '100-150k'
    ],
    '150k+': [
      'Over $150,000',
      '$150,000+',
      '$150k+',
      'More than $150k'
    ]
  },

  // Willing to Relocate
  willing_relocate: {
    'Yes': [
      'Yes',
      'yes',
      'Willing to relocate',
      'Open to relocation'
    ],
    'No': [
      'No',
      'no',
      'Not willing to relocate',
      'No relocation'
    ],
    'Maybe': [
      'Maybe',
      'Open to discussion',
      'Depending on location',
      'Perhaps'
    ]
  },

  // How did you hear about us?
  referral_source: {
    'linkedIn': [
      'LinkedIn',
      'Linkedin',
      'linkedin'
    ],
    'indeed': [
      'Indeed',
      'indeed'
    ],
    'companyWebsite': [
      'Company Website',
      'Your Website',
      'website',
      'company_website'
    ],
    'referral': [
      'Referral',
      'Employee Referral',
      'Friend or Colleague',
      'referral'
    ],
    'other': [
      'Other',
      'Other (Please specify)',
      'other'
    ]
  }
};

// ==================== MESSAGE LISTENERS ====================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('JobFlow: Received message:', request.action);
  
  // Handle ping (to check if script is loaded)
  if (request.action === 'ping') {
    sendResponse({ success: true, message: 'pong' });
    return true;
  }
  
  // Handle detect fields
  if (request.action === 'detectFields') {
    try {
      const fields = detectFormFields();
      sendResponse({ success: true, fields });
    } catch (error) {
      console.error('Error detecting fields:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
  
  // Handle autofill
  if (request.action === 'autofillForm') {
    try {
      const result = autofillFormFields(request.data);
      sendResponse({ success: true, result });
    } catch (error) {
      console.error('Error autofilling:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }

  // Handle file input highlighting
  if (request.action === 'highlightFileInput') {
    try {
      const element = document.querySelector(request.selector);
      
      if (element && element.type === 'file') {
        console.log(`📁 Highlighting file input for: ${request.filename}`);
        
        // Highlight the file input with enhanced styling
        element.style.border = '3px solid #10b981';
        element.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.5)';
        element.style.padding = '8px';
        element.style.borderRadius = '6px';
        element.style.backgroundColor = '#f0fdf4';
        
        // Scroll into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add enhanced tooltip/label
        const tooltip = document.createElement('div');
        tooltip.className = 'jobflow-file-tooltip';
        tooltip.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 20px;">📁</span>
            <div>
              <div style="font-weight: 600;">Upload Required</div>
              <div style="font-size: 12px; opacity: 0.9;">${request.filename}</div>
            </div>
          </div>
        `;
        tooltip.style.cssText = `
          position: fixed;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          z-index: 999999;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
          pointer-events: none;
          animation: fadeInBounce 0.5s ease;
        `;
        
        // Position tooltip above the input
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.top + window.scrollY - 70}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        
        document.body.appendChild(tooltip);
        
        // Remove highlight and tooltip after 10 seconds
        setTimeout(() => {
          element.style.border = '';
          element.style.boxShadow = '';
          element.style.padding = '';
          element.style.borderRadius = '';
          element.style.backgroundColor = '';
          tooltip.remove();
        }, 10000);
        
        sendResponse({ success: true });
      } else {
        console.warn('File input not found:', request.selector);
        sendResponse({ success: false, error: 'File input not found' });
      }
    } catch (error) {
      console.error('Error highlighting file input:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
  
  return true;
});

// Add CSS animation for tooltip
if (!document.getElementById('jobflow-animations')) {
  const style = document.createElement('style');
  style.id = 'jobflow-animations';
  style.textContent = `
    @keyframes fadeInBounce {
      0% {
        opacity: 0;
        transform: translateY(-20px) scale(0.8);
      }
      60% {
        opacity: 1;
        transform: translateY(5px) scale(1.05);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100px);
      }
    }
  `;
  document.head.appendChild(style);
}

// Auto-detect when page loads
window.addEventListener('load', () => {
  const formCount = document.querySelectorAll('form').length;
  if (formCount > 0) {
    console.log(`JobFlow: Found ${formCount} forms on this page`);
  }
});

// ==================== FIELD DETECTION ====================

function detectFormFields() {
  const fields = [];
  const formElements = document.querySelectorAll('input, textarea, select');
  
  formElements.forEach((element, index) => {
    // Skip buttons, submit, hidden, etc.
    const excludedTypes = ['submit', 'button', 'image', 'reset', 'hidden'];
    if (excludedTypes.includes(element.type)) {
      return;
    }

    // Get field information
    const fieldInfo = {
      index: index,
      tagName: element.tagName.toLowerCase(),
      type: element.type || 'text',
      name: element.name || '',
      id: element.id || '',
      placeholder: element.placeholder || '',
      autocomplete: element.autocomplete || '',
      required: element.required || false,
      value: element.value || '',
      label: getFieldLabel(element),
      selector: getUniqueSelector(element),
      // Dropdown info
      isDropdown: element.tagName.toLowerCase() === 'select',
      options: element.tagName.toLowerCase() === 'select' ? getDropdownOptions(element) : [],
      // File input info
      isFileInput: element.type === 'file',
      acceptedFileTypes: element.type === 'file' ? (element.accept || '*/*') : null
    };

    fields.push(fieldInfo);
  });

  console.log(`JobFlow: Detected ${fields.length} form fields (including ${fields.filter(f => f.isFileInput).length} file inputs)`);
  return fields;
}

// Get dropdown options
function getDropdownOptions(selectElement) {
  const options = [];
  Array.from(selectElement.options).forEach(option => {
    options.push({
      value: option.value,
      text: option.text.trim(),
      selected: option.selected
    });
  });
  return options;
}

// Get the label associated with a field
function getFieldLabel(element) {
  // Try to find label by 'for' attribute
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label) return label.textContent.trim();
  }

  // Try to find parent label
  const parentLabel = element.closest('label');
  if (parentLabel) {
    return parentLabel.textContent.trim();
  }

  // Try to find previous sibling label
  let sibling = element.previousElementSibling;
  if (sibling && sibling.tagName === 'LABEL') {
    return sibling.textContent.trim();
  }

  // Try aria-label
  if (element.getAttribute('aria-label')) {
    return element.getAttribute('aria-label');
  }

  // Fallback to placeholder, name, or id
  return element.placeholder || element.name || element.id || 'Unknown Field';
}

// Generate a unique CSS selector for an element
function getUniqueSelector(element) {
  // Prefer ID
  if (element.id) {
    return `#${element.id}`;
  }

  // Use name attribute
  if (element.name) {
    return `${element.tagName.toLowerCase()}[name="${element.name}"]`;
  }

  // Use data attributes if available
  const dataAttrs = Array.from(element.attributes)
    .filter(attr => attr.name.startsWith('data-'))
    .map(attr => `[${attr.name}="${attr.value}"]`)
    .join('');
  
  if (dataAttrs) {
    return `${element.tagName.toLowerCase()}${dataAttrs}`;
  }

  // Fallback: generate path
  const path = [];
  let current = element;
  while (current && current.tagName) {
    let selector = current.tagName.toLowerCase();
    if (current.className) {
      selector += '.' + current.className.trim().split(/\s+/).join('.');
    }
    path.unshift(selector);
    current = current.parentElement;
    if (path.length > 5) break;
  }
  return path.join(' > ');
}

// ==================== AUTOFILL LOGIC ====================

function autofillFormFields(fieldValues) {
  let filledCount = 0;
  let errors = [];

  console.log(`JobFlow: Starting autofill for ${fieldValues.length} fields`);

  fieldValues.forEach((fieldData, index) => {
    try {
      const { selector, value, fieldLabel } = fieldData;
      const element = document.querySelector(selector);

      if (!element) {
        errors.push(`Field not found: ${selector}`);
        console.warn(`JobFlow: Could not find field with selector: ${selector}`);
        return;
      }

      console.log(`\nJobFlow: Processing field ${index + 1}/${fieldValues.length}`);
      console.log(`  Label: ${fieldLabel}`);
      console.log(`  Selector: ${selector}`);
      console.log(`  Value from profile: "${value}"`);
      console.log(`  Element type: ${element.tagName} (${element.type || 'N/A'})`);

      // Skip file inputs (they're handled separately)
      if (element.type === 'file') {
        console.log(`  ⏭️ Skipping file input (handled separately)`);
        return;
      }

      // Check if it's a dropdown/select element
      if (element.tagName.toLowerCase() === 'select') {
        const success = fillDropdown(element, value, fieldLabel);
        if (success) {
          filledCount++;
          console.log(`  ✅ Dropdown filled successfully`);
        } else {
          errors.push(`Could not find matching option for: ${fieldLabel}`);
          console.warn(`  ❌ Could not find matching dropdown option`);
        }
      } 
      // Check if it's a date input
      else if (element.type === 'date') {
        const success = fillDateField(element, value, fieldLabel);
        if (success) {
          filledCount++;
          console.log(`  ✅ Date field filled successfully`);
        } else {
          errors.push(`Could not format date for: ${fieldLabel}`);
          console.warn(`  ❌ Could not fill date field`);
        }
      }
      // Check if it's a month input
      else if (element.type === 'month') {
        const success = fillMonthField(element, value, fieldLabel);
        if (success) {
          filledCount++;
          console.log(`  ✅ Month field filled successfully`);
        } else {
          errors.push(`Could not format month for: ${fieldLabel}`);
          console.warn(`  ❌ Could not fill month field`);
        }
      }
      // Check if it's a week input
      else if (element.type === 'week') {
        const success = fillWeekField(element, value, fieldLabel);
        if (success) {
          filledCount++;
          console.log(`  ✅ Week field filled successfully`);
        } else {
          errors.push(`Could not format week for: ${fieldLabel}`);
          console.warn(`  ❌ Could not fill week field`);
        }
      }
      // Regular input/textarea field
      else {
        element.value = value;

        // Trigger events
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));

        // Visual feedback
        element.style.border = '2px solid #8B5CF6';
        setTimeout(() => {
          element.style.border = '';
        }, 2000);

        filledCount++;
        console.log(`  ✅ Field filled with: "${value}"`);
      }

    } catch (error) {
      errors.push(`Error filling field: ${error.message}`);
      console.error('JobFlow: Error filling field:', error);
    }
  });

  console.log(`\nJobFlow: Autofill complete. Filled ${filledCount}/${fieldValues.length} fields.`);
  
  // Show notification on the page
  if (filledCount > 0) {
    showPageNotification(`✅ Filled ${filledCount} fields!`, 'success');
  }
  
  return {
    filledCount,
    totalFields: fieldValues.length,
    errors
  };
}

// ==================== DATE FIELD FILLING LOGIC ====================

/**
 * Fill a date input field
 * Accepts various date formats and converts to YYYY-MM-DD
 */
function fillDateField(dateElement, dateValue, fieldLabel) {
  console.log(`  📅 Date input detected`);
  console.log(`  Raw date value: "${dateValue}"`);
  
  try {
    // Parse the date value into a standardized format
    const formattedDate = formatDateForInput(dateValue);
    
    if (!formattedDate) {
      console.warn(`  ⚠️ Could not parse date: "${dateValue}"`);
      return false;
    }
    
    console.log(`  📅 Formatted date: "${formattedDate}"`);
    
    // Set the value
    dateElement.value = formattedDate;
    
    // Trigger events
    dateElement.dispatchEvent(new Event('input', { bubbles: true }));
    dateElement.dispatchEvent(new Event('change', { bubbles: true }));
    dateElement.dispatchEvent(new Event('blur', { bubbles: true }));
    
    // Visual feedback
    dateElement.style.border = '2px solid #8B5CF6';
    setTimeout(() => {
      dateElement.style.border = '';
    }, 2000);
    
    return true;
  } catch (error) {
    console.error(`  ❌ Error filling date field:`, error);
    return false;
  }
}

/**
 * Fill a month input field (format: YYYY-MM)
 */
function fillMonthField(monthElement, dateValue, fieldLabel) {
  console.log(`  📅 Month input detected`);
  console.log(`  Raw date value: "${dateValue}"`);
  
  try {
    const formattedMonth = formatMonthForInput(dateValue);
    
    if (!formattedMonth) {
      console.warn(`  ⚠️ Could not parse month: "${dateValue}"`);
      return false;
    }
    
    console.log(`  📅 Formatted month: "${formattedMonth}"`);
    
    monthElement.value = formattedMonth;
    
    // Trigger events
    monthElement.dispatchEvent(new Event('input', { bubbles: true }));
    monthElement.dispatchEvent(new Event('change', { bubbles: true }));
    monthElement.dispatchEvent(new Event('blur', { bubbles: true }));
    
    // Visual feedback
    monthElement.style.border = '2px solid #8B5CF6';
    setTimeout(() => {
      monthElement.style.border = '';
    }, 2000);
    
    return true;
  } catch (error) {
    console.error(`  ❌ Error filling month field:`, error);
    return false;
  }
}

/**
 * Fill a week input field (format: YYYY-Www)
 */
function fillWeekField(weekElement, dateValue, fieldLabel) {
  console.log(`  📅 Week input detected`);
  console.log(`  Raw date value: "${dateValue}"`);
  
  try {
    const formattedWeek = formatWeekForInput(dateValue);
    
    if (!formattedWeek) {
      console.warn(`  ⚠️ Could not parse week: "${dateValue}"`);
      return false;
    }
    
    console.log(`  📅 Formatted week: "${formattedWeek}"`);
    
    weekElement.value = formattedWeek;
    
    // Trigger events
    weekElement.dispatchEvent(new Event('input', { bubbles: true }));
    weekElement.dispatchEvent(new Event('change', { bubbles: true }));
    weekElement.dispatchEvent(new Event('blur', { bubbles: true }));
    
    // Visual feedback
    weekElement.style.border = '2px solid #8B5CF6';
    setTimeout(() => {
      weekElement.style.border = '';
    }, 2000);
    
    return true;
  } catch (error) {
    console.error(`  ❌ Error filling week field:`, error);
    return false;
  }
}

/**
 * Format date to YYYY-MM-DD
 * Accepts various formats:
 * - ISO 8601: "2024-03-15", "2024-03-15T10:30:00Z"
 * - US Format: "03/15/2024", "3/15/2024"
 * - EU Format: "15/03/2024", "15.03.2024"
 * - Long Format: "March 15, 2024", "15 March 2024"
 * - Timestamp: 1710504000000
 */
function formatDateForInput(dateValue) {
  if (!dateValue) return null;
  
  let date;
  
  // If it's already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  // Try parsing as ISO string or standard date formats
  date = new Date(dateValue);
  
  // Check if valid
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Try parsing MM/DD/YYYY or DD/MM/YYYY
  const slashMatch = dateValue.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (slashMatch) {
    const [, first, second, year] = slashMatch;
    
    // Try US format first (MM/DD/YYYY)
    const usDate = new Date(year, parseInt(first) - 1, parseInt(second));
    if (!isNaN(usDate.getTime()) && parseInt(first) <= 12) {
      const month = String(usDate.getMonth() + 1).padStart(2, '0');
      const day = String(usDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // Try EU format (DD/MM/YYYY)
    const euDate = new Date(year, parseInt(second) - 1, parseInt(first));
    if (!isNaN(euDate.getTime()) && parseInt(second) <= 12) {
      const month = String(euDate.getMonth() + 1).padStart(2, '0');
      const day = String(euDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  // If all parsing fails
  console.warn(`Could not parse date: "${dateValue}"`);
  return null;
}

/**
 * Format date to YYYY-MM for month inputs
 */
function formatMonthForInput(dateValue) {
  if (!dateValue) return null;
  
  // If already in YYYY-MM format
  if (/^\d{4}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  const date = new Date(dateValue);
  
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
  
  return null;
}

/**
 * Format date to YYYY-Www for week inputs
 */
function formatWeekForInput(dateValue) {
  if (!dateValue) return null;
  
  // If already in YYYY-Www format
  if (/^\d{4}-W\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  const date = new Date(dateValue);
  
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    return `${year}-W${String(week).padStart(2, '0')}`;
  }
  
  return null;
}

/**
 * Get ISO week number from date
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// ==================== DROPDOWN FILLING LOGIC ====================

function fillDropdown(selectElement, profileValue, fieldLabel) {
  console.log(`  📋 Dropdown detected with ${selectElement.options.length} options`);
  
  // Get all available options
  const options = Array.from(selectElement.options);
  
  console.log(`  Available options:`);
  options.forEach((opt, i) => {
    console.log(`    ${i + 1}. value="${opt.value}" text="${opt.text}"`);
  });

  // Try to find the best matching option
  const matchedOption = findBestDropdownMatch(options, profileValue, fieldLabel);
  
  if (matchedOption) {
    console.log(`  🎯 Found match: "${matchedOption.text}" (value: "${matchedOption.value}")`);
    
    // Set the selected option
    selectElement.value = matchedOption.value;
    
    // Trigger change events
    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    selectElement.dispatchEvent(new Event('blur', { bubbles: true }));
    
    // Visual feedback
    selectElement.style.border = '2px solid #8B5CF6';
    setTimeout(() => {
      selectElement.style.border = '';
    }, 2000);
    
    return true;
  }
  
  console.log(`  ⚠️ No matching option found`);
  return false;
}

function findBestDropdownMatch(options, profileValue, fieldLabel) {
  console.log(`  🔍 Searching for match: Profile value = "${profileValue}"`);
  
  // Determine which mapping to use based on the profile value or field label
  let mappingKey = profileValue;
  let mappingCategory = null;

  // Try to find exact mapping category
  for (const [category, mappings] of Object.entries(DROPDOWN_MAPPINGS)) {
    if (mappings[profileValue]) {
      mappingCategory = mappings;
      console.log(`  📚 Found mapping category: ${category}`);
      break;
    }
  }

  // If no exact match, try to infer from field label
  if (!mappingCategory) {
    const labelLower = fieldLabel.toLowerCase();
    
    if (labelLower.includes('veteran')) {
      mappingCategory = DROPDOWN_MAPPINGS.veteran_status;
    } else if (labelLower.includes('disability') || labelLower.includes('disabled')) {
      mappingCategory = DROPDOWN_MAPPINGS.disability_status;
    } else if (labelLower.includes('race') || labelLower.includes('ethnicity')) {
      mappingCategory = DROPDOWN_MAPPINGS.race;
    } else if (labelLower.includes('gender') || labelLower.includes('sex')) {
      mappingCategory = DROPDOWN_MAPPINGS.gender;
    } else if (labelLower.includes('degree') || labelLower.includes('education level')) {
      mappingCategory = DROPDOWN_MAPPINGS.degree;
    } else if (labelLower.includes('visa') || labelLower.includes('sponsor') || labelLower.includes('authorized to work')) {
      mappingCategory = DROPDOWN_MAPPINGS.visa_sponsorship_required;
    } else if (labelLower.includes('f-1') || labelLower.includes('opt') || labelLower.includes('cpt')) {
      mappingCategory = DROPDOWN_MAPPINGS.student_visa_status;
    } else if (labelLower.includes('h1b') || labelLower.includes('o-1') || labelLower.includes('tn')) {
      mappingCategory = DROPDOWN_MAPPINGS.sponsored_visa_status;
    } else if (labelLower.includes('compete') || labelLower.includes('restrictive')) {
      mappingCategory = DROPDOWN_MAPPINGS.restrictive_bond;
    } else if (labelLower.includes('employment type') || labelLower.includes('job type')) {
      mappingCategory = DROPDOWN_MAPPINGS.employment_type;
    } else if (labelLower.includes('experience')) {
      mappingCategory = DROPDOWN_MAPPINGS.years_experience;
    } else if (labelLower.includes('salary') || labelLower.includes('compensation')) {
      mappingCategory = DROPDOWN_MAPPINGS.salary_range;
    } else if (labelLower.includes('relocate')) {
      mappingCategory = DROPDOWN_MAPPINGS.willing_relocate;
    } else if (labelLower.includes('hear about') || labelLower.includes('find us')) {
      mappingCategory = DROPDOWN_MAPPINGS.referral_source;
    } else if (labelLower.includes('hispanic') || labelLower.includes('latino')) {
      mappingCategory = DROPDOWN_MAPPINGS.hispanicLatino;
    }
    
    if (mappingCategory) {
      console.log(`  🔎 Inferred mapping from label: "${fieldLabel}"`);
    }
  }

  // If we have a mapping, try to match using it
  if (mappingCategory && mappingCategory[mappingKey]) {
    const possibleValues = mappingCategory[mappingKey];
    console.log(`  📝 Trying ${possibleValues.length} possible matches for "${mappingKey}"`);
    
    for (const possibleValue of possibleValues) {
      for (const option of options) {
        // Skip disabled or empty options
        if (option.disabled || !option.value) continue;
        
        // Case-insensitive comparison of both text and value
        const optionText = option.text.trim().toLowerCase();
        const optionValue = option.value.toLowerCase();
        const searchValue = possibleValue.toLowerCase();
        
        // Exact matches get priority
        if (optionText === searchValue || optionValue === searchValue) {
          console.log(`  ✅ Exact match found!`);
          return option;
        }
        
        // Then try partial matches
        if (optionText.includes(searchValue) || searchValue.includes(optionText)) {
          console.log(`  ✅ Partial match found!`);
          return option;
        }
        
        if (optionValue === mappingKey.toLowerCase() || optionValue === searchValue) {
          console.log(`  ✅ Value match found!`);
          return option;
        }
      }
    }
  }

  // Fallback: Try direct match with profile value
  console.log(`  🔄 Trying direct match with "${profileValue}"`);
  for (const option of options) {
    // Skip disabled or empty options
    if (option.disabled || !option.value) continue;
    
    const optionText = option.text.trim().toLowerCase();
    const optionValue = option.value.toLowerCase();
    const searchValue = profileValue.toLowerCase();
    
    if (optionText === searchValue || 
        optionValue === searchValue ||
        optionText.includes(searchValue) ||
        searchValue.includes(optionText)) {
      console.log(`  ✅ Direct match found!`);
      return option;
    }
  }

  console.log(`  ❌ No match found for "${profileValue}"`);
  return null;
}

// ==================== NOTIFICATION ====================

function showPageNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #8B5CF6, #6366F1)' : '#ef4444'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(139, 92, 246, 0.5);
    z-index: 999999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 600;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}