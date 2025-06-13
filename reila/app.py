import os
from flask import Flask, request, jsonify
from supabase import create_client, Client
from markupsafe import escape
import gc
from dotenv import load_dotenv
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from flask_cors import CORS
import torch
import re

from html import escape

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_Key = os.getenv("SUPABASE_ANON")
supabase: Client = create_client(supabase_url, supabase_Key)

def sanitize_prompt(text: str) -> str:
    # Remove non-printable characters and HTML/script tags
    cleaned = re.sub(r'[^\x20-\x7E]+', '', text)        # ASCII printable only
    cleaned = re.sub(r'<[^>]+>', '', cleaned)           # Strip HTML tags
    cleaned = escape(cleaned)                           # Escape HTML entities
    return cleaned.strip()


app = Flask(__name__)
CORS(app )
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)



# Define local cache directory (optional, but good practice)
CACHE_DIR = os.path.expanduser("~/.cache/hf_models/flan-t5-base")

# Load tokenizer and model from local cache
tokenizer = AutoTokenizer.from_pretrained(
    "google/flan-t5-base",
    cache_dir=CACHE_DIR,
    local_files_only=False  # set True if you’ve already downloaded the model
)

model = AutoModelForSeq2SeqLM.from_pretrained(
    "google/flan-t5-base",
    cache_dir=CACHE_DIR,
    local_files_only=False
)

model.eval()  # Important: model runs in inference mode

@app.route("/rewrite", methods=["POST", "OPTIONS"])
def rewrite_prompt():
    if request.method == "OPTIONS":
        return '', 200  # CORS preflight
    data = request.get_json()
    user_prompt = data.get("prompt", "").strip()

    if not user_prompt:
        return jsonify({"error": "Missing 'prompt' field"}), 400
    

    sanitized_prompt = sanitize_prompt(user_prompt)
    
    if len(sanitized_prompt) < 3:
        return jsonify({"error": "Prompt too short after cleaning"}), 400

    formatted_prompt = f"Rephrase this instruction: {sanitized_prompt}"

    # Inference with no gradient tracking (saves memory)
    with torch.no_grad():
        inputs = tokenizer(formatted_prompt, return_tensors="pt", padding=True, truncation=True)

        outputs = model.generate(
            inputs.input_ids,
            max_new_tokens=40,
            num_return_sequences=3,
            do_sample=False, #Greedy decoding: always picks most probable next token (boring but stable)..
            num_beams = 3, #keeps top-N likely sequences, expands them in parallel. Balances quality and consistency.
           early_stopping=True
        )
        
        #force garbage collection
        gc.collect

        variations = [tokenizer.decode(output, skip_special_tokens=True) for output in outputs]

    return jsonify({"variations": variations})

@app.route("/log_favorite", methods=["POST"])
def log_favorite():
    data = request.json
    prompt = sanitize_prompt(data.get("prompt", ""))
    favorite = data.get("favorite", "")

    if not prompt or not favorite:
        return jsonify({"error": "Invalid input"}), 400

    try:
        supabase.table("prompt_logs").insert({
            "prompt": prompt,
            "variations": [favorite]
        }).execute()
    except Exception as e:
        print(f"Supabase logging failed: {e}")
        return jsonify({"error": "Logging failed"}), 500

    return jsonify({"status": "Favorite logged"})


if __name__ == "__main__":
     print("🚀 Flask server is starting...")
     print("✅ Listening at: http://localhost:5000")
     app.run(host="0.0.0.0", port=5000, debug=True)
