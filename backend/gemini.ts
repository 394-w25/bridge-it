import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import { EntryInput } from './dbFunctions';

// see https://ai.google.dev/gemini-api/docs/api-key?authuser=1
const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash-lite',
  systemInstruction: `You are an AI interview coach named Bridget that helps people prepare for interviews. 
                      Your job is to read in user journals and provide concise feedback and information relevant to interviews. 
                      Do not make up information that is not directly given.`
});

// initializes chatbot session with gemini
export async function startGeminiChat(jobInfo: string = "") {
  const chat = model.startChat({
    history: [
      {role: "user", parts:[ { text: `I'm interested in applying to this job and I want to hear your thoughts on it. Here is the job info: ${jobInfo}` } ]},
      {
        role: "model", 
        parts:[{ text: `Alright, you've got a job opportunity in sight—let's make sure you shine! I've broken down the role and compared it with your experiences. Now, I can help you:
                        1. Understand what this job really needs
                        2. Highlight your best skills for it
                        3. Prepare with interview questions that might come up
                        Feeling ready? I can walk you through any of these—just say the word!`}]
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
    hardSkills: `Only list the technical (hard) skills demonstrated in the following text. Format each skill as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks. Also, no introductory clauses before bullet points:\n\n${prompt}`,
    softSkills: `Only list the soft skills demonstrated in the following text. Format each skill as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks. Also, no introductory clauses before bullet points:\n\n${prompt}`,
    reflection: `Only write a reflection for an interview based on the following. Use paragraph format. Do NOT use bullet points, asterisks (*), or dashes (-). Also, no introductory clauses before the reflection:\n\n${prompt}`,
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

  let htmlContent;

  try {
    // NOTE: you need to go to this URL and activate demo access for url fetching to work
    htmlContent = await fetch("https://cors-anywhere.herokuapp.com/" + joburl).then(res => res.text());
  }
  catch (error) {
    htmlContent = "Error fetching job description";
  }

  const prompt = `Given the HTML content of a job posting, only return a JSON structure with companyInfo, keyStrength, and mockInterviewQ as the keys. 
  Do not add additional text outside of the JSON structure.
  The format should look like this:
  {
    "companyInfo": "• Fact 1\n• Fact 2\n• Fact 3",
    "keyStrength": "• Strength 1\n• Strength 2\n• Strength 3",
    "mockInterviewQ": "• Question 1\n• Question 2\n• Question
  }

  The values for each key should be generated according to the instructions below:

  The companyInfo should be a list of important facts about the company. 
  The keyStrength should be a list of my strengths that align with the job description, taken from my previous experiences listed here: ${formattedEntries}.
  The mockInterviewQ should be a list of questions tailored to the job description and the user's experience.
  Format each point as a separate line starting with "• " (a bullet point). Do NOT use asterisks (*), dashes (-), or quotation marks.

  The HTML content of the job posting is as follows:
  ${htmlContent}
  `

  const result = (await model.generateContent(prompt)).response.text();
  console.log(result);

  try {
    return JSON.parse(result.substring(result.indexOf('{'), result.lastIndexOf('}') + 1));
  }
  catch (error) {
    return {
      companyInfo: result.substring(result.indexOf('{'), result.lastIndexOf('}') + 1),
      keyStrength: "",
      mockInterviewQ: "",
    }
  }
}

export async function generateBlurbFromGemini(entries: EntryInput[], userName: string): Promise<string> {
  const formattedEntries = entries.map(entry => `
    Title: ${entry.title}
    Content: ${entry.content}
    Summary: ${entry.summary}
    Hard Skills: ${entry.hardSkills}
    Soft Skills: ${entry.softSkills}
    Reflection: ${entry.reflection}
  `).join('\n\n');

  const prompt = `Based on the following journal entries, generate a short and concise blurb that summarizes ${userName}'s skills, experiences, and aspirations in a similar style to this example: "John is an aspiring data analyst passionate about problem-solving and data visualization. He has recently collaborated on a renewable energy project, applying his strong analytical skills to real-world challenges. He aims to build expertise in machine learning and business intelligence."
  ${formattedEntries}`;

  const response = await model.generateContent(prompt);
  return response.response.text();
}