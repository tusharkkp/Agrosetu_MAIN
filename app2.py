import google.generativeai as genai
from pathlib import Path
import gradio as gr
from dotenv import load_dotenv
import os
import requests
from PIL import Image

# Load environment variables from a .env file
load_dotenv()

# Configure the GenerativeAI API key using the loaded environment variable
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Set up the model configuration for text generation
generation_config = {
    "temperature": 0.4,
    "top_p": 1,
    "top_k": 32,
    "max_output_tokens": 4096,
}

# Define safety settings for content generation
safety_settings = [
    {"category": f"HARM_CATEGORY_{category}", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
    for category in ["HARASSMENT", "HATE_SPEECH", "SEXUALLY_EXPLICIT", "DANGEROUS_CONTENT"]
]

# Initialize the GenerativeModel with the specified model name, configuration, and safety settings
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

# Function to read image data from a file path
def read_image_data(file_path):
    image_path = Path(file_path)
    if not image_path.exists():
        raise FileNotFoundError(f"Could not find image: {image_path}")
    image = Image.open(file_path)
    fmt = image.format.lower() if image.format else 'jpeg'
    mime_type = f"image/{fmt}"
    return {"mime_type": mime_type, "data": image_path.read_bytes()}

# Function to fetch current weather data
def get_weather(city):
    if not city:
        return "Weather data unavailable."
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return "Weather API key not configured. Add OPENWEATHER_API_KEY to .env file."
    try:
        # Assuming India-based locations; adjust country code if needed
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={api_key}&units=metric"
        resp = requests.get(url).json()
        if resp.get('cod') != 200:
            return f"Weather data not available for {city}."
        temp = resp['main']['temp']
        hum = resp['main']['humidity']
        desc = resp['weather'][0]['description']
        return f"Temperature: {temp}°C, Humidity: {hum}%, Condition: {desc}"
    except Exception as e:
        return f"Error fetching weather: {str(e)}"

# Function to generate a response based on a prompt and an image path
def generate_gemini_response(prompt, image_path):
    image_data = read_image_data(image_path)
    response = model.generate_content([prompt, image_data])
    return response.text

# Initial input prompt for the pest and disease expert
input_prompt = """
As a highly skilled plant pathologist and entomologist, your expertise is indispensable in helping small and marginal farmers identify and manage crop pests and diseases. You will be provided with an image of a crop (leaf, stem, or fruit) along with details like crop type, location, and current weather. Your role is to analyze the image, identify issues, assess severity, provide cost-effective recommendations, and predict potential outbreaks.

Analysis Guidelines:

1. Disease/Pest Identification: Examine the image to identify and name the specific pest or disease accurately. Start the response with the name on the first line.

2. Severity Assessment: Classify the issue as Mild, Moderate, or Severe based on the extent of damage.

3. Detailed Findings: Describe the symptoms, affected parts, and potential causes in detail.

4. Actionable Recommendations: Suggest cost-effective organic and chemical control options, including dosages suitable for small farms. Prioritize organic where possible.

5. Preventive Measures: Outline steps to prevent further spread, considering local conditions.

6. Weather & Pest Prediction: Based on the provided weather and location, predict potential pest or disease outbreaks in the next 7 days (e.g., high risk due to humidity).

7. Next Steps: Recommend immediate actions, including when to seek expert help.

Keep the response thorough yet concise, focused on practical advice for small farmers. Use plain text format without bold or markdown.

Disclaimer:
Please note that the information provided is based on AI analysis and should not replace professional agricultural advice. Consult with qualified agricultural experts before implementing any strategies or treatments.

"""

# Function to process uploaded files and generate a response
def (file, crop_type, location, language):
    if file is None:
        return None, "Please upload an image.", "", ""
    
    image_path = file.name
    weather_info = get_weather(location)
    full_prompt = input_prompt + f"\n\nAdditional Information:\n- Crop Type: {crop_type or 'Unknown'}\n- Location: {location or 'Unknown'}\n- Current Weather: {weather_info}\n- Provide the entire response in {language}."
    
    response = generate_gemini_response(full_prompt, image_path)
    
    # Simple parsing for severity to trigger alert
    lower_resp = response.lower()
    severity = "Severe" if "severe" in lower_resp else "Moderate" if "moderate" in lower_resp else "Mild"
    color = "red" if severity == "Severe" else "orange" if severity == "Moderate" else "green"
    urgency = " URGENT ALERT!" if severity == "Severe" else ""
    alert_html = f"""
    <div style="
        padding: 10px; 
        border-radius: 5px; 
        color: white; 
        background-color: {color};
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
    ">
        Severity: {severity}{urgency}
    </div>
    """
    
    feedback_msg = "Thank you for your feedback! This helps improve the system."  # Placeholder; in production, send to backend/DB
    
    return file, response, alert_html, feedback_msg

# Feedback function (placeholder; logs to console)
def submit_feedback(feedback_choice, feedback_comment):
    print(f"Feedback: {feedback_choice} - {feedback_comment}")
    return "Feedback submitted successfully! Thank you for helping us improve."

# Gradio interface setup with green and white farming theme
custom_css = """
    .gradio-container {
        background-color: #f8fff8;
    }
    .header {
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #2e7d32;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
    }
    .instructions {
        background-color: #e8f5e9;
        padding: 15px;
        border-radius: 10px;
        border-left: 5px solid #2e7d32;
        margin-bottom: 20px;
    }
    .footer {
        text-align: center;
        margin-top: 30px;
        color: #2e7d32;
        font-size: 14px;
        border-top: 1px solid #a5d6a7;
        padding-top: 15px;
    }
    button.primary {
        background-color: #2e7d32 !important;
    }
    button.primary:hover {
        background-color: #1b5e20 !important;
    }
    label.block span {
        color: #2e7d32;
        font-weight: bold;
    }
    .analysis-box {
        border: 1px solid #a5d6a7;
        border-radius: 8px;
        background-color: #f1f8e9;
    }
    .plant-icon {
        font-size: 22px;
        vertical-align: middle;
    }
    .knowledge-hub {
        background-color: #e8f5e9;
        padding: 15px;
        border-radius: 10px;
        margin-top: 20px;
    }
"""

with gr.Blocks(css=custom_css) as demo:
    # Header with farming icons
    gr.Markdown("<div class='header'>🌱 AgroSetu Pest & Disease Detection 🌱</div>")
    
    # Instructions in a styled box
    gr.Markdown("""
    <div class='instructions'>
    <strong>How to Use:</strong>
    <ol>
        <li>Enter your crop type, location, and preferred language</li>
        <li>Upload a clear photo of the affected crop part (leaf, stem, or fruit)</li>
        <li>Our AI will analyze and provide pest/disease identification, severity, recommendations, and predictions</li>
        <li>Review the report and follow the advice</li>
    </ol>
    <em>For best results: Use well-lit images focused on symptoms. Localized advice considers weather and region.</em>
    </div>
    """)

    # Main layout
    with gr.Row():
        with gr.Column(scale=1):
            crop_type = gr.Textbox(
                label="Crop Type (e.g., Tomato, Rice)", 
                placeholder="Enter crop name",
                elem_classes=["analysis-box"]
            )
            location = gr.Textbox(
                label="Location (City, e.g., Mumbai)", 
                placeholder="Enter your city",
                elem_classes=["analysis-box"]
            )
            language = gr.Dropdown(
                choices=["English", "Hindi", "Tamil", "Telugu", "Marathi"],
                value="English",
                label="Preferred Language",
                elem_classes=["analysis-box"]
            )
            upload = gr.File(
                label="📷 Upload Crop Image",
                file_types=[".png", ".jpg", ".jpeg"],
                elem_classes=["analysis-box"]
            )
            
            gr.Markdown("""
            <div style="background-color: #e8f5e9; padding: 10px; border-radius: 5px; margin-top: 15px;">
            <span class="plant-icon">🔍</span> <strong>Tip:</strong> Capture clear images of affected areas for accurate diagnosis.
            </div>
            """)
            
        with gr.Column(scale=2):
            image_output = gr.Image(label="Uploaded Image", elem_classes=["analysis-box"])
            alert_output = gr.HTML(label="Severity Alert", value="")
            report_output = gr.Textbox(
                label="Pest/Disease Analysis Report", 
                elem_classes=["analysis-box"], 
                lines=15
            )
            
            # Feedback section
            with gr.Row():
                feedback_choice = gr.Radio(
                    choices=["Helpful", "Not Accurate", "Partially Helpful"], 
                    label="Was this advisory helpful?",
                    value="Helpful"
                )
                feedback_comment = gr.Textbox(label="Additional Comments (Optional)")
                submit_btn = gr.Button("Submit Feedback", variant="secondary")
            
            feedback_status = gr.Textbox(label="Feedback Status", interactive=False)

    # Event handlers
    upload.change(
        process_detection, 
        inputs=[upload, crop_type, location, language], 
        outputs=[image_output, report_output, alert_output, feedback_status]
    )
    submit_btn.click(
        submit_feedback,
        inputs=[feedback_choice, feedback_comment],
        outputs=[feedback_status]
    )

    # Knowledge Hub / Preventive Education
    with gr.Accordion("📚 Knowledge Hub: Preventive Guides", open=False):
        gr.Markdown("""
        <div class='knowledge-hub'>
        <h3>🌿 How to Scout for Pests in Your Field</h3>
        <ul>
            <li>Walk your field weekly, checking 10-20 plants per row.</li>
            <li>Look for holes in leaves, sticky residue, or wilting.</li>
            <li>Use a magnifying glass for tiny insects.</li>
        </ul>
        
        <h3>🩹 Early Symptoms to Watch For</h3>
        <ul>
            <li>Yellowing or spotted leaves (fungal diseases).</li>
            <li>Chewed edges or webs (caterpillars or mites).</li>
            <li>Sudden wilting in hot weather (aphids or borers).</li>
        </ul>
        
        <h3>🎥 Recommended Videos</h3>
        <ul>
            <li><a href="https://www.youtube.com/watch?v=example_pest_scouting" target="_blank">How to Identify Common Crop Pests (Hindi)</a></li>
            <li><a href="https://www.youtube.com/watch?v=example_organic_control" target="_blank">Organic Pest Control for Small Farms</a></li>
        </ul>
        
        <em>Tip: Join local farmer groups for sharing photos and tips. For expert help, contact your nearest Krishi Vigyan Kendra (KVK).</em>
        </div>
        """)

    # Footer with farming theme
    gr.Markdown("<div class='footer'>🌾 Empowering Small Farmers with AgroSetu | Real-time Alerts & Localized Advice 🌾<br>© 2025 AgroSetu - Smart Crop Advisory System</div>")

# Launch the Gradio interface with debug mode enabled
demo.launch(debug=True, share=False, inbrowser=True)
