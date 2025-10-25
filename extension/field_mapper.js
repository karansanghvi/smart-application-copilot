// field_mapper.js - Field matching patterns and logic

const FieldMapper = {
    // Mapping patterns for different field types
    patterns: {
        firstName: ['first', 'fname', 'given', 'forename', 'firstname', 'first_name', 'givenname'],
        middleName: ['middle', 'mname', 'middlename', 'middle_name'],
        lastName: ['last', 'lname', 'surname', 'family', 'lastname', 'last_name', 'familyname'],
        fullName: ['name', 'fullname', 'full_name', 'full name', 'applicant', 'candidate'],
        email: ['email', 'e-mail', 'mail', 'emailaddress', 'email_address'],
        phone: ['phone', 'mobile', 'tel', 'telephone', 'contact', 'cell', 'phonenumber', 'phone_number'],
        
        // Address fields
        address: ['address', 'street', 'address1', 'addressline1', 'address_line_1', 'streetaddress'],
        addressLine2: ['address2', 'addressline2', 'address_line_2', 'apt', 'suite', 'unit'],
        city: ['city', 'town', 'locality', 'location_city', 'municipality'],
        state: ['state', 'province', 'region', 'county'],
        country: ['country', 'nation'],
        zipCode: ['zip', 'postal', 'postcode', 'zipcode', 'zip_code', 'postalcode'],
        
        // Work experience
        currentJobTitle: ['title', 'jobtitle', 'job_title', 'position', 'role', 'current_title', 'currenttitle'],
        currentCompany: ['company', 'employer', 'organization', 'workplace', 'current_company', 'currentcompany'],
        
        // Professional links
        linkedin: ['linkedin', 'linked-in', 'linkedinurl', 'linkedin_url', 'linked_in'],
        github: ['github', 'git', 'githuburl', 'github_url'],
        website: ['website', 'portfolio', 'url', 'personal_site', 'portfoliourl', 'personal', 'site', 'web'],
        
        // Work preferences
        salary: ['salary', 'compensation', 'expected_salary', 'expectedsalary', 'pay', 'wage'],
        workType: ['worktype', 'work_type', 'employment_type', 'employmenttype'],
        
        // Authorization
        workAuthorized: ['authorized', 'work_authorized', 'authorization', 'eligible', 'right_to_work', 'legally'],
        sponsorship: ['sponsor', 'sponsorship', 'visa', 'visa_sponsorship'],
        
        // Summary/Cover Letter
        summary: ['summary', 'about', 'bio', 'description', 'professional_summary', 'objective'],
        coverLetter: ['cover', 'coverletter', 'cover_letter', 'letter', 'motivation', 'additional', 'why', 'interest'],
        
        // Skills
        skills: ['skill', 'skills', 'expertise', 'competenc', 'technical_skills'],
        
        // Years of experience
        experience: ['experience', 'years', 'yoe', 'years_of_experience', 'yearsofexperience'],
        
        // Demographics (EEO)
        gender: ['gender', 'sex'],
        hispanicLatino: ['hispanic', 'latino', 'latina', 'latinx', 'ethnicity'],
        race: ['race', 'racial', 'ethnic'],
        veteran: ['veteran', 'military', 'armed', 'service'],
        disability: ['disability', 'disabled', 'accommodation', 'condition']
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
            'linkedin': 'linkedinUrl',
            'linkedinUrl': 'linkedinUrl',
            'github': 'githubUrl',
            'githubUrl': 'githubUrl',
            'website': 'websiteUrl',
            'websiteUrl': 'websiteUrl',
            'portfolio': 'portfolioUrl',
            'hispanicLatino': 'hispanicLatino',
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