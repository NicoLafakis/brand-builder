/**
 * OpenAI Service for Brand Builder
 *
 * This service integrates GPT models to provide intelligent reasoning
 * for brand personality analysis, tone dimensions, and voice generation.
 *
 * Model Strategy:
 * - DATA tasks (gpt-4o-mini): Fast, cheap extraction - $0.15/$0.60 per 1M tokens
 * - REASONING tasks (gpt-4.1-mini): Better instruction following for nuanced analysis - $0.40/$1.60 per 1M tokens
 *
 * The AI helps with:
 * - Analyzing brand archetype from website content (semantic understanding vs keyword matching)
 * - Determining tone dimensions (formal/casual, serious/funny, etc.)
 * - Calculating Aaker brand personality dimensions
 * - Generating personalized brand voice guidelines with nuanced reasoning
 */

import type {
  BrandArchetype,
  BrandPersonality,
  BrandVoice,
  ExtractedContent
} from '../types/brand';
import { ARCHETYPES } from '../utils/personality';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Model selection based on task type
const MODELS = {
  // Fast/cheap model for structured data extraction
  DATA: 'gpt-4o-mini',
  // Better model for nuanced reasoning (tone analysis, voice generation)
  REASONING: 'gpt-4.1-mini',
};

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

type ModelType = 'DATA' | 'REASONING';

/**
 * Makes a request to the OpenAI API with specified model type
 */
