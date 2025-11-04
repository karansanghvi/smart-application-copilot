// aiMatchController.js

const axios = require('axios');

// Python AI service URL
const AI_SERVICE_URL = "http://127.0.0.1:5000";

/**
 * Match form fields to profile fields using AI
 * This forwards requests to the Python AI service 
 */
const matchFields = async (req, res) => {
    try {
        const { formFieldLabel } = req.body;

        // Validate input 
        if (!formFieldLabel) {
            return res.status(400).json({
                success: false,
                error: 'formFieldLabel is required',
                example: {
                    formFieldLabel: 'What is your first name?'
                }
            });
        }

        console.log(`🔍 Matching field: "${formFieldLabel}"`);

        // Forward request to Python AI service 
        const aiResponse = await axios.post(`${AI_SERVICE_URL}/match`, {
            formFieldLabel: formFieldLabel
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Extract the result from Python service
        const matchResult = aiResponse.data;

        console.log(`✅ Match result: ${matchResult.matched_field || 'no match'} (${(matchResult.confidence * 100).toFixed(2)}%)`);

        // Return the match result to the extension 
        return res.status(200).json({
            success: true,
            data: {
                matched_field: matchResult.matched_field,
                confidence: matchResult.confidence,
                status: matchResult.status,
                message: matchResult.message || null
            }
        });

    } catch (error) {
        console.error('❌ Error in matchFields:', error.message);

        // Handle specific error cases 
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'AI service is not running',
                message: 'Please start the Python AI service on port 5000'
            });
        }

        if (error.response) {
            // Python service returned an error 
            return res.status(error.response.status).json({
                success: false,
                error: 'AI service error',
                details: error.response.data
            });
        }

        // Generic error 
        return res.status(500).json({
            success: false,
            error: 'Failed to match form field',
            message: error.message
        });
    }
};

/**
 * Batch match multiple form fields at once 
 * Useful for autofilling entire forms 
 */
const matchMultipleFields = async (req, res) => {
    try {
        const { formFields } = req.body;

        // Validate input 
        if (!formFields || !Array.isArray(formFields) || formFields.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'formFields array is required',
                example: {
                    formFields: [
                        'What is your first name?',
                        'Enter your email address',
                        'Phone number'
                    ]
                }
            });
        }

        console.log(`🔍 Matching ${formFields.length} fields...`);

        // Match all fields in parallel 
        const matchPromises = formFields.map(async (label) => {
            try {
                const response = await axios.post(`${AI_SERVICE_URL}/match`, {  // ✅ FIXED: Changed from PUT to POST
                    formFieldLabel: label
                }, {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                return {
                    formFieldLabel: label,
                    matched_field: response.data.matched_field,
                    confidence: response.data.confidence,
                    status: response.data.status
                };
            } catch (error) {
                console.error(`Error matching "${label}":`, error.message);
                return {
                    formFieldLabel: label,
                    matched_field: null,
                    confidence: 0,
                    status: 'error',
                    error: error.message
                };
            }
        });

        const results = await Promise.all(matchPromises);

        console.log(`✅ Matched ${results.filter(r => r.matched_field).length}/${formFields.length} fields`);

        return res.status(200).json({
            success: true,
            data: {
                matches: results,
                total: formFields.length,
                successful: results.filter(r => r.matched_field).length
            }
        });

    } catch (error) {
        console.error('❌ Error in matchMultipleFields:', error.message);

        return res.status(500).json({
            success: false,
            error: 'Failed to match form fields',
            message: error.message
        });
    }
};

/**
 * Health check for AI service connectivity 
 */
const checkAIServiceHealth = async (req, res) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/health`, {
            timeout: 5000
        });

        return res.status(200).json({
            success: true,
            ai_service: response.data,
            message: 'AI service is running and ready'
        });

    } catch (error) {
        console.error('❌ AI service health check failed:', error.message);

        return res.status(503).json({
            success: false,
            error: 'AI service is not available',  // ✅ FIXED: Correct error message
            message: 'Please ensure Python AI service is running on port 5000'
        });
    } 
};

module.exports = {
    matchFields,
    matchMultipleFields,
    checkAIServiceHealth
};