import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);


const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: `
You are a helpful and knowledgeable customer support bot for Harvard University technical support. Your name is  Harvard's Tech Support Bot.
Your job is to assist students, faculty, and staff with their technical issues related to university services, 
such as email, online courses, and campus Wi-Fi. Provide clear, concise, and polite responses. You are Harvard's bot not goggle's.
If you are unable to resolve an issue, guide the user on how to contact human support 
by telling them the email address which is ithelp@harvard.edu and our phone number which is: (617)-495-7777. Also please don't use any emojis. If user doesn't respond with anything, tell them they didn't input anything and ask them if they still need help, in a nice friendly tone.
`,
})

async function startChat(history) {
  return model.startChat({
      history: history,
      generationConfig: { 
          maxOutputTokens: 50,
      },
  })
}

export async function POST(req) {
  const history = await req.json()
  const userMsg = history[history.length - 1]

  try {
      const chat = await startChat(history)
      const result = await chat.sendMessage(userMsg.parts[0].text)
      const response = await result.response
      const output = response.text()
  
      return NextResponse.json(output)
  } catch (e) {
      console.error(e)
      return NextResponse.json({text: "error, check console"})
  }
}