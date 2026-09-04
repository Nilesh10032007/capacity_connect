import Groq from 'groq-sdk';

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'test_key_change_me') {
    return null; // Return null if not properly configured
  }
  return new Groq({ apiKey });
};

export const generateTrainerMatchExplanation = async (trainerData: any, criteria: any): Promise<string> => {
  const groq = getGroqClient();
  if (!groq) {
    return `Matched based on internal system score algorithm evaluating expertise in ${criteria.subject}.`;
  }

  try {
    const prompt = `You are an AI matching assistant. Explain why this trainer is a good match for the course.
    Criteria: Subject ${criteria.subject}, Required Competency: ${criteria.requiredCompetency}.
    Trainer: ${trainerData.name}, Skills: ${trainerData.skills.join(', ')}, Experience: ${trainerData.experienceYears} years.
    Keep it very concise, bullet points, max 3 lines.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });

    return chatCompletion.choices[0]?.message?.content || 'Matched successfully.';
  } catch (error) {
    console.error('Groq AI Error:', error);
    return 'Matched successfully (AI unavailable).';
  }
};
