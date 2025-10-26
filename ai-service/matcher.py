# import libraries 
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Use natural phrases instead of keyword lists
PROFILE_FIELD_DESCRIPTIONS = {
    'first_name': 'first name',
    'middle_name': 'middle name',
    'last_name': 'last name or surname',
    'email': 'email address',
    'phone': 'phone number or mobile number',  # ← More natural!
    'address_line_1': 'street address',
    'address_line_2': 'apartment or suite number',
    'city': 'city or town',
    'state': 'state or province',
    'country': 'country',
    'job_title': 'job title or position',
    'company_name': 'company name or employer',
    'start_date': 'start date',
    'end_date': 'end date',
    'currently_working': 'currently working',
    'professional_summary': 'professional summary or bio',
    'linkedin_url': 'linkedin profile',
    'github_url': 'github profile',
    'website_url': 'personal website',
    'work_type': 'work type',
    'expected_salary': 'expected salary',
    'preferred_locations': 'preferred locations',
    'work_authorized': 'work authorization',
    'visa_sponsorship_required': 'visa sponsorship required',
    'visa_sponsorship_type': 'visa type',
    'resume_filename': 'resume or cv',
    'resume_path': 'resume path',
    'cover_letter_filename': 'cover letter',
    'cover_letter_path': 'cover letter path',
    'gender': 'gender',
    'hispanic_latino': 'hispanic or latino',
    'race': 'race',
    'veteran_status': 'veteran status',
    'disability_status': 'disability status'
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
    CONFIDENCE_THRESHOLD = 0.60  # ← Changed from 0.70
    
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