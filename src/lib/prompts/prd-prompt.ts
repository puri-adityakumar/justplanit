export const PRD_PROMPT = `
You are a product manager creating a Product Requirements Document (PRD) for a startup idea. Keep responses concise and structured.

BUSINESS IDEA: "{USER_IDEA}"

Output ONLY as JSON with this structure:
{
  "overview": "[1-2 sentence project overview]",
  "user_personas": [
    {
      "name": "[Persona name]",
      "description": "[Brief description]",
      "needs": ["Need 1", "Need 2", "Need 3"]
    }
  ],
  "user_stories": [
    {
      "id": [number],
      "epic": "[Epic name]",
      "story": "[As a <user>, I want <feature> so that <benefit>]",
      "acceptance_criteria": ["Criteria 1", "Criteria 2"],
      "priority": "High|Medium|Low"
    }
  ],
  "features": [
    {
      "name": "[Feature name]",
      "description": "[Brief description]",
      "priority": "Must Have|Should Have|Nice to Have",
      "complexity": "High|Medium|Low"
    }
  ]
}

Limit arrays to 3-5 items max. Respond ONLY with JSON.
`;

export const generatePRDPrompt = (userIdea: string): string => {
    return PRD_PROMPT.replace('{USER_IDEA}', userIdea);
};
