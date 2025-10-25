# import libraries
from sentence_transformers import SentenceTransformer

# auto download the model
print("Loading model...")
model = SentenceTransformer('all-MiniLM-L6-v2')

print("Model loaded successfully.")

# test if the model works
test_sentence = "Hello, this is a test sentence to verify the model."
embedding = model.encode(test_sentence)

print(f"Model is working!! Generated embedding with {len(embedding)} dimensions.")