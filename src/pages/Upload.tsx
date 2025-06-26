
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && isValidFileType(file)) {
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready to be processed.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFileType(file)) {
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready to be processed.`,
      });
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    return validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.docx') || file.name.endsWith('.txt');
  };

  const handleContinue = () => {
    if (uploadedFile || manualText.trim()) {
      // Store the data in localStorage for the demo
      if (uploadedFile) {
        localStorage.setItem('storyCV_file', uploadedFile.name);
      }
      if (manualText.trim()) {
        localStorage.setItem('storyCV_text', manualText);
      }
      navigate('/parse');
    } else {
      toast({
        title: "No content to process",
        description: "Please upload a file or enter your resume text manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StoryCV
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Upload Your Resume
            </h1>
            <p className="text-xl text-gray-600">
              Let's start building your story. Upload your resume in any format.
            </p>
          </div>

          {/* Upload Area */}
          <Card className="p-8 border-2 border-dashed border-gray-300 bg-white/70 backdrop-blur-sm mb-6">
            <div
              className={`text-center transition-all duration-300 ${
                dragActive ? 'scale-105 border-blue-500' : ''
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UploadIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {uploadedFile ? uploadedFile.name : 'Drop your resume here'}
                </h3>
                <p className="text-gray-600 mb-4">
                  Supports PDF, DOCX, and TXT files
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-amber-50 border-amber-200 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Tips for Best Results</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Avoid resumes with complex tables or multiple columns</li>
                  <li>• Plain text layouts work best for AI parsing</li>
                  <li>• Make sure your PDF contains selectable text (not images)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Manual Input Toggle */}
          <div className="text-center mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-blue-600 hover:text-blue-700"
            >
              Having trouble? Paste your resume text instead
            </Button>
          </div>

          {/* Manual Text Input */}
          {showManualInput && (
            <Card className="p-6 bg-white/70 backdrop-blur-sm mb-6">
              <h4 className="font-semibold mb-4">Paste Your Resume Text</h4>
              <Textarea
                placeholder="Copy and paste your resume content here..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                className="min-h-[200px] mb-4"
              />
            </Card>
          )}

          {/* Continue Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!uploadedFile && !manualText.trim()}
              className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Parse Resume
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
