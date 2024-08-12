from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import re
from mangum import Mangum

# Load environment variables
load_dotenv()

# Get the API key from the environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Ensure the API key is set
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# System instructions
SYSTEM_INSTRUCTIONS = """
You are Headstarter's Tech Support Bot, a knowledgeable assistant for Headstarter AI's community of emerging software engineers. Your role is to help users with technical issues, provide information about Headstarter's programs, and offer guidance on career development in software engineering. Give clear, concise, and friendly responses. If you can't resolve an issue, direct the user to human support. If the user doesn't input anything, politely ask if they still need assistance. Don't add any emojis. Please provide your responses in plain text without using Markdown formatting or special characters for emphasis. Let's get started!
"""

# Create a model instance
model = genai.GenerativeModel('gemini-1.5-flash')

class ChatRequest(BaseModel):
    message: str

def remove_markdown(text):
    # Remove bold/italic markers
    text = re.sub(r'\*\*?', '', text)
    # Remove bullet points
    text = re.sub(r'^\s*[\*\-+]\s+', '', text, flags=re.MULTILINE)
    # Remove backticks for code blocks
    text = re.sub(r'`{1,3}', '', text)
    # Remove hashtags for headers
    text = re.sub(r'^#+\s+', '', text, flags=re.MULTILINE)
    # Remove underscores for emphasis
    text = re.sub(r'_{1,2}', '', text)
    # Remove square brackets and parentheses for links
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    return text.strip()

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        chat = model.start_chat(history=[])
        
        # Send system instructions
        chat.send_message(SYSTEM_INSTRUCTIONS)
        
        # Send user message and get response
        response = chat.send_message(request.message)
        
        # Remove Markdown formatting from the response
        cleaned_response = remove_markdown(response.text)
        
        return {"response": cleaned_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api")
async def root():
    return {"message": "Welcome to the Headstarter Tech Support Bot API. Use the /api/chat endpoint to chat."}

# Handler for Vercel serverless function
handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)