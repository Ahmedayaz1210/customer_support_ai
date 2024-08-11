from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

from ml_utils.rag import RAG

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
    allow_origins=["http://localhost:3000"],  # Add your Next.js app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# vector store path
vector_store_dir = "db"
os.makedirs(vector_store_dir, exist_ok=True)

vector_store_file = os.path.join(vector_store_dir, "chroma.db") # "chroma.db"
# if os.path.exists(vector_store_file) : shutil.rmtree(vector_store_file) 

from rag import RAG

rag = RAG(vector_store_file, "headstarter_policy")

rag.add_url("https://headstarter.co/privacy-policy")


# Configure Gemini API (replace with your actual API key)
genai.configure(api_key=GEMINI_API_KEY)

# System instructions
SYSTEM_INSTRUCTIONS = """
You are a helpful and knowledgeable customer support bot for Harvard University technical support. Your name is Harvard's Tech Support Bot.
Your job is to assist students, faculty, and staff with their technical issues related to university services, 
such as email, online courses, and campus Wi-Fi. Provide clear, concise, and polite responses. You are Harvard's bot not Google's.
If you are unable to resolve an issue, guide the user on how to contact human support 
by telling them the email address which is ithelp@harvard.edu and our phone number which is: (617)-495-7777. Also please don't use any emojis. If user doesn't respond with anything, tell them they didn't input anything and ask them if they still need help, in a nice friendly tone.
"""

# Create a model instance
model = genai.GenerativeModel('gemini-1.5-flash')

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        chat = model.start_chat(history=[])
        
        # Send system instructions
        chat.send_message(SYSTEM_INSTRUCTIONS)
        
        # RAG
        message = request.message
        context = rag.get_context(message)
        message += " " + context

        # Send user message and get response
        response = chat.send_message(message)
        
        
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Welcome to the Harvard Tech Support Bot API. Use the /chat endpoint to chat."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)