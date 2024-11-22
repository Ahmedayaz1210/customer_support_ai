# 🤖 Customer Support AI

<div align="center">

*Intelligent AI-powered customer service chatbot*

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://customer-support-ai-taupe.vercel.app/)
[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-000000?style=flat&logo=Next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=flat&logo=material-ui&logoColor=white)](https://mui.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-FF9900?style=flat&logo=aws-lambda&logoColor=white)](https://aws.amazon.com/lambda/)

[Features](#-key-features) • [Installation](#-installation-and-setup) • [Usage](#-usage-guide) • [Challenges](#-challenges-and-learnings) • [Future Improvements](#-future-improvements)

<img src="/public/Screenshot 2024-09-19 232738.png" alt="View" width="400"/>
<img src="/public/Screenshot 2024-09-19 232814.png" alt="Query View" width="400"/>
</div>

## 🌟 Project Overview

Customer Support AI is an advanced AI-powered chatbot designed specifically for Headstarter AI, a platform that helps software engineers create projects. This intelligent chatbot provides comprehensive answers to all questions related to the platform, enhancing user experience and streamlining customer support.

### 🎯 Key Features

- 💬 **AI-Powered Responses**: Utilizes Google Gemini API for intelligent and context-aware answers
- 🧠 **RAG Implementation**: Employs Retrieval-Augmented Generation for accurate and relevant information retrieval
- 🔍 **Custom Knowledge Base**: Integrates Headstarter AI's specific data for tailored responses
- ⚡ **Real-time Interaction**: Provides instant responses to user queries
- 🌐 **Web-based Interface**: User-friendly chat interface accessible through any web browser
- 🔒 **Secure Backend**: Robust backend hosted on AWS Lambda for scalable and secure operations

## 🛠 Technologies Used

### Frontend
- ⚛️ Next.js & React
- 🎨 Material-UI
- 🤖 Google Gemini API

### Backend
- 🐍 Python with FastAPI
- 🔗 LangChain
- 🗄️ Chroma DB
- 🤗 Hugging Face models
- ☁️ AWS Lambda

## 💻 Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Ahmedayaz1210/customer-support-ai.git
   cd customer-support-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Material-UI:
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   ```

4. Install Google Generative AI:
   ```bash
   npm i @google/generative-ai
   ```

5. Environment Setup:
   Create a `.env.local` file in the root directory and add:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

6. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📘 Usage Guide

1. Visit the [live demo](https://customer-support-ai-taupe.vercel.app/)
2. Type your question or query related to Headstarter AI in the chat interface
3. Receive instant, AI-generated responses based on the platform's knowledge base
4. Continue the conversation to get more detailed information or ask follow-up questions

## 💡 Challenges and Learnings

- Successfully implemented Retrieval-Augmented Generation (RAG) for the first time, involving complex processes of data scraping, chunking, and integration with Chroma DB
- Overcame significant challenges in hosting the backend on AWS Lambda, requiring three days of troubleshooting and configuration to achieve optimal performance

## 🚀 Future Improvements

1. 📊 Implement analytics to track common user queries and improve response accuracy
2. 🌐 Expand the knowledge base to cover a wider range of topics
3. 🗣️ Add multi-language support for international users
4. 🔗 Integrate with popular messaging platforms for broader accessibility
5. 👤 Implement user authentication for personalized experiences

## 🤝 Contributing

Contributions to enhance Customer Support AI are welcome! Feel free to fork the repository, make improvements, and submit pull requests. Together, we can make this AI chatbot even more powerful and user-friendly.


## 🖥️ Backend Repository

Excited to dive deeper into the backend workings of our Customer Support AI? We've got you covered! 🎉

For a comprehensive look at the backend code, including our FastAPI implementation, and LangChain integration, head over to our dedicated backend repository:
https://github.com/Ahmedayaz1210/customersupportai_backend/

This is where all the AI magic happens behind the scenes. Whether you're a fellow developer, an AI enthusiast, or just curious about how it all works, you'll find a treasure trove of code and configurations here.

Feel free to explore, learn, and if you're feeling inspired, contribute to making our AI even smarter! 🧠💻

Happy Coding!🚀
---

<div align="center">

[⬆ Back to top](#-customer-support-ai)

</div>
