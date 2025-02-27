import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getGeminiResponse(prompt: string) {
    const genAI = new GoogleGenerativeAI("AIzaSyChg2dvV4Xeeht0AMSLM06lch4oX4pyk9o");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // const result = await model.generateContent(prompt);
    
    // return result.response.text();
    const prompts = {
        summary: `Provide a concise summary of the following. Format each key point as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks:\n\n${prompt}`,

        hardSkills: `List the technical (hard) skills demonstrated in the following text. Format each skill as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks:\n\n${prompt}`,

        softSkills: `List the soft skills demonstrated in the following text. Format each skill as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks:\n\n${prompt}`,

        reflection: `Write a reflection for an interview based on the following. Use paragraph format. Do NOT use bullet points, asterisks (*), or dashes (-):\n\n${prompt}`
    };

    // Generate responses for each category
    const results = await Promise.all([
        model.generateContent(prompts.summary),
        model.generateContent(prompts.hardSkills),
        model.generateContent(prompts.softSkills),
        model.generateContent(prompts.reflection),
    ]);
    // const replaceAsteriskWithDot = (text: string) => text.replace(/\*/g, "•");


    return {
        summary: await results[0].response.text(),
        hardSkills: await results[1].response.text(),
        softSkills: await results[2].response.text(),
        reflection: await results[3].response.text(),
    };
}