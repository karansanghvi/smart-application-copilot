// backend/models/Profile.js

const { query, getClient } = require('../conifg/database');

class Profile {
    // Create Profile
    static async create(profileData) {
        const client = await getClient();
        try {
            await client.query('BEGIN');
            
            // Insert main profile
            const profileQuery = `
                INSERT INTO user_profiles (
                    first_name, middle_name, last_name, email, phone,
                    address_line_1, address_line_2, zipcode, city, state, country,
                    university_name, field_of_study, education_start_date, education_end_date, degree,
                    job_title, company_name, start_date, end_date, currently_working,
                    professional_summary, project_title, project_summary, linkedin_url, github_url, website_url,
                    work_type, expected_salary, preferred_locations, work_relocate,
                    work_authorized, visa_sponsorship_required, visa_sponsorship_type, restrictive_bond,
                    resume_filename, resume_path, cover_letter_filename, cover_letter_path,
                    gender, hispanic_latino, race, veteran_status, disability_status
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                    $12, $13, $14, $15, $16,
                    $17, $18, $19, $20, $21, $22, $23, $24, $25,
                    $26, $27, $28, $29, $30, $31, $32, $33, $34, $35,
                    $36, $37, $38, $39, $40, $41, $42, $43, $44
                ) RETURNING id
            `;
            
            const profileValues = [
                profileData.firstName,
                profileData.middleName || null,
                profileData.lastName,
                profileData.email,
                profileData.phone,
                profileData.addressOne,
                profileData.addressTwo || null,
                profileData.zipCode,
                profileData.city,
                profileData.state,
                profileData.country,
                profileData.universityName,
                profileData.fieldOfStudy,
                profileData.educationStartDate,
                profileData.educationEndDate || null,
                profileData.degree,
                profileData.jobTitle,
                profileData.companyName,
                profileData.startDate,
                profileData.endDate || null,
                profileData.currentlyWorking || false,
                profileData.professionalSummary,
                profileData.projectTitle || null,
                profileData.projectSummary || null,
                profileData.linkedin || null,
                profileData.github || null,
                profileData.website || null,
                profileData.workType || null,
                profileData.relocate || null,
                profileData.expectedSalary || null,
                profileData.preferredLocations || null,
                profileData.authorized || null,
                profileData.sponsorship || null,
                profileData.visaSponsorship || null,
                profileData.restrictiveBond || null,
                profileData.resumeFilename || null,
                profileData.resumePath || null,
                profileData.coverLetterFilename || null,
                profileData.coverLetterPath || null,
                profileData.gender || null,
                profileData.hispanicLatino || null,
                profileData.race || null,
                profileData.veteran || null,
                profileData.disability || null
            ];
            
            const result = await client.query(profileQuery, profileValues);
            const userId = result.rows[0].id;
            
            // ✅ Insert PRIMARY education into education table WITH is_primary flag
            console.log('Inserting primary education into education table...');
            await client.query(`
                INSERT INTO education (
                    user_profile_id, university_name, field_of_study, 
                    education_start_date, education_end_date, degree, is_primary
                ) VALUES ($1, $2, $3, $4, $5, $6, true)
            `, [
                userId,
                profileData.universityName,
                profileData.fieldOfStudy,
                profileData.educationStartDate,
                profileData.educationEndDate || null,
                profileData.degree
            ]);
            
            // ✅ Insert additional education entries WITH is_primary = false
            if (profileData.additionalEducation && profileData.additionalEducation.length > 0) {
                console.log(`Inserting ${profileData.additionalEducation.length} additional education entries...`);
                
                for (const edu of profileData.additionalEducation) {
                    // Skip if missing required fields
                    if (!edu.universityName || !edu.fieldOfStudy || !edu.educationStartDate || !edu.degree) {
                        console.log('Skipping invalid education entry:', edu);
                        continue;
                    }
                    
                    await client.query(`
                        INSERT INTO education (
                            user_profile_id, university_name, field_of_study, 
                            education_start_date, education_end_date, degree, is_primary
                        ) VALUES ($1, $2, $3, $4, $5, $6, false)
                    `, [
                        userId,
                        edu.universityName,
                        edu.fieldOfStudy,
                        edu.educationStartDate,
                        edu.educationEndDate || null,
                        edu.degree
                    ]);
                }
            }
            
            // ✅ Insert PRIMARY work experience into work_experiences table WITH is_primary flag
            console.log('Inserting primary experience into work_experiences table...');
            await client.query(`
                INSERT INTO work_experiences (
                    user_profile_id, job_title, company_name, 
                    start_date, end_date, currently_working, job_description, is_primary
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, true)
            `, [
                userId,
                profileData.jobTitle,
                profileData.companyName,
                profileData.startDate,
                profileData.endDate || null,
                profileData.currentlyWorking || false,
                profileData.professionalSummary
            ]);
            
            // ✅ Insert additional work experiences WITH is_primary = false
            if (profileData.additionalExperiences && profileData.additionalExperiences.length > 0) {
                console.log(`Inserting ${profileData.additionalExperiences.length} additional experiences...`);
                
                for (const exp of profileData.additionalExperiences) {
                    // Skip if missing required fields
                    if (!exp.jobTitle || !exp.companyName || !exp.startDate) {
                        console.log('Skipping invalid experience:', exp);
                        continue;
                    }
                    
                    await client.query(`
                        INSERT INTO work_experiences (
                            user_profile_id, job_title, company_name, 
                            start_date, end_date, currently_working, job_description, is_primary
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, false)
                    `, [
                        userId,
                        exp.jobTitle,
                        exp.companyName,
                        exp.startDate,
                        exp.endDate || null,
                        exp.currentlyWorking || false,
                        exp.jobDescription || null
                    ]);
                }
            }

            // ✅ Insert PRIMARY project into projects table WITH is_primary flag
            console.log('Inserting primary project into projects table...');
            await client.query(`
                INSERT INTO projects (
                    user_profile_id, project_title, project_summary, is_primary
                ) VALUES ($1, $2, $3, true)
            `, [
                userId,
                profileData.projectTitle || null,
                profileData.projectSummary || null
            ]);
            
            // ✅ Insert additional projects WITH is_primary = false
            if (profileData.additionalProject && profileData.additionalProject.length > 0) {
                console.log(`Inserting ${profileData.additionalProject.length} additional projects...`);
                
                for (const proj of profileData.additionalProject) {
                    // Skip if missing required fields
                    if (!proj.projectTitle || !proj.projectSummary) {
                        console.log('Skipping invalid project:', proj);
                        continue;
                    }
                    
                    await client.query(`
                        INSERT INTO projects (
                            user_profile_id, project_title, project_summary, is_primary
                        ) VALUES ($1, $2, $3, false)
                    `, [
                        userId,
                        proj.projectTitle,
                        proj.projectSummary
                    ]);
                }
            }
                        
            // ✅ Insert skills
            if (profileData.skills && profileData.skills.length > 0) {
                console.log(`Inserting ${profileData.skills.length} skills...`);
                
                for (const skillName of profileData.skills) {
                    // Insert skill if it doesn't exist
                    const skillResult = await client.query(`
                        INSERT INTO skills (skill_name) 
                        VALUES ($1) 
                        ON CONFLICT (skill_name) DO UPDATE 
                        SET skill_name = EXCLUDED.skill_name 
                        RETURNING id
                    `, [skillName]);
                    
                    const skillId = skillResult.rows[0].id;
                    
                    // Link skill to user
                    await client.query(`
                        INSERT INTO user_skills (user_profile_id, skill_id) 
                        VALUES ($1, $2)
                    `, [userId, skillId]);
                }
            }
            
            await client.query('COMMIT');
            
            console.log('✅ Profile created successfully with all education, experiences, and projects!');
            return { id: userId, message: 'Profile created successfully' };
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Error creating profile:', error);
            throw error;
        } finally {
            client.release();
        }
    }
    
