// backend/controllers/profileController.js

const { error, profileEnd } = require('console');
const Profile = require('../models/Profile');
const { validationResult } = require('express-validator');
const { query } = require('../conifg/database'); 

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
        let additionalEducation = [];
        let additionalProject = [];
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
            if (req.body.additionalEducation) {
                additionalEducation = typeof req.body.additionalEducation === 'string' 
                    ? JSON.parse(req.body.additionalEducation) 
                    : req.body.additionalEducation;
            }
        } catch (e) {
            console.error('Error parsing additionalEducation:', e);
        }

        try {
            if (req.body.additionalProject) {
                additionalProject = typeof req.body.additionalProject === 'string' 
                    ? JSON.parse(req.body.additionalProject) 
                    : req.body.additionalProject;
            }
        } catch (e) {
            console.error('Error parsing additionalProject:', e);
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
        
        // Filter out invalid education (must have required fields)
        const validEducation = additionalEducation.filter(edu => 
            edu && edu.universityName && edu.fieldOfStudy && edu.educationStartDate && edu.degree
        );

        const validProject = additionalProject.filter(proj => 
            proj && proj.projectTitle && proj.projectSummary 
        );
        
        console.log('Valid additional experiences:', validExperiences);
        console.log('Valid additional education:', validEducation);
        console.log('Valid additional projectsL:', validProject);
        console.log('Skills:', skills);
        
        // Handle file uploads if present
        const profileData = {
            ...req.body,
            additionalExperiences: validExperiences,
            additionalEducation: validEducation,
            additionalProject: validProject,
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
        
        // Parse JSON strings if they exist
        let additionalExperiences = [];
        let additionalEducation = [];
        let additionalProject = [];
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
            if (req.body.additionalEducation) {
                additionalEducation = typeof req.body.additionalEducation === 'string' 
                    ? JSON.parse(req.body.additionalEducation) 
                    : req.body.additionalEducation;
            }
        } catch (e) {
            console.error('Error parsing additionalEducation:', e);
        }

        try {
            if (req.body.additionalProject) {
                additionalProject = typeof req.body.additionalProject === 'string' 
                    ? JSON.parse(req.body.additionalProject) 
                    : req.body.additionalProject;
            }
        } catch (e) {
            console.error('Error parsing additionalProject:', e);
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
        
        // Prepare update data
        const updateData = {
            ...req.body,
            additionalExperiences,
            additionalEducation,
            additionalProject,
            skills
        };
        
        // Add new file paths if files were uploaded
        if (req.files?.resume?.[0]) {
            updateData.resumeFilename = req.files.resume[0].filename;
            updateData.resumePath = req.files.resume[0].path;
        }
        
        if (req.files?.coverLetter?.[0]) {
            updateData.coverLetterFilename = req.files.coverLetter[0].filename;
            updateData.coverLetterPath = req.files.coverLetter[0].path;
        }
        
        const result = await Profile.update(id, updateData);
        
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

// Update files only
exports.updateFiles = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('📁 Updating files for profile:', id);
        console.log('📄 Received files:', req.files);
        
        const updateData = {};
        
        if (req.files?.resume?.[0]) {
            updateData.resumeFilename = req.files.resume[0].filename;
            updateData.resumePath = req.files.resume[0].path;
            console.log('✅ New resume uploaded:', req.files.resume[0].filename);
        }
        
        if (req.files?.coverLetter?.[0]) {
            updateData.coverLetterFilename = req.files.coverLetter[0].filename;
            updateData.coverLetterPath = req.files.coverLetter[0].path;
            console.log('✅ New cover letter uploaded:', req.files.coverLetter[0].filename);
        }
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: 'No files provided'
            });
        }
        
        const result = await Profile.update(id, updateData);
        
        res.json({
            success: true,
            message: 'Files updated successfully',
            data: result
        });
        
    } catch (error) {
        console.error('Error updating files:', error);
        
        if (error.message === 'Profile not found') {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to update files',
            message: error.message 
        });
    }
};

