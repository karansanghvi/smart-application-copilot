document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['userProfile', 'profileId'], (result) => {
        if (result.userProfile) {
            displayUserProfile(result.userProfile);
        } else {
            window.location.href = 'onboarding.html';
        }
    });

    document.getElementById('editProfileBtn')?.addEventListener('click', () => {
        window.location.href = 'onboarding.html';
    });

    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        alert('Settings coming soon!');
    });

    document.getElementById('resetProfileBtn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your profile? This action cannot be undone.')) {
            chrome.storage.local.clear(() => {
                alert('Profile reset successfully!');
                window.location.href = 'onboarding.html';
            });
        }
    });
});

let currentProfile = null;
let currentProfileId = null;
let editingExpIndex = null;
let editingEducationIndex = null;
let editingProjectIndex = null;
let editingSkills = [];

// Display User Profile Data
function displayUserProfile(profile) {
    // Store profile globally
    currentProfile = profile;
    
    // Get profile ID
    chrome.storage.local.get(['profileId'], (result) => {
        currentProfileId = result.profileId;
    });
    
    // Header
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = `${profile.firstName} ${profile.lastName}`;
    }
    
    const userFirstNameEl = document.getElementById('userFirstName');
    if (userFirstNameEl) {
        userFirstNameEl.textContent = profile.firstName;
    }

    // Stats
    const experienceCountEl = document.getElementById('experienceCount');
    if (experienceCountEl) {
        const experienceCount = (profile.additionalExperiences?.length || 0) + 1;
        experienceCountEl.textContent = experienceCount;
    }
    
    const skillCountEl = document.getElementById('skillCount');
    if (skillCountEl) {
        skillCountEl.textContent = profile.skills?.length || 0;
    }
    
    const documentCountEl = document.getElementById('documentCount');
    if (documentCountEl) {
        let documentCount = 0;
        if (profile.resumeUploaded) documentCount++;
        if (profile.coverLetterUploaded) documentCount++;
        documentCountEl.textContent = documentCount;
    }

    // Personal Information
    const firstNameEl = document.getElementById('firstName');
    if (firstNameEl) {
        firstNameEl.textContent = profile.firstName || '-';
    }
    
    const middleNameEl = document.getElementById('middleName');
    if (middleNameEl) {
        middleNameEl.textContent = profile.middleName || '';
    }
    
    const lastNameEl = document.getElementById('lastName');
    if (lastNameEl) {
        lastNameEl.textContent = profile.lastName || '-';
    }
    
    const emailEl = document.getElementById('email');
    if (emailEl) {
        emailEl.textContent = profile.email || '-';
    }
    
    const phoneEl = document.getElementById('phone');
    if (phoneEl) {
        phoneEl.textContent = profile.phone || '-';
    }
    
    // Address Lines
    const addressOneEl = document.getElementById('addressOne');
    if (addressOneEl) {
        addressOneEl.textContent = profile.addressOne || '-';
    }
    
    const addressTwoEl = document.getElementById('addressTwo');
    if (addressTwoEl) {
        addressTwoEl.textContent = profile.addressTwo || '-';
    }

    const zipCodeEl = document.getElementById('zipCode');
    if (zipCodeEl) {
        zipCodeEl.textContent = profile.zipCode || '-';
    }

    const cityEl = document.getElementById('city');
    if (cityEl) {
        cityEl.textContent = profile.city || '-';
    }

    const stateEl = document.getElementById('state');
    if (stateEl) {
        stateEl.textContent = profile.state || '-';
    }

    const countryEl = document.getElementById('country');
    if (countryEl) {
        countryEl.textContent = profile.country || '-';
    }

    // Skills
    const skillsDisplay = document.getElementById('skillsDisplay');
    if (skillsDisplay) {
        if (profile.skills && profile.skills.length > 0) {
            skillsDisplay.innerHTML = profile.skills.map(skill => 
                `<span class="skill-tag">${skill}</span>`
            ).join('');
        } else {
            skillsDisplay.innerHTML = '<p style="color: #999;">No skills added</p>';
        }
    }

    // Professional Links
    const linkedinEl = document.getElementById('linkedin');
    if (linkedinEl) {
        if (profile.linkedin && profile.linkedin.trim()) {
            linkedinEl.innerHTML = `<a href="${profile.linkedin}" target="_blank" style="color: #0077b5; text-decoration: none;">${profile.linkedin}</a>`;
        } else {
            linkedinEl.textContent = 'Not provided';
            linkedinEl.style.color = 'rgba(255, 255, 255, 0.5)';
        }
    }

    const githubEl = document.getElementById('github');
    if (githubEl) {
        if (profile.github && profile.github.trim()) {
            githubEl.innerHTML = `<a href="${profile.github}" target="_blank" style="color: #0077b5; text-decoration: none;">${profile.github}</a>`;
        } else {
            githubEl.textContent = 'Not provided';
            githubEl.style.color = 'rgba(255, 255, 255, 0.5)';
        }
    }

    const websiteEl = document.getElementById('website');
    if (websiteEl) {
        if (profile.website && profile.website.trim()) {
            websiteEl.innerHTML = `<a href="${profile.website}" target="_blank" style="color: #0077b5; text-decoration: none;">${profile.website}</a>`;
        } else {
            websiteEl.textContent = 'Not provided';
            websiteEl.style.color = 'rgba(255, 255, 255, 0.5)';
        }
    }

    // Job Preferences - Work Type Display (for view mode)
    const workTypeDisplay = document.getElementById('workTypeDisplay');
    if (workTypeDisplay) {
        const workTypeMap = {
            'remote': 'Remote Only',
            'hybrid': 'Hybrid',
            'onsite': 'On-site',
            'flexible': 'Flexible'
        };
        workTypeDisplay.textContent = workTypeMap[profile.workType] || 'Not specified';
    }
    
    // Job Preferences - Work Type Radio Button (for old view mode with radio buttons)
    const workTypeValue = profile.workType;
    if (workTypeValue) {
        const workTypeRadio = document.querySelector(`input[name="workType"][value="${workTypeValue}"]`);
        if (workTypeRadio) {
            workTypeRadio.checked = true;
        }
    }

    // Job Preferences - Relocate Display
    const relocateEl = document.getElementById('relocate');
    if (relocateEl) {
        relocateEl.textContent = profile.relocate === 'yes' ? 'Yes' : (profile.relocate === 'no' ? 'No' : 'Not specified');
    }

    // Job Preferences - Restrictive Bond Display
    const restrictiveBondEl = document.getElementById('restrictiveBond');
    if (restrictiveBondEl) {
        restrictiveBondEl.textContent = profile.restrictiveBond === 'yes' ? 'Yes' : (profile.restrictiveBond === 'no' ? 'No' : 'Not specified');
    }

    // Abroad Authorization Display
    const authorizedDisplay = document.getElementById('authorizedDisplay');
    if (authorizedDisplay) {
        authorizedDisplay.textContent = profile.authorized === 'yes' ? 'Yes' : (profile.authorized === 'no' ? 'No' : 'Not specified');
    }

    const sponsorshipDisplay = document.getElementById('sponsorshipDisplay');
    if (sponsorshipDisplay) {
        sponsorshipDisplay.textContent = profile.sponsorship === 'yes' ? 'Yes' : (profile.sponsorship === 'no' ? 'No' : 'Not specified');
    }

    const visaTypeEl = document.getElementById('visaType');
    if (visaTypeEl) {
        if (profile.visaSponsorship && profile.visaSponsorship.trim()) {
            visaTypeEl.textContent = profile.visaSponsorship;
            visaTypeEl.style.color = 'white';
        } else {
            visaTypeEl.textContent = 'Not applicable';
            visaTypeEl.style.color = '#999';
        }
    }

    const salaryEl = document.getElementById('salary');
    if (salaryEl) {
        salaryEl.textContent = profile.expectedSalary || '-';
    }

    const preferredLocationsEl = document.getElementById('preferredLocations');
    if (preferredLocationsEl) {
        preferredLocationsEl.textContent = profile.preferredLocations || '-';
    }

    displayWorkExperiences(profile);
    displayEducation(profile);
    displayProjects(profile);
    displayAuthorizationInfo(profile);
    displayAdditionalInfo(profile);
    displayUploadedDocuments(profile);
}

// !!=======================================================================================================================
//  !!EVENT LISTENERS
// !!=======================================================================================================================

// Edit Personal Info
document.getElementById('editPersonalInfoBtn')?.addEventListener('click', () => {
    enterEditMode('personalInfo');
});

document.getElementById('savePersonalInfoBtn')?.addEventListener('click', () => {
    savePersonalInfo();
});

document.getElementById('cancelPersonalInfoBtn')?.addEventListener('click', () => {
    exitEditMode('personalInfo');
});

// Edit Primary and Additional Work Experience
document.getElementById('editWorkExpBtn')?.addEventListener('click', () => {
    enterEditMode('workExp');
});

document.getElementById('saveWorkExpBtn')?.addEventListener('click', () => {
    saveWorkExp();
});

document.getElementById('cancelWorkExpBtn')?.addEventListener('click', () => {
    exitEditMode('workExp');
});

document.getElementById('editCurrentlyWorking')?.addEventListener('change', (e) => {
    const endDateInput = document.getElementById('editEndDate');
    if (e.target.checked) {
        endDateInput.value = '';
        endDateInput.disabled = true;
        endDateInput.style.opacity = '0.5';
    } else {
        endDateInput.disabled = false;
        endDateInput.style.opacity = '1';
    }
});

