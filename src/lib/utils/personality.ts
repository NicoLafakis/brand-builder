import type { BrandArchetype, BrandPersonality, BrandVoice, ExtractedContent } from '../types/brand';
import {
  analyzeArchetypeWithAI,
  analyzeToneWithAI,
  analyzeAakerDimensionsWithAI,
  generateBrandVoiceWithAI,
  isOpenAIAvailable,
} from '../services/openai';

// Jungian Brand Archetypes
export const ARCHETYPES: Record<string, BrandArchetype> = {
  innocent: {
    primary: 'Innocent',
    description: 'Optimistic, pure, honest, and trustworthy',
    traits: ['Optimistic', 'Honest', 'Pure', 'Simple', 'Wholesome'],
    toneAttributes: ['Warm', 'Sincere', 'Nostalgic', 'Hopeful'],
  },
  explorer: {
    primary: 'Explorer',
    description: 'Adventurous, independent, and pioneering',
    traits: ['Adventurous', 'Independent', 'Ambitious', 'Pioneering', 'Individualistic'],
    toneAttributes: ['Bold', 'Authentic', 'Inspiring', 'Restless'],
  },
  sage: {
    primary: 'Sage',
    description: 'Wise, knowledgeable, and thoughtful',
    traits: ['Wise', 'Intelligent', 'Analytical', 'Thoughtful', 'Expert'],
    toneAttributes: ['Informative', 'Authoritative', 'Reflective', 'Clear'],
  },
  hero: {
    primary: 'Hero',
    description: 'Courageous, strong, and inspirational',
    traits: ['Courageous', 'Strong', 'Determined', 'Inspirational', 'Honorable'],
    toneAttributes: ['Motivating', 'Confident', 'Direct', 'Empowering'],
  },
  magician: {
    primary: 'Magician',
    description: 'Transformative, visionary, and innovative',
    traits: ['Visionary', 'Innovative', 'Transformative', 'Charismatic', 'Imaginative'],
    toneAttributes: ['Mysterious', 'Inspiring', 'Confident', 'Sophisticated'],
  },
  outlaw: {
    primary: 'Outlaw',
    description: 'Rebellious, disruptive, and unconventional',
    traits: ['Rebellious', 'Disruptive', 'Bold', 'Unconventional', 'Revolutionary'],
    toneAttributes: ['Provocative', 'Edgy', 'Irreverent', 'Authentic'],
  },
  everyman: {
    primary: 'Everyman',
    description: 'Relatable, down-to-earth, and inclusive',
    traits: ['Relatable', 'Friendly', 'Humble', 'Inclusive', 'Dependable'],
    toneAttributes: ['Conversational', 'Warm', 'Approachable', 'Genuine'],
  },
  lover: {
    primary: 'Lover',
    description: 'Passionate, intimate, and devoted',
    traits: ['Passionate', 'Sensual', 'Devoted', 'Appreciative', 'Intimate'],
    toneAttributes: ['Warm', 'Emotional', 'Romantic', 'Indulgent'],
  },
  jester: {
    primary: 'Jester',
    description: 'Fun-loving, playful, and entertaining',
    traits: ['Playful', 'Fun-loving', 'Humorous', 'Spontaneous', 'Creative'],
    toneAttributes: ['Witty', 'Lighthearted', 'Entertaining', 'Irreverent'],
  },
  caregiver: {
    primary: 'Caregiver',
    description: 'Nurturing, supportive, and compassionate',
    traits: ['Nurturing', 'Compassionate', 'Generous', 'Protective', 'Supportive'],
    toneAttributes: ['Warm', 'Reassuring', 'Empathetic', 'Caring'],
  },
  ruler: {
    primary: 'Ruler',
    description: 'Authoritative, powerful, and prestigious',
    traits: ['Authoritative', 'Powerful', 'Successful', 'Responsible', 'Prestigious'],
    toneAttributes: ['Commanding', 'Confident', 'Refined', 'Exclusive'],
  },
  creator: {
    primary: 'Creator',
    description: 'Innovative, artistic, and imaginative',
    traits: ['Innovative', 'Artistic', 'Expressive', 'Imaginative', 'Original'],
    toneAttributes: ['Inspiring', 'Visionary', 'Authentic', 'Creative'],
  },
};

