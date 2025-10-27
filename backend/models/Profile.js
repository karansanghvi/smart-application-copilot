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
                    professional_summary, linkedin_url, github_url, website_url,
                    work_type, expected_salary, preferred_locations, work_relocate,
                    work_authorized, visa_sponsorship_required, visa_sponsorship_type, restrictive_bond,
                    resume_filename, resume_path, cover_letter_filename, cover_letter_path,
                    gender, hispanic_latino, race, veteran_status, disability_status
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                    $12, $13, $14, $15, $16,
                    $17, $18, $19, $20, $21, $22, $23, $24, $25,
                    $26, $27, $28, $29, $30, $31, $32, $33, $34, $35,
                    $36, $37, $38, $39, $40, $41, $42
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
            
            // ✅ Insert PRIMARY education into education table
            console.log('Inserting primary education into education table...');
            await client.query(`
                INSERT INTO education (
                    user_profile_id, university_name, field_of_study, 
                    education_start_date, education_end_date, degree
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                userId,
                profileData.universityName,
                profileData.fieldOfStudy,
                profileData.educationStartDate,
                profileData.educationEndDate || null,
                profileData.degree
            ]);
            
            // ✅ Insert additional education entries
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
                            education_start_date, education_end_date, degree
                        ) VALUES ($1, $2, $3, $4, $5, $6)
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
            
            // ✅ Insert PRIMARY work experience into work_experiences table
            console.log('Inserting primary experience into work_experiences table...');
            await client.query(`
                INSERT INTO work_experiences (
                    user_profile_id, job_title, company_name, 
                    start_date, end_date, currently_working, job_description
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                userId,
                profileData.jobTitle,
                profileData.companyName,
                profileData.startDate,
                profileData.endDate || null,
                profileData.currentlyWorking || false,
                profileData.professionalSummary
            ]);
            
            // ✅ Insert additional work experiences
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
                            start_date, end_date, currently_working, job_description
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
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
            
            console.log('✅ Profile created successfully with all education and experiences!');
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
        const profileResult = await query(
            'SELECT * FROM user_profiles WHERE id = $1',
            [id]
        );
        
        if (profileResult.rows.length === 0) {
            return null;
        }
        
        const profile = profileResult.rows[0];
        
        // Get work experiences
        const experiencesResult = await query(
            'SELECT * FROM work_experiences WHERE user_profile_id = $1 ORDER BY start_date DESC',
            [id]
        );
        profile.work_experiences = experiencesResult.rows;
        
        // Get skills
        const skillsResult = await query(`
            SELECT s.skill_name 
            FROM skills s
            JOIN user_skills us ON s.id = us.skill_id
            WHERE us.user_profile_id = $1
        `, [id]);
        profile.skills = skillsResult.rows.map(row => row.skill_name);
        
        return profile;
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
                city: 'city',
                state: 'state',
                country: 'country',
                jobTitle: 'job_title',
                companyName: 'company_name',
                startDate: 'start_date',
                endDate: 'end_date',
                currentlyWorking: 'currently_working',
                professionalSummary: 'professional_summary',
                linkedin: 'linkedin_url',
                github: 'github_url',
                website: 'website_url',
                workType: 'work_type',
                expectedSalary: 'expected_salary',
                preferredLocations: 'preferred_locations',
                authorized: 'work_authorized',
                sponsorship: 'visa_sponsorship_required',
                visaSponsorship: 'visa_sponsorship_type',
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
            
            if (profileData.additionalExperiences !== undefined) {
                console.log('🔄 Updating additional work experiences...');
                
                await client.query(`
                    UPDATE work_experiences 
                    SET job_title = $1, 
                        company_name = $2, 
                        start_date = $3, 
                        end_date = $4, 
                        currently_working = $5, 
                        job_description = $6
                    WHERE user_profile_id = $7 
                    AND job_title = (SELECT job_title FROM user_profiles WHERE id = $7)
                    AND company_name = (SELECT company_name FROM user_profiles WHERE id = $7)
                `, [
                    profileData.jobTitle || null,
                    profileData.companyName || null,
                    profileData.startDate || null,
                    profileData.endDate || null,
                    profileData.currentlyWorking || false,
                    profileData.professionalSummary || null,
                    id
                ]);
                
                await client.query(`
                    DELETE FROM work_experiences 
                    WHERE user_profile_id = $1 
                    AND NOT (
                        job_title = (SELECT job_title FROM user_profiles WHERE id = $1)
                        AND company_name = (SELECT company_name FROM user_profiles WHERE id = $1)
                    )
                `, [id]);
                
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
                            start_date, end_date, currently_working, job_description
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
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
            
            if (profileData.skills && Array.isArray(profileData.skills)) {
                await client.query(
                    'DELETE FROM user_skills WHERE user_profile_id = $1',
                    [id]
                );
                
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
            }
            
            await client.query('COMMIT');
            return { id, message: 'Profile updated successfully' };
            
        } catch (error) {
            await client.query('ROLLBACK');
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