document.getElementById('addNewExpBtn')?.addEventListener('click', () => {
    document.getElementById('addExpModal').style.display = 'block';

    document.getElementById('newExpJobTitle').value = '';
    document.getElementById('newExpCompany').value = '';
    document.getElementById('newExpStartDate').value = '';
    document.getElementById('newExpEndDate').value = '';
    document.getElementById('newExpCurrentlyWorking').checked = false;
    document.getElementById('newExpDescription').value = '';
});

document.getElementById('cancelNewExpBtn')?.addEventListener('click', () => {
    document.getElementById('addExpModal').style.display = 'none';
});

document.getElementById('saveNewExpBtn')?.addEventListener('click', () => {
    addNewExperience();
});

document.getElementById('newExpCurrentlyWorking')?.addEventListener('change', (e) => {
    const endDateInput = document.getElementById('newExpEndDate');
    if (e.target.checked) {
        endDateInput.value = '';
        endDateInput.disabled = true;
        endDateInput.style.opacity = '0.5';
    } else {
        endDateInput.disabled = false;
        endDateInput.style.opacity = '1';
    }
});

document.getElementById('editExpCurrentlyWorking')?.addEventListener('change', (e) => {
    const endDateInput = document.getElementById('editExpEndDate');
    if (e.target.checked) {
        endDateInput.value = '';
        endDateInput.disabled = true;
        endDateInput.style.opacity = '0.5';
    } else {
        endDateInput.disabled = false;
        endDateInput.style.opacity = '1';
    }
});

document.getElementById('cancelEditExpBtn')?.addEventListener('click', () => {
    document.getElementById('editExpModal').style.display = 'none';
    editingExpIndex = null;
});

document.getElementById('saveEditExpBtn')?.addEventListener('click', () => {
    saveEditedExperience();
});

// Primary Education Edit 
document.getElementById('editPrimaryEducationBtn')?.addEventListener('click', () => {
    enterEditMode('primaryEducation');
});

document.getElementById('savePrimaryEducationBtn')?.addEventListener('click', () => {
    savePrimaryEducation();
});

document.getElementById('cancelPrimaryEducationBtn')?.addEventListener('click', () => {
    exitEditMode('primaryEducation');
});

// Add New Education 
document.getElementById('addNewEducationBtn')?.addEventListener('click', () => {
    openAddEducationModal();
});

document.getElementById('cancelNewEducationBtn')?.addEventListener('click', () => {
    closeAddEducationModal();
});

document.getElementById('saveNewEducationBtn')?.addEventListener('click', () => {
    addNewEducation();
});

// Edit Additional Education Modal
document.getElementById('cancelEditEducationModal')?.addEventListener('click', () => {
    closeEditEducationModal();
});

document.getElementById('saveEditEducationModal')?.addEventListener('click', () => {
    saveEditedEducation();
});

// Edit Primary Project 
document.getElementById('editProjectBtn')?.addEventListener('click', () => {
    enterEditMode('project');
});

document.getElementById('saveProjectBtn')?.addEventListener('click', () => {
    savePrimaryProject();
});

document.getElementById('cancelProjectBtn')?.addEventListener('click', () => {
    exitEditMode('project');
});

// Add New Project
document.getElementById('addNewProjectBtn')?.addEventListener('click', () => {
    openAddProjectModal();
});

document.getElementById('cancelNewProjectBtn')?.addEventListener('click', () => {
    closeAddProjectModal();
});

document.getElementById('saveNewProjectBtn')?.addEventListener('click', () => {
    addNewProject();
});

// Edit Project Modal
document.getElementById('cancelEditProjectBtn')?.addEventListener('click', () => {
    closeEditProjectModal();
});

document.getElementById('saveEditProjectBtn')?.addEventListener('click', () => {
    saveEditedProject();
});

// Edit Skills & Expertise
document.getElementById('editSkillsBtn')?.addEventListener('click', () => {
    enterEditMode('skills');
});

document.getElementById('saveSkillsBtn')?.addEventListener('click', () => {
    saveSkills();
});

document.getElementById('cancelSkillsBtn')?.addEventListener('click', () => {
    exitEditMode('skills');
});

document.getElementById('addSkillBtn')?.addEventListener('click', () => {
    addSkillToEdit();
});

document.getElementById('editSkillInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addSkillToEdit();
    }
});

// Edit Job Preferences
document.getElementById('editJobPrefBtn')?.addEventListener('click', () => {
    enterEditMode('jobPref');
});

document.getElementById('saveJobPrefBtn')?.addEventListener('click', () => {
    saveJobPref();
});

document.getElementById('cancelJobPrefBtn')?.addEventListener('click', () => {
    exitEditMode('jobPref');
});

// Edit Abroad Authorization
document.getElementById('editAuthBtn')?.addEventListener('click', () => {
    enterEditMode('auth');
});

document.getElementById('saveAuthBtn')?.addEventListener('click', () => {
    saveAuth();
});

document.getElementById('cancelAuthBtn')?.addEventListener('click', () => {
    exitEditMode('auth');
});

// File upload handlers
document.getElementById('uploadResumeBtn')?.addEventListener('click', () => {
    document.getElementById('resumeFileInput').click();
});

document.getElementById('replaceResumeBtn')?.addEventListener('click', () => {
    document.getElementById('resumeFileInput').click();
});

document.getElementById('uploadCoverLetterBtn')?.addEventListener('click', () => {
    document.getElementById('coverLetterFileInput').click();
});

document.getElementById('replaceCoverLetterBtn')?.addEventListener('click', () => {
    document.getElementById('coverLetterFileInput').click();
});

document.getElementById('resumeFileInput')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        await uploadDocument(file, 'resume');
    }
    e.target.value = '';
});

document.getElementById('coverLetterFileInput')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        await uploadDocument(file, 'coverLetter');
    }
    e.target.value = '';
});

// Edit Additional Questions
document.getElementById('editAdditionalBtn')?.addEventListener('click', () => {
    enterEditMode('additional');
});

document.getElementById('saveAdditionalBtn')?.addEventListener('click', () => {
    saveAdditional();
});

document.getElementById('cancelAdditionalBtn')?.addEventListener('click', () => {
    exitEditMode('additional');
});

// !!=======================================================================================================================
//  !!EDIT MODE
// !!=======================================================================================================================

// Enter Edit Mode
function enterEditMode(section) {
    if (section === 'personalInfo') {
        document.getElementById('personalInfoView').style.display = 'none';
        document.getElementById('personalInfoEdit').style.display = 'block';
        
        document.getElementById('editFirstName').value = currentProfile.firstName || '';
        document.getElementById('editMiddleName').value = currentProfile.middleName || '';
        document.getElementById('editLastName').value = currentProfile.lastName || '';
        document.getElementById('editEmail').value = currentProfile.email || '';
        document.getElementById('editPhone').value = currentProfile.phone || '';
        document.getElementById('editAddressOne').value = currentProfile.addressOne || '';
        document.getElementById('editAddressTwo').value = currentProfile.addressTwo || '';
        document.getElementById('editZipCode').value = currentProfile.zipCode || '';
        document.getElementById('editCity').value = currentProfile.city || '';
        document.getElementById('editState').value = currentProfile.state || '';
        document.getElementById('editCountry').value = currentProfile.country || '';
    }
    else if (section === 'workExp') {
        document.getElementById('workExpView').style.display = 'none';

        document.getElementById('workExpEdit').style.display = 'block';
        
        document.getElementById('editJobTitle').value = currentProfile.jobTitle || '';
        document.getElementById('editCompanyName').value = currentProfile.companyName || '';
        document.getElementById('editStartDate').value = currentProfile.startDate || '';
        document.getElementById('editEndDate').value = currentProfile.endDate || '';
        document.getElementById('editCurrentlyWorking').checked = currentProfile.currentlyWorking || false;
        document.getElementById('editProfessionalSummary').value = currentProfile.professionalSummary || '';
        
        const endDateInput = document.getElementById('editEndDate');
        if (currentProfile.currentlyWorking) {
            endDateInput.disabled = true;
            endDateInput.style.opacity = '0.5';
        }
    } else if (section === 'skills') {
        document.getElementById('skillsView').style.display = 'none';
        
        document.getElementById('skillsEdit').style.display = 'block';
        
        document.getElementById('editLinkedin').value = currentProfile.linkedin || '';
        document.getElementById('editGithub').value = currentProfile.github || '';
        document.getElementById('editWebsite').value = currentProfile.website || '';

        editingSkills = currentProfile.skills ? [...currentProfile.skills] : [];
        renderEditSkills();
    } else if (section === 'jobPref') {
        document.getElementById('jobPrefView').style.display = 'none';
        
        document.getElementById('jobPrefEdit').style.display = 'block';
        
        if (currentProfile.workType) {
            const radioBtn = document.getElementById(`editWorkType-${currentProfile.workType}`);
            if (radioBtn) {
                radioBtn.checked = true;
            }
        }
        
        if (currentProfile.relocate) {
            const radioBtn = document.getElementById(`editRelocate-${currentProfile.relocate}`);
            if (radioBtn) {
                radioBtn.checked = true;
            }
        }

         if (currentProfile.restrictiveBond) {
            const radioBtn = document.getElementById(`editRestrictiveBond-${currentProfile.restrictiveBond}`);
            if (radioBtn) {
                radioBtn.checked = true;
            }
        }
        
        document.getElementById('editSalary').value = currentProfile.expectedSalary || '';
        document.getElementById('editPreferredLocations').value = currentProfile.preferredLocations || '';
    } else if (section === 'auth') {
        document.getElementById('authView').style.display = 'none';
 
        document.getElementById('authEdit').style.display = 'block';
        
        if (currentProfile.authorized) {
            const authorizedRadio = document.querySelector(`input[name="editAuthorized"][value="${currentProfile.authorized}"]`);
            if (authorizedRadio) {
                authorizedRadio.checked = true;
            }
        }

        if (currentProfile.sponsorship) {
            const sponsorshipRadio = document.querySelector(`input[name="editSponsorship"][value="${currentProfile.sponsorship}"]`);
            if (sponsorshipRadio) {
                sponsorshipRadio.checked = true;
            }
        }
        
        document.getElementById('editVisaType').value = currentProfile.visaSponsorship || '';
    } else if (section === 'additional') {
        document.getElementById('additionalView').style.display = 'none';
        
        document.getElementById('additionalEdit').style.display = 'block';

        document.getElementById('editGender').value = currentProfile.gender || '';
        document.getElementById('editHispanicLatino').value = currentProfile.hispanicLatino || '';
        document.getElementById('editRace').value = currentProfile.race || '';
        document.getElementById('editVeteran').value = currentProfile.veteran || '';
        document.getElementById('editDisability').value = currentProfile.disability || '';
    } else if (section === 'primaryEducation') {
        document.getElementById('primaryEducationView').style.display = 'none';
        document.getElementById('primaryEducationEdit').style.display = 'block';
        
        document.getElementById('editPrimaryUniversityName').value = currentProfile.universityName || '';
        document.getElementById('editPrimaryFieldOfStudy').value = currentProfile.fieldOfStudy || '';
        document.getElementById('editPrimaryEducationStartDate').value = currentProfile.educationStartDate || '';
        document.getElementById('editPrimaryEducationEndDate').value = currentProfile.educationEndDate || '';
        document.getElementById('editPrimaryDegree').value = currentProfile.degree || '';
    } else if (section === 'project') {
        document.getElementById('projectView').style.display = 'none';  
        document.getElementById('projectEdit').style.display = 'block';
        
        document.getElementById('editProjectTitle').value = currentProfile.projectTitle || currentProfile.project_title || '';
        document.getElementById('editProjectSummary').value = currentProfile.projectSummary || currentProfile.project_summary || '';
    }
}

