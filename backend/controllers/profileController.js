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

// Get resume file
exports.getResume = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById(id);
        
        if (!profile) {
            return res.status(404).json({ 
                error: 'Profile not found' 
            });
        }
        
        if (!profile.resume_path || !profile.resume_filename) {
            return res.status(404).json({ 
                error: 'Resume not found for this profile' 
            });
        }
        
        // Check if file exists
        const fs = require('fs');
        if (!fs.existsSync(profile.resume_path)) {
            return res.status(404).json({ 
                error: 'Resume file not found on server' 
            });
        }
        
        // Send file
        res.download(profile.resume_path, profile.resume_filename, (err) => {
            if (err) {
                console.error('Error sending resume:', err);
                res.status(500).json({ 
                    error: 'Failed to download resume' 
                });
            }
        });
        
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ 
            error: 'Failed to fetch resume',
            message: error.message 
        });
    }
};

// Get cover letter file
exports.getCoverLetter = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById(id);
        
        if (!profile) {
            return res.status(404).json({ 
                error: 'Profile not found' 
            });
        }
        
        if (!profile.cover_letter_path || !profile.cover_letter_filename) {
            return res.status(404).json({ 
                error: 'Cover letter not found for this profile' 
            });
        }
        
        // Check if file exists
        const fs = require('fs');
        if (!fs.existsSync(profile.cover_letter_path)) {
            return res.status(404).json({ 
                error: 'Cover letter file not found on server' 
            });
        }
        
        // Send file
        res.download(profile.cover_letter_path, profile.cover_letter_filename, (err) => {
            if (err) {
                console.error('Error sending cover letter:', err);
                res.status(500).json({ 
                    error: 'Failed to download cover letter' 
                });
            }
        });
        
    } catch (error) {
        console.error('Error fetching cover letter:', error);
        res.status(500).json({ 
            error: 'Failed to fetch cover letter',
            message: error.message 
        });
    }
};

// Get file metadata (to check if files exist)
exports.getFileInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById(id);
        
        if (!profile) {
            return res.status(404).json({ 
                error: 'Profile not found' 
            });
        }
        
        const fs = require('fs');
        
        const fileInfo = {
            resume: {
                exists: false,
                filename: profile.resume_filename || null,
                path: profile.resume_path || null,
                fileExistsOnDisk: false
            },
            coverLetter: {
                exists: false,
                filename: profile.cover_letter_filename || null,
                path: profile.cover_letter_path || null,
                fileExistsOnDisk: false
            }
        };
        
        // Check resume
        if (profile.resume_path && profile.resume_filename) {
            fileInfo.resume.exists = true;
            fileInfo.resume.fileExistsOnDisk = fs.existsSync(profile.resume_path);
            
            if (fileInfo.resume.fileExistsOnDisk) {
                const stats = fs.statSync(profile.resume_path);
                fileInfo.resume.size = stats.size;
                fileInfo.resume.uploadedAt = stats.birthtime;
            }
        }
        
        // Check cover letter
        if (profile.cover_letter_path && profile.cover_letter_filename) {
            fileInfo.coverLetter.exists = true;
            fileInfo.coverLetter.fileExistsOnDisk = fs.existsSync(profile.cover_letter_path);
            
            if (fileInfo.coverLetter.fileExistsOnDisk) {
                const stats = fs.statSync(profile.cover_letter_path);
                fileInfo.coverLetter.size = stats.size;
                fileInfo.coverLetter.uploadedAt = stats.birthtime;
            }
        }
        
        res.json({
            success: true,
            data: fileInfo
        });
        
    } catch (error) {
        console.error('Error fetching file info:', error);
        res.status(500).json({ 
            error: 'Failed to fetch file information',
            message: error.message 
        });
    }
};
