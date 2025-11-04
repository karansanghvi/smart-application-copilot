# app.py

from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
from matcher import find_best_match
import time

app = Flask(__name__)

# Load model once at startup
print("="*50)
print("🚀 Initializing AI Service")
print("="*50)
print("🔄 Loading AI model... (this may take a few seconds)")
start_time = time.time()
model = SentenceTransformer('all-MiniLM-L6-v2')
load_time = time.time() - start_time
print(f"✅ Model loaded successfully in {load_time:.2f} seconds!")
print("="*50)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'AI matching service is running',
        'model': 'all-MiniLM-L6-v2'
    })

@app.route('/match', methods=['POST'])
def match_single():
    """Match a single form field label to a profile field"""
    try:
        data = request.json
        form_field_label = data.get('formFieldLabel')
        
        if not form_field_label:
            return jsonify({'error': 'formFieldLabel is required'}), 400
        
        # Use the matcher function
        result = find_best_match(model, form_field_label)
        
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Error in match_single: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/match-batch', methods=['POST'])
def match_batch():
    """Match multiple fields at once for better performance"""
    try:
        data = request.json
        form_field_labels = data.get('formFieldLabels', [])
        
        if not form_field_labels:
            return jsonify({'error': 'formFieldLabels array is required'}), 400
        
        print(f"\n🔄 Batch processing {len(form_field_labels)} fields...")
        batch_start = time.time()
        
        results = []
        for i, label in enumerate(form_field_labels, 1):
            result = find_best_match(model, label)
            results.append(result)
            
            # Progress indicator every 10 fields
            if i % 10 == 0:
                print(f"   Processed {i}/{len(form_field_labels)} fields...")
        
        batch_time = time.time() - batch_start
        print(f"✅ Batch processing complete: {len(results)} results in {batch_time:.2f}s")
        print(f"   Average: {(batch_time/len(results))*1000:.0f}ms per field\n")
        
        return jsonify({
            'results': results,
            'total': len(results),
            'processing_time': batch_time,
            'status': 'success'
        })
    
    except Exception as e:
        print(f"❌ Error in match_batch: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting AI Service on http://localhost:5000")
    print("📍 Endpoints available:")
    print("   - POST http://localhost:5000/match")
    print("   - POST http://localhost:5000/match-batch")
    print("   - GET  http://localhost:5000/health")
    print("="*50)
    app.run(debug=True, port=5000)