// Exit Edit Mode
function exitEditMode(section) {
    if (section === 'personalInfo') {
        document.getElementById('personalInfoView').style.display = 'block';
        document.getElementById('personalInfoEdit').style.display = 'none';
    }
    else if (section === 'workExp') {
        document.getElementById('workExpView').style.display = 'block';
        document.getElementById('workExpEdit').style.display = 'none';
    } else if (section === 'skills') {
        document.getElementById('skillsView').style.display = 'block';
        document.getElementById('skillsEdit').style.display = 'none';
        editingSkills = [];
    } else if (section === 'jobPref') {
        document.getElementById('jobPrefView').style.display = 'block';
        document.getElementById('jobPrefEdit').style.display = 'none';
         if (currentProfile.workType) {
            const radioBtn = document.getElementById(`editWorkType-${currentProfile.workType}`);
            if (radioBtn) {
                radioBtn.checked = true;
            }
        }
    
        if (currentProfile.relocate) {
            const radioBtn = document.getElementById(`editRelocate-${currentProfile.relocate}`);
            if (radioBtn) {
                radioBtn.checked = true;
            }
        }

        if (currentProfile.restrictiveBond) {
            const radioBtn = document.getElementById(`editRestrictiveBond-${currentProfile.restrictiveBond}`);
            if (radioBtn) {
                radioBtn.checked = true;
            }
        }
    
        document.getElementById('editSalary').value = currentProfile.expectedSalary || '';
        document.getElementById('editPreferredLocations').value = currentProfile.preferredLocations || '';

    } else if (section === 'auth') {
        document.getElementById('authView').style.display = 'block';
        document.getElementById('authEdit').style.display = 'none';
    } else if (section === 'additional') {
        document.getElementById('additionalView').style.display = 'block';
        document.getElementById('additionalEdit').style.display = 'none';
    } else if (section === 'primaryEducation') {
        document.getElementById('primaryEducationView').style.display = 'block';
        document.getElementById('primaryEducationEdit').style.display = 'none';
    } else if (section === 'project') {
        document.getElementById('projectView').style.display = 'block';
        document.getElementById('projectEdit').style.display = 'none';
    }
}

// !!=======================================================================================================================
//  !!PERSONAL INFORMATION
// !!=======================================================================================================================

// Edit and Update For Personal Information
async function savePersonalInfo() {
    console.log('💾 Saving personal info...');
    
    if (!currentProfileId) {
        alert('Error: Profile ID not found');
        return;
    }
    
    const updatedData = {
        ...currentProfile, 
        firstName: document.getElementById('editFirstName').value.trim(),
        middleName: document.getElementById('editMiddleName').value.trim(),
        lastName: document.getElementById('editLastName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        addressOne: document.getElementById('editAddressOne').value.trim(),
        addressTwo: document.getElementById('editAddressTwo').value.trim(),
        zipCode: document.getElementById('editZipCode').value.trim(),
        city: document.getElementById('editCity').value.trim(),
        state: document.getElementById('editState').value.trim(),
        country: document.getElementById('editCountry').value.trim()
    };
    
    console.log('📤 Sending data:', updatedData);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error response:', errorData);
            throw new Error(errorData.error || 'Failed to update profile');
        }
        
        const result = await response.json();
        console.log('✅ Update successful:', result);
        
        // Update local storage
        chrome.storage.local.set({ userProfile: updatedData }, () => {
            console.log('💾 Updated local storage');
            
            // Update display
            currentProfile = updatedData;
            displayUserProfile(updatedData);
            exitEditMode('personalInfo');
            alert('✅ Profile updated successfully!');
        });
        
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        alert(`❌ Failed to update profile: ${error.message}`);
    }
}

// Display Add Education Data 
function displayEducation(profile) {
    displayPrimaryEducation(profile);
    displayAdditionalEducation(profile);
}

// !!=======================================================================================================================
//  !!EDUCATION
// !!=======================================================================================================================

// Display Primary Education
function displayPrimaryEducation(profile) {
    const universityName = profile.universityName || profile.university_name;
    const fieldOfStudy = profile.fieldOfStudy || profile.field_of_study;
    const educationStartDate = profile.educationStartDate || profile.education_start_date;
    const educationEndDate = profile.educationEndDate || profile.education_end_date;
    const degree = profile.degree;
    
    const universityNameEl = document.getElementById('viewUniversityName');
    if (universityNameEl) {
        universityNameEl.textContent = universityName || 'Not specified';
    }

    const fieldOfStudyEl = document.getElementById('viewFieldOfStudy');
    if (fieldOfStudyEl) {
        fieldOfStudyEl.textContent = fieldOfStudy || 'Not specified';
    }

    const startDateEl = document.getElementById('viewEducationStartDate');
    if (startDateEl) {
        if (educationStartDate) {
            const date = new Date(educationStartDate);
            startDateEl.textContent = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
            startDateEl.textContent = 'Not specified';
        }
    }

    const endDateEl = document.getElementById('viewEducationEndDate');
    if (endDateEl) {
        if (educationEndDate) {
            const date = new Date(educationEndDate);
            endDateEl.textContent = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
            endDateEl.textContent = 'Present';
        }
    }

    const degreeEl = document.getElementById('viewDegree');
    if (degreeEl) {
        degreeEl.textContent = formatDegree(degree) || 'Not specified';
    }
}