async function callOpenAI(
  messages: OpenAIMessage[],
  modelType: ModelType = 'DATA',
  temperature = 0.7
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('[OpenAI] OPENAI_API_KEY not set');
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const model = MODELS[modelType];
  console.log(`[OpenAI] Calling ${model} for ${modelType} task...`);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[OpenAI] API error: ${response.status}`, error);
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data: OpenAIResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';
    console.log(`[OpenAI] ${model} responded (${content.length} chars)`);
    return content;
  } catch (error) {
    console.error(`[OpenAI] Request failed:`, error);
    throw error;
  }
}

/**
 * System prompt that explains the brand builder context to the AI
 */
const BRAND_BUILDER_CONTEXT = `You are an expert brand strategist and analyst working within a Brand Kit Generator application.

Your role is to analyze website content and help determine brand characteristics including:
1. Brand Archetypes (based on Jungian psychology): Innocent, Explorer, Sage, Hero, Magician, Outlaw, Everyman, Lover, Jester, Caregiver, Ruler, Creator
2. Tone Dimensions (1-10 scales):
   - Formality vs Casual (1 = very formal, 10 = very casual)
   - Serious vs Funny (1 = very serious, 10 = very funny)
   - Respectful vs Irreverent (1 = very respectful, 10 = irreverent)
   - Matter-of-fact vs Enthusiastic (1 = dry/factual, 10 = very enthusiastic)
3. Aaker Brand Personality Dimensions (0-10 scores):
   - Sincerity: honest, genuine, cheerful, down-to-earth
   - Excitement: daring, spirited, imaginative, up-to-date
   - Competence: reliable, intelligent, successful, confident
   - Sophistication: upper class, glamorous, charming, elegant
   - Ruggedness: outdoorsy, tough, rugged, strong

You analyze the semantic meaning of content, writing style, word choices, and overall messaging to provide accurate assessments.
Always respond with valid JSON as specified in each prompt.`;

/**
 * Analyzes brand archetype using AI semantic understanding
 */
export async function analyzeArchetypeWithAI(content: ExtractedContent): Promise<BrandArchetype> {
  const contentSummary = prepareContentForAnalysis(content);

  const messages: OpenAIMessage[] = [
    { role: 'system', content: BRAND_BUILDER_CONTEXT },
    {
      role: 'user',
      content: `Analyze the following website content and determine the brand archetype.

Website Content:
${contentSummary}

Based on the tone, messaging, values, and overall brand positioning evident in this content, identify:
1. The PRIMARY brand archetype (choose one: Innocent, Explorer, Sage, Hero, Magician, Outlaw, Everyman, Lover, Jester, Caregiver, Ruler, Creator)
2. A SECONDARY archetype if applicable (or null if the brand is very focused)
3. A brief description of why this archetype fits
4. 5 key traits that define this brand
5. 4 tone attributes that characterize how this brand communicates

Respond ONLY with valid JSON in this exact format:
{
  "primary": "ArchetypeName",
  "secondary": "ArchetypeName or null",
  "description": "Brief description of the brand personality",
  "traits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
  "toneAttributes": ["attr1", "attr2", "attr3", "attr4"]
}`
    }
  ];

  try {
    // Use DATA model for structured archetype extraction
    const response = await callOpenAI(messages, 'DATA', 0.5);
    const parsed = JSON.parse(response);

    return {
      primary: parsed.primary || 'Everyman',
      secondary: parsed.secondary || undefined,
      description: parsed.description || ARCHETYPES.everyman.description,
      traits: parsed.traits?.slice(0, 5) || ARCHETYPES.everyman.traits,
      toneAttributes: parsed.toneAttributes?.slice(0, 4) || ARCHETYPES.everyman.toneAttributes,
    };
  } catch (error) {
    console.error('AI archetype analysis failed:', error);
    // Return a default archetype on failure
    return ARCHETYPES.everyman;
  }
}

/**
 * Analyzes tone dimensions using AI with advanced reasoning
 * Uses the REASONING model for nuanced tone understanding
 */
export async function analyzeToneWithAI(content: ExtractedContent): Promise<BrandPersonality['tone']> {
  const contentSummary = prepareContentForAnalysis(content);

  const messages: OpenAIMessage[] = [
    { role: 'system', content: BRAND_BUILDER_CONTEXT },
    {
      role: 'user',
      content: `Analyze the following website content and determine the brand's tone dimensions.

Website Content:
${contentSummary}

Think deeply about the brand's communication style. Consider not just what they say, but HOW they say it.
Look for subtle cues in:
- Sentence structure and rhythm
- Word choices and vocabulary level
- Punctuation patterns (exclamation points, ellipses, etc.)
- Use of questions, commands, or statements
- Emotional undertones and energy levels
- Cultural references or industry jargon

Score these dimensions from 1-10:

1. Formality vs Casual (1 = very formal/corporate, 10 = very casual/friendly)
   Consider: sentence structure, vocabulary complexity, use of contractions, direct address

2. Serious vs Funny (1 = very serious/professional, 10 = playful/humorous)
   Consider: use of humor, lighthearted language, emoji usage, playful phrases

3. Respectful vs Irreverent (1 = very respectful/traditional, 10 = irreverent/rebellious)
   Consider: challenging conventions, bold statements, traditional vs disruptive messaging

4. Matter-of-fact vs Enthusiastic (1 = dry/factual, 10 = very enthusiastic/excited)
   Consider: exclamation points, superlatives, emotional language, energy level

Respond ONLY with valid JSON in this exact format:
{
  "formalityCasual": <number 1-10>,
  "seriousFunny": <number 1-10>,
  "respectfulIrreverent": <number 1-10>,
  "matterOfFactEnthusiastic": <number 1-10>,
  "reasoning": "Detailed explanation of why these scores were assigned, citing specific examples from the content"
}`
    }
  ];

  try {
    // Use REASONING model for nuanced tone analysis
    const response = await callOpenAI(messages, 'REASONING', 0.5);
    const parsed = JSON.parse(response);

    return {
      formalityCasual: clampScore(parsed.formalityCasual),
      seriousFunny: clampScore(parsed.seriousFunny),
      respectfulIrreverent: clampScore(parsed.respectfulIrreverent),
      matterOfFactEnthusiastic: clampScore(parsed.matterOfFactEnthusiastic),
    };
  } catch (error) {
    console.error('AI tone analysis failed:', error);
    // Return neutral scores on failure
    return {
      formalityCasual: 5,
      seriousFunny: 5,
      respectfulIrreverent: 5,
      matterOfFactEnthusiastic: 5,
    };
  }
}

/**
 * Analyzes Aaker brand personality dimensions using AI
 * Uses DATA model for structured dimension scoring
 */
export async function analyzeAakerDimensionsWithAI(content: ExtractedContent): Promise<BrandPersonality['dimensions']> {
  const contentSummary = prepareContentForAnalysis(content);

  const messages: OpenAIMessage[] = [
    { role: 'system', content: BRAND_BUILDER_CONTEXT },
    {
      role: 'user',
      content: `Analyze the following website content and score the Aaker Brand Personality dimensions.

Website Content:
${contentSummary}

Score each dimension from 0-10 based on how strongly the brand exhibits these characteristics:

1. Sincerity (0-10): honest, genuine, cheerful, wholesome, down-to-earth, family-oriented
2. Excitement (0-10): daring, spirited, imaginative, up-to-date, exciting, cool, young, trendy
3. Competence (0-10): reliable, intelligent, successful, confident, leader, technical, secure
4. Sophistication (0-10): upper class, glamorous, charming, elegant, prestigious, luxury
5. Ruggedness (0-10): outdoorsy, tough, rugged, strong, masculine, athletic, durable

Respond ONLY with valid JSON in this exact format:
{
  "sincerity": <number 0-10>,
  "excitement": <number 0-10>,
  "competence": <number 0-10>,
  "sophistication": <number 0-10>,
  "ruggedness": <number 0-10>,
  "reasoning": "Brief explanation of the dominant dimensions and why"
}`
    }
  ];

  try {
    // Use DATA model for structured dimension scoring
    const response = await callOpenAI(messages, 'DATA', 0.5);
    const parsed = JSON.parse(response);

    return {
      sincerity: clampDimension(parsed.sincerity),
      excitement: clampDimension(parsed.excitement),
      competence: clampDimension(parsed.competence),
      sophistication: clampDimension(parsed.sophistication),
      ruggedness: clampDimension(parsed.ruggedness),
    };
  } catch (error) {
    console.error('AI Aaker dimensions analysis failed:', error);
    // Return neutral scores on failure
    return {
      sincerity: 0,
      excitement: 0,
      competence: 0,
      sophistication: 0,
      ruggedness: 0,
    };
  }
}

/**
 * Generates comprehensive brand voice guidelines using AI with advanced reasoning
 * Uses REASONING model for nuanced voice, tone, and cadence generation
 */
export async function generateBrandVoiceWithAI(
  personality: BrandPersonality,
  content: ExtractedContent
): Promise<BrandVoice> {
  const contentSummary = prepareContentForAnalysis(content);

  const messages: OpenAIMessage[] = [
    { role: 'system', content: BRAND_BUILDER_CONTEXT },
    {
      role: 'user',
      content: `Generate comprehensive brand voice guidelines based on the analyzed brand personality and website content.

Brand Personality Analysis:
- Primary Archetype: ${personality.archetype.primary}
- Secondary Archetype: ${personality.archetype.secondary || 'None'}
- Description: ${personality.archetype.description}
- Traits: ${personality.archetype.traits.join(', ')}
- Tone Attributes: ${personality.archetype.toneAttributes.join(', ')}

Tone Dimensions (1-10 scale):
- Formality vs Casual: ${personality.tone.formalityCasual} ${personality.tone.formalityCasual <= 3 ? '(formal)' : personality.tone.formalityCasual >= 7 ? '(casual)' : '(balanced)'}
- Serious vs Funny: ${personality.tone.seriousFunny} ${personality.tone.seriousFunny <= 3 ? '(serious)' : personality.tone.seriousFunny >= 7 ? '(playful)' : '(balanced)'}
- Respectful vs Irreverent: ${personality.tone.respectfulIrreverent} ${personality.tone.respectfulIrreverent <= 3 ? '(traditional)' : personality.tone.respectfulIrreverent >= 7 ? '(bold)' : '(balanced)'}
- Matter-of-fact vs Enthusiastic: ${personality.tone.matterOfFactEnthusiastic} ${personality.tone.matterOfFactEnthusiastic <= 3 ? '(measured)' : personality.tone.matterOfFactEnthusiastic >= 7 ? '(energetic)' : '(balanced)'}

Aaker Dimensions (0-10 scale):
- Sincerity: ${personality.dimensions.sincerity}
- Excitement: ${personality.dimensions.excitement}
- Competence: ${personality.dimensions.competence}
- Sophistication: ${personality.dimensions.sophistication}
- Ruggedness: ${personality.dimensions.ruggedness}

Website Content:
${contentSummary}

Think carefully about how this brand should communicate. Consider:
1. The emotional connection they want to build with their audience
2. How their archetype influences word choice and messaging style
3. The rhythm and pacing that would feel authentic to this brand
4. Specific linguistic patterns that would reinforce their identity

Generate detailed brand voice guidelines including:

1. Three distinct voice principles that capture the essence of how this brand should communicate.
   Each principle should be actionable and memorable, with real-world examples.

2. Vocabulary guidance that reflects the brand's personality - specific words and phrases
   that feel "on brand" vs. those that would feel jarring or off-putting.

3. A rich tone description that paints a picture of how the brand sounds when it speaks.
   Go beyond basic descriptors - explain the emotional quality and character.

4. A thoughtful cadence description covering:
   - Typical sentence length and variation
   - Paragraph structure
   - Use of fragments, questions, or exclamations
   - Pacing and rhythm patterns
   - How the brand builds to key points

Respond ONLY with valid JSON in this exact format:
{
  "principles": [
    {
      "name": "Principle name",
      "description": "What this principle means for the brand",
      "howToApply": "Practical guidance for applying this principle",
      "example": "Example of this principle in action",
      "whatNotToDo": "Common mistakes to avoid"
    }
  ],
  "vocabulary": {
    "description": "Overall vocabulary guidance for the brand",
    "wordsToUse": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8"],
    "wordsToAvoid": ["word1", "word2", "word3", "word4"]
  },
  "toneDescription": "Rich, comprehensive description of how the brand should sound - its character, warmth, and emotional quality",
  "cadenceDescription": "Detailed guidance on sentence structure, rhythm, pacing, and how to build momentum in copy"
}`
    }
  ];

  try {
    // Use REASONING model for nuanced voice generation
    const response = await callOpenAI(messages, 'REASONING', 0.7);
    const parsed = JSON.parse(response);

    return {
      principles: parsed.principles?.slice(0, 3) || getDefaultPrinciples(personality),
      vocabulary: {
        description: parsed.vocabulary?.description || `Our vocabulary reflects our ${personality.archetype.primary} archetype.`,
        wordsToUse: parsed.vocabulary?.wordsToUse?.slice(0, 10) || personality.archetype.traits.map(t => t.toLowerCase()),
        wordsToAvoid: parsed.vocabulary?.wordsToAvoid?.slice(0, 6) || ['inappropriate', 'offensive'],
      },
      toneDescription: parsed.toneDescription || `Our tone is ${personality.archetype.toneAttributes.join(', ').toLowerCase()}.`,
      cadenceDescription: parsed.cadenceDescription || 'We maintain a balanced rhythm with varied sentence lengths.',
    };
  } catch (error) {
    console.error('AI brand voice generation failed:', error);
    // Return default voice on failure
    return getDefaultBrandVoice(personality);
  }
}

/**
 * Prepares extracted content for AI analysis by creating a summarized version
 */
function prepareContentForAnalysis(content: ExtractedContent): string {
  const sections: string[] = [];

  if (content.title) {
    sections.push(`Title: ${content.title}`);
  }

  if (content.description) {
    sections.push(`Description: ${content.description}`);
  }

  if (content.headings.length > 0) {
    sections.push(`Key Headings:\n${content.headings.slice(0, 10).join('\n')}`);
  }

  if (content.paragraphs.length > 0) {
    // Take first 15 paragraphs, limited to 500 chars each
    const limitedParagraphs = content.paragraphs
      .slice(0, 15)
      .map(p => p.length > 500 ? p.substring(0, 500) + '...' : p);
    sections.push(`Content:\n${limitedParagraphs.join('\n\n')}`);
  }

  // Limit total content to avoid token limits
  const combined = sections.join('\n\n');
  return combined.length > 6000 ? combined.substring(0, 6000) + '...' : combined;
}

/**
 * Clamps a tone score to 1-10 range
 */
function clampScore(value: number): number {
  const num = Number(value) || 5;
  return Math.min(10, Math.max(1, Math.round(num)));
}

/**
 * Clamps a dimension score to 0-10 range
 */
function clampDimension(value: number): number {
  const num = Number(value) || 0;
  return Math.min(10, Math.max(0, Math.round(num)));
}

/**
 * Returns default voice principles based on personality
 */
function getDefaultPrinciples(personality: BrandPersonality) {
  const { archetype, tone } = personality;
  const isCasual = tone.formalityCasual > 5;
  const isEnthusiastic = tone.matterOfFactEnthusiastic > 5;

  return [
    {
      name: `Be ${archetype.traits[0]}`,
      description: `Our brand voice embodies ${archetype.traits[0].toLowerCase()} qualities.`,
      howToApply: `Lead with ${archetype.traits[0].toLowerCase()} language and perspectives.`,
      example: `"We ${archetype.toneAttributes[0]?.toLowerCase() || 'genuinely'} believe in making a difference."`,
      whatNotToDo: `Don't use language that contradicts our ${archetype.traits[0].toLowerCase()} nature.`,
    },
    {
      name: isCasual ? 'Keep it Conversational' : 'Maintain Professionalism',
      description: isCasual
        ? 'We speak like a knowledgeable friend.'
        : 'We communicate with authority and precision.',
      howToApply: isCasual
        ? 'Use contractions and write like you speak.'
        : 'Use clear, structured communication.',
      example: isCasual
        ? '"Hey, we\'ve got something you\'ll love!"'
        : '"We\'re pleased to introduce our latest innovation."',
      whatNotToDo: isCasual
        ? 'Don\'t use stiff corporate language.'
        : 'Don\'t be overly casual or use slang.',
    },
    {
      name: isEnthusiastic ? 'Express Enthusiasm' : 'Be Direct and Clear',
      description: isEnthusiastic
        ? 'We show genuine excitement about what we do.'
        : 'We value clarity and get straight to the point.',
      howToApply: isEnthusiastic
        ? 'Use energetic language and show passion.'
        : 'Lead with the most important information.',
      example: isEnthusiastic
        ? '"We\'re thrilled to share this amazing opportunity!"'
        : '"Here\'s what you need to know."',
      whatNotToDo: isEnthusiastic
        ? 'Don\'t be dry or monotonous.'
        : 'Don\'t use excessive superlatives.',
    },
  ];
}

/**
 * Returns a default brand voice based on personality
 */
function getDefaultBrandVoice(personality: BrandPersonality): BrandVoice {
  const { archetype, tone } = personality;
  const isCasual = tone.formalityCasual > 5;
  const isEnthusiastic = tone.matterOfFactEnthusiastic > 5;

  return {
    principles: getDefaultPrinciples(personality),
    vocabulary: {
      description: `Our vocabulary reflects our ${archetype.primary} archetype - ${archetype.description.toLowerCase()}.`,
      wordsToUse: archetype.traits.map(t => t.toLowerCase()),
      wordsToAvoid: ['inappropriate', 'offensive', 'misleading'],
    },
    toneDescription: `Our tone is ${archetype.toneAttributes.join(', ').toLowerCase()}. We communicate in a way that is ${isCasual ? 'conversational and approachable' : 'professional and authoritative'}, and ${isEnthusiastic ? 'enthusiastic' : 'clear and direct'}.`,
    cadenceDescription: isCasual
      ? 'We use varied sentence lengths to maintain interest. Short sentences for impact. Longer ones for complex ideas.'
      : 'We maintain a steady, measured pace with clear sentence structures.',
  };
}

/**
 * Checks if OpenAI API is available
 */
export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
