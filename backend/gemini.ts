import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiResponse(prompt: string) {
    const genAI = new GoogleGenerativeAI("AIzaSyChg2dvV4Xeeht0AMSLM06lch4oX4pyk9o");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    
    return result.response.text();
}