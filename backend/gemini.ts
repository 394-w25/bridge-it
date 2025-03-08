import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyChg2dvV4Xeeht0AMSLM06lch4oX4pyk9o');
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-lite',
  systemInstruction: `You are an AI interview coach named Bridget that helps people prepare for interviews. 
                      Your job is to read in user journals and provide concise feedback and information relevant to interviews. 
                      Do not make up information that is not directly given.`
});

// initializes chatbot session with gemini
export async function startGeminiChat() {
  const chat = model.startChat({
    history: [
      {
        role: "model",
        parts:[{ text: `Alright, you've got a job opportunity in sight—let's make sure you shine! I've broken down the role and compared it with your experiences. Now, I can help you:
                        1. Understand what this job really needs
                        2. Highlight your best skills for it
                        3. Prepare with interview questions that might come up
                        Feeling ready? I can walk you through any of these—just say the word!` }]
      }]
  })
  return chat;
}

// sends message to chatbot given a session
export async function getGeminiChatResponse(chat: ChatSession, prompt: string) {
  let result = await chat.sendMessage(prompt);
  return result.response.text();
}

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
    type: results[0].response.text(),
    title: results[1].response.text(),
    summary: results[2].response.text(),
    hardSkills: results[3].response.text(),
    softSkills: results[4].response.text(),
    reflection: results[5].response.text(),
    categories: results[6].response.text(),
    shortsummary: results[7].response.text(),
  };
}

export async function getGeminiJobInfo(joburl: string, positionName: string, allEntries: EntryInput[]){
  const formattedEntries = allEntries.map(entry => `
    Title: ${entry.title}
    Content: ${entry.content}
    Summary: ${entry.summary}
    Hard Skills: ${entry.hardSkills}
    Soft Skills: ${entry.softSkills}
    Reflection: ${entry.reflection}
  `).join('\n\n');

  const prompts = {
    companyInfo: `Read carefully the job descriptions at ${joburl}. Research this company and provide an overview of 3-5 important facts about this company, like basic information, core products, competitive edges...
    Format each key point as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks:`,
    keyStrength: `Given my experiences below, list 3-5 of my key strengths that aligns me well for this job in ${positionName}. 
    Format each strength as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks: ${formattedEntries}`,
    mockInterviewQ: `Give me 3-7 mock interview questions that are tailored to my experience in the entries below and the job description that may come up during an interview for ${positionName}. 
    Format each question as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks: ${formattedEntries}`,
  }

  const results = await Promise.all([
    model.generateContent(prompts.companyInfo),
    model.generateContent(prompts.keyStrength),
    model.generateContent(prompts.mockInterviewQ),
  ])

  return {
    companyInfo: await results[0].response.text(),
    keyStrength: await results[1].response.text(),
    mockInterviewQ: await results[2].response.text(),
  };
}