const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const profileController = require('../controllers/profileController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// Validation middleware
const validateProfile = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('addressOne').trim().notEmpty().withMessage('Address is required'),
    body('zipCode').trim().notEmpty().withMessage('Zip Code is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('professionalSummary').trim().notEmpty().withMessage('Professional summary is required'),
    body('universityName').trim().notEmpty().withMessage('University Name required'),
    body('fieldOfStudy').trim().notEmpty().withMessage('Field Of Study Is Required'),
    body('educationStartDate').isISO8601().withMessage('Valid start date is required'),
    body('educationEndDate').optional().isISO8601().withMessage('Valid end date required'),
    body('degree').trim().notEmpty().withMessage('Degree is required')
];

const validateProfileUpdate = [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
    body('addressOne').optional().trim().notEmpty().withMessage('Address cannot be empty'),
    body('zipCode').optional().trim().notEmpty().withMessage('Zip Code cannot be empty'),
    body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
    body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
    body('country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
    body('jobTitle').optional().trim().notEmpty().withMessage('Job title cannot be empty'),
    body('companyName').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
    body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    body('professionalSummary').optional().trim().notEmpty().withMessage('Professional summary cannot be empty'),
    body('universityName').optional().trim().notEmpty().withMessage('University Name required'),
    body('fieldOfStudy').optional().trim().notEmpty().withMessage('Field Of Study Is Required'),
    body('educationStartDate').optional().isISO8601().withMessage('Valid start date is required'),
    body('educationEndDate').optional().isISO8601().withMessage('Valid end date is required'),
    body('degree').optional().trim().notEmpty().withMessage('Degree is required')
];

const skipValidationForFileUpload = (req, res, next) => {
    if (req.files && (req.files.resume || req.files.coverLetter)) {
        console.log('📁 File upload detected, skipping validation');
        return next();
    }
    return validateProfileUpdate[0](req, res, (err) => {
        if (err) return next(err);
        let index = 1;
        const runValidation = () => {
            if (index >= validateProfileUpdate.length) return next();
            validateProfileUpdate[index](req, res, (err) => {
                if (err) return next(err);
                index++;
                runValidation();
            });
        };
        runValidation();
    });
};

// Profile CRUD routes
router.post(
    '/',
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 }
    ]),
    validateProfile,
    profileController.createProfile
);

router.get('/', profileController.getAllProfiles);
router.get('/:id/autofill', profileController.getAutofillData);
router.get('/:id/files', profileController.getFileInfo);
router.get('/:id/resume', profileController.getResume);
router.get('/:id/cover-letter', profileController.getCoverLetter);
router.get('/:id', profileController.getProfile);

router.put(
    '/:id',
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 }
    ]),
    skipValidationForFileUpload,  
    profileController.updateProfile
);

router.put(
    '/:id/files',
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 }
    ]),
    profileController.updateFiles
);

router.delete('/:id', profileController.deleteProfile);

// Education routes
router.get('/:id/education', profileController.getEducation);
router.put('/:id/education/primary', profileController.updatePrimaryEducation);
router.post('/:id/education/additional', profileController.addAdditionalEducation);
router.put('/:id/education/additional/:eduIndex', profileController.updateAdditionalEducation);
router.delete('/:id/education/additional/:eduIndex', profileController.deleteAdditionalEducation);

// Project routes
router.get('/:id/projects', profileController.getProjects);
router.put('/:id/projects/primary', profileController.updatePrimaryProject);
router.post('/:id/projects/additional', profileController.addAdditionalProject);
router.put('/:id/projects/additional/:projIndex', profileController.updateAdditionalProject);
router.delete('/:id/projects/additional/:projIndex', profileController.deleteAdditionalProject);

module.exports = router;