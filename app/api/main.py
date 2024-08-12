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
from ml_utils.rag import RAG

rag = RAG(vector_store_file, "headstarter_policy")

rag.add_url("https://headstarter.co/privacy-policy")
rag.add_url("https://headstarter.co/info")


# Configure Gemini API (replace with your actual API key)
genai.configure(api_key=GEMINI_API_KEY)

# System instructions
SYSTEM_INSTRUCTIONS = """
You are Headstarter's Tech Support Bot, a knowledgeable assistant for Headstarter AI's community of emerging software engineers. Your role is to help users with technical issues, provide information about Headstarter's programs, and offer guidance on career development in software engineering. Give clear, concise, and friendly responses. If you can't resolve an issue, direct the user to human support. If the user doesn't input anything, politely ask if they still need assistance. Don't add any emojis. Let's get started!
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
    return {"message": "Welcome to the Headstarter Tech Support Bot API. Use the /chat endpoint to chat."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)