// Display Additional Education
function displayAdditionalEducation(profile) {
    const containerEl = document.getElementById('additionalEducationContainer');
    
    if (!containerEl) return;

    const educationArray = profile.education || profile.additionalEducation || [];
    
    if (educationArray.length === 0) {
        containerEl.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem;">No additional education added yet</p>';
        return;
    }
    
    containerEl.innerHTML = '';
    
    educationArray.forEach((edu, index) => {
        const universityName = edu.universityName || edu.university_name || 'Not specified';
        const fieldOfStudy = edu.fieldOfStudy || edu.field_of_study || 'Not specified';
        const startDate = edu.startDate || edu.education_start_date;
        const endDate = edu.endDate || edu.education_end_date;
        const degree = edu.degree;
        
        const startDateFormatted = startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Not specified';
        const endDateFormatted = endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
        
        const educationHTML = `
            <div class="education-item" data-index="${index}" style="position: relative; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div class="education-badge" style="display: inline-block; background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        Education ${index + 1}
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button type="button" class="edit-edu-btn" data-index="${index}" title="Edit" style="background: rgba(102, 126, 234, 0.2); color: #667eea; border: 1px solid rgba(102, 126, 234, 0.3); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
                            Edit
                        </button>
                        <button type="button" class="delete-edu-btn" data-index="${index}" title="Delete" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
                            Delete
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label style="color: white;">University Name</label>
                    <div class="data-box">
                        <span class="dataText" style="color: white;">${universityName}</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label style="color: white;">Field of Study</label>
                    <div class="data-box">
                        <span class="dataText" style="color: white;">${fieldOfStudy}</span>
                    </div>
                </div>

                <div class="form-grid-two">
                    <div class="form-group">
                        <label style="color: white;">Degree</label>
                        <div class="data-box">
                            <span class="dataText" style="color: white;">${formatDegree(degree)}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="color: white;">Date Range</label>
                        <div class="data-box">
                            <span class="dataText" style="color: white;">${startDateFormatted} - ${endDateFormatted}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        containerEl.innerHTML += educationHTML;
    });
    
    document.querySelectorAll('.edit-edu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            editAdditionalEducation(index);
        });
    });
    
    document.querySelectorAll('.delete-edu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            deleteAdditionalEducation(index);
        });
    });
}

// Save Primary Education
async function savePrimaryEducation() {
    console.log('Saving primary education...');
    
    if (!currentProfileId) {
        alert('Error: Profile ID not found');
        return;
    }
    
    const updatedData = {
        universityName: document.getElementById('editPrimaryUniversityName').value.trim(),
        fieldOfStudy: document.getElementById('editPrimaryFieldOfStudy').value.trim(),
        startDate: document.getElementById('editPrimaryEducationStartDate').value.trim(),
        endDate: document.getElementById('editPrimaryEducationEndDate').value.trim(),
        degree: document.getElementById('editPrimaryDegree').value
    };
    
    // Validation
    if (!updatedData.universityName || !updatedData.fieldOfStudy || !updatedData.startDate || !updatedData.degree) {
        alert('⚠️ Please fill in all required fields');
        return;
    }
    
    console.log('Sending data:', updatedData);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}/education/primary`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.error || 'Failed to update education');
        }
        
        const result = await response.json();
        console.log('Update successful:', result);
        
        // Update local profile
        currentProfile = {
            ...currentProfile,
            universityName: updatedData.universityName,
            fieldOfStudy: updatedData.fieldOfStudy,
            educationStartDate: updatedData.startDate,
            educationEndDate: updatedData.endDate,
            degree: updatedData.degree
        };
        
        // Update storage
        chrome.storage.local.set({ userProfile: currentProfile }, () => {
            console.log('Updated local storage');
            displayEducation(currentProfile);
            exitEditMode('primaryEducation');
            alert('Primary education updated successfully!');
        });
        
    } catch (error) {
        console.error('Error updating primary education:', error);
        alert(`Failed to update primary education: ${error.message}`);
    }
}