    // Get profile by ID with all related data
    static async findById(id) {
        try {
            // Get main profile data
            const profileResult = await query(
                'SELECT * FROM user_profiles WHERE id = $1',
                [id]
            );
            
            if (profileResult.rows.length === 0) {
                return null;
            }
            
            const profile = profileResult.rows[0];
            
            // Get work experiences (primary first, then additional)
            const experiencesResult = await query(
                `SELECT * FROM work_experiences 
                WHERE user_profile_id = $1 
                ORDER BY is_primary DESC NULLS LAST, start_date DESC`,
                [id]
            );
            
            // Separate primary and additional work experiences
            const allExperiences = experiencesResult.rows;
            const primaryExperience = allExperiences.find(exp => exp.is_primary === true);
            const additionalExperiences = allExperiences.filter(exp => exp.is_primary !== true);
            
            profile.work_experiences = additionalExperiences; // For autofill of additional fields
            profile.all_work_experiences = allExperiences;    // For display purposes
            profile.primary_work_experience = primaryExperience; // Primary experience
            
            // Get education (primary first, then additional)
            const educationResult = await query(
                `SELECT * FROM education 
                WHERE user_profile_id = $1 
                ORDER BY is_primary DESC NULLS LAST, education_start_date DESC`,
                [id]
            );
            
            // Separate primary and additional education
            const allEducation = educationResult.rows;
            const primaryEducation = allEducation.find(edu => edu.is_primary === true);
            const additionalEducation = allEducation.filter(edu => edu.is_primary !== true);
            
            profile.education = additionalEducation;       // For autofill of additional fields
            profile.all_education = allEducation;          // For display purposes
            profile.primary_education = primaryEducation;  // Primary education
            
            // Get projects (primary first, then additional)
            const projectsResult = await query(
                `SELECT * FROM projects 
                WHERE user_profile_id = $1 
                ORDER BY is_primary DESC NULLS LAST, created_at DESC`,
                [id]
            );
            
            // Separate primary and additional projects
            const allProjects = projectsResult.rows;
            const primaryProject = allProjects.find(proj => proj.is_primary === true);
            const additionalProjects = allProjects.filter(proj => proj.is_primary !== true);
            
            profile.projects = additionalProjects;      // For autofill of additional fields
            profile.all_projects = allProjects;         // For display purposes
            profile.primary_project = primaryProject;   // Primary project
            
            // Get skills
            const skillsResult = await query(
                `SELECT s.skill_name 
                FROM skills s
                JOIN user_skills us ON s.id = us.skill_id
                WHERE us.user_profile_id = $1`,
                [id]
            );
            profile.skills = skillsResult.rows.map(row => row.skill_name);
            
            // Log summary for debugging
            console.log(`📊 Profile ${id} loaded:`);
            console.log(`   Work Experiences: ${profile.all_work_experiences.length} total (${additionalExperiences.length} additional)`);
            console.log(`   Education: ${profile.all_education.length} total (${additionalEducation.length} additional)`);
            console.log(`   Projects: ${profile.all_projects.length} total (${additionalProjects.length} additional)`);
            console.log(`   Skills: ${profile.skills.length}`);
            
            return profile;
            
        } catch (error) {
            console.error('❌ Error in findById:', error);
            throw error;
        }
    }
    
