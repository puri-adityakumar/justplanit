import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calculator, AlertCircle } from "lucide-react";
import { ValidatedIdea } from "@/data/dummyIdeas";

interface CostAnalysisSectionProps {
  ideaData: ValidatedIdea;
}

export const CostAnalysisSection = ({ ideaData }: CostAnalysisSectionProps) => {
  // Dummy cost analysis data
  const costData = {
    services: [
      {
        name: "Supabase",
        category: "Database & Auth",
        plans: [
          { name: "Free", price: "$0", features: ["2 projects", "500MB database", "50,000 monthly active users"], recommended: false },
          { name: "Pro", price: "$25", features: ["Unlimited projects", "8GB database", "100,000 monthly active users"], recommended: true },
          { name: "Team", price: "$599", features: ["Advanced security", "Point-in-time recovery", "Read replicas"], recommended: false }
        ]
      },
      {
        name: "Vercel",
        category: "Frontend Hosting",
        plans: [
          { name: "Hobby", price: "$0", features: ["Personal projects", "100GB bandwidth", "Basic analytics"], recommended: false },
          { name: "Pro", price: "$20", features: ["Commercial use", "1TB bandwidth", "Advanced analytics"], recommended: true },
          { name: "Enterprise", price: "$400", features: ["Advanced security", "99.99% SLA", "Custom domains"], recommended: false }
        ]
      },
      {
        name: "Railway",
        category: "Backend Hosting",
        plans: [
          { name: "Developer", price: "$0", features: ["$5 included usage", "512MB RAM", "1GB disk"], recommended: false },
          { name: "Hobby", price: "$5", features: ["$5 included usage", "8GB RAM", "100GB disk"], recommended: true },
          { name: "Pro", price: "$20", features: ["$20 included usage", "32GB RAM", "100GB disk"], recommended: false }
        ]
      },
      {
        name: "OpenAI API",
        category: "AI Services",
        plans: [
          { name: "Pay-as-you-go", price: "~$50", features: ["GPT-4 access", "Usage-based pricing", "Rate limits"], recommended: true }
        ]
      },
      {
        name: "Clerk",
        category: "Authentication",
        plans: [
          { name: "Free", price: "$0", features: ["10,000 monthly active users", "Social logins", "Basic features"], recommended: false },
          { name: "Pro", price: "$25", features: ["Unlimited users", "Advanced security", "Custom branding"], recommended: true }
        ]
      }
    ],
    estimates: {
      mvp: {
        monthly: 125,
        yearly: 1380,
        breakdown: [
          { service: "Supabase Pro", cost: 25 },
          { service: "Vercel Pro", cost: 20 },
          { service: "Railway Hobby", cost: 5 },
          { service: "OpenAI API", cost: 50 },
          { service: "Clerk Pro", cost: 25 }
        ]
      },
      growth: {
        monthly: 320,
        yearly: 3540,
        breakdown: [
          { service: "Supabase Team", cost: 599/12 },
          { service: "Vercel Pro", cost: 20 },
          { service: "Railway Pro", cost: 20 },
          { service: "OpenAI API", cost: 150 },
          { service: "Clerk Pro", cost: 25 }
        ]
      },
      scale: {
        monthly: 850,
        yearly: 9400,
        breakdown: [
          { service: "Enterprise Services", cost: 850 }
        ]
      }
    }
  };

  const formatPrice = (price: string | number) => {
    if (typeof price === 'string') return price;
    return `$${price}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-white">Cost Analysis</h2>
      </div>

      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 text-center">
          <div className="text-2xl font-bold text-green-500 mb-2">
            ${costData.estimates.mvp.monthly}/mo
          </div>
          <div className="text-sm text-foreground/60 mb-1">MVP Stage</div>
          <div className="text-xs text-foreground/40">
            (~${costData.estimates.mvp.yearly}/year)
          </div>
        </Card>

        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 text-center">
          <div className="text-2xl font-bold text-yellow-500 mb-2">
            ${costData.estimates.growth.monthly}/mo
          </div>
          <div className="text-sm text-foreground/60 mb-1">Growth Stage</div>
          <div className="text-xs text-foreground/40">
            (~${costData.estimates.growth.yearly}/year)
          </div>
        </Card>

        <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6 text-center">
          <div className="text-2xl font-bold text-red-500 mb-2">
            ${costData.estimates.scale.monthly}/mo
          </div>
          <div className="text-sm text-foreground/60 mb-1">Scale Stage</div>
          <div className="text-xs text-foreground/40">
            (~${costData.estimates.scale.yearly}/year)
          </div>
        </Card>
      </div>

      {/* Service Breakdown */}
      <div className="space-y-4">
        {costData.services.map((service, index) => (
          <Card key={index} className="bg-card/20 backdrop-blur-md border-border/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                <Badge variant="outline" className="mt-1">{service.category}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {service.plans.map((plan, planIndex) => (
                <div 
                  key={planIndex} 
                  className={`bg-background/10 rounded-lg p-4 relative ${
                    plan.recommended ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  {plan.recommended && (
                    <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground">
                      Recommended
                    </Badge>
                  )}
                  
                  <div className="mb-3">
                    <h4 className="font-semibold text-white">{plan.name}</h4>
                    <div className="text-xl font-bold text-primary">
                      {formatPrice(plan.price)}
                      {plan.price !== "$0" && <span className="text-sm text-foreground/60">/month</span>}
                    </div>
                  </div>

                  <ul className="space-y-1">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-foreground/70 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Cost Breakdown by Stage */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold text-white">Detailed Cost Breakdown</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* MVP Stage */}
          <div className="bg-background/10 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              MVP Stage
            </h4>
            <div className="space-y-2">
              {costData.estimates.mvp.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-foreground/70">{item.service}</span>
                  <span className="text-white font-medium">${item.cost}</span>
                </div>
              ))}
              <div className="border-t border-border/30 pt-2 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-white">Total Monthly</span>
                  <span className="text-green-500">${costData.estimates.mvp.monthly}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Stage */}
          <div className="bg-background/10 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-500" />
              Growth Stage
            </h4>
            <div className="space-y-2">
              {costData.estimates.growth.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-foreground/70">{item.service}</span>
                  <span className="text-white font-medium">${Math.round(item.cost)}</span>
                </div>
              ))}
              <div className="border-t border-border/30 pt-2 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-white">Total Monthly</span>
                  <span className="text-yellow-500">${costData.estimates.growth.monthly}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scale Stage */}
          <div className="bg-background/10 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              Scale Stage
            </h4>
            <div className="space-y-2">
              {costData.estimates.scale.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-foreground/70">{item.service}</span>
                  <span className="text-white font-medium">${item.cost}</span>
                </div>
              ))}
              <div className="border-t border-border/30 pt-2 mt-3">
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-white">Total Monthly</span>
                  <span className="text-red-500">${costData.estimates.scale.monthly}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Cost Optimization Tips */}
      <Card className="bg-card/20 backdrop-blur-md border-border/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <h3 className="text-xl font-semibold text-white">Cost Optimization Tips</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-white">Early Stage (0-1K users)</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                Start with free tiers and scale up as needed
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                Use Supabase free tier for initial development
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                Monitor API usage to avoid unexpected charges
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-white">Growth Stage (1K-10K users)</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                Implement caching to reduce API calls
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                Consider annual billing for 10-20% savings
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                Optimize database queries and storage
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