// Add New Education
async function addNewEducation() {
    const universityName = document.getElementById('newUniversityName').value.trim();
    const fieldOfStudy = document.getElementById('newFieldOfStudy').value.trim();
    const startDate = document.getElementById('newEducationStartDate').value.trim();
    const endDate = document.getElementById('newEducationEndDate').value.trim();
    const degree = document.getElementById('newDegree').value;

    if (!universityName || !fieldOfStudy || !startDate || !degree) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newEducation = {
        universityName,
        fieldOfStudy,
        startDate,
        endDate: endDate || null,
        degree
    };
    
    console.log('Adding new education:', newEducation);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}/education/additional`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEducation)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add education');
        }
        
        const result = await response.json();
        console.log('Education added successfully:', result);
        
        // Update local profile - note the response structure
        if (!currentProfile.education) {
            currentProfile.education = [];
        }
        currentProfile.education = result.data;
        
        // Update storage
        chrome.storage.local.set({ userProfile: currentProfile }, () => {
            displayEducation(currentProfile);
            closeAddEducationModal();
            alert('Education added successfully!');
        });
        
    } catch (error) {
        console.error('Error adding education:', error);
        alert(`Failed to add education: ${error.message}`);
    }
}

// Edit Additional Education
function editAdditionalEducation(index) {
    editingEducationIndex = index;
    const edu = currentProfile.education[index];
    
    // Handle both formats
    const universityName = edu.universityName || edu.university_name || '';
    const fieldOfStudy = edu.fieldOfStudy || edu.field_of_study || '';
    const startDate = edu.startDate || edu.education_start_date || '';
    const endDate = edu.endDate || edu.education_end_date || '';
    const degree = edu.degree || '';
    
    // Populate edit modal
    document.getElementById('editModalUniversityName').value = universityName;
    document.getElementById('editModalFieldOfStudy').value = fieldOfStudy;
    document.getElementById('editModalEducationStartDate').value = startDate;
    document.getElementById('editModalEducationEndDate').value = endDate;
    document.getElementById('editModalDegree').value = degree;
    
    // Show modal
    document.getElementById('editEducationModal').style.display = 'block';
}

// Save Edited Education
async function saveEditedEducation() {
    if (editingEducationIndex === null) return;
    
    const universityName = document.getElementById('editModalUniversityName').value.trim();
    const fieldOfStudy = document.getElementById('editModalFieldOfStudy').value.trim();
    const startDate = document.getElementById('editModalEducationStartDate').value.trim();
    const endDate = document.getElementById('editModalEducationEndDate').value.trim();
    const degree = document.getElementById('editModalDegree').value;
    
    // Validation
    if (!universityName || !fieldOfStudy || !startDate || !degree) {
        alert('Please fill in all required fields');
        return;
    }
    
    const updatedEducation = {
        universityName,
        fieldOfStudy,
        startDate,
        endDate: endDate || null,
        degree
    };
    
    console.log('Updating education:', updatedEducation);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}/education/additional/${editingEducationIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedEducation)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update education');
        }
        
        const result = await response.json();
        console.log('Education updated successfully:', result);
        
        // Update local profile
        currentProfile.education = result.data;
        
        // Update storage
        chrome.storage.local.set({ userProfile: currentProfile }, () => {
            displayEducation(currentProfile);
            closeEditEducationModal();
            editingEducationIndex = null;
            alert('Education updated successfully!');
        });
        
    } catch (error) {
        console.error('Error updating education:', error);
        alert(`Failed to update education: ${error.message}`);
    }
}

// Delete Additional Education
async function deleteAdditionalEducation(index) {
    if (!confirm('Are you sure you want to delete this education entry?')) {
        return;
    }
    
    console.log('Deleting education at index:', index);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}/education/additional/${index}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete education');
        }
        
        const result = await response.json();
        console.log('Education deleted successfully:', result);
        
        // Update local profile
        currentProfile.education = result.data;
        
        // Update storage
        chrome.storage.local.set({ userProfile: currentProfile }, () => {
            displayEducation(currentProfile);
            alert('Education deleted successfully!');
        });
        
    } catch (error) {
        console.error('Error deleting education:', error);
        alert(`Failed to delete education: ${error.message}`);
    }
}

// Add Education Modal
function openAddEducationModal() {
    document.getElementById('newUniversityName').value = '';
    document.getElementById('newFieldOfStudy').value = '';
    document.getElementById('newEducationStartDate').value = '';
    document.getElementById('newEducationEndDate').value = '';
    document.getElementById('newDegree').value = '';
    document.getElementById('addEducationModal').style.display = 'block';
}

// Close Add Education Modal
function closeAddEducationModal() {
    document.getElementById('addEducationModal').style.display = 'none';
}

// Close Edit Education Modal
function closeEditEducationModal() {
    document.getElementById('editEducationModal').style.display = 'none';
    editingEducationIndex = null;
}

// Format Degree
function formatDegree(value) {
    if (!value) return 'Not specified';
    
    const degreeMap = {
        'highSchool': 'High School',
        'associateDegree': "Associate's Degree",
        'bachelorsDegree': "Bachelor's Degree",
        'mastersDegree': "Master's Degree",
        'mbaDegree': 'Master of Business Administration (MBA)',
        'jurisDegree': 'Juris Degree (JD)',
        'doctorOfMedicine': 'Doctor of Medicine',
        'doctorOfPhilosophy': 'Doctor of Philosophy (PhD)',
        'engineerDegree': 'Engineer Degree',
        'otherDegree': 'Other'
    };
    
    return degreeMap[value] || value;
}

// !!=======================================================================================================================
//  !!WORK EXPERIENCE
// !!=======================================================================================================================

// Edit and Update For Work & Additional Experience
async function saveWorkExp() {
    console.log('💾 Saving work experience...');
    
    if (!currentProfileId) {
        alert('Error: Profile ID not found');
        return;
    }
    
    // Get updated values
    const currentlyWorking = document.getElementById('editCurrentlyWorking').checked;
    const endDate = currentlyWorking ? null : document.getElementById('editEndDate').value.trim();
    
    const updatedData = {
        ...currentProfile,
        jobTitle: document.getElementById('editJobTitle').value.trim(),
        companyName: document.getElementById('editCompanyName').value.trim(),
        startDate: document.getElementById('editStartDate').value.trim(),
        endDate: endDate,
        currentlyWorking: currentlyWorking,
        professionalSummary: document.getElementById('editProfessionalSummary').value.trim()
    };
    
    // Validation
    if (!updatedData.jobTitle || !updatedData.companyName || !updatedData.startDate || !updatedData.professionalSummary) {
        alert('⚠️ Please fill in all required fields');
        return;
    }
    
    console.log('📤 Sending data:', updatedData);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error response:', errorData);
            throw new Error(errorData.error || 'Failed to update profile');
        }
        
        const result = await response.json();
        console.log('✅ Update successful:', result);
        
        // Update local storage
        chrome.storage.local.set({ userProfile: updatedData }, () => {
            console.log('💾 Updated local storage');
            
            // Update display
            currentProfile = updatedData;
            displayUserProfile(updatedData);
            exitEditMode('workExp');
            alert('✅ Work experience updated successfully!');
        });
        
    } catch (error) {
        console.error('❌ Error updating work experience:', error);
        alert(`❌ Failed to update work experience: ${error.message}`);
    }
}

// Add New Additional Experience
async function addNewExperience() {
    const jobTitle = document.getElementById('newExpJobTitle').value.trim();
    const companyName = document.getElementById('newExpCompany').value.trim();
    const startDate = document.getElementById('newExpStartDate').value.trim();
    const endDate = document.getElementById('newExpEndDate').value.trim();
    const currentlyWorking = document.getElementById('newExpCurrentlyWorking').checked;
    const jobDescription = document.getElementById('newExpDescription').value.trim();

    if (!jobTitle || !companyName || !startDate) {
        alert('⚠️ Please fill in all required fields (Job Title, Company, Start Date)');
        return;
    }
    
    const newExp = {
        jobTitle,
        companyName,
        startDate,
        endDate: currentlyWorking ? null : endDate,
        currentlyWorking,
        jobDescription
    };
    
    const additionalExperiences = currentProfile.additionalExperiences || [];
    additionalExperiences.push(newExp);
    
    await updateAdditionalExperiences(additionalExperiences);
    
    document.getElementById('addExpModal').style.display = 'none';
}

// Edit Additional Experience
function editAdditionalExperience(index) {
    editingExpIndex = index;
    const exp = currentProfile.additionalExperiences[index];
    
    // Populate edit modal
    document.getElementById('editExpJobTitle').value = exp.jobTitle || '';
    document.getElementById('editExpCompany').value = exp.companyName || '';
    document.getElementById('editExpStartDate').value = exp.startDate || '';
    document.getElementById('editExpEndDate').value = exp.endDate || '';
    document.getElementById('editExpCurrentlyWorking').checked = exp.currentlyWorking || false;
    document.getElementById('editExpDescription').value = exp.jobDescription || '';
    
    // Handle end date disabled state
    const endDateInput = document.getElementById('editExpEndDate');
    if (exp.currentlyWorking) {
        endDateInput.disabled = true;
        endDateInput.style.opacity = '0.5';
    }
    
    // Show modal
    document.getElementById('editExpModal').style.display = 'block';
}

// Save Edited Additional Experience
async function saveEditedExperience() {
    if (editingExpIndex === null) return;
    
    const jobTitle = document.getElementById('editExpJobTitle').value.trim();
    const companyName = document.getElementById('editExpCompany').value.trim();
    const startDate = document.getElementById('editExpStartDate').value.trim();
    const endDate = document.getElementById('editExpEndDate').value.trim();
    const currentlyWorking = document.getElementById('editExpCurrentlyWorking').checked;
    const jobDescription = document.getElementById('editExpDescription').value.trim();
    
    // Validation
    if (!jobTitle || !companyName || !startDate) {
        alert('⚠️ Please fill in all required fields (Job Title, Company, Start Date)');
        return;
    }
    
    // Update experience in array
    const additionalExperiences = [...currentProfile.additionalExperiences];
    additionalExperiences[editingExpIndex] = {
        jobTitle,
        companyName,
        startDate,
        endDate: currentlyWorking ? null : endDate,
        currentlyWorking,
        jobDescription
    };
    
    // Update profile
    await updateAdditionalExperiences(additionalExperiences);
    
    // Close modal
    document.getElementById('editExpModal').style.display = 'none';
    editingExpIndex = null;
}

// Delete Additional Experience
async function deleteAdditionalExperience(index) {
    if (!confirm('Are you sure you want to delete this work experience?')) {
        return;
    }
    
    // Remove from array
    const additionalExperiences = [...currentProfile.additionalExperiences];
    additionalExperiences.splice(index, 1);
    
    // Update profile
    await updateAdditionalExperiences(additionalExperiences);
}

// Update Additional Experiences Helper
async function updateAdditionalExperiences(additionalExperiences) {
    console.log('💾 Updating additional experiences...');
    
    if (!currentProfileId) {
        alert('Error: Profile ID not found');
        return;
    }
    
    const updatedData = {
        ...currentProfile,
        additionalExperiences
    };
    
    console.log('📤 Sending data:', updatedData);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error response:', errorData);
            throw new Error(errorData.error || 'Failed to update profile');
        }
        
        const result = await response.json();
        console.log('✅ Update successful:', result);
        
        // Update local storage
        chrome.storage.local.set({ userProfile: updatedData }, () => {
            console.log('💾 Updated local storage');
            
            // Update display
            currentProfile = updatedData;
            displayUserProfile(updatedData);
            alert('✅ Work experiences updated successfully!');
        });
        
    } catch (error) {
        console.error('❌ Error updating experiences:', error);
        alert(`❌ Failed to update experiences: ${error.message}`);
    }
}

// Display Work Experiences
function displayWorkExperiences(profile) {
    displayPrimaryExperience(profile);
    
    displayAdditionalExperiences(profile);
}

// Display Primary Experience
function displayPrimaryExperience(profile) {
    // Job Title
    const jobTitleEl = document.getElementById('jobTitle');
    if (jobTitleEl) {
        jobTitleEl.textContent = profile.jobTitle || 'Not specified';
    }

    // Company Name
    const companyNameEl = document.getElementById('companyName');
    if (companyNameEl) {
        companyNameEl.textContent = profile.companyName || 'Not specified';
    }

    // Start Date
    const startDateEl = document.getElementById('startDate');
    if (startDateEl) {
        if (profile.startDate) {
            const date = new Date(profile.startDate);
            startDateEl.textContent = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
            startDateEl.textContent = 'Not specified';
        }
    }

    // End Date
    const endDateEl = document.getElementById('endDate');
    if (endDateEl) {
        if (profile.currentlyWorking) {
            endDateEl.textContent = 'Present';
            endDateEl.style.color = '#10b981';
            endDateEl.style.fontWeight = '600';
        } else if (profile.endDate) {
            const date = new Date(profile.endDate);
            endDateEl.textContent = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
            endDateEl.textContent = 'Not specified';
        }
    }

    // Currently Working Status
    const currentlyWorkingEl = document.getElementById('currentlyWorkingStatus');
    if (currentlyWorkingEl) {
        if (profile.currentlyWorking) {
            currentlyWorkingEl.textContent = '✓ Yes, currently working here';
            currentlyWorkingEl.style.color = '#10b981';
            currentlyWorkingEl.style.fontWeight = '600';
        } else {
            currentlyWorkingEl.textContent = '✗ No longer working here';
            currentlyWorkingEl.style.color = 'rgba(255, 255, 255, 0.7)';
        }
    }

    // Professional Summary
    const summaryEl = document.getElementById('professionalSummary');
    if (summaryEl) {
        summaryEl.textContent = profile.professionalSummary || 'No summary provided';
    }
}

// Display Additional Experiences
function displayAdditionalExperiences(profile) {
    const sectionEl = document.getElementById('additionalExperiencesSection');
    const containerEl = document.getElementById('additionalExperiencesContainer');
    
    if (!containerEl) return;
    
    // Check if there are additional experiences
    if (!profile.additionalExperiences || profile.additionalExperiences.length === 0) {
        sectionEl.style.display = 'none';
        return;
    }
    
    // Show the section
    sectionEl.style.display = 'block';
    
    // Clear existing content
    containerEl.innerHTML = '';
    
    // Display each additional experience
    profile.additionalExperiences.forEach((exp, index) => {
        const duration = calculateDuration(exp.startDate, exp.endDate, exp.currentlyWorking);
        const startDateFormatted = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Not specified';
        const endDateFormatted = exp.currentlyWorking ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Not specified');
        
        const experienceHTML = `
            <div class="experience-item additional-experience" data-index="${index}" style="position: relative; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div class="experience-badge" style="display: inline-block; background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        Position ${index + 1}
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button type="button" class="edit-exp-btn" data-index="${index}" title="Edit" style="background: rgba(102, 126, 234, 0.2); color: #667eea; border: 1px solid rgba(102, 126, 234, 0.3); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
                            Edit
                        </button>
                        <button type="button" class="delete-exp-btn" data-index="${index}" title="Delete" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
                            Delete
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label style="color: white;">Job Title</label>
                    <div class="data-box">
                        <span class="dataText" style="color: white;">${exp.jobTitle || 'Not specified'}</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label style="color: white;">Company</label>
                    <div class="data-box">
                        <span class="dataText" style="color: white;">${exp.companyName || 'Not specified'}</span>
                    </div>
                </div>

                <div class="form-grid-two">
                    <div class="form-group">
                        <label style="color: white;">Duration</label>
                        <div class="data-box">
                            <span class="dataText" style="color: white;">${duration}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="color: white;">Date Range</label>
                        <div class="data-box">
                            <span class="dataText" style="color: white;">${startDateFormatted} - ${endDateFormatted}</span>
                        </div>
                    </div>
                </div>

                ${exp.jobDescription ? `
                    <div class="form-group">
                        <label style="color: white;">Job Description</label>
                        <div class="data-box" style="min-height: 60px;">
                            <span class="dataText" style="color: white; white-space: pre-wrap;">${exp.jobDescription}</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        containerEl.innerHTML += experienceHTML;
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-exp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            editAdditionalExperience(index);
        });
    });
    
    document.querySelectorAll('.delete-exp-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            deleteAdditionalExperience(index);
        });
    });
}

// Calculate Duration Between Two Dates (additional experiences)
function calculateDuration(startDate, endDate, currentlyWorking) {
    if (!startDate) return 'Duration not specified';
    
    const start = new Date(startDate);
    const end = currentlyWorking ? new Date() : (endDate ? new Date(endDate) : new Date());
    
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0 && remainingMonths === 0) return '1 month';
    
    let duration = '';
    if (years > 0) duration += `${years} year${years > 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
        if (duration) duration += ', ';
        duration += `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
    
    return duration || '1 month';
}

// Format Date Range for Work Experience (additional experiences)
function formatDateRange(startDate, endDate, currentlyWorking) {
    if (!startDate) return '-';
    
    const start = new Date(startDate);
    const startFormatted = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (currentlyWorking) {
        return `${startFormatted} - Present`;
    }
    
    if (!endDate) {
        return startFormatted;
    }
    
    const end = new Date(endDate);
    const endFormatted = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    return `${startFormatted} - ${endFormatted}`;
}

// !!=======================================================================================================================
//  !!PROJECTS
// !!=======================================================================================================================
// Display projects
function displayProjects(profile) {
    displayPrimaryProject(profile)
    displayAdditionalProjects(profile)
}

// Display Primary Project
function displayPrimaryProject(profile) {
    const projectTitle = profile.projectTitle || profile.project_title;
    const projectSummary = profile.projectSummary || profile.project_summary;

    const projectTitleEl = document.getElementById('projectTitle');
    if (projectTitleEl) {
        projectTitleEl.textContent = projectTitle || '-';
    }

    const projectSummaryEl = document.getElementById('projectSummary');
    if (projectSummaryEl) {
        projectSummaryEl.textContent = projectSummary || '-';
    }
}

// Display Additional Projects
function displayAdditionalProjects(profile) {
    const sectionEl = document.getElementById('additionalProjectSection');
    const containerEl = document.getElementById('additionalProjectContainer');

    if (!containerEl) return;

    const projectsArray = profile.projects || profile.additionalProject || [];

    if (projectsArray.length === 0) {
        sectionEl.style.display = 'none';
        containerEl.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem;">No additional projects added yet</p>';
        return;
    }
    
    sectionEl.style.display = 'block';
    containerEl.innerHTML = '';

    projectsArray.forEach((project, index) => {
        const projectTitle = project.projectTitle || project.project_title || 'Not specified';
        const projectSummary = project.projectSummary || project.project_summary || 'No summary provided';
        
        const projectHTML = `
            <div class="project-item" data-index="${index}" style="position: relative; padding: 1.5rem; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div class="project-badge" style="display: inline-block; background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">
                        Project ${index + 1}
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button type="button" class="edit-project-btn" data-index="${index}" title="Edit" style="background: rgba(102, 126, 234, 0.2); color: #667eea; border: 1px solid rgba(102, 126, 234, 0.3); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
                            Edit
                        </button>
                        <button type="button" class="delete-project-btn" data-index="${index}" title="Delete" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.875rem;">
                            Delete
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label style="color: white;">Project Title</label>
                    <div class="data-box">
                        <span class="dataText" style="color: white;">${projectTitle}</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label style="color: white;">Project Summary</label>
                    <div class="data-box" style="min-height: 100px;">
                        <span class="dataText" style="color: white; white-space: pre-wrap;">${projectSummary}</span>
                    </div>
                </div>
            </div>
        `;
        
        containerEl.innerHTML += projectHTML;
    });

    document.querySelectorAll('.edit-project-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            editAdditionalProject(index);
        });
    });
    
    document.querySelectorAll('.delete-project-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.getAttribute('data-index'));
            deleteAdditionalProject(index);
        });
    });
}

// Save Primary Project 
async function savePrimaryProject() {
    console.log('Saving primary project...');

    if (!currentProfileId) {
        alert('Error: Profile Id not found');
        return;
    }

    const updatedData = {
        projectTitle: document.getElementById('editProjectTitle').value.trim(),
        projectSummary: document.getElementById('editProjectSummary').value.trim()
    };

    if (!updatedData.projectTitle || !updatedData.projectSummary) {
        alert('Please fill in all required fields');
        return;
    }

    console.log('Sending data: ', updatedData);

    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}/projects/primary`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        console.log('Response status: ', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.error || 'Failed to update project');
        }

        const result = await response.json();
        console.log('Update successful:', result);

        currentProfile = {
            ...currentProfile,
            projectTitle: updatedData.projectTitle,
            projectSummary: updatedData.projectSummary
        };
        
        chrome.storage.local.set({ userProfile: currentProfile }, () => {
            console.log('Updated local storage');
            displayProjects(currentProfile);
            exitEditMode('project');
            alert('Primary project updated successfully!');
        });
    } catch (error) {
        console.error('Error updating primary project:', error);
        alert(`Failed to update primary project: ${error.message}`);
    }
}

