# import libraries 
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

PROFILE_FIELDS = [
    'first_name',
    'middle_name',
    'last_name',
    'email',
    'phone',
    'address_line_1',
    'address_line_2',
    'city',
    'state',
    'country',
    'job_title',
    'company_name',
    'start_date',
    'end_date',
    'currently_working',
    'professional_summary',
    'linkedin_url',
    'github_url',
    'website_url',
    'work_type',
    'expected_salary',
    'preferred_locations',
    'work_authorized',
    'visa_sponsorship_required',
    'visa_sponsorship_type',
    'resume_filename',
    'resume_path',
    'cover_letter_filename',
    'cover_letter_path',
    'gender',
    'hispanic_latino',
    'race',
    'veteran_status',
    'disability_status'
]

def find_best_match(model, form_field_label):
    """
    Find the best matching profile field for a given form field label.
    
    Args:
        model: The loaded SentenceTransformer model
        form_field_label: The label from the form (e.g., "What is your first name?")
    
    Returns:
        dict: {
            'matched_field': 'firstName' or None,
            'confidence': 0.85 (similarity score),
            'all_scores': {...} (all field scores for debugging)
        }
    """
    
    # Step 1: Convert form field label to embedding (numbers)
    print(f"Analyzing: '{form_field_label}'")
    form_embedding = model.encode(form_field_label)
    
    # Step 2: Convert each profile field name to embedding 
    profile_embeddings = model.encode(PROFILE_FIELDS)
    
    # Step 3: Calculate similarity scores 
    # Reshape for sklearn (needs 2D arrays)
    form_embedding_2d = form_embedding.reshape(1, -1)
    
    # Calculate cosine similarity between form label and each profile field 
    similarities = cosine_similarity(form_embedding_2d, profile_embeddings)[0]
    
    # Create a dictionary of field -> score 
    all_scores = {field: float(score) for field, score in zip(PROFILE_FIELDS, similarities)}
    
    # Step 4: Find the highest similarity score 
    best_index = np.argmax(similarities)
    best_field = PROFILE_FIELDS[best_index]
    best_score = similarities[best_index]
    
    print(f"Best match: '{best_field}' with {best_score:.2%} confidence")
    
    # Only return match if confidence is > 70%
    
    CONFIDENCE_THRESHOLD = 0.70
    
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
        "What is your middle name?",
        "Your company name",
        "Your job description"
    ]
    
    print("\n" + "="*50)
    print("Testing Matcher Function")
    print("="*50 + "\n")
    
    for label in test_labels:
        result = find_best_match(model, label)
        print(f"Input: '{label}")
        print(f"Match: {result['matched_field']} ({result['confidence']:.2%})")
        print("-" * 50)