document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentStep = 1;
  const totalSteps = 8;
  let skills = [];
  let experienceCount = 0;
  let educationCount = 0;
  
  // Backend API URL - Update this for production
  const API_URL = 'http://localhost:3000/api/profiles';
  
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
        endDateInput.required = false;
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
            <label for="endDate_${experienceCount}">Select End Date</label>
            <input type="date" id="endDate_${experienceCount}" name="endDate_${experienceCount}">
          </div>
        </div>
    
        <div class="form-group">
          <label for="experienceSummary_${experienceCount}">Job Description</label>
          <textarea id="experienceSummary_${experienceCount}" name="experienceSummary_${experienceCount}" rows="4" 
            placeholder="Describe your responsibilities and achievements..."></textarea>
        </div>
      </div>
    `;
    
    additionalExperiencesContainer.insertAdjacentHTML('beforeend', experienceHTML);
    
    const newExperience = additionalExperiencesContainer.lastElementChild;
    newExperience.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-experience-btn')) {
      const removeId = e.target.getAttribute('data-remove-id');
      const experienceItem = document.querySelector(`[data-experience-id="${removeId}"]`);
      
      if (experienceItem) {
        experienceItem.style.transition = 'all 0.3s ease';
        experienceItem.style.opacity = '0';
        experienceItem.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          experienceItem.remove();
        }, 300);
      }
    }
  });

  // Education Management
  const addEducationBtn = document.getElementById('addEducationBtn');
  const additionalEducationContainer = document.getElementById('additionalEducation');

  if (addEducationBtn) {
    addEducationBtn.addEventListener('click', () => {
      addEducationItem();
    });
  }

  function addEducationItem() {
    educationCount++;
    
    const educationHTML = `
      <div class="experience-item additional-experience" data-experience-id="${educationCount}">
        <div class="experience-header">
          <h3>Previous Education ${educationCount}</h3>
          <button type="button" class="remove-experience-btn" data-remove-id="${educationCount}">
            Remove
          </button>
        </div>

        <div class="form-group">
          <label for="universityName_${educationCount}">Enter University Name *</label>
          <input type="text" id="universityName_${educationCount}" name="universityName_${educationCount}" required placeholder="University Name">
        </div>
        
        <div class="form-group">
          <label for="fieldOfStudy_${educationCount}">Enter Field Of Study *</label>
          <input type="text" id="fieldOfStudy_${educationCount}" name="fieldOfStudy_${educationCount}" placeholder="Field of Study" required>
        </div>

        <div class="form-grid-three">
          <div class="form-group">
            <label for="educationStartDate_${educationCount}">Select Start Date *</label>
            <input type="date" id="educationStartDate_${educationCount}" name="educationStartDate_${educationCount}" required>
          </div>
          <div class="form-group">
            <label for="educationEndDate_${educationCount}">Select End Date</label>
            <input type="date" id="educationEndDate_${educationCount}" name="educationEndDate_${educationCount}">
          </div>
          <div class="form-group">
            <label for="degree_${educationCount}">Select Degree *</label>
            <select id="degree_${educationCount}" name="degree_${educationCount}" required>
              <option value="" disabled selected>Select your option</option>
              <option value="highSchool">High School</option>
              <option value="associateDegree">Associate's Degree</option>
              <option value="bachelorsDegree">Bachelor's Degree</option>
              <option value="mastersDegree">Master's Degree</option>
              <option value="mbaDegree">Master's Of Business Administration (MBA)</option>
              <option value="jurisDegree">Juris Degree (JD)</option>
              <option value="doctorOfMedicine">Doctor Of Medicine</option>
              <option value="doctorOfPhilosophy">Doctor Of Philosophy (PhD)</option>
              <option value="engineerDegree">Engineer Degree</option>
              <option value="otherDegree">Other</option>
            </select>
          </div>
        </div>
      </div>
    `;
    
    additionalEducationContainer.insertAdjacentHTML('beforeend', educationHTML);
    
    const newEducation = additionalEducationContainer.lastElementChild;
    newEducation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-education-btn')) {
      const removeId = e.target.getAttribute('data-remove-id');
      const educationItem = document.querySelector(`[data-education-id="${removeId}"]`);
      
      if (educationItem) {
        educationItem.style.transition = 'all 0.3s ease';
        educationItem.style.opacity = '0';
        educationItem.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          educationItem.remove();
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
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  });
  
  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      await saveFormData();
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
    
    if (!isValid) {
      alert('Please fill in all required fields');
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
    }
    
    return isValid;
  }

  async function saveFormData() {
  const formElements = form.elements;
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Saving...</span>';

  try {
    // Collect additional experiences
    const additionalExperiences = [];
    for (let i = 1; i <= experienceCount; i++) {
      const expItem = document.querySelector(`[data-experience-id="${i}"]`);
      if (expItem) {
        additionalExperiences.push({
          jobTitle: formElements[`jobTitle_${i}`]?.value || '',
          companyName: formElements[`companyName_${i}`]?.value || '',
          startDate: formElements[`startDate_${i}`]?.value || '',
          endDate: formElements[`endDate_${i}`]?.value || '',
          currentlyWorking: false,
          jobDescription: formElements[`experienceSummary_${i}`]?.value || ''
        });
      }
    }
    
    // Collect additional education
    const additionalEducation = [];
    for (let i = 1; i <= educationCount; i++) {
      const eduItem = document.querySelector(`[data-experience-id="${i}"]`);
      if (eduItem) {
        additionalEducation.push({
          universityName: formElements[`universityName_${i}`]?.value || '',
          fieldOfStudy: formElements[`fieldOfStudy_${i}`]?.value || '',
          educationStartDate: formElements[`educationStartDate_${i}`]?.value || '',
          educationEndDate: formElements[`educationEndDate_${i}`]?.value || '',
          degree: formElements[`degree_${i}`]?.value || ''
        });
      }
    }
    
    // Create FormData object for file uploads
    const formData = new FormData();
    
    // Add files if uploaded
    if (uploadedResume) {
      formData.append('resume', uploadedResume);
    }
    
    if (uploadedCoverLetter) {
      formData.append('coverLetter', uploadedCoverLetter);
    }
    
    // Prepare profile data matching backend expectations
    const profileData = {
      // Personal Information (Step 1)
      firstName: formElements.firstName.value,
      middleName: formElements.middleName?.value || '',
      lastName: formElements.lastName.value,
      email: formElements.email.value,
      phone: formElements.phone.value,
      addressOne: formElements.addressOne.value,
      addressTwo: formElements.addressTwo?.value || '',
      zipCode: formElements.zipCode.value,  // Fixed: lowercase 'zipcode' to match HTML name attribute
      city: formElements.city.value,
      state: formElements.state.value,
      country: formElements.country.value,

      // Education (Step 2) - Primary Education
      universityName: formElements.universityName.value,
      fieldOfStudy: formElements.fieldOfStudy.value,
      educationStartDate: formElements.educationStartDate.value,
      educationEndDate: formElements.educationEndDate && !formElements.educationEndDate.disabled ? formElements.educationEndDate.value : null,
      degree: formElements.degree.value, 
      
      // Additional education
      additionalEducation: additionalEducation,
      
      // Professional Experience (Step 3) - Primary Position
      jobTitle: formElements.jobTitle.value,
      companyName: formElements.companyName.value,
      startDate: formElements.startDate.value,
      endDate: formElements.endDate && !formElements.endDate.disabled ? formElements.endDate.value : null,
      currentlyWorking: formElements.currentlyWorking ? formElements.currentlyWorking.checked : false,
      professionalSummary: formElements.professionalSummary.value,
      
      // Additional experiences
      additionalExperiences: additionalExperiences,
      
      // Skills & Expertise (Step 4)
      skills: skills,
      linkedin: formElements.linkedin?.value || '',
      github: formElements.github?.value || '',
      website: formElements.website?.value || '',
      
      // Job Preferences (Step 5)
      workType: formElements.workType?.value || null,
      expectedSalary: formElements.expectedSalary?.value || '',
      preferredLocations: formElements.preferredLocations?.value || '',
      restrictiveBond: formElements.restrictiveBond?.value || '',
      
      // Work Authorization (Step 6)
      authorized: formElements.authorized?.value || null,
      sponsorship: formElements.sponsorship?.value || null,
      visaSponsorship: formElements.visaSponsorship?.value || '',
      relocate: formElements.relocate?.value || null,
      
      // Additional Questions (Step 8)
      gender: formElements.gender.value,
      hispanicLatino: formElements.hispanicLatino?.value || '',
      race: formElements.race?.value || '',
      veteran: formElements.veteran?.value || '',
      disability: formElements.disability?.value || ''
    };
    
    // Add all profile data as JSON string to FormData
    for (const [key, value] of Object.entries(profileData)) {
      if (key === 'additionalExperiences' || key === 'additionalEducation' || key === 'skills') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value === null ? '' : value);
      }
    }
    
    console.log('Sending data to backend...');
    console.log('Profile Data:', profileData);
    console.log('Additional Education:', additionalEducation);
    console.log('Additional Experiences:', additionalExperiences);
    console.log('Skills:', skills);
    console.log('Has Resume:', !!uploadedResume);
    console.log('Has Cover Letter:', !!uploadedCoverLetter);
    
    // Send to backend API
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('Profile saved successfully:', result);
      
      // Also save to Chrome storage for extension use
      chrome.storage.local.set({ 
        userProfile: profileData,
        profileCompleted: true,
        profileId: result.data.id
      }, () => {
        alert('✅ Profile setup complete! Your information has been saved.');
        
        // Close the tab or redirect
        setTimeout(() => {
          window.close();
        }, 1500);
      });
      
    } else {
      // Log detailed error information
      console.error('Backend validation error:', result);
      console.error('Error details:', result.details || result.message);
      
      const errorMessage = result.details 
        ? `Validation errors:\n${JSON.stringify(result.details, null, 2)}`
        : result.error || result.message || 'Failed to save profile';
      
      throw new Error(errorMessage);
    }
    
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('❌ Error saving profile: ' + error.message + '\n\nPlease check your connection and try again.');
    
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Complete Setup ✓';
  }
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
    steps.forEach(s => {
      s.classList.remove('active');
    });
  
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    
    if (currentStepElement) {
      currentStepElement.classList.add('active');
    }
  
    updateSidebar(step);
    
    prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';
    nextBtn.style.display = step === totalSteps ? 'none' : 'inline-flex';
    submitBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Initialize
  showStep(1);
});