// Add New Project 
async function addNewProject() {
    const projectTitle = document.getElementById('newProjectTitle').value.trim();
    const projectSummary = document.getElementById('newProjectSummary').value.trim();

    if (!projectTitle || !projectSummary) {
        alert('Please fill in all required fields');
        return;
    }

    const newProject = {
        projectTitle,
        projectSummary
    };

    console.log('Adding new project:', newProject);

    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}/projects/additional`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProject)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add new project');
        }

        const result = await response.json();
        console.log('Project added successfully:', result);

        if (!currentProfile.projects) {
            currentProfile.projects = [];
        }
        currentProfile.projects = result.data;

        chrome.storage.local.set({ userProfile: currentProfile }, () => {
            displayProjects(currentProfile);
            closeAddProjectModal();
            alert('Project added successfully!');
        });
    } catch (error) {
        console.error('Error adding project:', error);
        alert(`Failed to add new project: ${error.message}`);
    }
}

// Edit Additional Project 
function editAdditionalProject(index) {
    editingProjectIndex = index;
    const project = currentProfile.projects[index];

    const projectTitle = project.projectTitle || project.project_title || '';
    const projectSummary = project.projectSummary || project.project_summary || '';

    document.getElementById('editProjectTitle').value = projectTitle;
    document.getElementById('editProjectSummary').value = projectSummary;

    document.getElementById('editProjectModal').style.display = 'block';
}

// Save Edited Project 
async function saveEditedProject() {
    if (editingProjectIndex === null) return;

    const projectTitle = document.getElementById('editProjectTitle').value.trim();
    const projectSummary = document.getElementById('editProjectSummary').value.trim();

    if (!projectTitle || !projectSummary) {
        alert('Please fill in all required fields');
        return;
    }

    const updatedProject = {
        projectTitle,
        projectSummary
    };

    console.log('Updating project: ', updatedProject);

    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}/projects/additional/${editingProjectIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProject)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update project');
        }

        const result = await response.json();
        console.log('Profile updated successfully:', result);

        currentProfile.projects = result.data;

        chrome.storage.local.set({ userProfile: currentProfile }, () => {
            displayProjects(currentProfile);
            closeEditProjectModal();
            editingProjectIndex = null;
            alert('✅ Project updated successfully!');
        });
    } catch (error) {
        console.error('Error updating project:', error);
        alert(`Failed to update project: ${error.message}`);
    }
}

// Delete Additional Project 
async function deleteAdditionalProject(index) {
    console.log('Deleting project at index:', index);

    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}/projects/additional/${index}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete project');
        }

        const result = await response.json();
        console.log('Project deleted successfully:', result);

        currentProfile.projects = result.data;

        chrome.storage.local.set({ userProfile: currentProfile }, () => {
            displayProjects(currentProfile);
            alert('Project deleted successfully!');
        });
    } catch (error) {
        console.error('Error deleting project:', error);
        alert(`Failed to delete project: ${error.message}`);
    }
}

// Open Add Project Modal 
function openAddProjectModal() {
    document.getElementById('newProjectTitle').value = '';
    document.getElementById('newProjectSummary').value = '';
    document.getElementById('addProjectModal').style.display = 'block';
}

// Close Add Project Modal
function closeAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'none';
}

// Close Edit Project Modal
function closeEditProjectModal() {
    document.getElementById('editProjectModal').style.display = 'none';
    editingProjectIndex = null;
}

// !!=======================================================================================================================
//  !!SKILLS & EXPERTISE
// !!=======================================================================================================================

// Edit and Update For Skills & Expertise
function addSkillToEdit() {
    const input = document.getElementById('editSkillInput');
    const skillName = input.value.trim();
    
    if (!skillName) {
        return;
    }

    if (editingSkills.includes(skillName)) {
        alert('⚠️ This skill is already added');
        input.value = '';
        return;
    }
    
    editingSkills.push(skillName);
    input.value = '';
    
    renderEditSkills();
}

// Remove skill from editing list
function removeSkillFromEdit(skillName) {
    editingSkills = editingSkills.filter(s => s !== skillName);
    renderEditSkills();
}

// Render skills in edit mode
function renderEditSkills() {
    const container = document.getElementById('editSkillsTags');
    
    if (editingSkills.length === 0) {
        container.innerHTML = '<span style="color: rgba(255,255,255,0.5); padding: 0.5rem;">No skills added yet</span>';
        return;
    }
    
    container.innerHTML = editingSkills.map(skill => `
        <span class="skill-tag" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #667eea; color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.875rem;">
            ${skill}
            <button 
                type="button" 
                onclick="removeSkillFromEdit('${skill.replace(/'/g, "\\'")}')" 
                style="background: none; border: none; color: white; cursor: pointer; font-weight: bold; padding: 0; font-size: 1.1rem; line-height: 1;"
                title="Remove skill"
            >
                ×
            </button>
        </span>
    `).join('');
}

// Save Skills & Expertise
async function saveSkills() {
    console.log('💾 Saving skills & expertise...');
    
    if (!currentProfileId) {
        alert('Error: Profile ID not found');
        return;
    }
    
    const updatedData = {
        ...currentProfile,
        skills: editingSkills,
        linkedin: document.getElementById('editLinkedin').value.trim(),
        github: document.getElementById('editGithub').value.trim(),
        website: document.getElementById('editWebsite').value.trim()
    };
    
    console.log('📤 Sending data:', updatedData);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error response:', errorData);
            throw new Error(errorData.error || 'Failed to update profile');
        }
        
        const result = await response.json();
        console.log('✅ Update successful:', result);
        
        chrome.storage.local.set({ userProfile: updatedData }, () => {
            console.log('💾 Updated local storage');

            currentProfile = updatedData;
            displayUserProfile(updatedData);
            exitEditMode('skills');
            alert('✅ Skills & Expertise updated successfully!');
        });
        
    } catch (error) {
        console.error('❌ Error updating skills:', error);
        alert(`❌ Failed to update skills: ${error.message}`);
    }
}

// !!=======================================================================================================================
//  !!JOB PREFERENCES
// !!=======================================================================================================================

// Edit and Update For Job Preferences
async function saveJobPref() {
    console.log('Saving job preferences...');
    
    if (!currentProfileId) {
        alert('Error: Profile ID not found');
        return;
    }
    
    const selectedWorkType = document.querySelector('input[name="editWorkType"]:checked');
    const selectedRelocate = document.querySelector('input[name="editRelocate"]:checked');
    const selectedRestrictiveBond = document.querySelector('input[name="editRestrictiveBond"]:checked'); // ADD THIS
    
    const updatedData = {
        ...currentProfile,
        workType: selectedWorkType ? selectedWorkType.value : null,
        relocate: selectedRelocate ? selectedRelocate.value : null,
        restrictiveBond: selectedRestrictiveBond ? selectedRestrictiveBond.value : null, // ADD THIS
        expectedSalary: document.getElementById('editSalary').value.trim(),
        preferredLocations: document.getElementById('editPreferredLocations').value.trim()
    };
    
    console.log('Sending data:', updatedData);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.error || 'Failed to update profile');
        }
        
        const result = await response.json();
        console.log('Update successful:', result);
        
        chrome.storage.local.set({ userProfile: updatedData }, () => {
            console.log('Updated local storage');
            
            currentProfile = updatedData;
            displayUserProfile(updatedData);
            exitEditMode('jobPref');
            alert('Job Preferences updated successfully!');
        });
        
    } catch (error) {
        console.error('Error updating job preferences:', error);
        alert(`Failed to update job preferences: ${error.message}`);
    }
}

// !!=======================================================================================================================
//  !!ABROAD AUTHORIZATION
// !!=======================================================================================================================

// Save Abroad Authorization
async function saveAuth() {
    console.log('💾 Saving abroad authorization...');
    
    if (!currentProfileId) {
        alert('Error: Profile ID not found');
        return;
    }
    
    const selectedAuthorized = document.querySelector('input[name="editAuthorized"]:checked');
    const selectedSponsorship = document.querySelector('input[name="editSponsorship"]:checked');

    const updatedData = {
        ...currentProfile,
        authorized: selectedAuthorized ? selectedAuthorized.value : null,
        sponsorship: selectedSponsorship ? selectedSponsorship.value : null,
        visaSponsorship: document.getElementById('editVisaType').value.trim()
    };
    
    console.log('📤 Sending data:', updatedData);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error response:', errorData);
            throw new Error(errorData.error || 'Failed to update profile');
        }
        
        const result = await response.json();
        console.log('✅ Update successful:', result);
        
        chrome.storage.local.set({ userProfile: updatedData }, () => {
            console.log('💾 Updated local storage');

            currentProfile = updatedData;
            displayUserProfile(updatedData);
            exitEditMode('auth');
            alert('✅ Authorization information updated successfully!');
        });
        
    } catch (error) {
        console.error('❌ Error updating authorization:', error);
        alert(`❌ Failed to update authorization: ${error.message}`);
    }
}

// Display Authorization Information
function displayAuthorizationInfo(profile) {
    // Work Authorization - Select Radio Button
    const authorizedValue = profile.authorized;
    if (authorizedValue) {
        const authorizedRadio = document.querySelector(`input[name="authorized"][value="${authorizedValue}"]`);
        if (authorizedRadio) {
            authorizedRadio.checked = true;
        }
    }

    // Visa Sponsorship - Select Radio Button
    const sponsorshipValue = profile.sponsorship;
    if (sponsorshipValue) {
        const sponsorshipRadio = document.querySelector(`input[name="sponsorship"][value="${sponsorshipValue}"]`);
        if (sponsorshipRadio) {
            sponsorshipRadio.checked = true;
        }
    }

    // Visa Type
    const visaTypeEl = document.getElementById('visaType');
    if (profile.visaSponsorship && profile.visaSponsorship.trim()) {
        visaTypeEl.textContent = profile.visaSponsorship;
    } else {
        visaTypeEl.textContent = 'Not applicable';
        visaTypeEl.style.color = '#999';
    }
}

// !!=======================================================================================================================
//  !!UPLOAD DOCUMENTS
// !!=======================================================================================================================

// Upload Document (Resume or Cover Letter)
async function uploadDocument(file, type) {
    console.log(`📤 Uploading ${type}...`, file);
    
    if (!currentProfileId) {
        alert('Error: Profile ID not found');
        return;
    }
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        alert('⚠️ Please upload only PDF, DOC, or DOCX files');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ File size must be less than 5MB');
        return;
    }

    const formData = new FormData();
    formData.append(type, file);
    
    try {
        console.log(`📤 Uploading ${type === 'resume' ? 'resume' : 'cover letter'}...`);
        
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}/files`, {
            method: 'PUT',
            body: formData
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error response:', errorData);
            throw new Error(errorData.error || 'Failed to upload file');
        }
        
        const result = await response.json();
        console.log('✅ Upload successful:', result);
 
        await displayUploadedDocuments(currentProfile);
        
        alert(`✅ ${type === 'resume' ? 'Resume' : 'Cover letter'} uploaded successfully!`);
        
    } catch (error) {
        console.error(`❌ Error uploading ${type}:`, error);
        alert(`❌ Failed to upload ${type === 'resume' ? 'resume' : 'cover letter'}: ${error.message}`);
    }
}

