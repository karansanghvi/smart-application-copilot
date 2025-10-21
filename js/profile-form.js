document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentStep = 1;
  const totalSteps = 7;
  let skills = [];
  let experienceCount = 0;
  
  // DOM Elements
  const form = document.getElementById('profileForm');
  const steps = document.querySelectorAll('.form-step');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  
  // Currently Working Checkbox - Disable End Date
  const currentlyWorkingCheckbox = document.getElementById('currentlyWorking');
  const endDateInput = document.getElementById('endDate');
  
  if (currentlyWorkingCheckbox && endDateInput) {
    currentlyWorkingCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        endDateInput.value = '';
        endDateInput.disabled = true;
        endDateInput.style.opacity = '0.5';
        endDateInput.required = false;
      } else {
        endDateInput.disabled = false;
        endDateInput.style.opacity = '1';
        endDateInput.required = false; // Keep optional
      }
    });
  }
  
  // Experience Management
  const addExperienceBtn = document.getElementById('addExperienceBtn');
  const additionalExperiencesContainer = document.getElementById('additionalExperiences');

  if (addExperienceBtn) {
    addExperienceBtn.addEventListener('click', () => {
      addExperienceItem();
    });
  }

  function addExperienceItem() {
    experienceCount++;
    
    const experienceHTML = `
      <div class="experience-item additional-experience" data-experience-id="${experienceCount}">
        <div class="experience-header">
          <h3>Previous Position ${experienceCount}</h3>
          <button type="button" class="remove-experience-btn" data-remove-id="${experienceCount}">
            Remove
          </button>
        </div>

        <div class="form-group">
          <label for="jobTitle_${experienceCount}">Enter Job Title *</label>
          <input type="text" id="jobTitle_${experienceCount}" name="jobTitle_${experienceCount}" required placeholder="Title">
        </div>
        
        <div class="form-group">
          <label for="companyName_${experienceCount}">Enter Company *</label>
          <input type="text" id="companyName_${experienceCount}" name="companyName_${experienceCount}" placeholder="Company" required>
        </div>

        <div class="form-grid-two">
          <div class="form-group">
            <label for="startDate_${experienceCount}">Select Start Date *</label>
            <input type="date" id="startDate_${experienceCount}" name="startDate_${experienceCount}" required>
          </div>
          <div class="form-group">
            <label for="endDate_${experienceCount}">Select End Date *</label>
            <input type="date" id="endDate_${experienceCount}" name="endDate_${experienceCount}" required>
          </div>
        </div>
    
        <div class="form-group">
          <label for="experienceSummary_${experienceCount}">Job Description *</label>
          <textarea id="experienceSummary_${experienceCount}" name="experienceSummary_${experienceCount}" rows="4" required 
            placeholder="Describe your responsibilities and achievements..."></textarea>
        </div>
      </div>
    `;
    
    additionalExperiencesContainer.insertAdjacentHTML('beforeend', experienceHTML);
    
    // Scroll to the new experience
    const newExperience = additionalExperiencesContainer.lastElementChild;
    newExperience.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-experience-btn')) {
      const removeId = e.target.getAttribute('data-remove-id');
      const experienceItem = document.querySelector(`[data-experience-id="${removeId}"]`);
      
      if (experienceItem) {
        console.log('Removing experience:', removeId);
        
        // Add fade out animation
        experienceItem.style.transition = 'all 0.3s ease';
        experienceItem.style.opacity = '0';
        experienceItem.style.transform = 'translateX(-20px)';
        
        // Remove after animation
        setTimeout(() => {
          experienceItem.remove();
          console.log('Experience removed');
        }, 300);
      }
    }
  });
  
  // Tags Input - Skills
  const skillsInput = document.getElementById('skillsInput');
  const skillsTags = document.getElementById('skillsTags');
  
  if (skillsInput) {
    skillsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const skill = skillsInput.value.trim();
        if (skill && !skills.includes(skill)) {
          skills.push(skill);
          addTag(skill, skillsTags, skills);
          skillsInput.value = '';
        }
      }
    });
  }
  
  // File Upload - Resume
  const uploadBox = document.getElementById('uploadBox');
  const resumeUpload = document.getElementById('resumeUpload');
  const uploadedFile = document.getElementById('uploadedFile');
  const fileName = document.getElementById('fileName');
  const fileSize = document.getElementById('fileSize');
  const removeFile = document.getElementById('removeFile');
  let uploadedResume = null;
  
  // File Upload - Cover Letter
  const uploadBoxCover = document.getElementById('uploadBoxCover');
  const coverLetterUpload = document.getElementById('coverLetterUpload');
  const uploadedFileCover = document.getElementById('uploadedFileCover');
  const fileNameCover = document.getElementById('fileNameCover');
  const fileSizeCover = document.getElementById('fileSizeCover');
  const removeFileCover = document.getElementById('removeFileCover');
  let uploadedCoverLetter = null;
  
  // Resume Upload Handlers
  if (uploadBox) {
    uploadBox.addEventListener('click', () => {
      resumeUpload.click();
    });
    
    uploadBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadBox.style.borderColor = '#6366f1';
      uploadBox.style.background = 'rgba(99, 102, 241, 0.1)';
    });
    
    uploadBox.addEventListener('dragleave', () => {
      uploadBox.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      uploadBox.style.background = 'rgba(255, 255, 255, 0.03)';
    });
    
    uploadBox.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadBox.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      uploadBox.style.background = 'rgba(255, 255, 255, 0.03)';
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0], 'resume');
      }
    });
  }
  
  if (resumeUpload) {
    resumeUpload.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0], 'resume');
      }
    });
  }
  
  if (removeFile) {
    removeFile.addEventListener('click', () => {
      uploadedResume = null;
      resumeUpload.value = '';
      uploadBox.style.display = 'block';
      uploadedFile.style.display = 'none';
    });
  }

  // Cover Letter Upload Handlers
  if (uploadBoxCover) {
    uploadBoxCover.addEventListener('click', () => {
      coverLetterUpload.click();
    });
    
    uploadBoxCover.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadBoxCover.style.borderColor = '#6366f1';
      uploadBoxCover.style.background = 'rgba(99, 102, 241, 0.1)';
    });
    
    uploadBoxCover.addEventListener('dragleave', () => {
      uploadBoxCover.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      uploadBoxCover.style.background = 'rgba(255, 255, 255, 0.03)';
    });
    
    uploadBoxCover.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadBoxCover.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      uploadBoxCover.style.background = 'rgba(255, 255, 255, 0.03)';
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0], 'cover');
      }
    });
  }
  
  if (coverLetterUpload) {
    coverLetterUpload.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0], 'cover');
      }
    });
  }
  
  if (removeFileCover) {
    removeFileCover.addEventListener('click', () => {
      uploadedCoverLetter = null;
      coverLetterUpload.value = '';
      uploadBoxCover.style.display = 'block';
      uploadedFileCover.style.display = 'none';
    });
  }
  
  // Navigation
  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });
  
  nextBtn.addEventListener('click', () => {
    console.log('=== NEXT BUTTON CLICKED ===');
    console.log('Current step:', currentStep);
    
    // const isValid = validateStep(currentStep);
    // console.log('Validation result:', isValid);
    
    // if (isValid) {
      console.log('Validation passed! Moving to next step...');
      if (currentStep < totalSteps) {
        currentStep++;
        console.log('New step:', currentStep);
        showStep(currentStep);
      }
    // } else {
    //   console.log('Validation FAILED - staying on current step');
    // }
  });
  
  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      saveFormData();
    }
  });
  
  // Helper Functions
  function addTag(text, container, array) {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
      <span>${text}</span>
      <span class="tag-remove">×</span>
    `;
    
    tag.querySelector('.tag-remove').addEventListener('click', () => {
      const index = array.indexOf(text);
      if (index > -1) {
        array.splice(index, 1);
      }
      tag.remove();
    });
    
    container.appendChild(tag);
  }
  
  function handleFileUpload(file, type) {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, or DOCX file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    if (type === 'resume') {
      uploadedResume = file;
      fileName.textContent = file.name;
      fileSize.textContent = formatFileSize(file.size);
      uploadBox.style.display = 'none';
      uploadedFile.style.display = 'flex';
    } else if (type === 'cover') {
      uploadedCoverLetter = file;
      fileNameCover.textContent = file.name;
      fileSizeCover.textContent = formatFileSize(file.size);
      uploadBoxCover.style.display = 'none';
      uploadedFileCover.style.display = 'flex';
    }
  }
  
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  
  function validateStep(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const requiredInputs = currentStepElement.querySelectorAll('[required]');
    
    let isValid = true;
    let firstInvalidInput = null;
    
    requiredInputs.forEach(input => {
      // Skip disabled inputs (like end date when currently working)
      if (input.disabled) return;
      
      const value = input.value ? input.value.trim() : '';
      
      if (!value) {
        isValid = false;
        input.style.borderColor = '#ef4444';
        
        if (!firstInvalidInput) {
          firstInvalidInput = input;
        }
        
        input.addEventListener('input', () => {
          input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }, { once: true });
      }
    });
    
    // Additional validation for skills (Step 3)
    // if (step === 3 && skills.length === 0) {
    //   alert('Please add at least one skill');
    //   isValid = false;
    // }
    
    if (!isValid) {
      alert('Please fill in all required fields');
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
    }
    
    return isValid;
  }
  
  function saveFormData() {
    const formElements = form.elements;
    
    // Collect primary experience
    const primaryExperience = {
      jobTitle: formElements.jobTitle.value,
      companyName: formElements.companyName.value,
      startDate: formElements.startDate.value,
      endDate: formElements.endDate && !formElements.endDate.disabled ? formElements.endDate.value : '',
      currentlyWorking: formElements.currentlyWorking ? formElements.currentlyWorking.checked : false,
      summary: formElements.professionalSummary.value,
      isPrimary: true
    };
    
    // Collect additional experiences
    const additionalExperiences = [];
    for (let i = 1; i <= experienceCount; i++) {
      const expItem = document.querySelector(`[data-experience-id="${i}"]`);
      if (expItem) {
        additionalExperiences.push({
          jobTitle: formElements[`jobTitle_${i}`].value,
          companyName: formElements[`companyName_${i}`].value,
          startDate: formElements[`startDate_${i}`].value,
          endDate: formElements[`endDate_${i}`].value,
          summary: formElements[`experienceSummary_${i}`].value,
          isPrimary: false
        });
      }
    }
    
    // Combine all experiences
    const allExperiences = [primaryExperience, ...additionalExperiences];
    
    const formData = {
      // Personal Info
      firstName: formElements.firstName.value,
      middleName: formElements.middleName?.value || '',
      lastName: formElements.lastName.value,
      email: formElements.email.value,
      phone: formElements.phone.value,
      addressOne: formElements.addressOne.value,
      addressTwo: formElements.addressTwo?.value || '',
      city: formElements.city?.value || '',
      state: formElements.state?.value || '',
      country: formElements.country?.value || '',
      
      // Work Experiences (array)
      experiences: allExperiences,
      
      // Skills
      skills: skills,
      linkedin: formElements.linkedin?.value || '',
      github: formElements.github?.value || '',
      website: formElements.website?.value || '',
      
      // Job Preferences
      workType: formElements.workType?.value || '',
      expectedSalary: formElements.expectedSalary?.value || '',
      preferredLocations: formElements.preferredLocations?.value || '',

      // Work Authorization
      authorized: formElements.authorized?.value || '',
      sponsorship: formElements.sponsorship?.value || '',
      visaSponsorship: formElements.visaSponsorship?.value || '',
      
      // Resume & Cover Letter
      resumeUploaded: uploadedResume !== null,
      resumeName: uploadedResume ? uploadedResume.name : null,
      coverLetterUploaded: uploadedCoverLetter !== null,
      coverLetterName: uploadedCoverLetter ? uploadedCoverLetter.name : null,

      // Additional Info
      gender: formElements.gender.value,
      hispanicLatino: formElements.hispanicLatino?.value || '',
      race: formElements.race?.value || '',
      veteran: formElements.veteran?.value || '',
      disability: formElements.disability?.value || '',
      
      // Metadata
      createdAt: new Date().toISOString(),
      profileCompleted: true
    };
    
    console.log('Saving form data:', formData);
    
    chrome.storage.local.set({ userProfile: formData }, () => {
      console.log('Profile saved successfully!');
      
      chrome.storage.local.set({ profileCompleted: true }, () => {
        alert('Profile setup complete! You can now start auto-filling applications.');
        window.close();
      });
    });
  }

  function updateSidebar(step) {
    const stepItems = document.querySelectorAll('.step-item');
  
    stepItems.forEach((item, index) => {
      const stepNum = index + 1;
      const stepNumber = item.querySelector('.step-number');
      const numberSpan = item.querySelector('.number');
      const checkmark = item.querySelector('.checkmark');
      
      item.classList.remove('active', 'completed');
      
      if (stepNum < step) {
        item.classList.add('completed');
        numberSpan.style.display = 'none';
        checkmark.style.display = 'block';
      } else if (stepNum === step) {
        item.classList.add('active');
        numberSpan.style.display = 'block';
        checkmark.style.display = 'none';
      } else {
        numberSpan.style.display = 'block';
        checkmark.style.display = 'none';
      }
    });
  }

  function showStep(step) {
    console.log('=== showStep called:', step, '===');
  
    // Hide all form steps
    steps.forEach(s => {
      s.classList.remove('active');
    });
  
    // Show current form step
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    console.log('Found form step element:', currentStepElement);
    
    if (currentStepElement) {
      currentStepElement.classList.add('active');
      console.log('✅ Step', step, 'is now active');
    } else {
      console.error('❌ Could not find form step', step);
    }
  
    // Update sidebar
    updateSidebar(step);
    
    // Update buttons
    prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';
    nextBtn.style.display = step === totalSteps ? 'none' : 'inline-flex';
    submitBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Initialize
  console.log('Initializing form with', steps.length, 'steps');
  showStep(1);
});