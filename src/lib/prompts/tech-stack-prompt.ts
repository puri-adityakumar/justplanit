export const TECH_STACK_PROMPT = `
You are a tech architect recommending a technology stack. Provide 2-3 stack options. If the user specifies a preferred stack, make sure it is one of the options.

BUSINESS IDEA: "{USER_IDEA}"
USER PREFERENCE: "{USER_PREFERENCE}"

Output ONLY as JSON with this structure:
{
  "suggested_stacks": [
    {
      "name": "[Stack name, e.g., 'Next.js + Supabase']",
      "description": "[Brief overview]",
      "frontend": "[Frontend tech]",
      "backend": "[Backend tech]",
      "database": "[Database]",
      "other_tools": ["Tool 1", "Tool 2"],
      "pros": ["Pro 1", "Pro 2"],
      "cons": ["Con 1", "Con 2"],
      "complexity": "Low|Medium|High"
    }
  ]
}

Limit to 2-3 stack options. Respond ONLY with JSON.
`;

export const generateTechStackPrompt = (userIdea: string, userPreference: string): string => {
  return TECH_STACK_PROMPT.replace('{USER_IDEA}', userIdea).replace('{USER_PREFERENCE}', userPreference);
};
