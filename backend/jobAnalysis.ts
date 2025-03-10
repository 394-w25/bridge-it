export async function fetchJobDetails(jobLink: string) {
    try {
      const response = await fetch(`https://api.jobinfo.com/analyze?url=${encodeURIComponent(jobLink)}`);
      const data = await response.json();
  
      if (!data || data.error) {
        return { error: "Invalid job description link" };
      }
  
      return {
        facts: data.companyFacts || [],
        skills: data.skills || [],
      };
    } catch (error) {
      return { error: "Failed to analyze job description" };
    }
  }
  
  export async function fetchInterviewQuestions(jobTitle: string) {
    try {
      const response = await fetch(`https://api.mockquestions.com/get?title=${encodeURIComponent(jobTitle)}`);
      const data = await response.json();
      return data.questions || [];
    } catch (error) {
      return [];
    }
  }
  