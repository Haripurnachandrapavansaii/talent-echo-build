
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

export const parseResumeText = (text: string): ParsedData => {
  console.log('Parsing resume text:', text.substring(0, 200) + '...');
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const textLower = text.toLowerCase();
  
  // Extract name (look for patterns that indicate a name)
  const namePatterns = [
    // Look for standalone names at the beginning
    /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*$/m,
    // Look for names in headers
    /^([A-Z][A-Z\s]{2,30}[A-Z])$/m
  ];
  
  let name = "Professional";
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1].length < 40) {
      name = match[1].trim();
      break;
    }
  }
  
  // Extract email and phone for context
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const phoneMatch = text.match(/[\+]?[(]?[\d\s\-\(\)]{10,}/);
  
  // Extract skills with improved detection
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'angular', 'vue', 'node', 'python', 'java', 
    'html', 'css', 'sass', 'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 
    'kubernetes', 'git', 'github', 'agile', 'scrum', 'figma', 'photoshop', 'excel'
  ];
  
  const skills = [];
  for (const keyword of skillKeywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(textLower)) {
      skills.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  }
  
  // Look for skills sections
  const skillsSection = text.match(/(?:skills?|technologies?|technical skills?)[\s\n:•-]*(.*?)(?:\n\n|\n[A-Z]|$)/is);
  if (skillsSection) {
    const skillText = skillsSection[1];
    const extractedSkills = skillText.split(/[,•\n\-]/)
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 30)
      .slice(0, 10);
    skills.push(...extractedSkills);
  }
  
  // Extract work experience
  const roles = [];
  const jobTitlePatterns = [
    /(?:^|\n)([^\n]*(?:engineer|developer|manager|analyst|designer|specialist|consultant|coordinator|lead|senior|director|architect)[^\n]*)\n([^\n]+)\n([^\n]*(?:20\d{2}|present)[^\n]*)/gi
  ];
  
  for (const pattern of jobTitlePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null && roles.length < 4) {
      roles.push({
        title: match[1].trim(),
        company: match[2].trim(),
        duration: match[3].trim(),
        description: `Professional experience as ${match[1].trim()}`
      });
    }
  }
  
  // Extract education
  const education = [];
  const educationPatterns = [
    /(?:bachelor|master|phd|degree|university|college|certification)[^\n]*/gi,
    /(?:b\.?s\.?|m\.?s\.?|m\.?a\.?|b\.?a\.?)[^\n]*/gi
  ];
  
  for (const pattern of educationPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      education.push(...matches.slice(0, 3));
    }
  }
  
  // Extract projects
  const projects = [];
  const projectPatterns = [
    /(?:project|built|developed|created|designed)[\s:]([^\n]+)/gi
  ];
  
  for (const pattern of projectPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null && projects.length < 3) {
      const projectName = match[1].trim();
      if (projectName.length > 10) {
        projects.push({
          name: projectName.substring(0, 60),
          tech_stack: skills.slice(0, 3).join(', ') || 'Various Technologies',
          summary: projectName
        });
      }
    }
  }
  
  // Extract certifications
  const certifications = [];
  const certificationPattern = /(?:certified?|certification)[^\n]*/gi;
  const certMatches = text.match(certificationPattern);
  if (certMatches) {
    certifications.push(...certMatches.slice(0, 3));
  }
  
  // Determine target role
  let targetRole = "Professional Role";
  if (roles.length > 0) {
    targetRole = roles[0].title;
  } else if (skills.includes('React') || skills.includes('Javascript')) {
    targetRole = "Frontend Developer";
  } else if (skills.includes('Python') || skills.includes('Java')) {
    targetRole = "Software Developer";
  }
  
  return {
    name,
    roles: roles.length > 0 ? roles : [{
      title: targetRole,
      company: "Previous Company",
      duration: "2022 - Present",
      description: "Professional experience in software development"
    }],
    projects: projects.length > 0 ? projects : [{
      name: "Professional Project",
      tech_stack: skills.join(', ') || 'Various Technologies',
      summary: "Project developed using modern technologies"
    }],
    skills: skills.length > 0 ? [...new Set(skills)] : ['Professional Skills'],
    education: education.length > 0 ? education : ['Professional Education'],
    certifications,
    achievements: [],
    target_role: targetRole
  };
};
