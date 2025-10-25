/**
 * Maps AI-matched field names to actual profile data values
 * This handles the translation between database field names and their values
 */

/**
 * Extract value from profile object based on matched field name
 */
const getFieldValue = (fieldName, profile) => {
    if (!profile || !fieldName) {
        return null;
    }

    const fieldMap = {
        // Personal Information
        'first_name': profile.first_name,
        'middle_name': profile.middle_name,
        'last_name': profile.last_name,
        'email': profile.email,
        'phone': profile.phone,
        
        // Address
        'address_line_1': profile.address_line_1,
        'address_line_2': profile.address_line_2,
        'city': profile.city,
        'state': profile.state,
        'country': profile.country,
        'zip_code': profile.zip_code,
        
        // Work Experience (Primary)
        'job_title': profile.job_title,
        'company_name': profile.company_name,
        'start_date': profile.start_date,
        'end_date': profile.end_date,
        'currently_working': profile.currently_working ? 'Yes' : 'No',
        'professional_summary': profile.professional_summary,
        
        // Social Links
        'linkedin_url': profile.linkedin_url,
        'github_url': profile.github_url,
        'website_url': profile.website_url,
        
        // Job Preferences
        'work_type': profile.work_type,
        'expected_salary': profile.expected_salary,
        'preferred_locations': profile.preferred_locations,
        'work_authorized': profile.work_authorized ? 'Yes' : 'No',
        'visa_sponsorship_required': profile.visa_sponsorship_required ? 'Yes' : 'No',
        'visa_sponsorship_type': profile.visa_sponsorship_type,
        
        // Demographic Information
        'gender': profile.gender,
        'hispanic_latino': profile.hispanic_latino,
        'race': profile.race,
        'veteran_status': profile.veteran_status,
        'disability_status': profile.disability_status,
        
        // File Information
        'resume_filename': profile.resume_filename,
        'resume_path': profile.resume_path,
        'cover_letter_filename': profile.cover_letter_filename,
        'cover_letter_path': profile.cover_letter_path
    };

    const value = fieldMap[fieldName];
    
    return value !== undefined && value !== null && value !== '' ? value : null;
};

// Get multiple field values at once
const getMultipleFieldValues = (matchedFields, profile) => {
    return matchedFields.map(fieldName => ({
        field: fieldName,
        value: getFieldValue(fieldName, profile)
    }));
};

// Check if profile has value for a given field
const hasFieldValue = (fieldName, profile) => {
    const value = getFieldValue(fieldName, profile);
    return value !== null;
};

module.exports = {
    getFieldValue,
    getMultipleFieldValues,
    hasFieldValue
};