// Keywords that suggest each archetype
const ARCHETYPE_KEYWORDS: Record<string, string[]> = {
  innocent: ['pure', 'simple', 'honest', 'trust', 'natural', 'organic', 'clean', 'fresh', 'wholesome', 'family'],
  explorer: ['adventure', 'discover', 'explore', 'journey', 'freedom', 'experience', 'authentic', 'outdoor', 'travel'],
  sage: ['learn', 'know', 'understand', 'wisdom', 'research', 'data', 'insight', 'expert', 'intelligence', 'truth'],
  hero: ['achieve', 'win', 'strong', 'power', 'champion', 'victory', 'challenge', 'overcome', 'courage', 'best'],
  magician: ['transform', 'dream', 'vision', 'magic', 'imagine', 'change', 'revolutionary', 'miracle', 'innovative'],
  outlaw: ['rebel', 'break', 'disrupt', 'revolution', 'different', 'rule', 'bold', 'challenge', 'unconventional'],
  everyman: ['everyone', 'people', 'community', 'together', 'belong', 'real', 'everyday', 'accessible', 'friendly'],
  lover: ['love', 'beautiful', 'passion', 'luxury', 'indulge', 'pleasure', 'intimate', 'romance', 'desire', 'elegant'],
  jester: ['fun', 'enjoy', 'play', 'laugh', 'joy', 'happy', 'humor', 'entertaining', 'celebrate', 'light'],
  caregiver: ['care', 'help', 'support', 'protect', 'safe', 'nurture', 'service', 'compassion', 'comfort', 'health'],
  ruler: ['lead', 'control', 'premium', 'exclusive', 'prestige', 'success', 'power', 'status', 'quality', 'elite'],
  creator: ['create', 'design', 'build', 'craft', 'art', 'original', 'unique', 'express', 'imagination', 'innovative'],
};

// Analyze content and determine brand archetype
export function analyzeArchetype(content: ExtractedContent): BrandArchetype {
  const allText = [
    content.title,
    content.description,
    ...content.headings,
    ...content.paragraphs.slice(0, 10), // Limit to first 10 paragraphs
  ].join(' ').toLowerCase();

  const scores: Record<string, number> = {};

  // Score each archetype based on keyword matches
  for (const [archetype, keywords] of Object.entries(ARCHETYPE_KEYWORDS)) {
    scores[archetype] = keywords.reduce((score, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = allText.match(regex);
      return score + (matches?.length || 0);
    }, 0);
  }

  // Find top archetype
  const sortedArchetypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primaryArchetype = sortedArchetypes[0][0];
  const secondaryArchetype = sortedArchetypes[1]?.[1] > 0 ? sortedArchetypes[1][0] : undefined;

  const archetype = { ...ARCHETYPES[primaryArchetype] };
  if (secondaryArchetype) {
    archetype.secondary = ARCHETYPES[secondaryArchetype].primary;
  }

  return archetype;
}

// Analyze tone dimensions from content
export function analyzeTone(content: ExtractedContent): BrandPersonality['tone'] {
  const allText = [
    content.title,
    content.description,
    ...content.paragraphs.slice(0, 10),
  ].join(' ').toLowerCase();

  // Formal vs Casual indicators
  const formalIndicators = ['therefore', 'furthermore', 'consequently', 'regarding', 'pursuant', 'hereby'];
  const casualIndicators = ['hey', 'awesome', 'cool', 'gonna', 'wanna', 'yeah', "let's", 'btw', '!'];

  // Serious vs Funny indicators
  const seriousIndicators = ['important', 'critical', 'essential', 'significant', 'professional'];
  const funnyIndicators = ['fun', 'joke', 'laugh', 'hilarious', 'lol', 'haha', '😀', '🎉'];

  // Respectful vs Irreverent indicators
  const respectfulIndicators = ['please', 'thank you', 'appreciate', 'respect', 'honor'];
  const irreverentIndicators = ['disrupt', 'break', 'rebel', 'damn', 'hell', 'kick'];

  // Matter-of-fact vs Enthusiastic indicators
  const matterOfFactIndicators = ['simply', 'just', 'basically', 'merely', 'only'];
  const enthusiasticIndicators = ['amazing', 'incredible', 'awesome', 'fantastic', 'love', 'excited', '!'];

  const countIndicators = (indicators: string[]) =>
    indicators.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      return count + (allText.match(regex)?.length || 0);
    }, 0);

  const calculateScore = (positive: string[], negative: string[]): number => {
    const posCount = countIndicators(positive);
    const negCount = countIndicators(negative);
    const total = posCount + negCount;
    if (total === 0) return 5; // Neutral
    return Math.min(10, Math.max(1, Math.round(5 + ((posCount - negCount) / total) * 5)));
  };

  return {
    formalityCasual: calculateScore(casualIndicators, formalIndicators),
    seriousFunny: calculateScore(funnyIndicators, seriousIndicators),
    respectfulIrreverent: calculateScore(irreverentIndicators, respectfulIndicators),
    matterOfFactEnthusiastic: calculateScore(enthusiasticIndicators, matterOfFactIndicators),
  };
}

