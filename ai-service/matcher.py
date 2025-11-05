# matcher.py
# import libraries 
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Use natural phrases instead of keyword lists
PROFILE_FIELD_DESCRIPTIONS = {
    # Personal Information
    'first_name': 'first name or given name or forename or what is your first name',
    'middle_name': 'middle name or middle initial or what is your middle name',
    'last_name': 'last name or surname or family name or what is your last name',
    'email': 'email address or email or contact email or work email or personal email',
    'phone': 'phone number or mobile number or contact number or telephone number or cell phone or primary phone',  
    'address_line_1': 'street address or address line 1 or home address or residential address or mailing address',
    'address_line_2': 'apartment number or suite number or unit number or address line 2 or apt or building number',
    'zipcode': 'zip code or postal code or zip or postcode or area code',
    'city': 'city or town or municipality or what city do you live in',
    'state': 'state or province or region or territory or what state do you live in',
    'country': 'country or nation or country of residence or what country do you live in',
    
    # Primary Education
    'university_name': 'university name or college name or school name or educational institution or name of university or name of college or where did you study or institution name or first university or primary education',
    'field_of_study': 'field of study or major or degree program or area of study or specialization or concentration or what did you study or academic major or course of study',
    'education_start_date': 'education start date or enrollment date or start date or when did you start or date started or beginning date or commenced education',
    'education_end_date': 'graduation date or when did you graduate or when you graduated or education end date or completion date or finish date or end date or date graduated or expected graduation or graduation year',
    'degree': 'degree type or qualification or education level or degree or highest education or academic degree or degree earned or level of education or educational qualification',
    
    # Additional Education (for subsequent education entries)
    'education_0': 'second university or second college or second school or additional education or other education or another degree or previous education or prior university or earlier education or another university or previous college or other school or second degree',
    'education_1': 'third university or third college or third school or additional education or other education or another degree or third degree or another previous education',
    'education_2': 'fourth university or fourth college or fourth school or additional education or another degree or fourth degree',
    'education_3': 'fifth university or fifth college or fifth school or additional education or another degree',
    'education_4': 'sixth university or sixth college or additional education',
    
    # Primary Work Experience 
    'job_title': 'job title or position or role or current position or job role or position title or current title or what is your title or designation or first job or primary job or most recent job',
    'company_name': 'company name or employer or organization or employer name or current employer or company or workplace or where do you work or organization name or first company or primary employer',
    'start_date': 'start date or from date or employment start date or when did you start or date started or beginning date or commenced work',
    'end_date': 'end date or to date or employment end date or when did you leave or date ended or finish date or left company',
    'currently_working': 'currently working or present or current position or still working here or working here now or currently employed',
    'professional_summary': 'professional summary or bio or about you or professional bio or career summary or summary or professional profile or tell us about yourself or describe yourself or job description',
    
    # Additional Work Experiences (for subsequent work entries)
    'work_experience_0': 'second job or previous job or additional work experience or other work experience or previous employer or past job or former position or prior job or earlier job or another job or second position or previous company or former employer or second employer or past position',
    'work_experience_1': 'third job or additional work experience or other work experience or another previous job or third position or third employer or third company',
    'work_experience_2': 'fourth job or additional work experience or another past job or fourth position or fourth employer',
    'work_experience_3': 'fifth job or additional work experience or fifth position',
    'work_experience_4': 'sixth job or additional work experience or sixth position',
    
    # Primary Project
    'project_title': 'project title or project name or name of project or title or what is the project called or first project or primary project or main project or most recent project',
    'project_summary': 'project description or project details or project summary or describe the project or tell us about the project or what did you do or project overview or description',
    
    # Additional Projects (for subsequent project entries)
    'project_0': 'second project or additional project or other project or another project you worked on or previous project or prior project or another project or second project title or other project name',
    'project_1': 'third project or additional project or another project or third project title',
    'project_2': 'fourth project or additional project or fourth project title',
    'project_3': 'fifth project or additional project',
    'project_4': 'sixth project or additional project',
    
    # Skills & Expertise
    'skills': 'skills or technical skills or core competencies or soft skills or professional skills or what are your skills or list your skills or key skills or relevant skills or areas of expertise',
    'linkedin_url': 'linkedin profile or linkedin url or linkedin or linkedin link or linkedin address or your linkedin',
    'github_url': 'github profile or github url or github or github username or github link or github account',
    'website_url': 'personal website or website url or portfolio url or website or portfolio or your website or personal site',
    
    # Job Preferences
    'work_type': 'work type or employment type or job type or type of employment or full time or part time or contract or preferred work type or work arrangement',
    'expected_salary': 'expected salary or salary expectations or desired salary or salary requirement or compensation expectations or what is your expected salary',
    'preferred_locations': 'preferred locations or preferred work location or where would you like to work or location preference or desired location',
    'work_relocate': 'willing to relocate or open to relocation or can you relocate or relocation or are you willing to move or relocation availability',
    'restrictive_bond': 'restrictive bond or service agreement or employment bond or notice period or non compete or contractual obligations',
    
    # Work Authorization
    'work_authorized': 'work authorization or authorized to work or legally authorized or can you legally work or work permit or right to work or employment authorization or are you authorized',
    'visa_sponsorship_required': 'visa sponsorship required or need visa sponsorship or require sponsorship or do you need sponsorship or sponsorship needed or will you require sponsorship',
    'visa_sponsorship_type': 'visa type or visa category or type of visa or what type of visa or visa status or immigration status or current visa',
    
    # Documents
    'resume_filename': 'resume or cv or curriculum vitae or upload resume or attach resume or your resume',
    'resume_path': 'resume path or resume file or resume location or cv file',
    'cover_letter_filename': 'cover letter or upload cover letter or attach cover letter or letter of interest',
    'cover_letter_path': 'cover letter path or cover letter file or cover letter location',
    
    # Demographic Information (EEO)
    'gender': 'gender or gender identity or what is your gender or sex or gender identification',
    'hispanic_latino': 'hispanic or latino or are you hispanic or latino or hispanic latino ethnicity or ethnicity',
    'race': 'race or racial identity or ethnicity or what is your race or racial background or ethnic background',
    'veteran_status': 'veteran status or are you a veteran or military veteran or protected veteran or veteran',
    'disability_status': 'disability status or do you have a disability or disability or physical disability or protected disability status',
    
    # Documents 
    'resume_filename': 'resume or cv or curriculum vitae or upload resume or attach resume or your resume or resume file or resume upload or upload your resume or attach your cv',
    'cover_letter_filename': 'cover letter or upload cover letter or attach cover letter or letter of interest or cover letter file or cover letter upload or upload your cover letter or motivation letter',
}

