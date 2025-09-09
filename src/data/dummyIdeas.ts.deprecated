import { ValidationResult } from '@/types/validation';

export interface ValidatedIdea {
  id: string;
  slug: string;
  title: string;
  description: string;
  validationData?: ValidationResult;
  status: 'analyzing' | 'completed' | 'failed';
  viabilityScore?: number;
  marketSize?: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}

// Dummy validated ideas for the current user
export const dummyValidatedIdeas: ValidatedIdea[] = [
  {
    id: "1",
    slug: "ai-powered-fitness-app",
    title: "AI-Powered Fitness App",
    description: "A mobile app that uses AI to create personalized workout plans based on user's fitness level, goals, and available equipment",
    status: "completed",
    viabilityScore: 8,
    marketSize: "$96B",
    createdAt: new Date('2024-12-15T10:30:00Z'),
    updatedAt: new Date('2024-12-15T11:45:00Z'),
    isPublic: false,
    validationData: {
      executive_summary: {
        viability_score: 8,
        verdict: "GO",
        market_opportunity: "$96B",
        time_to_market: "8-12 months",
        key_strengths: [
          "Growing fitness tech market",
          "AI personalization trend",
          "High user engagement potential"
        ],
        key_weaknesses: [
          "Competitive market",
          "Requires significant AI expertise",
          "User retention challenges"
        ]
      },
      market_analysis: {
        target_market: {
          demographics: "Health-conscious millennials and Gen Z (25-40 years)",
          size: 250000000,
          growth_rate: 15.2
        },
        market_size: {
          tam: "$96B",
          sam: "$12B",
          som: "$150M"
        },
        trends: [
          {
            trend: "AI-powered fitness apps gaining popularity",
            impact: "HIGH",
            timeline: "2024-2025"
          }
        ],
        market_readiness: 8,
        recent_developments: [
          "Major fitness apps adding AI features",
          "Increased investment in health tech"
        ]
      },
      competitive_analysis: {
        threats_level: "MEDIUM",
        competitors: [
          { 
            name: "MyFitnessPal", 
            type: "DIRECT", 
            strength: 9,
            key_features: ["Calorie tracking", "Exercise database"],
            weaknesses: ["Limited personalization", "Outdated UI"]
          },
          { 
            name: "Nike Training Club", 
            type: "DIRECT", 
            strength: 8,
            key_features: ["Professional workouts", "Nike branding"],
            weaknesses: ["Equipment focused", "Not personalized"]
          },
          { 
            name: "Fitbit Coach", 
            type: "INDIRECT", 
            strength: 7,
            key_features: ["Device integration", "Health tracking"],
            weaknesses: ["Requires Fitbit device", "Limited AI"]
          }
        ],
        competitive_advantages: [
          "Advanced AI personalization",
          "Equipment-agnostic workouts",
          "Real-time form correction"
        ],
        market_position: "AI-first fitness platform",
        funding_landscape: "Active VC interest in health tech"
      },
      technical_feasibility: {
        complexity_rating: 7,
        required_technologies: [
          {
            technology: "Machine Learning",
            difficulty: "HARD",
            availability: true,
            current_trends: "TensorFlow and PyTorch ecosystem mature"
          },
          {
            technology: "Computer Vision",
            difficulty: "HARD",
            availability: true,
            current_trends: "Real-time pose estimation advancing"
          }
        ],
        resource_requirements: {
          team_size: 8,
          timeline: "8-12 months",
          budget_range: "$300K-500K"
        },
        technical_risks: [
          "AI model accuracy challenges",
          "Real-time processing requirements"
        ]
      },
      risk_assessment: {
        overall_risk_level: "MEDIUM",
        risk_score: 45,
        risks: [
          {
            risk: "High competition from established players",
            probability: 70,
            impact: 80,
            category: "MARKET",
            mitigation: "Focus on unique AI personalization features"
          },
          {
            risk: "AI model accuracy challenges",
            probability: 40,
            impact: 60,
            category: "TECHNICAL",
            mitigation: "Extensive testing and iterative model improvement"
          }
        ],
        regulatory_considerations: [
          "Data privacy compliance",
          "Health data regulations"
        ]
      },
      financial_projections: {
        revenue_model: "Freemium with premium subscriptions",
        funding_required: 400000,
        projections: {
          year1: 50000,
          year3: 2500000,
          year5: 8000000
        },
        cost_structure: [
          { category: "Development", percentage: 40, amount: 160000 },
          { category: "Marketing", percentage: 30, amount: 120000 },
          { category: "Operations", percentage: 20, amount: 80000 },
          { category: "Legal & Admin", percentage: 10, amount: 40000 }
        ],
        break_even_point: "18 months",
        roi: 320,
        funding_environment: "Active VC interest in health tech sector"
      },
      implementation_roadmap: {
        phases: [
          {
            phase: "MVP Development",
            duration: "4 months",
            budget: 150000,
            resources: "5 developers, 1 designer, 1 data scientist, 1 PM",
            key_milestones: [
              "Core AI engine development",
              "Basic workout library",
              "User registration & profiles"
            ]
          },
          {
            phase: "Beta Testing",
            duration: "2 months",
            budget: 75000,
            resources: "Same team + 2 QA testers",
            key_milestones: [
              "Closed beta with 100 users",
              "Feedback integration",
              "Performance optimization"
            ]
          },
          {
            phase: "Market Launch",
            duration: "3 months",
            budget: 175000,
            resources: "Full team + 2 marketing specialists",
            key_milestones: [
              "App store launch",
              "Marketing campaign",
              "User acquisition drive"
            ]
          }
        ],
        critical_path: [
          "AI model development",
          "Mobile app development",
          "User testing and feedback"
        ],
        success_metrics: [
          "User acquisition rate",
          "Retention rate",
          "AI accuracy metrics"
        ],
        next_steps: [
          "Finalize team hiring",
          "Set up development environment",
          "Begin AI model training"
        ]
      },
      recommendations: {
        decision: "GO",
        success_probability: 75,
        confidence: 85,
        priority_actions: [
          "Secure AI talent and expertise",
          "Develop partnerships with fitness equipment brands",
          "Focus on unique personalization features"
        ],
        alternative_approaches: [
          "Start with web platform before mobile",
          "Partner with existing fitness apps",
          "Focus on specific fitness niche first"
        ],
        key_success_factors: [
          "AI accuracy and personalization",
          "User experience and retention",
          "Effective marketing strategy"
        ],
        market_timing: "Excellent - fitness tech adoption is at an all-time high"
      },
      sources: {
        search_quality: 9,
        sources: [
          {
            title: "Global Fitness App Market Report 2024",
            url: "https://example.com/fitness-market-report",
            domain: "marketresearch.com",
            type: "INDUSTRY_REPORT",
            relevance: "HIGH"
          },
          {
            title: "AI in Fitness Technology Trends",
            url: "https://example.com/ai-fitness-trends",
            domain: "techcrunch.com",
            type: "NEWS",
            relevance: "HIGH"
          }
        ],
        last_updated: "2024-12-15T11:45:00Z"
      }
    }
  },
  {
    id: "2",
    slug: "sustainable-fashion-marketplace",
    title: "Sustainable Fashion Marketplace",
    description: "An online platform connecting eco-conscious consumers with sustainable fashion brands and second-hand clothing",
    status: "completed",
    viabilityScore: 7,
    marketSize: "$15B",
    createdAt: new Date('2024-12-10T14:20:00Z'),
    updatedAt: new Date('2024-12-10T15:30:00Z'),
    isPublic: true
  },
  {
    id: "3",
    slug: "vr-language-learning-platform",
    title: "VR Language Learning Platform",
    description: "Immersive virtual reality platform for learning languages through real-world scenarios and cultural experiences",
    status: "analyzing",
    viabilityScore: undefined,
    marketSize: undefined,
    createdAt: new Date('2024-12-20T09:15:00Z'),
    updatedAt: new Date('2024-12-20T09:15:00Z'),
    isPublic: false
  },
  {
    id: "4",
    slug: "smart-home-energy-optimizer",
    title: "Smart Home Energy Optimizer",
    description: "IoT device and app that automatically optimizes home energy consumption using AI and real-time energy pricing",
    status: "completed",
    viabilityScore: 6,
    marketSize: "$23B",
    createdAt: new Date('2024-12-05T16:45:00Z'),
    updatedAt: new Date('2024-12-05T17:20:00Z'),
    isPublic: false
  },
  {
    id: "5",
    slug: "digital-wellness-coach",
    title: "Digital Wellness Coach",
    description: "AI-powered app that helps users manage screen time, digital addiction, and maintain healthy tech habits",
    status: "failed",
    viabilityScore: undefined,
    marketSize: undefined,
    createdAt: new Date('2024-11-28T11:30:00Z'),
    updatedAt: new Date('2024-11-28T12:00:00Z'),
    isPublic: false
  }
];

// Helper function to get user's ideas (simulating database query)
export const getUserIdeas = (userId: string): ValidatedIdea[] => {
  // In real implementation, this would filter by userId
  return dummyValidatedIdeas;
};

// Helper function to get idea by slug
export const getIdeaBySlug = (slug: string): ValidatedIdea | undefined => {
  return dummyValidatedIdeas.find(idea => idea.slug === slug);
};

// Helper function to generate slug from idea text
export const generateSlug = (idea: string): string => {
  return idea
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .slice(0, 50); // Limit length
};
