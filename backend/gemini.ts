import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyChg2dvV4Xeeht0AMSLM06lch4oX4pyk9o');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function getGeminiResponse(prompt: string) {
  const prompts = {
    type: `Identify the type of achievement (academic, personal, professional, or other) in the following text. Format your response as a single word without quotation marks:\n\n${prompt}`,
    title: `Generate a concise title for the following text. Format it as a single sentence. Do NOT use quotation marks:\n\n${prompt}`,
    summary: `Provide a concise summary of the following. Format each key point as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks:\n\n${prompt}`,
    hardSkills: `List the technical (hard) skills demonstrated in the following text. Format each skill as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks:\n\n${prompt}`,
    softSkills: `List the soft skills demonstrated in the following text. Format each skill as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks:\n\n${prompt}`,
    reflection: `Write a reflection for an interview based on the following. Use paragraph format. Do NOT use bullet points, asterisks (*), or dashes (-):\n\n${prompt}`,
    categories: `
        From the following text, identify which categories from the set {academic, personal, leadership, research, project} apply.
        Only return the category names as a **comma-separated list**.
        Do not include explanations, extra words, bullet points, or special characters.
        If multiple categories apply, separate them only with commas.

        Text:
        ${prompt}
        `,
    shortSummery: `Summerize the following text from first person perspective. Format your response as a single sentence without quotation marks:\n\n${prompt}`,
  };

  const results = await Promise.all([
    model.generateContent(prompts.type),
    model.generateContent(prompts.title),
    model.generateContent(prompts.summary),
    model.generateContent(prompts.hardSkills),
    model.generateContent(prompts.softSkills),
    model.generateContent(prompts.reflection),
    model.generateContent(prompts.categories),
    model.generateContent(prompts.shortSummery),
  ]);

  return {
    type: await results[0].response.text(),
    title: await results[1].response.text(),
    summary: await results[2].response.text(),
    hardSkills: await results[3].response.text(),
    softSkills: await results[4].response.text(),
    reflection: await results[5].response.text(),
    categories: await results[6].response.text(),
    shortSummery: await results[7].response.text(),
  };
}

// export async function getGeminiSummary(prompt: string){
//   const prompts = {
//     summery: `Summerize the following text from first person perspective. Format your response as a single sentence without quotation marks:\n\n${prompt}`,
//   }

//   const result = await model.generateContent(prompts.summery);

//   return {
//     summery: await result.response.text(),
//   };

// }