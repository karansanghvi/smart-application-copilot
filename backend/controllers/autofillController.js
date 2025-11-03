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
                timeout: 10000,
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

        // Step 1: Get user profile once (reuse for all fields)
        const profile = await Profile.findById(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found',
                message: `No profile found for user ID ${userId}`
            });
        }

        // Step 2: Match all fields with AI in parallel 
        const matchPromises = formFields.map(async (label) => {
            try {
                const response = await axios.post(`${AI_SERVICE_URL}/match`, {
                    formFieldLabel: label
                }, {
                    timeout: 30000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log(`🔍 AI Response for "${label}":`, response.data);

                const matchedField = response.data.matched_field;  
                const confidence = response.data.confidence;       

                // IMPORTANT: Check if match was successful
                if (!matchedField || response.data.status !== 'success') {
                    return {
                        formFieldLabel: label,
                        matched_field: null,
                        value: null,
                        confidence: confidence || 0,
                        has_value: false,
                        status: 'no_match'
                    };
                }

                // Get value from profile if match found 
                const value = extractFieldValue(matchedField, profile);

                return {
                    formFieldLabel: label,
                    matched_field: matchedField,
                    value: value,
                    confidence: confidence,
                    has_value: value !== null && value !== undefined && value !== '',
                    status: 'success'
                };
            } catch (error) {
                console.error(`❌ Error processing "${label}":`, error.message);
                return {
                    formFieldLabel: label,
                    matched_field: null,
                    value: null,
                    confidence: 0,
                    has_value: false,
                    status: 'error',
                    error: error.message
                };
            }
        });

        const results = await Promise.all(matchPromises);

        const successfulMatches = results.filter(r => r.matched_field && r.has_value).length;

        console.log(`✅ Completed: ${successfulMatches}/${formFields.length} fields matched with values`);

        return res.status(200).json({
            success: true,
            data: {
                results: results,
                total: formFields.length,
                matched: results.filter(r => r.matched_field).length,
                with_values: successfulMatches
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