
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Brain, ArrowLeft, Edit3, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParsedData {
  name: string;
  roles: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    tech_stack: string;
    summary: string;
  }>;
  skills: string[];
  education: string[];
  certifications: string[];
  achievements: string[];
  target_role: string;
}

const Parse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [parsedData, setParsedData] = useState<ParsedData>({
    name: "",
    roles: [],
    projects: [],
    skills: [],
    education: [],
    certifications: [],
    achievements: [],
    target_role: ""
  });
  const [editMode, setEditMode] = useState<string | null>(null);

  useEffect(() => {
    // Simulate AI parsing with mock data
    setTimeout(() => {
      const mockData: ParsedData = {
        name: "Alex Johnson",
        roles: [
          {
            title: "Senior Software Engineer",
            company: "TechCorp Inc.",
            duration: "2022 - Present",
            description: "Led development of microservices architecture, mentored junior developers, and improved system performance by 40%"
          },
          {
            title: "Full Stack Developer",
            company: "StartupXYZ",
            duration: "2020 - 2022",
            description: "Built responsive web applications using React and Node.js, collaborated with design team on user experience improvements"
          }
        ],
        projects: [
          {
            name: "E-commerce Platform",
            tech_stack: "React, Node.js, PostgreSQL, AWS",
            summary: "Developed a full-stack e-commerce solution handling 10k+ daily transactions"
          },
          {
            name: "AI Chatbot Assistant",
            tech_stack: "Python, TensorFlow, Flask, Docker",
            summary: "Created an intelligent customer support bot that reduced response time by 60%"
          }
        ],
        skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "PostgreSQL", "Docker", "Agile"],
        education: ["Bachelor of Science in Computer Science - University of Technology (2020)"],
        certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional Developer"],
        achievements: ["Led team of 5 developers", "Increased system performance by 40%", "Published 3 technical articles"],
        target_role: "Senior Software Engineer / Tech Lead"
      };
      
      setParsedData(mockData);
      setLoading(false);
      
      toast({
        title: "Resume parsed successfully!",
        description: "Review and edit the extracted information below.",
      });
    }, 2000);
  }, [toast]);

  const handleSave = (field: string, value: any) => {
    setParsedData(prev => ({
      ...prev,
      [field]: value
    }));
    setEditMode(null);
    toast({
      title: "Changes saved",
      description: "Information updated successfully.",
    });
  };

  const handleContinue = () => {
    localStorage.setItem('storyCV_parsed', JSON.stringify(parsedData));
    navigate('/story');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">AI is parsing your resume...</h2>
          <p className="text-gray-600">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/upload')} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
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
              Review Parsed Information
            </h1>
            <p className="text-xl text-gray-600">
              AI has extracted key information from your resume. Review and edit as needed.
            </p>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="p-6 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditMode(editMode === 'basic' ? null : 'basic')}
                >
                  {editMode === 'basic' ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </div>
              
              {editMode === 'basic' ? (
                <div className="space-y-4">
                  <Input
                    value={parsedData.name}
                    onChange={(e) => setParsedData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full Name"
                  />
                  <Input
                    value={parsedData.target_role}
                    onChange={(e) => setParsedData(prev => ({ ...prev, target_role: e.target.value }))}
                    placeholder="Target Role"
                  />
                  <Button onClick={() => handleSave('basic', null)}>Save Changes</Button>
                </div>
              ) : (
                <div>
                  <p><strong>Name:</strong> {parsedData.name}</p>
                  <p><strong>Target Role:</strong> {parsedData.target_role}</p>
                </div>
              )}
            </Card>

            {/* Work Experience */}
            <Card className="p-6 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditMode(editMode === 'roles' ? null : 'roles')}
                >
                  {editMode === 'roles' ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="space-y-4">
                {parsedData.roles.map((role, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold">{role.title}</h4>
                    <p className="text-gray-600">{role.company} • {role.duration}</p>
                    <p className="text-sm text-gray-700 mt-2">{role.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Projects */}
            <Card className="p-6 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Projects</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditMode(editMode === 'projects' ? null : 'projects')}
                >
                  {editMode === 'projects' ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="space-y-4">
                {parsedData.projects.map((project, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-gray-600 text-sm">{project.tech_stack}</p>
                    <p className="text-sm text-gray-700 mt-2">{project.summary}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            {/* Continue Button */}
            <div className="text-center pt-6">
              <Button
                size="lg"
                onClick={handleContinue}
                className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              >
                Generate My Story
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Parse;
