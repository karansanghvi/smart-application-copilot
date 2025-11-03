// field_mapper.js - Field matching patterns and logic

const FieldMapper = {
    // Mapping patterns for different field types
    patterns: {
        // Personal Information
        firstName: ['first', 'fname', 'given', 'forename', 'firstname', 'first_name', 'givenname'],
        middleName: ['middle', 'mname', 'middlename', 'middle_name', 'initial'],
        lastName: ['last', 'lname', 'surname', 'family', 'lastname', 'last_name', 'familyname'],
        fullName: ['name', 'fullname', 'full_name', 'full name', 'applicant', 'candidate'],
        email: ['email', 'e-mail', 'mail', 'emailaddress', 'email_address', 'contact_email', 'work_email', 'personal_email'],
        phone: ['phone', 'mobile', 'tel', 'telephone', 'contact', 'cell', 'phonenumber', 'phone_number', 'primary_phone', 'contact_number'],
        
        // Address fields
        address: ['address', 'street', 'address1', 'addressline1', 'address_line_1', 'streetaddress', 'home_address', 'residential', 'mailing'],
        addressLine2: ['address2', 'addressline2', 'address_line_2', 'apt', 'suite', 'unit', 'apartment', 'building'],
        city: ['city', 'town', 'locality', 'location_city', 'municipality'],
        state: ['state', 'province', 'region', 'county', 'territory'],
        country: ['country', 'nation', 'residence'],
        zipCode: ['zip', 'postal', 'postcode', 'zipcode', 'zip_code', 'postalcode', 'area_code'],
        
        // Education
        universityName: ['university', 'college', 'school', 'institution', 'university_name', 'college_name', 'school_name', 'educational_institution'],
        fieldOfStudy: ['major', 'field', 'study', 'degree_program', 'specialization', 'concentration', 'field_of_study', 'area_of_study', 'academic_major', 'course'],
        educationStartDate: ['education_start', 'enrollment', 'start_date', 'commenced', 'began', 'started_education'],
        educationEndDate: ['graduation', 'graduate', 'education_end', 'completion', 'finish', 'graduated', 'expected_graduation', 'graduation_year', 'end_date'],
        degree: ['degree', 'qualification', 'education_level', 'highest_education', 'academic_degree', 'educational_qualification'],
        
        // Work Experience
        jobTitle: ['title', 'jobtitle', 'job_title', 'position', 'role', 'current_title', 'currenttitle', 'designation'],
        companyName: ['company', 'employer', 'organization', 'workplace', 'current_company', 'currentcompany', 'employer_name', 'organization_name'],
        startDate: ['start', 'from', 'employment_start', 'date_started', 'beginning', 'commenced_work'],
        endDate: ['end', 'to', 'employment_end', 'date_ended', 'finish', 'left'],
        currentlyWorking: ['currently', 'present', 'current_position', 'still_working', 'working_now', 'currently_employed'],
        professionalSummary: ['summary', 'about', 'bio', 'description', 'professional_summary', 'objective', 'career_summary', 'professional_bio', 'profile', 'tell_us_about', 'describe_yourself'],
        
        // Projects
        projectTitle: ['project_title', 'project_name', 'project', 'name_of_project', 'what_is_the_project'],
        projectSummary: ['project_description', 'project_details', 'project_summary', 'describe_project', 'project_overview', 'what_did_you_do'],
        
        // Skills
        skills: ['skill', 'skills', 'expertise', 'competenc', 'technical_skills', 'professional_skills', 'key_skills', 'relevant_skills', 'core_competencies', 'soft_skills', 'areas_of_expertise'],
        
        // Professional links
        linkedin: ['linkedin', 'linked-in', 'linkedinurl', 'linkedin_url', 'linked_in', 'linkedin_profile', 'linkedin_link', 'linkedin_address'],
        github: ['github', 'git', 'githuburl', 'github_url', 'github_profile', 'github_username', 'github_link', 'github_account'],
        website: ['website', 'portfolio', 'url', 'personal_site', 'portfoliourl', 'personal', 'site', 'web', 'portfolio_url', 'personal_website'],
        
        // Work preferences
        salary: ['salary', 'compensation', 'expected_salary', 'expectedsalary', 'pay', 'wage', 'salary_expectations', 'desired_salary', 'salary_requirement', 'compensation_expectations'],
        workType: ['worktype', 'work_type', 'employment_type', 'employmenttype', 'job_type', 'full_time', 'part_time', 'contract', 'work_arrangement'],
        preferredLocations: ['preferred_location', 'location_preference', 'desired_location', 'where_would_you_like', 'work_location'],
        workRelocate: ['relocate', 'relocation', 'willing_to_relocate', 'open_to_relocation', 'can_you_relocate', 'willing_to_move', 'relocation_availability'],
        restrictiveBond: ['bond', 'restrictive_bond', 'service_agreement', 'employment_bond', 'notice_period', 'non_compete', 'contractual_obligations'],
        
        // Authorization
        workAuthorized: ['authorized', 'work_authorized', 'authorization', 'eligible', 'right_to_work', 'legally', 'work_permit', 'employment_authorization', 'can_you_legally_work'],
        sponsorship: ['sponsor', 'sponsorship', 'visa_sponsorship', 'need_sponsorship', 'require_sponsorship', 'sponsorship_required', 'will_you_require'],
        visaSponsorshipType: ['visa_type', 'visa_category', 'type_of_visa', 'visa_status', 'immigration_status', 'current_visa'],
        
        // Documents
        resume: ['resume', 'cv', 'curriculum', 'upload_resume', 'attach_resume', 'resume_filename', 'your_resume'],
        resumePath: ['resume_path', 'resume_file', 'resume_location', 'cv_file'],
        coverLetter: ['cover', 'coverletter', 'cover_letter', 'letter', 'motivation', 'additional', 'why', 'interest', 'upload_cover_letter', 'attach_cover_letter', 'letter_of_interest'],
        coverLetterPath: ['cover_letter_path', 'cover_letter_file', 'cover_letter_location'],
        
        // Years of experience
        experience: ['experience', 'years', 'yoe', 'years_of_experience', 'yearsofexperience'],
        
        // Demographics (EEO)
        gender: ['gender', 'sex', 'gender_identity', 'gender_identification'],
        hispanicLatino: ['hispanic', 'latino', 'latina', 'latinx', 'ethnicity', 'hispanic_latino'],
        race: ['race', 'racial', 'ethnic', 'racial_identity', 'ethnic_background', 'racial_background'],
        veteran: ['veteran', 'military', 'armed', 'service', 'veteran_status', 'protected_veteran'],
        disability: ['disability', 'disabled', 'accommodation', 'condition', 'disability_status', 'physical_disability', 'protected_disability']
    },

    // Check if field matches a pattern
    matchesPattern(fieldIdentifier, patternArray) {
        const lowerField = fieldIdentifier.toLowerCase().replace(/[_\-\s]/g, '');
        return patternArray.some(pattern => 
            lowerField.includes(pattern.toLowerCase().replace(/[_\-\s]/g, ''))
        );
    },

    // Get field identifier (combine name, id, placeholder, and label)
    getFieldIdentifier(input) {
        const identifiers = [
            input.name || '',
            input.id || '',
            input.placeholder || '',
            input.getAttribute('aria-label') || ''
        ];

        // Check for associated label
        if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                identifiers.push(label.textContent || '');
            }
        }

        // Check for closest label parent
        const closestLabel = input.closest('label');
        if (closestLabel) {
            identifiers.push(closestLabel.textContent || '');
        }

        return identifiers.join(' ').toLowerCase();
    },

    // Map profile data field to form field type
    getFieldType(input) {
        const identifier = this.getFieldIdentifier(input);

        // Check each pattern type
        for (const [fieldType, patterns] of Object.entries(this.patterns)) {
            if (this.matchesPattern(identifier, patterns)) {
                return fieldType;
            }
        }

        return null; // No match found
    },

    // Get all fillable fields on the page
    getAllFields() {
        const fields = [];
        const inputs = document.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Skip buttons, submit, hidden, file inputs
            if (['button', 'submit', 'hidden', 'file', 'image', 'reset'].includes(input.type)) {
                return;
            }

            const fieldType = this.getFieldType(input);
            if (fieldType) {
                fields.push({
                    element: input,
                    type: fieldType,
                    identifier: this.getFieldIdentifier(input)
                });
            }
        });

        return fields;
    },

    // Fill a field with appropriate data
    fillField(field, profileData) {
        const { element, type } = field;

        // Map field types to profile data keys
        const dataKeyMap = {
            // Personal
            'firstName': 'firstName',
            'middleName': 'middleName',
            'lastName': 'lastName',
            'email': 'email',
            'phone': 'phone',
            'address': 'addressLine1',
            'addressLine2': 'addressLine2',
            'city': 'city',
            'state': 'state',
            'country': 'country',
            'zipCode': 'zipcode',
            
            // Education
            'universityName': 'universityName',
            'fieldOfStudy': 'fieldOfStudy',
            'educationStartDate': 'educationStartDate',
            'educationEndDate': 'educationEndDate',
            'degree': 'degree',
            
            // Work
            'jobTitle': 'jobTitle',
            'companyName': 'companyName',
            'startDate': 'startDate',
            'endDate': 'endDate',
            'currentlyWorking': 'currentlyWorking',
            'professionalSummary': 'professionalSummary',
            
            // Projects
            'projectTitle': 'projectTitle',
            'projectSummary': 'projectSummary',
            
            // Skills & Links
            'skills': 'skills',
            'linkedin': 'linkedinUrl',
            'linkedinUrl': 'linkedinUrl',
            'github': 'githubUrl',
            'githubUrl': 'githubUrl',
            'website': 'websiteUrl',
            'websiteUrl': 'websiteUrl',
            'portfolio': 'portfolioUrl',
            
            // Preferences
            'salary': 'expectedSalary',
            'workType': 'workType',
            'preferredLocations': 'preferredLocations',
            'workRelocate': 'workRelocate',
            'restrictiveBond': 'restrictiveBond',
            
            // Authorization
            'workAuthorized': 'workAuthorized',
            'sponsorship': 'visaSponsorshipRequired',
            'visaSponsorshipType': 'visaSponsorshipType',
            
            // Documents
            'resume': 'resumeFilename',
            'resumePath': 'resumePath',
            'coverLetter': 'coverLetterFilename',
            'coverLetterPath': 'coverLetterPath',
            
            // Demographics
            'gender': 'gender',
            'hispanicLatino': 'hispanicLatino',
            'race': 'race',
            'veteran': 'veteran',
            'disability': 'disability'
        };

        // Get the correct profile data key
        const dataKey = dataKeyMap[type] || type;
        let value = profileData[dataKey];

        if (!value) {
            console.log(`⚠️ No data for field type: ${type}, tried key: ${dataKey}`);
            return false;
        }

        // Handle different input types
        if (element.tagName === 'SELECT') {
            // For dropdowns, try multiple matching strategies
            const options = Array.from(element.options);
            
            // Strategy 1: Exact value match (case-insensitive)
            let matchingOption = options.find(opt => 
                opt.value.toLowerCase() === value.toLowerCase()
            );
            
            // Strategy 2: Partial value match
            if (!matchingOption) {
                matchingOption = options.find(opt => 
                    opt.value.toLowerCase().includes(value.toLowerCase())
                );
            }
            
            // Strategy 3: Text content match
            if (!matchingOption) {
                matchingOption = options.find(opt => 
                    opt.text.toLowerCase().includes(value.toLowerCase()) ||
                    value.toLowerCase().includes(opt.text.toLowerCase())
                );
            }
            
            // Strategy 4: Handle common mappings for EEO fields
            if (!matchingOption && type === 'hispanicLatino') {
                const mapping = {
                    'yes': ['yes', 'hispanic', 'latino'],
                    'no': ['no', 'not hispanic', 'decline']
                };
                const searchTerms = mapping[value.toLowerCase()] || [];
                matchingOption = options.find(opt => 
                    searchTerms.some(term => 
                        opt.text.toLowerCase().includes(term) || 
                        opt.value.toLowerCase().includes(term)
                    )
                );
            }
            
            if (!matchingOption && type === 'veteran') {
                const mapping = {
                    'notVeteran': ['not', 'no', 'not a veteran', 'i am not', 'not protected'],
                    'veteran': ['yes', 'i am', 'protected veteran'],
                    'decline': ['decline', 'prefer not', 'choose not']
                };
                const searchTerms = mapping[value] || [value];
                matchingOption = options.find(opt => 
                    searchTerms.some(term => 
                        opt.text.toLowerCase().includes(term.toLowerCase())
                    )
                );
            }
            
            if (!matchingOption && type === 'disability') {
                const mapping = {
                    'noDisability': ['no', 'not', 'i don\'t', 'do not have', 'i do not'],
                    'hasDisability': ['yes', 'i have', 'i do have'],
                    'decline': ['decline', 'prefer not', 'choose not']
                };
                const searchTerms = mapping[value] || [value];
                matchingOption = options.find(opt => 
                    searchTerms.some(term => 
                        opt.text.toLowerCase().includes(term.toLowerCase())
                    )
                );
            }
            
            if (matchingOption) {
                element.value = matchingOption.value;
                element.dispatchEvent(new Event('change', { bubbles: true }));
                element.dispatchEvent(new Event('blur', { bubbles: true }));
                console.log(`✅ Dropdown filled: ${type} = "${matchingOption.text}"`);
                return true;
            } else {
                console.log(`❌ No matching option for ${type}, value: "${value}"`);
                console.log('Available options:', options.map(o => ({ value: o.value, text: o.text })));
                return false;
            }
            
        } else if (element.type === 'checkbox' || element.type === 'radio') {
            // For checkboxes/radios, check if value matches
            const shouldCheck = 
                value === 'yes' || 
                value === true || 
                element.value.toLowerCase().includes(value.toLowerCase());
            
            if (shouldCheck) {
                element.checked = true;
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
        } else {
            // For text inputs, textareas
            element.value = value;
            
            // Trigger events to ensure form validation works
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('blur', { bubbles: true }));
            return true;
        }

        return false;
    }
};

// Make available globally
window.FieldMapper = FieldMapper;
console.log('✅ FieldMapper loaded and ready');