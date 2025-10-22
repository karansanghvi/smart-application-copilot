const Profile = require('../models/Profile');
const { validationResult } = require('express-validator');

// Create new profile
exports.createProfile = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        
        console.log('Received request body:', req.body);
        console.log('Received files:', req.files);
        
        // Check if email already exists
        const existingProfile = await Profile.findByEmail(req.body.email);
        if (existingProfile) {
            return res.status(409).json({ 
                error: 'Email already registered' 
            });
        }
        
        // Parse JSON strings from FormData
        let additionalExperiences = [];
        let skills = [];
        
        try {
            if (req.body.additionalExperiences) {
                additionalExperiences = typeof req.body.additionalExperiences === 'string' 
                    ? JSON.parse(req.body.additionalExperiences) 
                    : req.body.additionalExperiences;
            }
        } catch (e) {
            console.error('Error parsing additionalExperiences:', e);
        }
        
        try {
            if (req.body.skills) {
                skills = typeof req.body.skills === 'string' 
                    ? JSON.parse(req.body.skills) 
                    : req.body.skills;
            }
        } catch (e) {
            console.error('Error parsing skills:', e);
        }
        
        // Filter out invalid experiences (must have required fields)
        const validExperiences = additionalExperiences.filter(exp => 
            exp && exp.jobTitle && exp.companyName && exp.startDate
        );
        
        console.log('Valid additional experiences:', validExperiences);
        console.log('Skills:', skills);
        
        // Handle file uploads if present
        const profileData = {
            ...req.body,
            additionalExperiences: validExperiences,
            skills: skills,
            resumeFilename: req.files?.resume?.[0]?.filename,
            resumePath: req.files?.resume?.[0]?.path,
            coverLetterFilename: req.files?.coverLetter?.[0]?.filename,
            coverLetterPath: req.files?.coverLetter?.[0]?.path
        };
        
        console.log('Prepared profile data:', profileData);
        
        const result = await Profile.create(profileData);
        
        res.status(201).json({
            success: true,
            message: 'Profile created successfully',
            data: result
        });
        
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ 
            error: 'Failed to create profile',
            message: error.message 
        });
    }
};

// Get profile by ID
exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById(id);
        
        if (!profile) {
            return res.status(404).json({ 
                error: 'Profile not found' 
            });
        }
        
        res.json({
            success: true,
            data: profile
        });
        
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ 
            error: 'Failed to fetch profile',
            message: error.message 
        });
    }
};

// Get all profiles
exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.findAll();
        
        res.json({
            success: true,
            count: profiles.length,
            data: profiles
        });
        
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ 
            error: 'Failed to fetch profiles',
            message: error.message 
        });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }
        
        const result = await Profile.update(id, req.body);
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: result
        });
        
    } catch (error) {
        console.error('Error updating profile:', error);
        
        if (error.message === 'Profile not found') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to update profile',
            message: error.message 
        });
    }
};

// Delete profile
exports.deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        await Profile.delete(id);
        
        res.json({
            success: true,
            message: 'Profile deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting profile:', error);
        
        if (error.message === 'Profile not found') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to delete profile',
            message: error.message 
        });
    }
};