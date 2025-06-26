
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, Brain, Mic, Image, MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="w-8 h-8 text-blue-500" />,
      title: "Upload Resume",
      description: "Support for PDF, DOCX, and TXT files"
    },
    {
      icon: <Brain className="w-8 h-8 text-green-500" />,
      title: "AI Story Generation",
      description: "Transform your experience into compelling narratives"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: "Soft Skills Inference",
      description: "Identify and highlight your unique strengths"
    },
    {
      icon: <Mic className="w-8 h-8 text-orange-500" />,
      title: "Voiceover Scripts",
      description: "Professional audio-ready content"
    },
    {
      icon: <Image className="w-8 h-8 text-pink-500" />,
      title: "Visual Avatar",
      description: "AI-generated professional imagery"
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-indigo-500" />,
      title: "Career Chatbot",
      description: "Interactive career guidance and refinement"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StoryCV
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Transform Your Resume Into Your Story
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Upload your resume and let AI craft a compelling personal narrative that showcases your journey, skills, and potential
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/upload')}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Resume
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-2 hover:bg-blue-50 transition-all duration-300"
            >
              View Example
            </Button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-12">
            <p className="text-sm text-gray-500 mb-2">🔒 Secure • Private • Powered by GPT-4</p>
            <p className="text-gray-600">Your resume is only used to generate content. Nothing is saved or stored.</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Upload", desc: "Upload your resume in any format" },
              { step: "2", title: "Parse", desc: "AI extracts and structures your data" },
              { step: "3", title: "Generate", desc: "Creates your personalized story" },
              { step: "4", title: "Export", desc: "Download your complete StoryCV" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
