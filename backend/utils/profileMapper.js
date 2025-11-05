// backend/utils/profileMapper.js
/**
 * Maps AI-matched field names to actual profile data values
 * This handles the translation between database field names and their values
 */

/**
 * Extract value from profile object based on matched field name
 * Now handles additional education, work experiences, and projects
 */
const getFieldValue = (fieldName, profile, index = 0) => {
    if (!profile || !fieldName) {
        return null;
    }

    // Check if this is requesting additional data (e.g., 'education_1', 'work_experience_2')
    const match = fieldName.match(/^(education|work_experience|project)_(\d+)$/);
    
    if (match) {
        const [, type, idx] = match;
        const arrayIndex = parseInt(idx);
        
        // Handle additional education
        if (type === 'education' && profile.education && profile.education[arrayIndex]) {
            const edu = profile.education[arrayIndex];
            return {
                university_name: edu.university_name,
                field_of_study: edu.field_of_study,
                education_start_date: edu.education_start_date,
                education_end_date: edu.education_end_date,
                degree: edu.degree
            };
        }
        
        // Handle additional work experiences
        if (type === 'work_experience' && profile.work_experiences && profile.work_experiences[arrayIndex]) {
            const exp = profile.work_experiences[arrayIndex];
            return {
                job_title: exp.job_title,
                company_name: exp.company_name,
                start_date: exp.start_date,
                end_date: exp.end_date,
                currently_working: exp.currently_working ? 'Yes' : 'No',
                job_description: exp.job_description
            };
        }
        
        // Handle additional projects
        if (type === 'project' && profile.projects && profile.projects[arrayIndex]) {
            const proj = profile.projects[arrayIndex];
            return {
                project_title: proj.project_title,
                project_summary: proj.project_summary
            };
        }
        
        return null;
    }

    // Original field mapping for primary data
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
        'zipcode': profile.zipcode,
        
        // Education (Primary/Current)
        'university_name': profile.university_name,
        'field_of_study': profile.field_of_study,
        'education_start_date': profile.education_start_date,
        'education_end_date': profile.education_end_date,
        'degree': profile.degree,
        
        // Work Experience (Primary/Current)
        'job_title': profile.job_title,
        'company_name': profile.company_name,
        'start_date': profile.start_date,
        'end_date': profile.end_date,
        'currently_working': profile.currently_working ? 'Yes' : 'No',
        'professional_summary': profile.professional_summary,

        // Projects
        'project_title': profile.project_title,
        'project_summary': profile.project_summary,
        
        // Social Links
        'linkedin_url': profile.linkedin_url,
        'github_url': profile.github_url,
        'website_url': profile.website_url,
        
        // Job Preferences
        'work_type': profile.work_type,
        'expected_salary': profile.expected_salary,
        'preferred_locations': profile.preferred_locations,
        'work_relocate': profile.work_relocate ? 'Yes' : 'No',
        'work_authorized': profile.work_authorized ? 'Yes' : 'No',
        'visa_sponsorship_required': profile.visa_spons_required ? 'Yes' : 'No',
        'visa_sponsorship_type': profile.visa_sponsorship_type,
        'restrictive_bond': profile.restrictive_bond ? 'Yes' : 'No',
        
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
        'cover_letter_path': profile.cover_letter_path,

        // File Information - Return file metadata
        'resume_filename': profile.resume_filename ? {
            filename: profile.resume_filename,
            path: profile.resume_path,
            type: 'resume',
            downloadUrl: `http://localhost:3000/api/profiles/${profile.id}/resume`
        } : null,
        
        'cover_letter_filename': profile.cover_letter_filename ? {
            filename: profile.cover_letter_filename,
            path: profile.cover_letter_path,
            type: 'cover_letter',
            downloadUrl: `http://localhost:3000/api/profiles/${profile.id}/cover-letter`
        } : null,
    };

    const value = fieldMap[fieldName];
    
    return value !== undefined && value !== null && value !== '' ? value : null;
};

/**
 * Get all available data including additional entries
 * This creates a flattened map of all available fields
 */
const getAllAvailableFields = (profile) => {
    const fields = {};
    
    // Add all primary fields
    const primaryFields = [
        'first_name', 'middle_name', 'last_name', 'email', 'phone',
        'address_line_1', 'address_line_2', 'city', 'state', 'country', 'zipcode',
        'university_name', 'field_of_study', 'education_start_date', 'education_end_date', 'degree',
        'job_title', 'company_name', 'start_date', 'end_date', 'currently_working', 'professional_summary',
        'project_title', 'project_summary',
        'linkedin_url', 'github_url', 'website_url',
        'work_type', 'expected_salary', 'preferred_locations',
        'work_relocate', 'work_authorized', 'visa_sponsorship_required', 'visa_sponsorship_type', 'restrictive_bond',
        'gender', 'hispanic_latino', 'race', 'veteran_status', 'disability_status'
    ];
    
    primaryFields.forEach(field => {
        const value = getFieldValue(field, profile);
        if (value !== null) {
            fields[field] = value;
        }
    });
    
    // Add additional education
    if (profile.education && profile.education.length > 0) {
        profile.education.forEach((edu, index) => {
            fields[`education_${index}`] = {
                university_name: edu.university_name,
                field_of_study: edu.field_of_study,
                education_start_date: edu.education_start_date,
                education_end_date: edu.education_end_date,
                degree: edu.degree
            };
        });
    }
    
    // Add additional work experiences
    if (profile.work_experiences && profile.work_experiences.length > 0) {
        profile.work_experiences.forEach((exp, index) => {
            fields[`work_experience_${index}`] = {
                job_title: exp.job_title,
                company_name: exp.company_name,
                start_date: exp.start_date,
                end_date: exp.end_date,
                currently_working: exp.currently_working ? 'Yes' : 'No',
                job_description: exp.job_description
            };
        });
    }
    
    // Add additional projects
    if (profile.projects && profile.projects.length > 0) {
        profile.projects.forEach((proj, index) => {
            fields[`project_${index}`] = {
                project_title: proj.project_title,
                project_summary: proj.project_summary
            };
        });
    }
    
    return fields;
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
    hasFieldValue,
    getAllAvailableFields
};