// Get profile data formatted for autofill
exports.getAutofillData = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById(id);

        if (!profile) {
            return res.status(404).json({
                error: 'Profile not found'
            });
        }

        // Format data for autofill 
        const autofillData = {
            // Personal Information
            firstName: profile.first_name || '',
            middleName: profile.middle_name || '',
            lastName: profile.last_name || '',
            email: profile.email || '',
            phone: profile.phone || '',

            // Address
            addressOne: profile.address_line_1 || '',
            addressTwo: profile.address_line_2 || '',
            zipCode: profile.zip_code || '',
            city: profile.city || '',
            state: profile.state || '',
            country: profile.country || '',

            // Primary Education
            universityName: profile.university_name || '',
            fieldOfStudy: profile.field_of_study || '',
            educationStartDate: profile.education_start_date || '',
            educationEndDate: profile.education_end_date || '',
            degree: profile.degree || '',

            // Additional Education
            additionalEducation: profile.education ? profile.education.map(edu => ({
                universityName: edu.university_name,
                fieldOfStudy: edu.field_of_study,
                educationStartDate: edu.education_start_date,
                educationEndDate: edu.education_end_date,
                degree: edu.degree
            })) : [],

            // Primary Work Experience
            jobTitle: profile.job_title || '',
            companyName: profile.company_name || '',
            startDate: profile.start_date || '',
            endDate: profile.end_date || '',
            currentlyWorking: profile.currently_working || false,
            professionalSummary: profile.professional_summary || '',

            // Additional Work Experiences
            additionalExperiences: profile.work_experiences ? profile.work_experiences.map(exp => ({
                jobTitle: exp.job_title,
                companyName: exp.company_name,
                startDate: exp.start_date,
                endDate: exp.end_date,
                currentlyWorking: exp.currently_working,
                jobDescription: exp.job_description
            })) : [],

            // Primary Project 
            projectTitle: profile.project_title || '',
            projectSummary: profile.project_summary || '',

            // Additional Projects 
            additionalProjects: profile.projects ? profile.projects.map(proj => ({
                projectTitle: proj.project_title,
                projectSummary: proj.project_summary
            })) : [],

            // Skills
            skills: profile.skills || [],

            // Social Links
            linkedIn: profile.linkedin_url || '',
            github: profile.github_url || '',
            website: profile.website_url || '',

            // Job Preferences
            workType: profile.work_type || '',
            expectedSalary: profile.expected_salary || '',
            preferredLocations: profile.preferred_locations || '',
            
            // Work Authorization
            authorized: profile.work_authorized || '',
            relocate: profile.work_relocate || '',
            sponsorship: profile.visa_sponsorship_required || '',
            visaSponsorship: profile.visa_sponsorship_type || '',
            restrictiveBond: profile.restrictive_bond || '',

            // Additional Information
            gender: profile.gender || '',
            hispanicLatino: profile.hispanic_latino || '',
            race: profile.race || '',
            veteran: profile.veteran_status || '',
            disability: profile.disability_status || '',

            // File Information 
            hasResume: !!(profile.resume_path && profile.resume_filename),
            hasCoverLetter: !!(profile.cover_letter_path && profile.cover_letter_filename)
        };

        res.json({
            success: true,
            data: autofillData
        });
    } catch (error) {
        console.error("Error fetching autofill data:", error);
        res.status(500).json({
            error: "Failed to fetch autofill data",
            message: error.message
        });
    }
};

