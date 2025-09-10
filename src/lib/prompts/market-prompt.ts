// AI prompt for detailed market analysis generation

export const MARKET_PROMPT = `
You are a senior market analyst. Analyze this startup idea and generate a detailed market analysis. Respond ONLY with JSON matching this shape:

{
  "market_analysis": {
    "target_market": {
      "demographics": "",
      "size": 0,
      "growth_rate": 0
    },
    "market_size": {
      "tam": "",
      "sam": "",
      "som": ""
    },
    "trends": [
      { "trend": "", "impact": "HIGH", "timeline": "", "source": "" }
    ],
    "market_readiness": 0,
    "recent_developments": []
  },
  "competitive_analysis": {
    "competitors": [
      {
        "name": "",
        "type": "DIRECT",
        "strength": 0,
        "market_share": "",
        "recent_funding": "",
        "key_features": [],
        "weaknesses": []
      }
    ],
    "competitive_advantages": [],
    "threats_level": "MEDIUM",
    "market_position": "",
    "funding_landscape": ""
  },
  "risk_assessment": {
    "overall_risk_level": "MEDIUM",
    "risks": [],
    "risk_score": 50,
    "regulatory_considerations": []
  },
  "sources": {
    "sources": [],
    "search_quality": 5,
    "last_updated": "${new Date().toISOString()}"
  }
}`;

export const generateMarketPrompt = (userIdea: string, context?: { region?: string; industry?: string }) => {
    let prompt = MARKET_PROMPT.replace('Analyze this startup idea', `Analyze this startup idea: "${userIdea}"`);
    if (context?.region || context?.industry) {
        prompt += `\nContext:`;
        if (context.region) prompt += ` Region: ${context.region}.`;
        if (context.industry) prompt += ` Industry: ${context.industry}.`;
    }
    return prompt;
};


