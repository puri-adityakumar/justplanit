// Updated overview prompt for focused, brief startup idea validation

export const OVERVIEW_PROMPT = `
You are a startup advisor. Analyze this business idea and provide a quick, glanceable overview validation. Keep all responses brief (1-2 sentences max per section, use bullets where possible).

BUSINESS IDEA: "{USER_IDEA}"

Provide output ONLY as JSON with this exact structure:

{
  "quick_stats": {
    "viability_score": [1-10 rating],
    "verdict": ["STRONG_GO" | "GO" | "CONDITIONAL" | "NO_GO"],
    "market_size": "[Large/Medium/Small with 1-sentence explanation]",
    "time_to_market": "[Quick estimate: 3-6 months, 6-12 months, 1-2 years, 2+ years]"
  },
  "overview": {
    "idea_summary": "[1-2 sentence improvised summary of the idea]",
    "key_features_and_pain_points": ["[Bullet 1]", "[Bullet 2]", "[Bullet 3]"],
    "problems_solved": ["[Bullet 1]", "[Bullet 2]", "[Bullet 3]"],
    "market_analysis": {
      "target_audience": "[Brief description]",
      "growth_rate": "[Percentage with 1-sentence explanation]",
      "opportunity": "[1-sentence summary]"
    },
    "risk_level": {
      "level": ["LOW" | "MEDIUM" | "HIGH"],
      "explanation": "[1-sentence reason]"
    },
    "estimated_cost": {
      "total": "[Estimated total in USD, e.g., 50000]",
      "breakdown": [
        {"category": "[Category 1]", "amount": [number], "description": "[Brief desc]"},
        {"category": "[Category 2]", "amount": [number], "description": "[Brief desc]"},
        {"category": "[Category 3]", "amount": [number], "description": "[Brief desc]"}
      ]
    },
    "ai_suggestions": ["[Suggestion 1]", "[Suggestion 2]", "[Suggestion 3]"],
    "future_scope": ["[Scope item 1]", "[Scope item 2]", "[Scope item 3]"]
  },
  "confidence": [1-10 how confident you are in this analysis]
}

GUIDELINES:
- Keep everything concise for quick reading (bullets, short sentences).
- Base on logical market reasoning.
- For breakdowns/arrays: Limit to 3 items max.
- Respond ONLY with the JSON object, no additional text.
`;

export const generateOverviewPrompt = (userIdea: string, userContext?: string): string => {
  let prompt = OVERVIEW_PROMPT.replace('{USER_IDEA}', userIdea);
  if (userContext) {
    prompt = prompt.replace('BUSINESS IDEA: "{USER_IDEA}"', `BUSINESS IDEA: "{USER_IDEA}"\nUSER CONTEXT: "${userContext}"`);
  }
  return prompt;
};