// Get education data
exports.getEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const { query } = require('../conifg/database');
        
        // Get primary education from user_profiles table
        const profileResult = await query(
            'SELECT university_name, field_of_study, education_start_date, education_end_date, degree FROM user_profiles WHERE id = $1',
            [id]
        );
        
        if (profileResult.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        // Get additional education from education table (excluding primary)
        const educationResult = await query(
            `SELECT id, university_name, field_of_study, education_start_date, education_end_date, degree 
             FROM education 
             WHERE user_profile_id = $1 
             AND (is_primary = false OR is_primary IS NULL)
             ORDER BY education_start_date DESC`,
            [id]
        );
        
        res.json({
            success: true,
            data: {
                primary: {
                    universityName: profileResult.rows[0].university_name,
                    fieldOfStudy: profileResult.rows[0].field_of_study,
                    startDate: profileResult.rows[0].education_start_date,
                    endDate: profileResult.rows[0].education_end_date,
                    degree: profileResult.rows[0].degree
                },
                additional: educationResult.rows.map(edu => ({
                    id: edu.id,
                    universityName: edu.university_name,
                    fieldOfStudy: edu.field_of_study,
                    startDate: edu.education_start_date,
                    endDate: edu.education_end_date,
                    degree: edu.degree
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching education:', error);
        res.status(500).json({ 
            error: 'Failed to fetch education data',
            message: error.message 
        });
    }
};

// Update primary education
exports.updatePrimaryEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const { universityName, fieldOfStudy, startDate, endDate, degree } = req.body;
        const { query } = require('../conifg/database');
        
        console.log('Updating primary education for profile:', id);
        console.log('Data:', { universityName, fieldOfStudy, startDate, endDate, degree });
        
        // Update in user_profiles table
        const profileResult = await query(
            `UPDATE user_profiles 
             SET university_name = $1, 
                 field_of_study = $2, 
                 education_start_date = $3, 
                 education_end_date = $4, 
                 degree = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6 
             RETURNING *`,
            [universityName, fieldOfStudy, startDate, endDate, degree, id]
        );
        
        if (profileResult.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        // Also sync to education table
        // Check if a primary education already exists in education table for this user
        const existingPrimaryEducation = await query(
            `SELECT id FROM education 
             WHERE user_profile_id = $1 
             AND is_primary = true 
             LIMIT 1`,
            [id]
        );
        
        if (existingPrimaryEducation.rows.length > 0) {
            // Update existing primary education
            await query(
                `UPDATE education 
                 SET university_name = $1, 
                     field_of_study = $2, 
                     education_start_date = $3, 
                     education_end_date = $4, 
                     degree = $5,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $6 AND user_profile_id = $7`,
                [universityName, fieldOfStudy, startDate, endDate, degree, existingPrimaryEducation.rows[0].id, id]
            );
            console.log('Primary education updated in education table');
        } else {
            // Insert new primary education
            await query(
                `INSERT INTO education (
                    user_profile_id, university_name, field_of_study, 
                    education_start_date, education_end_date, degree, is_primary
                ) VALUES ($1, $2, $3, $4, $5, $6, true)`,
                [id, universityName, fieldOfStudy, startDate, endDate, degree]
            );
            console.log('Primary education inserted into education table');
        }
        
        console.log('Primary education updated successfully');
        
        res.json({ 
            success: true,
            message: 'Primary education updated successfully',
            data: profileResult.rows[0]
        });
    } catch (error) {
        console.error('Error updating primary education:', error);
        res.status(500).json({ 
            error: 'Failed to update primary education',
            message: error.message 
        });
    }
};

// Add additional education
exports.addAdditionalEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const { universityName, fieldOfStudy, startDate, endDate, degree } = req.body;
        const { query } = require('../conifg/database');
        
        console.log('Adding additional education for profile:', id);
        console.log('Data:', { universityName, fieldOfStudy, startDate, endDate, degree });
        
        // Validation
        if (!universityName || !fieldOfStudy || !startDate || !degree) {
            return res.status(400).json({ 
                error: 'Missing required fields: universityName, fieldOfStudy, startDate, degree' 
            });
        }
        
        // Insert into education table (explicitly set is_primary to false)
        const result = await query(
            `INSERT INTO education (
                user_profile_id, university_name, field_of_study, 
                education_start_date, education_end_date, degree, is_primary
            ) VALUES ($1, $2, $3, $4, $5, $6, false)
            RETURNING *`,
            [id, universityName, fieldOfStudy, startDate, endDate, degree]
        );
        
        console.log('Education added successfully');
        
        // Get all additional education to return (excluding primary)
        const allEducation = await query(
            `SELECT id, university_name, field_of_study, education_start_date, education_end_date, degree 
             FROM education 
             WHERE user_profile_id = $1 
             AND (is_primary = false OR is_primary IS NULL)
             ORDER BY education_start_date DESC`,
            [id]
        );
        
        res.json({ 
            success: true,
            message: 'Education added successfully',
            data: allEducation.rows.map(edu => ({
                id: edu.id,
                universityName: edu.university_name,
                fieldOfStudy: edu.field_of_study,
                startDate: edu.education_start_date,
                endDate: edu.education_end_date,
                degree: edu.degree
            }))
        });
    } catch (error) {
        console.error('Error adding education:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to add education',
            message: error.message
        });
    }
};

// Update additional education by index
exports.updateAdditionalEducation = async (req, res) => {
    try {
        const { id, eduIndex } = req.params;
        const { universityName, fieldOfStudy, startDate, endDate, degree } = req.body;
        const { query } = require('../conifg/database');
        
        console.log('Updating education with index:', eduIndex);
        
        // Get all additional education entries for this user (excluding primary)
        const allEducation = await query(
            `SELECT id FROM education 
             WHERE user_profile_id = $1 
             AND (is_primary = false OR is_primary IS NULL)
             ORDER BY education_start_date DESC`,
            [id]
        );
        
        if (allEducation.rows.length === 0) {
            return res.status(404).json({ error: 'No additional education entries found' });
        }
        
        const index = parseInt(eduIndex);
        if (index < 0 || index >= allEducation.rows.length) {
            return res.status(400).json({ error: 'Invalid education index' });
        }
        
        // Get the actual education ID at this index
        const educationId = allEducation.rows[index].id;
        
        // Update the education entry (keep is_primary as false)
        const result = await query(
            `UPDATE education 
             SET university_name = $1, 
                 field_of_study = $2, 
                 education_start_date = $3, 
                 education_end_date = $4, 
                 degree = $5,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6 AND user_profile_id = $7 AND (is_primary = false OR is_primary IS NULL)
             RETURNING *`,
            [universityName, fieldOfStudy, startDate, endDate, degree, educationId, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Education entry not found' });
        }
        
        console.log('Education updated successfully');
        
        // Get all additional education to return (excluding primary)
        const allEducationUpdated = await query(
            `SELECT id, university_name, field_of_study, education_start_date, education_end_date, degree 
             FROM education 
             WHERE user_profile_id = $1 
             AND (is_primary = false OR is_primary IS NULL)
             ORDER BY education_start_date DESC`,
            [id]
        );
        
        res.json({ 
            success: true,
            message: 'Education updated successfully',
            data: allEducationUpdated.rows.map(edu => ({
                id: edu.id,
                universityName: edu.university_name,
                fieldOfStudy: edu.field_of_study,
                startDate: edu.education_start_date,
                endDate: edu.education_end_date,
                degree: edu.degree
            }))
        });
    } catch (error) {
        console.error('Error updating education:', error);
        res.status(500).json({ 
            error: 'Failed to update education',
            message: error.message 
        });
    }
};

// Delete additional education by index
exports.deleteAdditionalEducation = async (req, res) => {
    try {
        const { id, eduIndex } = req.params;
        const { query } = require('../conifg/database');
        
        console.log('Deleting education at index:', eduIndex);
        
        // Get all additional education entries for this user (excluding primary)
        const allEducation = await query(
            `SELECT id FROM education 
             WHERE user_profile_id = $1 
             AND (is_primary = false OR is_primary IS NULL)
             ORDER BY education_start_date DESC`,
            [id]
        );
        
        if (allEducation.rows.length === 0) {
            return res.status(404).json({ error: 'No additional education entries found' });
        }
        
        const index = parseInt(eduIndex);
        if (index < 0 || index >= allEducation.rows.length) {
            return res.status(400).json({ error: 'Invalid education index' });
        }
        
        // Get the actual education ID at this index
        const educationId = allEducation.rows[index].id;
        
        // Delete the education entry (only if it's not primary)
        const result = await query(
            `DELETE FROM education 
             WHERE id = $1 AND user_profile_id = $2 AND (is_primary = false OR is_primary IS NULL)
             RETURNING *`,
            [educationId, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Education entry not found or cannot delete primary education' });
        }
        
        console.log('Education deleted successfully');
        
        // Get remaining additional education to return (excluding primary)
        const remainingEducation = await query(
            `SELECT id, university_name, field_of_study, education_start_date, education_end_date, degree 
             FROM education 
             WHERE user_profile_id = $1 
             AND (is_primary = false OR is_primary IS NULL)
             ORDER BY education_start_date DESC`,
            [id]
        );
        
        res.json({ 
            success: true,
            message: 'Education deleted successfully',
            data: remainingEducation.rows.map(edu => ({
                id: edu.id,
                universityName: edu.university_name,
                fieldOfStudy: edu.field_of_study,
                startDate: edu.education_start_date,
                endDate: edu.education_end_date,
                degree: edu.degree
            }))
        });
    } catch (error) {
        console.error('Error deleting education:', error);
        res.status(500).json({ 
            error: 'Failed to delete education',
            message: error.message 
        });
    }
};

// Get projects data
exports.getProjects = async (req, res) => {
    try {
        const { id } = req.params;
        const { query } = require('../conifg/database');
        
        // Get primary project from user_profiles table
        const profileResult = await query(
            'SELECT project_title, project_summary FROM user_profiles WHERE id = $1',
            [id]
        );
        
        if (profileResult.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        // Get additional projects from projects table (excluding primary)
        const projectsResult = await query(
            `SELECT id, project_title, project_summary, created_at 
             FROM projects 
             WHERE user_profile_id = $1 
             AND (is_primary = false OR is_primary IS NULL)
             ORDER BY created_at DESC`,
            [id]
        );
        
        res.json({
            success: true,
            data: {
                primary: {
                    projectTitle: profileResult.rows[0].project_title,
                    projectSummary: profileResult.rows[0].project_summary
                },
                additional: projectsResult.rows.map(proj => ({
                    id: proj.id,
                    projectTitle: proj.project_title,
                    projectSummary: proj.project_summary,
                    createdAt: proj.created_at
                }))
            }
        });
    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        res.status(500).json({ 
            error: 'Failed to fetch projects data',
            message: error.message 
        });
    }
};

// Update primary project
exports.updatePrimaryProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { projectTitle, projectSummary } = req.body;
        const { query } = require('../conifg/database');
        
        console.log('📚 Updating primary project for profile:', id);
        console.log('📤 Data:', { projectTitle, projectSummary });
        
        // Update in user_profiles table
        const profileResult = await query(
            `UPDATE user_profiles 
             SET project_title = $1, 
                 project_summary = $2, 
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 
             RETURNING *`,
            [projectTitle, projectSummary, id]
        );
        
        if (profileResult.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        
        // Also sync to projects table
        // Check if a primary project already exists in projects table for this user
        const existingPrimaryProject = await query(
            `SELECT id FROM projects 
             WHERE user_profile_id = $1 
             AND is_primary = true 
             LIMIT 1`,
            [id]
        );
        
        if (existingPrimaryProject.rows.length > 0) {
            // Update existing primary project
            await query(
                `UPDATE projects 
                 SET project_title = $1, 
                     project_summary = $2,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $3 AND user_profile_id = $4`,
                [projectTitle, projectSummary, existingPrimaryProject.rows[0].id, id]
            );
            console.log('Primary project updated in projects table');
        } else {
            // Insert new primary project
            await query(
                `INSERT INTO projects (
                    user_profile_id, project_title, project_summary, is_primary
                ) VALUES ($1, $2, $3, true)`,
                [id, projectTitle, projectSummary]
            );
            console.log('Primary project inserted into projects table');
        }
        
        console.log('Primary project updated successfully');
        
        res.json({ 
            success: true,
            message: 'Primary project updated successfully',
            data: profileResult.rows[0]
        });
    } catch (error) {
        console.error('❌ Error updating primary project:', error);
        res.status(500).json({ 
            error: 'Failed to update primary project',
            message: error.message 
        });
    }
};

// Add additional project
exports.addAdditionalProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { projectTitle, projectSummary } = req.body;
        const { query } = require('../conifg/database');
        
        console.log('Adding additional project for profile:', id);
        console.log('Data:', { projectTitle, projectSummary });
        
        // Validation
        if (!projectTitle || !projectSummary) {
            return res.status(400).json({ 
                error: 'Missing required fields: projectTitle, projectSummary' 
            });
        }
        
        // Insert into projects table
        const result = await query(
            `INSERT INTO projects (
                user_profile_id, project_title, project_summary
            ) VALUES ($1, $2, $3)
            RETURNING *`,
            [id, projectTitle, projectSummary]
        );
        
        console.log('Project added successfully');
        
        // Get all additional projects to return
        const allProjects = await query(
            'SELECT id, project_title, project_summary, created_at FROM projects WHERE user_profile_id = $1 ORDER BY created_at DESC',
            [id]
        );
        
        res.json({ 
            success: true,
            message: 'Project added successfully',
            data: allProjects.rows.map(proj => ({
                id: proj.id,
                projectTitle: proj.project_title,
                projectSummary: proj.project_summary,
                createdAt: proj.created_at
            }))
        });
    } catch (error) {
        console.error('Error adding project:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            error: 'Failed to add project',
            message: error.message
        });
    }
};