// Display Uploaded Documents
async function displayUploadedDocuments(profile) {
    const API_BASE_URL = 'http://localhost:3000/api/profiles';
    
    // Get profile ID from storage
    chrome.storage.local.get(['profileId'], async (result) => {
        const profileId = result.profileId;
        
        if (!profileId) {
            showNoDocumentsMessage();
            return;
        }
        
        try {
            showLoadingState();
            
            // Fetch file information from backend
            const url = `${API_BASE_URL}/${profileId}/files`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch file information');
            }
            
            const data = await response.json();
            
            const fileInfo = data.data;
            
            displayResumeInfo(fileInfo.resume, profileId);
            
            displayCoverLetterInfo(fileInfo.coverLetter, profileId);
        } catch (error) {
            showNoDocumentsMessage();
        }
    });
}

// Loading State For Documents
function showLoadingState() {
    const resumeLoading = document.getElementById('resumeLoading');
    const coverLetterLoading = document.getElementById('coverLetterLoading');
    
    if (resumeLoading) resumeLoading.style.display = 'block';
    if (coverLetterLoading) coverLetterLoading.style.display = 'block';
}

// Display Resume Information
function displayResumeInfo(resumeInfo, profileId) {
    const uploadedFileEl = document.getElementById('uploadedFile');
    const fileNameEl = document.getElementById('fileName');
    const fileSizeEl = document.getElementById('fileSize');
    const fileUploadDateEl = document.getElementById('fileUploadDate');
    const noResumeMessageEl = document.getElementById('noResumeMessage');
    const resumeLoadingEl = document.getElementById('resumeLoading');

    if (resumeLoadingEl) resumeLoadingEl.style.display = 'none';
    
    if (resumeInfo.exists && resumeInfo.fileExistsOnDisk) {
        // Show resume card
        if (uploadedFileEl) {
            uploadedFileEl.style.display = 'block';
        }
        if (noResumeMessageEl) noResumeMessageEl.style.display = 'none';
        
        // Set file details
        if (fileNameEl) {
            fileNameEl.textContent = resumeInfo.filename;
        }
        if (fileSizeEl) {
            const formattedSize = formatFileSize(resumeInfo.size);
            fileSizeEl.textContent = formattedSize;
        }
        if (fileUploadDateEl) {
            const formattedDate = formatDate(resumeInfo.uploadedAt);
            fileUploadDateEl.textContent = formattedDate;
        }
        
        // Add event listeners for buttons
        const viewBtn = document.getElementById('viewResumeBtn');
        const downloadBtn = document.getElementById('downloadResumeBtn');
        
        if (viewBtn) {
            viewBtn.onclick = () => viewFile(profileId, 'resume');
        }
        
        if (downloadBtn) {
            downloadBtn.onclick = () => downloadFile(profileId, 'resume', resumeInfo.filename);
        }
    } else {
        // Show no resume message
        if (uploadedFileEl) uploadedFileEl.style.display = 'none';
        if (noResumeMessageEl) noResumeMessageEl.style.display = 'block';
    }
}

