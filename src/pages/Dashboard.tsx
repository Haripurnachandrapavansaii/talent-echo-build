
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Download, Share2, Mic, Camera, MessageSquare, Sparkles, Copy, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [storyData, setStoryData] = useState<any>(null);
  const [voiceoverScript, setVoiceoverScript] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    // Load story data from localStorage
    const savedStory = localStorage.getItem('storyCV_story');
    if (savedStory) {
      setStoryData(JSON.parse(savedStory));
    }

    // Generate voiceover script
    const script = `Hi, I'm Alex Johnson, a Senior Software Engineer who's passionate about turning complex problems into elegant solutions. Over the past few years, I've led teams at TechCorp, improved system performance by 40%, and built innovative solutions like AI-powered chatbots. I believe in collaborative leadership, continuous learning, and creating technology that makes a real difference. I'm excited about opportunities to merge technical leadership with emerging technologies while mentoring the next generation of developers.`;
    setVoiceoverScript(script);
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied!`,
      description: "Content copied to clipboard.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your StoryCV PDF is being generated...",
    });
  };

  const projectSummaries = [
    {
      name: "E-commerce Platform",
      summary: "• Built full-stack e-commerce solution handling 10k+ daily transactions\n• Implemented React frontend with Node.js backend and PostgreSQL database\n• Deployed on AWS with 99.9% uptime and optimized performance"
    },
    {
      name: "AI Chatbot Assistant",
      summary: "• Developed intelligent customer support bot reducing response time by 60%\n• Used Python, TensorFlow for NLP processing and Flask for API development\n• Containerized with Docker for scalable deployment across environments"
    }
  ];

  if (!storyData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/story')} className="p-2">
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
          
          <div className="flex space-x-2">
            <Button onClick={handleDownload} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your StoryCV Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Your complete AI-generated career profile
            </p>
          </div>

          <Tabs defaultValue="story" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm">
              <TabsTrigger value="story">Story</TabsTrigger>
              <TabsTrigger value="voiceover">Voiceover</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="visual">Visual</TabsTrigger>
              <TabsTrigger value="chatbot">AI Coach</TabsTrigger>
            </TabsList>

            {/* Story Tab */}
            <TabsContent value="story" className="space-y-6">
              {/* Personal Story */}
              <Card className="p-6 bg-white/70 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Your Professional Story</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(storyData.story, "Story")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="prose max-w-none text-gray-700">
                  {storyData.story.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </Card>

              {/* Tagline & Soft Skills */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-r from-purple-100 to-blue-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Professional Tagline</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(storyData.tagline, "Tagline")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-lg font-medium italic">"{storyData.tagline}"</p>
                </Card>

                <Card className="p-6 bg-white/70 backdrop-blur-sm">
                  <h3 className="text-lg font-bold mb-4">Key Soft Skills</h3>
                  <div className="space-y-3">
                    {storyData.softSkills.map((skill: any, index: number) => (
                      <div key={index}>
                        <span className="font-semibold text-blue-600">{skill.skill}</span>
                        <p className="text-sm text-gray-600">{skill.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Voiceover Tab */}
            <TabsContent value="voiceover">
              <Card className="p-6 bg-white/70 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center">
                    <Mic className="w-6 h-6 mr-2 text-orange-500" />
                    30-Second Voiceover Script
                  </h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Play Audio
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(voiceoverScript, "Voiceover Script")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{voiceoverScript}</p>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>💡 This script is optimized for professional voiceovers and elevator pitches.</p>
                </div>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              {projectSummaries.map((project, index) => (
                <Card key={index} className="p-6 bg-white/70 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(project.summary, "Project Summary")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans">{project.summary}</pre>
                  </div>
                </Card>
              ))}
            </TabsContent>

            {/* Visual Tab */}
            <TabsContent value="visual">
              <Card className="p-6 bg-white/70 backdrop-blur-sm text-center">
                <div className="mb-6">
                  <Camera className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Professional Avatar Generator</h3>
                  <p className="text-gray-600">Generate a professional hero image for your profile</p>
                </div>
                
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-8 rounded-lg mb-6">
                  <div className="w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">AJ</span>
                  </div>
                  <p className="text-gray-600">Sample avatar - Click generate to create yours</p>
                </div>
                
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  <Camera className="w-4 h-4 mr-2" />
                  Generate Professional Avatar
                </Button>
              </Card>
            </TabsContent>

            {/* Chatbot Tab */}
            <TabsContent value="chatbot">
              <Card className="p-6 bg-white/70 backdrop-blur-sm">
                <div className="flex items-center mb-6">
                  <MessageSquare className="w-6 h-6 mr-2 text-indigo-500" />
                  <h3 className="text-xl font-bold">AI Career Coach</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-4 min-h-[300px]">
                  <div className="text-center text-gray-500 mt-20">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation with your AI career coach</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-4">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "How can I improve my story for startups?",
                      "Which roles match my profile?",
                      "What keywords should I add?",
                      "Help me optimize for ATS"
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
