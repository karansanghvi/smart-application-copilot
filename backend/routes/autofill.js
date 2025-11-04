// backend/routes/autofill.js 

const express = require('express');
const router = express.Router();

// Import Profile model - ADD THIS LINE
const Profile = require('../models/Profile');

// AI Match Controller 
const {
    matchFields,
    matchMultipleFields,
    checkAIServiceHealth 
} = require('../controllers/aiMatcherController');

// Autofill Controller (combines AI + Database)
const {
    getFieldValue,
    getMultipleFieldValues
} = require('../controllers/autofillController');

// Match a single form field label to a profile field using AI 
router.post('/match-fields', matchFields);

// Match multiple form field labels at once 
router.post('/match-multiple', matchMultipleFields);

router.get('/ai-health', checkAIServiceHealth);

// ====================================
// Complete Autofill (AI + Database)
// ====================================

// Get autofill value for a single form field 
router.post('/get-field-value', getFieldValue);

// Get autofill values for multiple form fields at once 
router.post('/get-multiple-values', getMultipleFieldValues);

// ====================================
// Test Endpoint
// ====================================

// Test endpoint to see all available fields for a user
router.get('/test-fields/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log(`📋 Testing fields for user ID: ${userId}`);
        
        const profile = await Profile.findById(userId);
        
        if (!profile) {
            return res.status(404).json({ 
                success: false,
                error: 'Profile not found' 
            });
        }
        
        console.log(`✅ Profile found for user ${userId}`);
        console.log(`   - Additional Education: ${profile.education?.length || 0}`);
        console.log(`   - Additional Work Experiences: ${profile.work_experiences?.length || 0}`);
        console.log(`   - Additional Projects: ${profile.projects?.length || 0}`);
        
        const { getAllAvailableFields } = require('../utils/profileMapper');
        const allFields = getAllAvailableFields(profile);
        
        console.log(`📊 Total fields available: ${Object.keys(allFields).length}`);
        
        res.json({
            success: true,
            userId: userId,
            totalFields: Object.keys(allFields).length,
            summary: {
                primary: {
                    education: profile.university_name ? `${profile.university_name} - ${profile.degree}` : 'None',
                    work: profile.job_title ? `${profile.job_title} at ${profile.company_name}` : 'None',
                    project: profile.project_title || 'None'
                },
                additional: {
                    education: profile.education?.length || 0,
                    work_experiences: profile.work_experiences?.length || 0,
                    projects: profile.projects?.length || 0
                }
            },
            fields: allFields
        });
    } catch (error) {
        console.error('❌ Error in test-fields:', error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;