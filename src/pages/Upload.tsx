
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload as UploadIcon, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change triggered', e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type);
      if (isValidFileType(file)) {
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
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validExtensions = ['.pdf', '.docx', '.txt'];
    
    console.log('Validating file:', file.name, 'Type:', file.type);
    
    return validTypes.includes(file.type) || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix to get just the base64 data
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleContinue = async () => {
    console.log('Continue button clicked');
    console.log('Uploaded file:', uploadedFile);
    console.log('Manual text length:', manualText.trim().length);
    
    if (!uploadedFile && !manualText.trim()) {
      toast({
        title: "No content to process",
        description: "Please upload a file or enter text manually.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Store the content for the next step
      if (uploadedFile) {
        localStorage.setItem('uploaded_file_name', uploadedFile.name);
        
        // Convert file to base64 for storage
        try {
          const base64Data = await fileToBase64(uploadedFile);
          localStorage.setItem('uploaded_file_data', base64Data);
          console.log('File converted to base64 and stored');
        } catch (error) {
          console.error('Error converting file to base64:', error);
          toast({
            title: "File processing error",
            description: "There was an issue processing your file. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }
      
      if (manualText.trim()) {
        localStorage.setItem('manual_resume_text', manualText);
      }

      toast({
        title: "Content ready for processing",
        description: "Proceeding to parse your resume...",
      });

      // Navigate to parse page
      navigate('/parse');
    } catch (error) {
      console.error('Error processing content:', error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            <p className="text-gray-600 text-lg">
              Upload your resume file or paste the content manually to get started
            </p>
          </div>

          <Card className="p-8 bg-white/70 backdrop-blur-sm">
            <div className="space-y-8">
              {/* File Upload Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Upload File</h2>
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <UploadIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your resume here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF, DOCX, and TXT files
                  </p>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button type="button" variant="outline" className="cursor-pointer" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                    {uploadedFile && (
                      <span className="text-sm text-green-600 font-medium">
                        ✓ {uploadedFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center space-x-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Manual Text Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Enter Manually</h2>
                <div className="space-y-2">
                  <label htmlFor="manual-text" className="block text-sm font-medium text-gray-700">
                    Paste your resume content here
                  </label>
                  <Textarea
                    id="manual-text"
                    placeholder="Copy and paste your resume content here..."
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    {manualText.length} characters
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <div className="pt-4">
                <Button
                  onClick={handleContinue}
                  disabled={(!uploadedFile && !manualText.trim()) || loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Parse Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
