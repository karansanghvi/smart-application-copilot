from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import time
from matcher import find_best_match

# Create Flask app
app = Flask(__name__)

# Global variable to store the model
model = None

# Load model when server starts
def load_model():
    """
    Load the AI model into memory when Flask starts.
    This happens once, so responses are fast!
    """
    global model
    print("🔄 Loading AI model... (this may take a few seconds)")
    start_time = time.time()
    
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    load_time = time.time() - start_time
    print(f"✅ Model loaded successfully in {load_time:.2f} seconds!")
    return model

# Load model before server starts
print("=" * 50)
print("🚀 Initializing AI Service")
print("=" * 50)
load_model()

# MAIN ENDPOINT - POST /match
@app.route('/match', methods=['POST'])
def match():
    """
    Match a form field label to a profile field.
    
    Expected JSON body:
    {
        "formFieldLabel": "What is your first name?"
    }
    
    Returns:
    {
        "matched_field": "first_name",
        "confidence": 0.7073,
        "status": "success"
    }
    """
    if model is None:
        return jsonify({
            'error': 'Model not loaded',
            'status': 'error'
        }), 500
    
    # Get the form field label from request
    data = request.get_json()
    
    if not data or 'formFieldLabel' not in data:
        return jsonify({
            'error': 'Missing formFieldLabel in request body',
            'status': 'error',
            'example': {
                'formFieldLabel': 'What is your first name?'
            }
        }), 400
    
    form_field_label = data['formFieldLabel']
    
    # Use the matcher function to find best match
    result = find_best_match(model, form_field_label)
    
    return jsonify(result)

# Health check endpoint - GET /health
@app.route('/health', methods=['GET'])
def health():
    """
    Check if server is running AND model is loaded
    """
    model_status = 'loaded' if model is not None else 'not loaded'
    
    return jsonify({
        'status': 'Server is running!',
        'port': 5000,
        'model_status': model_status,
        'model_ready': model is not None
    })

# Run the server
if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Starting AI Service on http://localhost:5000")
    print("📍 Endpoints available:")
    print("   - POST http://localhost:5000/match")
    print("   - GET  http://localhost:5000/health")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)