def find_best_match(model, form_field_label):
    """
    Find the best matching profile field for a given form field label.
    
    Args:
        model: The loaded SentenceTransformer model
        form_field_label: The label from the form (e.g., "What is your first name?")
    
    Returns:
        dict: {
            'matched_field': 'first_name' or None,
            'confidence': 0.85 (similarity score),
            'all_scores': {...} (all field scores for debugging)
        }
    """
    
    # Step 1: Convert form field label to embedding (numbers)
    print(f"Analyzing: '{form_field_label}'")
    form_embedding = model.encode(form_field_label)
    
    # Step 2: Get field names and their descriptions
    field_names = list(PROFILE_FIELD_DESCRIPTIONS.keys())
    field_descriptions = list(PROFILE_FIELD_DESCRIPTIONS.values())
    
    # Convert descriptions to embeddings
    profile_embeddings = model.encode(field_descriptions)
    
    # Step 3: Calculate similarity scores 
    # Reshape for sklearn (needs 2D arrays)
    form_embedding_2d = form_embedding.reshape(1, -1)
    
    # Calculate cosine similarity between form label and each profile field description
    similarities = cosine_similarity(form_embedding_2d, profile_embeddings)[0]
    
    # Create a dictionary of field -> score 
    all_scores = {field: float(score) for field, score in zip(field_names, similarities)}
    
    # Step 4: Find the highest similarity score 
    best_index = np.argmax(similarities)
    best_field = field_names[best_index]
    best_score = similarities[best_index]
    
    print(f"Best match: '{best_field}' with {best_score:.2%} confidence")
    
    # Lowered threshold to 60% for better coverage
    CONFIDENCE_THRESHOLD = 0.45  # ← Changed from 0.50
    
    if best_score >= CONFIDENCE_THRESHOLD:
        return {
            'matched_field': best_field,
            'confidence': float(best_score),
            'all_scores': all_scores,
            'status': 'success'
        }
    else:
        return {
            'matched_field': None,
            'confidence': float(best_score),
            'all_scores': all_scores,
            'status': 'no_confident_match',
            'message': f'Highest confidence was {best_score:.2%}, below threshold of {CONFIDENCE_THRESHOLD:.0%}'
        }

# Test function (for local testing)
if __name__ == '__main__':
    from sentence_transformers import SentenceTransformer 
    
    print("Loading model for testing")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    # test cases
    test_labels = [
        "What is your first name?",
        "Enter your email address",
        "What's your phone number?",
        "Phone number",
        "Contact number",
        "Mobile number",
        "What is your middle name?",
        "Your company name",
        "Your job title",
        "Current employer"
    ]
    
    print("\n" + "="*50)
    print("Testing Matcher Function")
    print("="*50 + "\n")
    
    for label in test_labels:
        result = find_best_match(model, label)
        print(f"Input: '{label}'")
        print(f"Match: {result['matched_field']} ({result['confidence']:.2%})")
        print("-" * 50)