// Update additional project by index
exports.updateAdditionalProject = async (req, res) => {
    try {
        const { id, projIndex } = req.params;
        const { projectTitle, projectSummary } = req.body;
        const { query } = require('../conifg/database');
        
        console.log('📚 Updating project with index:', projIndex);
        
        // Get all projects for this user
        const allProjects = await query(
            'SELECT id FROM projects WHERE user_profile_id = $1 ORDER BY created_at DESC',
            [id]
        );
        
        if (allProjects.rows.length === 0) {
            return res.status(404).json({ error: 'No projects found' });
        }
        
        const index = parseInt(projIndex);
        if (index < 0 || index >= allProjects.rows.length) {
            return res.status(400).json({ error: 'Invalid project index' });
        }
        
        // Get the actual project ID at this index
        const projectId = allProjects.rows[index].id;
        
        // Update the project
        const result = await query(
            `UPDATE projects 
             SET project_title = $1, 
                 project_summary = $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 AND user_profile_id = $4
             RETURNING *`,
            [projectTitle, projectSummary, projectId, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        console.log('Project updated successfully');
        
        // Get all projects to return
        const allProjectsUpdated = await query(
            'SELECT id, project_title, project_summary, created_at FROM projects WHERE user_profile_id = $1 ORDER BY created_at DESC',
            [id]
        );
        
        res.json({ 
            success: true,
            message: 'Project updated successfully',
            data: allProjectsUpdated.rows.map(proj => ({
                id: proj.id,
                projectTitle: proj.project_title,
                projectSummary: proj.project_summary,
                createdAt: proj.created_at
            }))
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ 
            error: 'Failed to update project',
            message: error.message 
        });
    }
};

// Delete additional project by index
exports.deleteAdditionalProject = async (req, res) => {
    try {
        const { id, projIndex } = req.params;
        const { query } = require('../conifg/database');
        
        console.log('🗑️ Deleting project at index:', projIndex);
        
        // Get all projects for this user
        const allProjects = await query(
            'SELECT id FROM projects WHERE user_profile_id = $1 ORDER BY created_at DESC',
            [id]
        );
        
        if (allProjects.rows.length === 0) {
            return res.status(404).json({ error: 'No projects found' });
        }
        
        const index = parseInt(projIndex);
        if (index < 0 || index >= allProjects.rows.length) {
            return res.status(400).json({ error: 'Invalid project index' });
        }
        
        // Get the actual project ID at this index
        const projectId = allProjects.rows[index].id;
        
        // Delete the project
        const result = await query(
            'DELETE FROM projects WHERE id = $1 AND user_profile_id = $2 RETURNING *',
            [projectId, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        
        console.log('✅ Project deleted successfully');
        
        // Get remaining projects to return
        const remainingProjects = await query(
            'SELECT id, project_title, project_summary, created_at FROM projects WHERE user_profile_id = $1 ORDER BY created_at DESC',
            [id]
        );
        
        res.json({ 
            success: true,
            message: 'Project deleted successfully',
            data: remainingProjects.rows.map(proj => ({
                id: proj.id,
                projectTitle: proj.project_title,
                projectSummary: proj.project_summary,
                createdAt: proj.created_at
            }))
        });
    } catch (error) {
        console.error('❌ Error deleting project:', error);
        res.status(500).json({ 
            error: 'Failed to delete project',
            message: error.message 
        });
    }
};