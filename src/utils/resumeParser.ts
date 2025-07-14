
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
  console.log('Advanced parsing resume text:', text.substring(0, 300) + '...');
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const textLower = text.toLowerCase();
  
  // Enhanced name extraction with multiple strategies
  const extractName = (text: string): string => {
    // Strategy 1: Look for name patterns at the beginning
    const namePatterns = [
      // Full name at start of document
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]*){1,3})(?:\s*\n|\s*$)/m,
      // Name followed by contact info
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]*){1,3})(?:\s*[\|\•\-]\s*|\s+)[\w\@\.\s\(\)\-\+]+$/m,
      // Name in header format
      /^([A-Z\s]{3,40})$/m,
      // Name before email or phone
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]*){1,3})[\s\n]*(?:[\w\.-]+@[\w\.-]+\.\w+|[\+\(\)\d\s\-]{10,})/
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const candidate = match[1].trim();
        // Validate it's actually a name (not a title or company)
        if (candidate.length >= 3 && candidate.length <= 50 && 
            !candidate.toLowerCase().includes('resume') &&
            !candidate.toLowerCase().includes('curriculum') &&
            !/\d/.test(candidate) &&
            candidate.split(' ').length <= 4) {
          return candidate;
        }
      }
    }
    
    // Strategy 2: Look for "Name: " or similar labels
    const labeledName = text.match(/(?:name|full name):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]*){1,3})/i);
    if (labeledName) return labeledName[1].trim();
    
    return "Professional";
  };
  
  // Enhanced work experience extraction
  const extractWorkExperience = (text: string) => {
    const roles = [];
    
    // Multiple patterns for job experience
    const experiencePatterns = [
      // Title, Company, Duration format
      /(?:^|\n)([^\n]*(?:engineer|developer|manager|analyst|designer|specialist|consultant|coordinator|lead|senior|director|architect|intern|associate)[^\n]*)\n([^\n]+(?:inc|corp|llc|ltd|company|tech|systems|solutions|group|enterprises)[^\n]*)\n([^\n]*(?:20\d{2}|present|current)[^\n]*)/gi,
      // Company first format
      /(?:^|\n)([^\n]+(?:inc|corp|llc|ltd|company|tech|systems|solutions|group|enterprises)[^\n]*)\n([^\n]*(?:engineer|developer|manager|analyst|designer|specialist|consultant|coordinator|lead|senior|director|architect)[^\n]*)\n([^\n]*(?:20\d{2}|present|current)[^\n]*)/gi,
      // Bullet point format
      /(?:^|\n)•\s*([^\n]*(?:engineer|developer|manager|analyst|designer|specialist|consultant|coordinator|lead|senior|director|architect)[^\n]*)[^\n]*\n(?:•\s*)?([^\n]+(?:inc|corp|llc|ltd|company|tech|systems|solutions|group|enterprises)[^\n]*)\n(?:•\s*)?([^\n]*(?:20\d{2}|present|current)[^\n]*)/gi
    ];
    
    for (const pattern of experiencePatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null && roles.length < 5) {
        const [, field1, field2, field3] = match;
        
        // Determine which field is title, company, duration
        let title, company, duration;
        
        if (field3.match(/20\d{2}|present|current/i)) {
          duration = field3.trim();
          if (field1.match(/engineer|developer|manager|analyst|designer|specialist|consultant|coordinator|lead|senior|director|architect/i)) {
            title = field1.trim();
            company = field2.trim();
          } else {
            title = field2.trim();
            company = field1.trim();
          }
        }
        
        if (title && company && duration) {
          // Extract job description from surrounding text
          const jobIndex = text.indexOf(match[0]);
          const nextJobIndex = text.indexOf('\n\n', jobIndex + match[0].length);
          const descriptionText = text.substring(jobIndex + match[0].length, nextJobIndex > 0 ? nextJobIndex : jobIndex + 500);
          
          const description = descriptionText
            .split('\n')
            .filter(line => line.trim().length > 10)
            .slice(0, 3)
            .join(' ')
            .substring(0, 200) || `Professional experience as ${title}`;
          
          roles.push({
            title: title.replace(/[•\-]/g, '').trim(),
            company: company.replace(/[•\-]/g, '').trim(),
            duration: duration.replace(/[•\-]/g, '').trim(),
            description: description.trim()
          });
        }
      }
    }
    
    return roles;
  };
  
  // Enhanced project extraction
  const extractProjects = (text: string) => {
    const projects = [];
    
    // Look for project sections and individual projects
    const projectPatterns = [
      /(?:projects?|portfolio|work samples?)[\s\n:•\-]*(.*?)(?:\n\n|$)/gis,
      /(?:built|developed|created|designed|implemented)\s+([^\n.]{20,100})/gi,
      /project:\s*([^\n]{10,80})/gi,
      /([A-Z][a-z\s]{10,60}(?:app|application|website|system|platform|tool|dashboard|api))/gi
    ];
    
    for (const pattern of projectPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null && projects.length < 4) {
        const projectText = match[1];
        if (projectText && projectText.length > 10) {
          const lines = projectText.split('\n').filter(line => line.trim().length > 5);
          
          for (const line of lines.slice(0, 3)) {
            if (projects.length >= 4) break;
            
            const cleanLine = line.replace(/[•\-\*]/g, '').trim();
            if (cleanLine.length > 15 && cleanLine.length < 100) {
              // Extract tech stack from the same context
              const techContext = text.substring(
                Math.max(0, text.indexOf(cleanLine) - 200),
                text.indexOf(cleanLine) + 200
              );
              
              const techWords = ['React', 'JavaScript', 'Python', 'Java', 'Node', 'SQL', 'HTML', 'CSS', 'Angular', 'Vue', 'Django', 'Flask', 'Spring', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git'];
              const foundTech = techWords.filter(tech => 
                new RegExp(`\\b${tech}\\b`, 'i').test(techContext)
              );
              
              projects.push({
                name: cleanLine.substring(0, 60),
                tech_stack: foundTech.length > 0 ? foundTech.join(', ') : 'Various Technologies',
                summary: cleanLine.length > 60 ? cleanLine.substring(0, 120) + '...' : cleanLine
              });
            }
          }
        }
      }
    }
    
    return projects;
  };
  
  // Enhanced skills extraction
  const extractSkills = (text: string) => {
    const allSkills = [];
    
    // Technical skills keywords (expanded)
    const techSkills = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python', 'Java', 'C++', 'C#',
      'HTML', 'CSS', 'SASS', 'SCSS', 'Tailwind', 'Bootstrap', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'GitLab', 'Jenkins', 'CI/CD',
      'REST', 'GraphQL', 'API', 'Microservices', 'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence',
      'Redux', 'Next.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Ruby', 'PHP', 'Go',
      'Figma', 'Photoshop', 'Illustrator', 'Sketch', 'InVision', 'Wireframing', 'Prototyping',
      'Machine Learning', 'AI', 'Data Science', 'Analytics', 'Tableau', 'Power BI', 'Excel'
    ];
    
    // Find skills in the text
    for (const skill of techSkills) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(text)) {
        allSkills.push(skill);
      }
    }
    
    // Look for skills sections
    const skillsSectionMatch = text.match(/(?:skills?|technologies?|technical skills?|competencies)[\s\n:•\-]*(.*?)(?:\n\n|experience|education|projects|$)/is);
    if (skillsSectionMatch) {
      const skillsText = skillsSectionMatch[1];
      const extractedSkills = skillsText
        .split(/[,•\n\-\|]/)
        .map(s => s.trim())
        .filter(s => s.length > 1 && s.length < 25 && !/\d{4}/.test(s))
        .slice(0, 15);
      allSkills.push(...extractedSkills);
    }
    
    return [...new Set(allSkills)].slice(0, 20);
  };
  
  // Enhanced education extraction
  const extractEducation = (text: string) => {
    const education = [];
    const educationPatterns = [
      /(?:bachelor|master|phd|doctorate|degree|university|college|institute).*?(?:\n|$)/gi,
      /(?:b\.?s\.?|m\.?s\.?|m\.?a\.?|b\.?a\.?|phd).*?(?:\n|$)/gi,
      /(?:education|academic|qualification)[\s\n:•\-]*(.*?)(?:\n\n|experience|skills|$)/is
    ];
    
    for (const pattern of educationPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        education.push(...matches.slice(0, 3).map(match => match.trim()));
      }
    }
    
    return [...new Set(education)].slice(0, 3);
  };
  
  // Parse all components
  const name = extractName(text);
  const roles = extractWorkExperience(text);
  const projects = extractProjects(text);
  const skills = extractSkills(text);
  const education = extractEducation(text);
  
  // Determine target role intelligently
  let targetRole = "Software Professional";
  if (roles.length > 0) {
    targetRole = roles[0].title;
  } else if (skills.some(skill => ['React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'HTML', 'CSS'].includes(skill))) {
    targetRole = "Frontend Developer";
  } else if (skills.some(skill => ['Python', 'Java', 'Node.js', 'API', 'Database'].includes(skill))) {
    targetRole = "Backend Developer";
  } else if (skills.some(skill => ['AWS', 'Docker', 'Kubernetes', 'DevOps'].includes(skill))) {
    targetRole = "DevOps Engineer";
  } else if (skills.some(skill => ['Machine Learning', 'Data Science', 'Analytics'].includes(skill))) {
    targetRole = "Data Scientist";
  }
  
  // Extract certifications
  const certifications = [];
  const certPattern = /(?:certified?|certification).*?(?:\n|$)/gi;
  const certMatches = text.match(certPattern);
  if (certMatches) {
    certifications.push(...certMatches.slice(0, 3));
  }
  
  // Extract achievements
  const achievements = [];
  const achievementPatterns = [
    /(?:achieved|accomplished|awarded|recognized|improved|increased|reduced|led).*?(?:\n|$)/gi,
    /(?:award|recognition|achievement|accomplishment).*?(?:\n|$)/gi
  ];
  
  for (const pattern of achievementPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      achievements.push(...matches.slice(0, 3).map(match => match.trim()));
    }
  }
  
  return {
    name,
    roles: roles.length > 0 ? roles : [{
      title: targetRole,
      company: "Previous Company",
      duration: "2022 - Present",
      description: "Professional experience in software development and technology solutions"
    }],
    projects: projects.length > 0 ? projects : [{
      name: "Professional Development Project",
      tech_stack: skills.slice(0, 3).join(', ') || 'Modern Technologies',
      summary: "Developed and implemented technology solutions using industry best practices"
    }],
    skills: skills.length > 0 ? skills : ['Problem Solving', 'Team Collaboration', 'Technical Skills'],
    education: education.length > 0 ? education : ['Professional Education Background'],
    certifications,
    achievements: [...new Set(achievements)].slice(0, 5),
    target_role: targetRole
  };
};
