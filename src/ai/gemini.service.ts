import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private ai: GoogleGenAI;
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Cannot fount gemeni api key');
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  async generateCoverLetter(
    jobTitle: string,
    company: string,
    description?: string,
  ): Promise<string> {
    const prompt = `
    ROLE:
    You are a skilled Fullstack Developer looking for a job.
    Your writing style is: direct, casual professional, concise, and human-like.
    Your English level is B1 (Intermediate) — simple grammar, no complex academic words.

    TASK:
    Write a cold message (cover letter) for the position of "${jobTitle}" at "${company}".
    
    INPUT CONTEXT (Job Description):
    """
    ${description}
    """

    STRICT CONSTRAINTS (Follow or fail):
    1. Language: Detect the language of the Job Description. Write the response IN THE SAME LANGUAGE.
    2. Length: STRICTLY MAXIMUM 4 sentences.
    3. Tone: NO enthusiastic fluff (e.g., ban words like: "thrilled", "esteemed", "passion", "seamlessly align", "opportunity").
    4. Structure: 
       - Sentence 1: Hi + mention 1 specific tech stack requirement you saw in their description.
       - Sentence 2: Mention you have experience with it (give a concrete simplified example).
       - Sentence 3: Briefly mention why you like their specific product/project (from description).
       - Sentence 4: Simple call to action (e.g., "Let's chat?", "Attached my CV.").

    GOAL:
    The recruiter must think a real human typed this in 30 seconds. Do not sign with a name.
  `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || 'Generation error';
  }
}
