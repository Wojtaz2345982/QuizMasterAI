import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import PageContainer from "@/components/Layout/PageContainer";
import { ArrowRight, Brain, Target, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const session = useSession();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-primary" />,
      title: "AI Quiz Generation",
      description: "Create unique quizzes instantly with our advanced AI technology"
    },
    {
      icon: <Target className="w-12 h-12 text-primary" />,
      title: "Quiz Management",
      description: "Organize and customize your quizzes with an intuitive interface"
    },
    {
      icon: <CheckCircle2 className="w-12 h-12 text-primary" />,
      title: "Interactive Solving",
      description: "Engage with quizzes in an interactive and enjoyable way"
    }
  ];

  return (
    <PageContainer className="bg-gradient-to-b from-secondary to-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fadeIn">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to Quiz Master
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          Transform your learning experience with AI-powered quiz generation. 
          Create, manage, and solve quizzes with the power of artificial intelligence.
        </p>
        <div className="space-y-4 md:space-y-0 md:space-x-4 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          {session ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/create-quiz")}
                className="bg-primary text-white hover:bg-primary-hover"
              >
                Create a Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate("/my-quizzes")}
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                View My Quizzes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Quiz Master?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow duration-300 animate-fadeIn hover:scale-105 transform transition-transform"
                style={{ animationDelay: `${0.2 * (index + 1)}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="py-16 bg-gradient-to-b from-white to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 animate-fadeIn">
            Powered by Advanced AI Technology
          </h2>
          <p className="text-lg text-gray-600 mb-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            Our AI-driven platform helps you create engaging quizzes on any topic.
            Perfect for educators, students, and knowledge enthusiasts.
          </p>
          {!session && (
            <div className="animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <Link
                to="/auth"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                Start Creating Quizzes
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;