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
        From the following text, identify which categories from the set {Academic, Personal, Leadership, Research, Project} apply.
        Only return the exact category names as written in the set above, in a comma-separated list.
        Do not include explanations, extra words, bullet points, or special characters.
        If multiple categories apply, separate them only with commas.

        Text:
        ${prompt}
        `,
    shortsummary: `summarize the following text from first person perspective. Keep it concise, under 15 words. Format your response as a single sentence without quotation marks:\n\n${prompt}`,
  };

  const results = await Promise.all([
    model.generateContent(prompts.type),
    model.generateContent(prompts.title),
    model.generateContent(prompts.summary),
    model.generateContent(prompts.hardSkills),
    model.generateContent(prompts.softSkills),
    model.generateContent(prompts.reflection),
    model.generateContent(prompts.categories),
    model.generateContent(prompts.shortsummary),
  ]);

  return {
    type: await results[0].response.text(),
    title: await results[1].response.text(),
    summary: await results[2].response.text(),
    hardSkills: await results[3].response.text(),
    softSkills: await results[4].response.text(),
    reflection: await results[5].response.text(),
    categories: await results[6].response.text(),
    shortsummary: await results[7].response.text(),
  };
}

export async function getGeminiJobInfo(joburl: string, positionName: string, selectedExperiences: []){
  const prompts = {
    jobRoleSummary: `Read Carefully the job descriptions at ${joburl}. Provide a concise summary of the job description. Format each key point as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks:`,
    keyStrength: `Given my experiences ${selectedExperiences}, concisely list what my key strengths and alignments are for this job. Format each strength as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks: `,
    mockInterviewQ: `Give me some mock interview questions that are tailored to my experience and the job description that may come up during an interview for ${positionName}. Format each question as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks: `,
  }

  const results = await Promise.all([
    model.generateContent(prompts.jobRoleSummary),
    model.generateContent(prompts.keyStrength),
    model.generateContent(prompts.mockInterviewQ),
  ])

  return {
    jobRoleSummary: await results[0].response.text(),
    keyStrength: await results[1].response.text(),
    mockInterviewQ: await results[2].response.text(),
  };
}