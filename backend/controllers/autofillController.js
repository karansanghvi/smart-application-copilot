// autofillController.js

const axios = require('axios');
const Profile = require('../models/Profile');
const { 
    getFieldValue: extractFieldValue,
    getMultipleFieldValues: extractMultipleFieldValues 
} = require('../utils/profileMapper');

// Python AI service URL 
const AI_SERVICE_URL = "http://127.0.0.1:5000";

/**
 * Get autofill value for a single form field 
 * This is the main endpoint the Chrome extension will use 
 * 
 * Flow:
 * 1) Receive form field label from extension
 * 2) Call AI service to match field names 
 * 3) Query database for user profile 
 * 4) Extract the specific field value 
 * 5) Return everything to the extension 
 */
const getFieldValue = async (req, res) => {
    try {
        const { userId, formFieldLabel } = req.body;

        // Validate input 
        if (!userId || !formFieldLabel) {
            return res.status(400).json({
                success: false,
                error: 'userId and formFieldLabel are required',
                example: {
                    userId: 2,
                    formFieldLabel: 'What is your first name?'
                }
            });
        }

        console.log(`🔍 Autofill request for user ${userId}: "${formFieldLabel}"`);

        // Step 1: Call AI service to match field name 
        let matchedField = null;
        let confidence = 0;

        try {
            const aiResponse = await axios.post(`${AI_SERVICE_URL}/match`, {
                formFieldLabel: formFieldLabel
            }, {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            matchedField = aiResponse.data.matched_field;
            confidence = aiResponse.data.confidence;

            console.log(`🤖 AI matched: "${matchedField}" (${(confidence * 100).toFixed(2)}%)`);
        } catch (aiError) {
            console.error('❌ AI service error:', aiError.message);
            return res.status(503).json({
                success: false,
                error: 'AI service unavailable',
                message: 'Unable to match form field. Please ensure AI service is running.'
            });
        }

        // If no confident match found, return early 
        if (!matchedField) {
            return res.status(200).json({
                success: true,
                matched: false,
                message: 'No confident match found for this field',
                data: {
                    formFieldLabel: formFieldLabel,
                    matched_field: null,
                    value: null,
                    confidence: confidence
                }
            });
        }

        // Step 2: Query database for user profile 
        let profile = null;
        try {
            profile = await Profile.findById(userId);

            if (!profile) {
                return res.status(404).json({
                    success: false,
                    error: 'Profile not found',
                    message: `No profile found for user ID ${userId}`
                });
            }

            console.log(`📊 Profile loaded for user ${userId}`);
        } catch (dbError) {
            console.error('❌ Database error:', dbError.message);
            return res.status(500).json({
                success: false,
                error: 'Database error',
                message: 'Unable to fetch user profile'
            });
        }

        // Step 3: Extract the specific field value 
        const fieldValue = extractFieldValue(matchedField, profile);

        console.log(`✅ Field value: ${fieldValue || '(empty)'}`);

        // Step 4: Return complete response 
        return res.status(200).json({
            success: true,
            matched: true,
            data: {
                formFieldLabel: formFieldLabel,
                matched_field: matchedField,
                value: fieldValue,
                confidence: confidence,
                has_value: fieldValue !== null
            }
        });
    } catch (error) {
        console.error('❌ Error in getFieldValue:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Failed to get autofill value',
            message: error.message
        });
    }
};

/**
 * Get autofill values for multiple form fields at once 
 * Useful for filling entire forms 
 * Uses batch processing for better performance
 */
const getMultipleFieldValues = async (req, res) => {
    try {
        const { userId, formFields } = req.body;

        // Validate input 
        if (!userId || !formFields || !Array.isArray(formFields) || formFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'userId and formFields array are required',
                example: {
                    userId: 1,
                    formFields: [
                        'What is your first name?',
                        'Enter email address',
                        'Phone number'
                    ]
                }
            });
        }

        console.log(`🔍 Batch autofill request for user ${userId}: ${formFields.length} fields`);

        // Step 1: Get user profile with additional data (education, work_experiences, projects)
        const profile = await Profile.findById(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found',
                message: `No profile found for user ID ${userId}`
            });
        }

        // Log additional data availability
        console.log(`📊 Profile loaded for user ${userId}:`);
        console.log(`   - Additional Education Entries: ${profile.education?.length || 0}`);
        console.log(`   - Additional Work Experiences: ${profile.work_experiences?.length || 0}`);
        console.log(`   - Additional Projects: ${profile.projects?.length || 0}`);

        // Step 2: Call AI service with batch endpoint (all fields at once)
        let aiResults;
        try {
            const response = await axios.post(`${AI_SERVICE_URL}/match-batch`, {
                formFieldLabels: formFields  // Send all fields at once
            }, {
                timeout: 80000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            aiResults = response.data.results;
            console.log(`🤖 AI batch processing completed: ${aiResults.length} fields processed`);
        } catch (aiError) {
            console.error('❌ AI batch service error:', aiError.message);
            return res.status(503).json({
                success: false,
                error: 'AI service unavailable',
                message: 'Unable to match form fields. Please ensure AI service is running.'
            });
        }

        // Step 3: Process batch results and extract values from profile
        // This includes both primary and additional entries
        const results = aiResults.map((aiResult, index) => {
            const matchedField = aiResult.matched_field;
            const confidence = aiResult.confidence;
            
            if (!matchedField || aiResult.status !== 'success') {
                return {
                    formFieldLabel: formFields[index],
                    matched_field: null,
                    value: null,
                    confidence: confidence || 0,
                    has_value: false,
                    status: 'no_match',
                    field_type: 'unknown'
                };
            }
            
            // Extract value (handles both primary and additional entries)
            const value = extractFieldValue(matchedField, profile);
            
            // Determine field type and format value appropriately
            let displayValue = value;
            let fieldType = 'simple';
            let rawValue = value;
            
            // Check if this is a complex object (additional education/work/project)
            if (value && typeof value === 'object') {
                fieldType = 'complex';
                
                // Format education entries
                if (value.university_name) {
                    displayValue = `${value.degree || 'Degree'} in ${value.field_of_study || 'N/A'} from ${value.university_name}`;
                    if (value.education_start_date && value.education_end_date) {
                        displayValue += ` (${value.education_start_date} - ${value.education_end_date})`;
                    }
                    fieldType = 'education';
                } 
                // Format work experience entries
                else if (value.job_title && value.company_name) {
                    displayValue = `${value.job_title} at ${value.company_name}`;
                    if (value.start_date) {
                        const endDate = value.currently_working === 'Yes' ? 'Present' : (value.end_date || 'N/A');
                        displayValue += ` (${value.start_date} - ${endDate})`;
                    }
                    fieldType = 'work_experience';
                } 
                // Format project entries
                else if (value.project_title) {
                    displayValue = value.project_title;
                    fieldType = 'project';
                }
            }
            
            const hasValue = value !== null && value !== undefined && value !== '';
            
            // Log matching details for debugging
            if (hasValue) {
                console.log(`   ✅ Matched: "${formFields[index]}" → ${matchedField} (${(confidence * 100).toFixed(1)}%)`);
                if (fieldType !== 'simple') {
                    console.log(`      Type: ${fieldType} | Value: ${displayValue}`);
                }
            }
            
            return {
                formFieldLabel: formFields[index],
                matched_field: matchedField,
                value: displayValue,
                raw_value: rawValue,  // Include raw object for complex field handling
                confidence: confidence,
                has_value: hasValue,
                field_type: fieldType,
                status: 'success'
            };
        });

        // Count different types of matches
        const successfulMatches = results.filter(r => r.matched_field && r.has_value).length;
        const additionalMatches = results.filter(r => 
            r.has_value && ['education', 'work_experience', 'project'].includes(r.field_type)
        ).length;

        console.log(`✅ Completed: ${successfulMatches}/${formFields.length} fields matched with values`);
        console.log(`   - Primary fields: ${successfulMatches - additionalMatches}`);
        console.log(`   - Additional entries: ${additionalMatches}`);

        return res.status(200).json({
            success: true,
            data: {
                results: results,
                total: formFields.length,
                matched: results.filter(r => r.matched_field).length,
                with_values: successfulMatches,
                additional_entries_used: additionalMatches,
                breakdown: {
                    primary_fields: successfulMatches - additionalMatches,
                    additional_education: results.filter(r => r.field_type === 'education').length,
                    additional_work: results.filter(r => r.field_type === 'work_experience').length,
                    additional_projects: results.filter(r => r.field_type === 'project').length
                }
            }
        });
    } catch (error) {
        console.error('❌ Error in getMultipleFieldValues:', error.message);
        return res.status(500).json({
            success: false,
            error: 'Failed to get autofill values',
            message: error.message
        });
    }
};

module.exports = {
    getFieldValue,
    getMultipleFieldValues
};