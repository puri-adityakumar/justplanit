import { useEffect } from "react";
import { Link } from "react-router-dom";
import { GradientBars } from "@/components/ui/bg-bars";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/ui/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Search,
    Brain,
    BarChart3,
    Target,
    ArrowRight,
    Mail,
    MessageCircle,
    MapPin
} from "lucide-react";

const AboutUs = () => {
    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        document.title = "About Us • Just Plan It!";
    }, []);

    const features = [
        {
            icon: Brain,
            title: "Context Packs",
            description: "Structured briefs with problem, goals, scope, personas, user stories, constraints, risks, and next steps."
        },
        {
            icon: Target,
            title: "Stakeholder Alignment",
            description: "Clear, role‑focused views for developers and product leads so handoffs are crisp and complete."
        },
        {
            icon: Search,
            title: "Grounded Research",
            description: "Relevant market and competitive signals embedded into the brief to inform decisions."
        },
        {
            icon: BarChart3,
            title: "Prompt & Handoff",
            description: "Export prompt‑ready packets and ticket‑friendly breakdowns for fast execution."
        }
    ];

    const howItWorksSteps = [
        {
            step: "01",
            title: "Describe Your Idea",
            description: "Add audience, constraints, and success metrics to set strong context."
        },
        {
            step: "02",
            title: "Generate the Context",
            description: "Our agents assemble a structured context pack and stitch in web research."
        },
        {
            step: "03",
            title: "Align and Build",
            description: "Share with your team, export to prompts or tickets, and start building with confidence."
        }
    ];

    return (
        <div className="min-h-screen bg-black relative">
            <GradientBars
                bars={25}
                colors={['#ef4444', 'transparent']}
            />

            <Navigation />

            <div className="relative z-10 px-6 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-7xl font-instrument font-bold text-white mb-6 leading-tight">
                            About Just Plan It!
                        </h1>
                        <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
                            Vibe coding wastes time and context. LLMs forget, teams misalign. Just Plan It generates durable, structured context for LLMs and developers so you move from idea to plan with clarity and speed.
                        </p>
                    </div>

                    {/* Features Section */}
                    <section id="features" className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-body font-bold text-white mb-4">
                                Features
                            </h2>
                            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                                Everything you need to replace vibe coding with actionable context that LLMs and developers can execute on.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <Card key={index} className="bg-card/30 backdrop-blur-xl border-border/40 p-6 hover:bg-card/50 transition-all duration-300">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                                <IconComponent className="h-6 w-6 text-primary" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-foreground/70 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section id="how-it-works" className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-body font-bold text-white mb-4">
                                How It Works
                            </h2>
                            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                                From rough idea to aligned plan in three steps.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {howItWorksSteps.map((step, index) => (
                                <div key={index} className="relative">
                                    <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-8 hover:bg-card/50 transition-all duration-300">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                                                <span className="text-2xl font-bold text-primary">
                                                    {step.step}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-white mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-foreground/70 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </Card>

                                    {/* Arrow between steps */}
                                    {index < howItWorksSteps.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                                            <ArrowRight className="h-6 w-6 text-primary/60" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <Link to="/">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Try It Now
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section id="contact" className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-body font-bold text-white mb-4">
                                Contact Us
                            </h2>
                            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
                                Have questions or need support? We're here to help you succeed.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-6 hover:bg-card/50 transition-all duration-300">
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Email Support
                                    </h3>
                                    <p className="text-foreground/70 mb-3">
                                        Get help with your validation
                                    </p>
                                    <a
                                        href="mailto:kumar.adityapuri@gmail.com"
                                        className="text-primary hover:text-primary/80 transition-colors"
                                    >
                                        kumar.adityapuri@gmail.com
                                    </a>
                                </div>
                            </Card>

                            <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-6 hover:bg-card/50 transition-all duration-300">
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                        <MessageCircle className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Follow Us
                                    </h3>
                                    <p className="text-foreground/70 mb-3">
                                        Connect on Twitter/X
                                    </p>
                                    <a
                                        href="https://x.com/adityawaslost"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:text-primary/80 transition-colors"
                                    >
                                        @adityawaslost
                                    </a>
                                </div>
                            </Card>

                            <Card className="bg-card/30 backdrop-blur-xl border-border/40 p-6 hover:bg-card/50 transition-all duration-300">
                                <div className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Office
                                    </h3>
                                    <p className="text-foreground/70 mb-3">
                                        Visit us in person
                                    </p>
                                    <p className="text-primary">
                                        India
                                    </p>
                                </div>
                            </Card>
                        </div>

                        <div className="text-center mt-12">
                            <Card className="bg-card/20 backdrop-blur-xl border-border/30 p-8 max-w-2xl mx-auto">
                                <h3 className="text-xl font-semibold text-white mb-4">
                                    Ready to validate your next big idea?
                                </h3>
                                <p className="text-foreground/70 mb-6">
                                    Join thousands of entrepreneurs who trust Just Plan It! for startup validation.
                                </p>
                                <Link to="/">
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                        Get Started Free
                                    </Button>
                                </Link>
                            </Card>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUs;
