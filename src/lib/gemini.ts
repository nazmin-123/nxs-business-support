import { GoogleGenAI, Type, Schema } from '@google/genai';
import { GeneratedReview, ReviewGenerationResponse } from './types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Could not initialize Gemini client:', err);
  }
}

/**
 * Offline Mock Review Generator (Fallback when API key is missing)
 */
export function generateMockReviews(businessName: string, aiMasterProfile: string): ReviewGenerationResponse {
  const profileItems = aiMasterProfile
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 2);

  const feature1 = profileItems[0] || 'amazing quality and friendly atmosphere';
  const feature2 = profileItems[1] || 'superb customer service';
  const feature3 = profileItems[2] || 'great value and top-tier experience';

  const reviews: GeneratedReview[] = [
    {
      index: 0,
      tone: 'Detailed',
      review_text: `Absolute 5-star experience at ${businessName}! The attention to detail is remarkable. You can really tell they take pride in ${feature1}. The ambiance was great and the staff went out of their way to ensure everything was perfect. Will definitely be returning soon!`,
      suggested_tags: ['Highly Recommended', 'Top Quality', '5 Stars'],
    },
    {
      index: 1,
      tone: 'Concise',
      review_text: `Best spot in town for ${feature1}! Fast service, awesome staff, and 10/10 quality every single time.`,
      suggested_tags: ['Fast & Reliable', '10/10', 'Best Service'],
    },
    {
      index: 2,
      tone: 'Service-Oriented',
      review_text: `Huge shoutout to the team at ${businessName}. Exceptional customer care and ${feature2}. They truly care about their customers and it shows in every interaction. 100% recommend!`,
      suggested_tags: ['Great Service', 'Friendly Staff', 'Customer First'],
    },
  ];

  return {
    business_name: businessName,
    reviews,
  };
}

/**
 * Generate 3 custom 5-star reviews using Gemini 2.5 API or Fallback Engine
 */
export async function generateCustomerReviews(
  businessName: string,
  aiMasterProfile: string
): Promise<ReviewGenerationResponse> {
  if (!ai || !apiKey) {
    // Artificial 600ms latency to simulate real AI synthesis
    await new Promise((resolve) => setTimeout(resolve, 600));
    return generateMockReviews(businessName, aiMasterProfile);
  }

  try {
    const reviewResponseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        business_name: { type: Type.STRING },
        reviews: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              index: { type: Type.INTEGER },
              tone: {
                type: Type.STRING,
                enum: ['Detailed', 'Concise', 'Service-Oriented'],
              },
              review_text: { type: Type.STRING },
              suggested_tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['index', 'tone', 'review_text', 'suggested_tags'],
          },
        },
      },
      required: ['business_name', 'reviews'],
    };

    const systemInstruction = `You are a professional customer review generator for local businesses.
Your goal is to craft 3 distinct, authentic, natural-sounding 5-star Google customer reviews for '${businessName}' based on their AI Master Profile.
Rules:
1. Do NOT sound like corporate marketing text. Use genuine human language, enthusiasm, and realistic consumer phrasing.
2. Provide exactly 3 distinct reviews corresponding to:
   - Index 0: Detailed & Experiential (atmosphere, products, specific highlights)
   - Index 1: Concise & Direct (2-3 punchy sentences)
   - Index 2: Service & Value Focused (staff friendliness, speed, customer care)
3. Return strict JSON matching the schema.`;

    const prompt = `Business Name: ${businessName}

AI Master Profile Context:
${aiMasterProfile}

Generate the 3 customer reviews now.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: 'application/json',
        responseSchema: reviewResponseSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ReviewGenerationResponse;
    }

    return generateMockReviews(businessName, aiMasterProfile);
  } catch (error) {
    console.warn('Gemini API call failed, using mock generator fallback:', error);
    return generateMockReviews(businessName, aiMasterProfile);
  }
}
