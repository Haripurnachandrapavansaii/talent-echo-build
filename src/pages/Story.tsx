
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, RefreshCw, Copy, Edit, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Story = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");
  const [tagline, setTagline] = useState("");
  const [softSkills, setSoftSkills] = useState<Array<{skill: string, reasoning: string}>>([]);

  useEffect(() => {
    // Simulate AI story generation
    setTimeout(() => {
      const generatedStory = `My journey in technology began with a simple curiosity about how things work, but it quickly evolved into a passion for creating solutions that make a real difference. As a Senior Software Engineer at TechCorp Inc., I've had the privilege of leading teams through complex challenges, turning ambitious ideas into scalable systems that serve thousands of users daily.

What drives me most is the intersection of technical excellence and human impact. Whether I'm architecting microservices that improve system performance by 40% or mentoring junior developers who bring fresh perspectives to our team, I've learned that the best solutions come from collaboration and continuous learning. My experience spans the full spectrum of development - from building responsive web applications at StartupXYZ to developing AI-powered chatbots that revolutionize customer support.

I thrive in environments where innovation meets execution. My background in both startup agility and enterprise-scale solutions has taught me to balance rapid iteration with robust architecture. I believe in writing code that not only works today but stands the test of time, and in building teams that are as passionate about clean code as they are about solving real-world problems.

Looking ahead, I'm excited about the opportunities to merge my technical leadership skills with emerging technologies. I see myself continuing to bridge the gap between complex technical challenges and meaningful business outcomes, always with an eye toward mentoring the next generation of developers and contributing to technology that makes our world a little bit better.`;

      const generatedTagline = "Turning complex problems into elegant solutions since 2020";
      
      const generatedSoftSkills = [
        {
          skill: "Leadership",
          reasoning: "Led teams of 5+ developers and improved system performance through strategic technical decisions"
        },
        {
          skill: "Mentorship",
          reasoning: "Consistently mentored junior developers, helping them grow their technical and professional skills"
        },
        {
          skill: "Innovation",
          reasoning: "Developed AI-powered solutions and modern architectures that solved real business challenges"
        }
      ];

      setStory(generatedStory);
      setTagline(generatedTagline);
      setSoftSkills(generatedSoftSkills);
      setLoading(false);

      toast({
        title: "Your story is ready!",
        description: "AI has crafted your personalized career narrative.",
      });
    }, 3000);
  }, [toast]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied!`,
      description: "Content copied to clipboard.",
    });
  };

  const handleRegenerate = () => {
    setLoading(true);
    // Simulate regeneration
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Story regenerated!",
        description: "Your narrative has been refreshed with new insights.",
      });
    }, 2000);
  };

  const handleContinue = () => {
    const storyData = {
      story,
      tagline,
      softSkills
    };
    localStorage.setItem('storyCV_story', JSON.stringify(storyData));
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Crafting your story...</h2>
          <p className="text-gray-600">AI is weaving your experiences into a compelling narrative</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/parse')} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Career Story
            </h1>
            <p className="text-xl text-gray-600">
              AI has crafted a compelling narrative from your experience
            </p>
          </div>

          {/* Story Card */}
          <Card className="p-8 bg-white/70 backdrop-blur-sm mb-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Professional Narrative</h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  className="text-blue-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(story, "Story")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {story.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>

          {/* Tagline Card */}
          <Card className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Your Professional Tagline</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(tagline, "Tagline")}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <p className="text-lg font-medium text-gray-800 italic">"{tagline}"</p>
          </Card>

          {/* Soft Skills Card */}
          <Card className="p-6 bg-white/70 backdrop-blur-sm mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Inferred Soft Skills</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {softSkills.map((skill, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{skill.skill}</h4>
                  <p className="text-sm text-gray-600">{skill.reasoning}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Story
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Continue to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Story;
