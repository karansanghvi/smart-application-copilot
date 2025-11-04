// backend/routes/autofill.js 

const express = require('express');
const router = express.Router();

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

module.exports= router;