// Analyze Aaker brand personality dimensions
export function analyzeAakerDimensions(content: ExtractedContent): BrandPersonality['dimensions'] {
  const allText = [
    content.title,
    content.description,
    ...content.paragraphs.slice(0, 10),
  ].join(' ').toLowerCase();

  const dimensionKeywords = {
    sincerity: ['honest', 'genuine', 'cheerful', 'wholesome', 'down-to-earth', 'family', 'friendly', 'sincere'],
    excitement: ['daring', 'spirited', 'imaginative', 'up-to-date', 'exciting', 'cool', 'young', 'unique', 'trendy'],
    competence: ['reliable', 'intelligent', 'successful', 'leader', 'confident', 'technical', 'corporate', 'secure'],
    sophistication: ['upper class', 'glamorous', 'charming', 'feminine', 'smooth', 'prestigious', 'elegant', 'luxury'],
    ruggedness: ['outdoorsy', 'tough', 'rugged', 'strong', 'masculine', 'western', 'athletic', 'durable'],
  };

  const scores: BrandPersonality['dimensions'] = {
    sincerity: 0,
    excitement: 0,
    competence: 0,
    sophistication: 0,
    ruggedness: 0,
  };

  for (const [dimension, keywords] of Object.entries(dimensionKeywords)) {
    scores[dimension as keyof typeof scores] = keywords.reduce((score, word) => {
      const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
      const matches = allText.match(regex);
      return score + (matches?.length || 0);
    }, 0);
  }

  // Normalize scores to 0-10 range
  const maxScore = Math.max(...Object.values(scores), 1);
  for (const key of Object.keys(scores) as (keyof typeof scores)[]) {
    scores[key] = Math.round((scores[key] / maxScore) * 10);
  }

  return scores;
}

// Build complete brand personality profile
export function buildBrandPersonality(content: ExtractedContent): BrandPersonality {
  return {
    archetype: analyzeArchetype(content),
    dimensions: analyzeAakerDimensions(content),
    tone: analyzeTone(content),
  };
}

// Generate brand voice guidelines based on personality
export function generateBrandVoice(personality: BrandPersonality, content: ExtractedContent): BrandVoice {
  const { archetype, tone } = personality;

  // Determine primary voice characteristics based on tone scores
  const isCasual = tone.formalityCasual > 5;
  const isEnthusiastic = tone.matterOfFactEnthusiastic > 5;
  const isFunny = tone.seriousFunny > 5;

  // Generate voice principles based on archetype
  const principles = [
    {
      name: `Be ${archetype.traits[0]}`,
      description: `Our brand voice embodies ${archetype.traits[0].toLowerCase()} qualities that resonate with our audience.`,
      howToApply: `When writing, lead with ${archetype.traits[0].toLowerCase()} language and perspectives.`,
      example: `"We ${archetype.toneAttributes[0].toLowerCase()}ly believe in making a difference."`,
      whatNotToDo: `Don't use language that contradicts our ${archetype.traits[0].toLowerCase()} nature.`,
    },
    {
      name: isCasual ? 'Keep it Conversational' : 'Maintain Professionalism',
      description: isCasual
        ? 'We speak like a knowledgeable friend, not a corporate entity.'
        : 'We communicate with authority and precision while remaining approachable.',
      howToApply: isCasual
        ? 'Use contractions, ask questions, and write like you speak.'
        : 'Use clear, structured communication without unnecessary jargon.',
      example: isCasual
        ? '"Hey, we\'ve got something you\'ll love!"'
        : '"We\'re pleased to introduce our latest innovation."',
      whatNotToDo: isCasual
        ? 'Don\'t use stiff, formal corporate language.'
        : 'Don\'t be overly casual or use slang.',
    },
    {
      name: isEnthusiastic ? 'Express Enthusiasm' : 'Be Direct and Clear',
      description: isEnthusiastic
        ? 'We show genuine excitement about what we do and offer.'
        : 'We value clarity and get straight to the point.',
      howToApply: isEnthusiastic
        ? 'Use energetic language and show passion in your writing.'
        : 'Lead with the most important information and be concise.',
      example: isEnthusiastic
        ? '"We\'re thrilled to share this amazing opportunity!"'
        : '"Here\'s what you need to know."',
      whatNotToDo: isEnthusiastic
        ? 'Don\'t be dry or monotonous.'
        : 'Don\'t use excessive superlatives or filler words.',
    },
  ];

  // Extract vocabulary patterns from content
  const allText = content.paragraphs.join(' ');
  const words = allText.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  const frequentWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word)
    .filter(w => !['that', 'this', 'with', 'have', 'from', 'your', 'will', 'more', 'been'].includes(w));

  return {
    principles,
    vocabulary: {
      description: `Our vocabulary reflects our ${archetype.primary} archetype - ${archetype.description.toLowerCase()}.`,
      wordsToUse: [
        ...archetype.traits.map(t => t.toLowerCase()),
        ...frequentWords.slice(0, 5),
      ],
      wordsToAvoid: getWordsToAvoid(archetype.primary),
    },
    toneDescription: `Our tone is ${archetype.toneAttributes.join(', ').toLowerCase()}. We communicate in a way that is ${isCasual ? 'conversational and approachable' : 'professional and authoritative'}, ${isEnthusiastic ? 'enthusiastic and energetic' : 'clear and direct'}, and ${isFunny ? 'occasionally playful' : 'consistently focused'}.`,
    cadenceDescription: isCasual
      ? 'We use varied sentence lengths to maintain interest. Short sentences for impact. Longer ones to explain complex ideas thoroughly when needed.'
      : 'We maintain a steady, measured pace with clear sentence structures that guide the reader through our message logically.',
  };
}