    // Get profile by email
    static async findByEmail(email) {
        const result = await query(
            'SELECT * FROM user_profiles WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }
    
    // Get all profiles
    static async findAll() {
        const result = await query(
            'SELECT id, first_name, last_name, email, job_title, company_name, created_at FROM user_profiles ORDER BY created_at DESC'
        );
        return result.rows;
    }
    
    // Update profile
    static async update(id, profileData) {
        const client = await getClient();
        
        try {
            await client.query('BEGIN');
            
            // Build dynamic update query
            const updateFields = [];
            const values = [];
            let paramCount = 1;
            
            const fieldMapping = {
                firstName: 'first_name',
                middleName: 'middle_name',
                lastName: 'last_name',
                email: 'email',
                phone: 'phone',
                addressOne: 'address_line_1',
                addressTwo: 'address_line_2',
                zipCode: 'zipcode',
                city: 'city',
                state: 'state',
                country: 'country',
                universityName: 'university_name',
                fieldOfStudy: 'field_of_study',
                educationStartDate: 'education_start_date',
                educationEndDate: 'education_end_date',
                degree: 'degree',
                jobTitle: 'job_title',
                companyName: 'company_name',
                startDate: 'start_date',
                endDate: 'end_date',
                currentlyWorking: 'currently_working',
                professionalSummary: 'professional_summary',
                projectTitle: 'project_title',
                projectSummary: 'project_summary',
                linkedin: 'linkedin_url',
                github: 'github_url',
                website: 'website_url',
                workType: 'work_type',
                expectedSalary: 'expected_salary',
                preferredLocations: 'preferred_locations',
                relocate: 'work_relocate',
                authorized: 'work_authorized',
                sponsorship: 'visa_sponsorship_required',
                visaSponsorship: 'visa_sponsorship_type',
                restrictiveBond: 'restrictive_bond',
                resumeFilename: 'resume_filename',
                resumePath: 'resume_path',
                coverLetterFilename: 'cover_letter_filename',
                coverLetterPath: 'cover_letter_path',
                gender: 'gender',
                hispanicLatino: 'hispanic_latino',
                race: 'race',
                veteran: 'veteran_status',
                disability: 'disability_status'
            };
            
            for (const [key, dbField] of Object.entries(fieldMapping)) {
                if (profileData[key] !== undefined) {
                    updateFields.push(`${dbField} = $${paramCount}`);
                    values.push(profileData[key]);
                    paramCount++;
                }
            }
            
            if (updateFields.length > 0) {
                values.push(id);
                const updateQuery = `
                    UPDATE user_profiles 
                    SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
                    WHERE id = $${paramCount}
                    RETURNING id
                `;
                
                const result = await client.query(updateQuery, values);
                
                if (result.rows.length === 0) {
                    throw new Error('Profile not found');
                }
            }
            
            // Update education if provided
            if (profileData.additionalEducation !== undefined) {
                console.log('🔄 Updating education...');
                
                // Update primary education in both user_profiles and education tables
                if (profileData.universityName || profileData.fieldOfStudy || profileData.educationStartDate || profileData.degree) {
                    await client.query(`
                        UPDATE education 
                        SET university_name = $1, 
                            field_of_study = $2, 
                            education_start_date = $3, 
                            education_end_date = $4, 
                            degree = $5,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE user_profile_id = $6 AND is_primary = true
                    `, [
                        profileData.universityName || null,
                        profileData.fieldOfStudy || null,
                        profileData.educationStartDate || null,
                        profileData.educationEndDate || null,
                        profileData.degree || null,
                        id
                    ]);
                }
                
                // Delete all non-primary education
                await client.query(`
                    DELETE FROM education 
                    WHERE user_profile_id = $1 AND (is_primary = false OR is_primary IS NULL)
                `, [id]);
                
                // Insert new additional education
                const additionalEducation = Array.isArray(profileData.additionalEducation) 
                    ? profileData.additionalEducation 
                    : [];
                    
                for (const edu of additionalEducation) {
                    if (!edu.universityName || !edu.fieldOfStudy || !edu.educationStartDate || !edu.degree) {
                        console.log('⚠️ Skipping invalid education:', edu);
                        continue;
                    }
                    
                    await client.query(`
                        INSERT INTO education (
                            user_profile_id, university_name, field_of_study, 
                            education_start_date, education_end_date, degree, is_primary
                        ) VALUES ($1, $2, $3, $4, $5, $6, false)
                    `, [
                        id,
                        edu.universityName,
                        edu.fieldOfStudy,
                        edu.educationStartDate,
                        edu.educationEndDate || null,
                        edu.degree
                    ]);
                }
                
                console.log(`✅ Updated ${additionalEducation.length} additional education entries`);
            }

            // Update work experiences if provided
            if (profileData.additionalExperiences !== undefined) {
                console.log('🔄 Updating work experiences...');
                
                // Update primary experience in both user_profiles and work_experiences tables
                if (profileData.jobTitle || profileData.companyName || profileData.startDate) {
                    await client.query(`
                        UPDATE work_experiences 
                        SET job_title = $1, 
                            company_name = $2, 
                            start_date = $3, 
                            end_date = $4, 
                            currently_working = $5, 
                            job_description = $6,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE user_profile_id = $7 AND is_primary = true
                    `, [
                        profileData.jobTitle || null,
                        profileData.companyName || null,
                        profileData.startDate || null,
                        profileData.endDate || null,
                        profileData.currentlyWorking || false,
                        profileData.professionalSummary || null,
                        id
                    ]);
                }
                
                // Delete all non-primary experiences
                await client.query(`
                    DELETE FROM work_experiences 
                    WHERE user_profile_id = $1 AND (is_primary = false OR is_primary IS NULL)
                `, [id]);
                
                // Insert new additional experiences
                const additionalExps = Array.isArray(profileData.additionalExperiences) 
                    ? profileData.additionalExperiences 
                    : [];
                    
                for (const exp of additionalExps) {
                    if (!exp.jobTitle || !exp.companyName || !exp.startDate) {
                        console.log('⚠️ Skipping invalid experience:', exp);
                        continue;
                    }
                    
                    await client.query(`
                        INSERT INTO work_experiences (
                            user_profile_id, job_title, company_name, 
                            start_date, end_date, currently_working, job_description, is_primary
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, false)
                    `, [
                        id,
                        exp.jobTitle,
                        exp.companyName,
                        exp.startDate,
                        exp.endDate || null,
                        exp.currentlyWorking || false,
                        exp.jobDescription || null
                    ]);
                }
                
                console.log(`✅ Updated ${additionalExps.length} additional experiences`);
            }

            // Update projects if provided
            if (profileData.additionalProject !== undefined) {
                console.log('🔄 Updating projects...');
                
                // Update primary project in both user_profiles and projects tables
                if (profileData.projectTitle !== undefined || profileData.projectSummary !== undefined) {
                    await client.query(`
                        UPDATE projects 
                        SET project_title = $1, 
                            project_summary = $2,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE user_profile_id = $3 AND is_primary = true
                    `, [
                        profileData.projectTitle || null,
                        profileData.projectSummary || null,
                        id
                    ]);
                }
                
                // Delete all non-primary projects
                await client.query(`
                    DELETE FROM projects 
                    WHERE user_profile_id = $1 AND (is_primary = false OR is_primary IS NULL)
                `, [id]);
                
                // Insert new additional projects
                const additionalProjects = Array.isArray(profileData.additionalProject) 
                    ? profileData.additionalProject 
                    : [];
                    
                for (const proj of additionalProjects) {
                    if (!proj.projectTitle || !proj.projectSummary) {
                        console.log('⚠️ Skipping invalid project:', proj);
                        continue;
                    }
                    
                    await client.query(`
                        INSERT INTO projects (
                            user_profile_id, project_title, project_summary, is_primary
                        ) VALUES ($1, $2, $3, false)
                    `, [
                        id,
                        proj.projectTitle,
                        proj.projectSummary
                    ]);
                }
                
                console.log(`✅ Updated ${additionalProjects.length} additional projects`);
            }
            
            // Update skills if provided
            if (profileData.skills && Array.isArray(profileData.skills)) {
                console.log('🔄 Updating skills...');
                
                // Delete existing skills
                await client.query(
                    'DELETE FROM user_skills WHERE user_profile_id = $1',
                    [id]
                );
                
                // Insert new skills
                for (const skillName of profileData.skills) {
                    const skillResult = await client.query(`
                        INSERT INTO skills (skill_name) 
                        VALUES ($1) 
                        ON CONFLICT (skill_name) DO UPDATE 
                        SET skill_name = EXCLUDED.skill_name 
                        RETURNING id
                    `, [skillName]);
                    
                    const skillId = skillResult.rows[0].id;
                    
                    await client.query(`
                        INSERT INTO user_skills (user_profile_id, skill_id) 
                        VALUES ($1, $2)
                    `, [id, skillId]);
                }
                
                console.log(`✅ Updated ${profileData.skills.length} skills`);
            }
            
            await client.query('COMMIT');
            return { id, message: 'Profile updated successfully' };
            
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('❌ Error updating profile:', error);
            throw error;
        } finally {
            client.release();
        }
    }
    
    // Delete profile
    static async delete(id) {
        const result = await query(
            'DELETE FROM user_profiles WHERE id = $1 RETURNING id',
            [id]
        );
        
        if (result.rows.length === 0) {
            throw new Error('Profile not found');
        }
        
        return { message: 'Profile deleted successfully' };
    }
}

module.exports = Profile;