// Display Cover Letter Information
function displayCoverLetterInfo(coverLetterInfo, profileId) {
    const uploadedFileCoverEl = document.getElementById('uploadedFileCover');
    const fileNameCoverEl = document.getElementById('fileNameCover');
    const fileSizeCoverEl = document.getElementById('fileSizeCover');
    const fileCoverUploadDateEl = document.getElementById('fileCoverUploadDate');
    const noCoverLetterMessageEl = document.getElementById('noCoverLetterMessage');
    const coverLetterLoadingEl = document.getElementById('coverLetterLoading');
    
    // Hide loading
    if (coverLetterLoadingEl) coverLetterLoadingEl.style.display = 'none';
    
    if (coverLetterInfo.exists && coverLetterInfo.fileExistsOnDisk) {
        // Show cover letter card
        if (uploadedFileCoverEl) {
            uploadedFileCoverEl.style.display = 'block';
        }
        if (noCoverLetterMessageEl) noCoverLetterMessageEl.style.display = 'none';
        
        // Set file details
        if (fileNameCoverEl) {
            fileNameCoverEl.textContent = coverLetterInfo.filename;
        }
        if (fileSizeCoverEl) {
            const formattedSize = formatFileSize(coverLetterInfo.size);
            fileSizeCoverEl.textContent = formattedSize;
        }
        if (fileCoverUploadDateEl) {
            const formattedDate = formatDate(coverLetterInfo.uploadedAt);
            fileCoverUploadDateEl.textContent = formattedDate;
        }
        
        // Add event listeners for buttons
        const viewBtn = document.getElementById('viewCoverLetterBtn');
        const downloadBtn = document.getElementById('downloadCoverLetterBtn');
        
        if (viewBtn) {
            viewBtn.onclick = () => viewFile(profileId, 'cover-letter');
        }
        
        if (downloadBtn) {
            downloadBtn.onclick = () => downloadFile(profileId, 'cover-letter', coverLetterInfo.filename);
        }
    } else {
        // Show no cover letter message
        if (uploadedFileCoverEl) uploadedFileCoverEl.style.display = 'none';
        if (noCoverLetterMessageEl) noCoverLetterMessageEl.style.display = 'block';
    }
}

// Show No Documents (Resume & Cover Letter) Message
function showNoDocumentsMessage() { 
    const uploadedFileEl = document.getElementById('uploadedFile');
    const noResumeMessageEl = document.getElementById('noResumeMessage');
    const uploadedFileCoverEl = document.getElementById('uploadedFileCover');
    const noCoverLetterMessageEl = document.getElementById('noCoverLetterMessage');
    const resumeLoadingEl = document.getElementById('resumeLoading');
    const coverLetterLoadingEl = document.getElementById('coverLetterLoading');
    
    if (resumeLoadingEl) resumeLoadingEl.style.display = 'none';
    if (coverLetterLoadingEl) coverLetterLoadingEl.style.display = 'none';
    if (uploadedFileEl) uploadedFileEl.style.display = 'none';
    if (uploadedFileCoverEl) uploadedFileCoverEl.style.display = 'none';
    if (noResumeMessageEl) noResumeMessageEl.style.display = 'block';
    if (noCoverLetterMessageEl) noCoverLetterMessageEl.style.display = 'block';
}

// View File (Resume & Cover Letter) in New Tab
function viewFile(profileId, fileType) {
    const API_BASE_URL = 'http://localhost:3000/api/profiles';
    const url = `${API_BASE_URL}/${profileId}/${fileType}`;
    window.open(url, '_blank');
}

// Download File (Resume & Cover Letter)
async function downloadFile(profileId, fileType, filename) {
    const API_BASE_URL = 'http://localhost:3000/api/profiles';
    
    try {
        const url = `${API_BASE_URL}/${profileId}/${fileType}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to download ${fileType}`);
        }
        
        const blob = await response.blob();
        
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
    } catch (error) {
        alert(`Failed to download ${fileType}. Please try again.`);
    }
}

// Format File Size
function formatFileSize(bytes) {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(2);
    
    return `${size} ${sizes[i]}`;
}

// !!=======================================================================================================================
//  !!ADDITIONAL QUESTIONS
// !!=======================================================================================================================

// Display Additional Information
function displayAdditionalInfo(profile) {
    // Gender
    const genderEl = document.getElementById('genderInfo');
    genderEl.textContent = formatGender(profile.gender);
    if (profile.gender === 'otherGender') {
        genderEl.className = 'declined';
    }

    // Hispanic/Latino
    const hispanicEl = document.getElementById('hispanicLatinoInfo');
    hispanicEl.textContent = formatHispanicLatino(profile.hispanicLatino);
    if (profile.hispanicLatino === 'otherHisLat') {
        hispanicEl.className = 'declined';
    }

    // Race
    const raceEl = document.getElementById('raceInfo');
    raceEl.textContent = formatRace(profile.race);
    if (profile.race === 'otherRace') {
        raceEl.className = 'declined';
    }

    // Veteran Status
    const veteranEl = document.getElementById('veteranInfo');
    veteranEl.textContent = formatVeteranStatus(profile.veteran);
    if (profile.veteran === 'otherVeteran') {
        veteranEl.className = 'declined';
    }

    // Disability Status
    const disabilityEl = document.getElementById('disabilityInfo');
    disabilityEl.textContent = formatDisabilityStatus(profile.disability);
    if (profile.disability === 'otherDisability') {
        disabilityEl.className = 'declined';
    }
}

// Save Additional Questions
async function saveAdditional() {
    console.log('💾 Saving additional questions...');
    
    if (!currentProfileId) {
        alert('Error: Profile ID not found');
        return;
    }

    const updatedData = {
        ...currentProfile,
        gender: document.getElementById('editGender').value,
        hispanicLatino: document.getElementById('editHispanicLatino').value,
        race: document.getElementById('editRace').value,
        veteran: document.getElementById('editVeteran').value,
        disability: document.getElementById('editDisability').value
    };
    
    console.log('📤 Sending data:', updatedData);
    
    try {
        const response = await fetch(`http://localhost:3000/api/profiles/${currentProfileId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Error response:', errorData);
            throw new Error(errorData.error || 'Failed to update profile');
        }
        
        const result = await response.json();
        console.log('✅ Update successful:', result);
        
        chrome.storage.local.set({ userProfile: updatedData }, () => {
            console.log('💾 Updated local storage');
            
            currentProfile = updatedData;
            displayUserProfile(updatedData);
            exitEditMode('additional');
            alert('✅ Additional questions updated successfully!');
        });
        
    } catch (error) {
        console.error('❌ Error updating additional questions:', error);
        alert(`❌ Failed to update additional questions: ${error.message}`);
    }
}

// Format Date - Additional Info
function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
}

// Format Gender - Additional Info
function formatGender(value) {
    if (!value) return 'Not specified';
    
    const genderMap = {
        'male': 'Male',
        'female': 'Female',
        'otherGender': 'Decline to self-identify'
    };
    
    return genderMap[value] || value;
}

// Format Hispanic/Latino - Additional Info
function formatHispanicLatino(value) {
    if (!value) return 'Not specified';
    
    const hispanicMap = {
        'yes': 'Yes',
        'no': 'No',
        'otherHisLat': 'Decline to self-identify'
    };
    
    return hispanicMap[value] || value;
}

// Format Race - Additional Info
function formatRace(value) {
    if (!value) return 'Not specified';
    
    const raceMap = {
        'american': 'American Indian or Alaskan Native',
        'asian': 'Asian',
        'black': 'Black or African American',
        'white': 'White',
        'native': 'Native Hawaiian or Other Pacific Islander',
        'twoOrMore': 'Two or More Races',
        'otherRace': 'Decline to self-identify'
    };
    
    return raceMap[value] || value;
}

// Format Veteran Status - Additional Info
function formatVeteranStatus(value) {
    if (!value) return 'Not specified';
    
    const veteranMap = {
        'notVeteran': 'Not a protected veteran',
        'iVeteran': 'Protected veteran',
        'otherVeteran': 'Decline to self-identify'
    };
    
    return veteranMap[value] || value;
}

// Format Disability Status - Additional Info
function formatDisabilityStatus(value) {
    if (!value) return 'Not specified';
    
    const disabilityMap = {
        'yesDisability': 'Yes, I have a disability',
        'noDisability': 'No, I do not have a disability',
        'otherDisability': 'Decline to self-identify'
    };
    
    return disabilityMap[value] || value;
}