// Get words to avoid based on archetype
function getWordsToAvoid(archetype: string): string[] {
  const avoidByArchetype: Record<string, string[]> = {
    Innocent: ['complicated', 'edgy', 'aggressive', 'controversial'],
    Explorer: ['ordinary', 'routine', 'traditional', 'conventional'],
    Sage: ['simplistic', 'uninformed', 'casual', 'vague'],
    Hero: ['weak', 'passive', 'timid', 'ordinary'],
    Magician: ['mundane', 'ordinary', 'predictable', 'simple'],
    Outlaw: ['conformist', 'traditional', 'mainstream', 'ordinary'],
    Everyman: ['exclusive', 'elite', 'pretentious', 'complicated'],
    Lover: ['cold', 'distant', 'harsh', 'plain'],
    Jester: ['boring', 'serious', 'formal', 'mundane'],
    Caregiver: ['neglect', 'ignore', 'harsh', 'indifferent'],
    Ruler: ['cheap', 'common', 'mediocre', 'amateur'],
    Creator: ['copy', 'generic', 'boring', 'conventional'],
  };

  return avoidByArchetype[archetype] || ['inappropriate', 'offensive', 'misleading'];
}

// ============================================================================
// AI-ENHANCED FUNCTIONS
// These functions use OpenAI for intelligent brand analysis when available,
// falling back to keyword-based analysis when the API is unavailable.
// ============================================================================

/**
 * Analyzes brand archetype using AI when available, falls back to keyword matching
 */
export async function analyzeArchetypeEnhanced(content: ExtractedContent): Promise<BrandArchetype> {
  if (isOpenAIAvailable()) {
    try {
      return await analyzeArchetypeWithAI(content);
    } catch (error) {
      console.warn('AI archetype analysis failed, falling back to keyword matching:', error);
    }
  }
  return analyzeArchetype(content);
}

/**
 * Analyzes tone dimensions using AI when available, falls back to keyword matching
 */
export async function analyzeToneEnhanced(content: ExtractedContent): Promise<BrandPersonality['tone']> {
  if (isOpenAIAvailable()) {
    try {
      return await analyzeToneWithAI(content);
    } catch (error) {
      console.warn('AI tone analysis failed, falling back to keyword matching:', error);
    }
  }
  return analyzeTone(content);
}

/**
 * Analyzes Aaker dimensions using AI when available, falls back to keyword matching
 */
export async function analyzeAakerDimensionsEnhanced(content: ExtractedContent): Promise<BrandPersonality['dimensions']> {
  if (isOpenAIAvailable()) {
    try {
      return await analyzeAakerDimensionsWithAI(content);
    } catch (error) {
      console.warn('AI Aaker dimensions analysis failed, falling back to keyword matching:', error);
    }
  }
  return analyzeAakerDimensions(content);
}

/**
 * Builds complete brand personality using AI-enhanced analysis
 * Runs all three analyses in parallel for better performance
 */
export async function buildBrandPersonalityEnhanced(content: ExtractedContent): Promise<BrandPersonality> {
  const [archetype, dimensions, tone] = await Promise.all([
    analyzeArchetypeEnhanced(content),
    analyzeAakerDimensionsEnhanced(content),
    analyzeToneEnhanced(content),
  ]);

  return { archetype, dimensions, tone };
}

/**
 * Generates brand voice guidelines using AI when available, falls back to template-based
 */
export async function generateBrandVoiceEnhanced(
  personality: BrandPersonality,
  content: ExtractedContent
): Promise<BrandVoice> {
  if (isOpenAIAvailable()) {
    try {
      return await generateBrandVoiceWithAI(personality, content);
    } catch (error) {
      console.warn('AI brand voice generation failed, falling back to template-based:', error);
    }
  }
  return generateBrandVoice(personality, content);
}
