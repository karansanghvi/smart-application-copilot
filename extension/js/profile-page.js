document.addEventListener('DOMContentLoaded', () => {
    // Load user profile from Chrome storage
    chrome.storage.local.get(['userProfile', 'profileId'], (result) => {
        if (result.userProfile) {
            displayUserProfile(result.userProfile);
        } else {
            // If no profile, redirect to profile setup
            window.location.href = 'onboarding.html';
        }
    });

    // Button event listeners
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

function displayUserProfile(profile) {
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

    // Job Preferences - Work Type (Select Radio Button)
    const workTypeValue = profile.workType;
    if (workTypeValue) {
        const workTypeRadio = document.querySelector(`input[name="workType"][value="${workTypeValue}"]`);
        if (workTypeRadio) {
            workTypeRadio.checked = true;
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
    displayAuthorizationInfo(profile);
    displayAdditionalInfo(profile);
    displayUploadedDocuments(profile);
}

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

function showLoadingState() {
    const resumeLoading = document.getElementById('resumeLoading');
    const coverLetterLoading = document.getElementById('coverLetterLoading');
    
    if (resumeLoading) resumeLoading.style.display = 'block';
    if (coverLetterLoading) coverLetterLoading.style.display = 'block';
}

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

// View file in new tab
function viewFile(profileId, fileType) {
    const API_BASE_URL = 'http://localhost:3000/api/profiles';
    const url = `${API_BASE_URL}/${profileId}/${fileType}`;
    window.open(url, '_blank');
}

// Download file
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

// Helper function to format file size
function formatFileSize(bytes) {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, i)).toFixed(2);
    
    return `${size} ${sizes[i]}`;
}

// Helper function to format date
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

// Formatting helper functions
function formatGender(value) {
    if (!value) return 'Not specified';
    
    const genderMap = {
        'male': 'Male',
        'female': 'Female',
        'otherGender': 'Decline to self-identify'
    };
    
    return genderMap[value] || value;
}

function formatHispanicLatino(value) {
    if (!value) return 'Not specified';
    
    const hispanicMap = {
        'yes': 'Yes',
        'no': 'No',
        'otherHisLat': 'Decline to self-identify'
    };
    
    return hispanicMap[value] || value;
}

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

function formatVeteranStatus(value) {
    if (!value) return 'Not specified';
    
    const veteranMap = {
        'notVeteran': 'Not a protected veteran',
        'iVeteran': 'Protected veteran',
        'otherVeteran': 'Decline to self-identify'
    };
    
    return veteranMap[value] || value;
}

function formatDisabilityStatus(value) {
    if (!value) return 'Not specified';
    
    const disabilityMap = {
        'yesDisability': 'Yes, I have a disability',
        'noDisability': 'No, I do not have a disability',
        'otherDisability': 'Decline to self-identify'
    };
    
    return disabilityMap[value] || value;
}

function displayWorkExperiences(profile) {
    displayPrimaryExperience(profile);
    
    displayAdditionalExperiences(profile);
}

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
            <div class="experience-item additional-experience">
                <div class="experience-badge" style="display: inline-block; background: #667eea; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; margin-bottom: 1rem;">
                    Position ${index + 1}
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
}

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