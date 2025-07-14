
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

interface StoryData {
  story: string;
  tagline: string;
  softSkills: Array<{
    skill: string;
    reasoning: string;
  }>;
}

export const generatePersonalizedStory = (data: ParsedData): StoryData => {
  console.log('Generating personalized story for:', data.name);
  
  // Analyze the career progression
  const careerProgression = analyzeCareerProgression(data.roles);
  const technicalExpertise = analyzeTechnicalSkills(data.skills);
  const projectImpact = analyzeProjectImpact(data.projects);
  
  // Generate story paragraphs
  const introductionParagraph = generateIntroduction(data, technicalExpertise);
  const experienceParagraph = generateExperienceNarrative(data, careerProgression);
  const projectsParagraph = generateProjectsNarrative(data, projectImpact);
  const futureParagraph = generateFutureVision(data, technicalExpertise);
  
  const story = [
    introductionParagraph,
    experienceParagraph,
    projectsParagraph,
    futureParagraph
  ].join('\n\n');
  
  // Generate tagline
  const tagline = generateTagline(data, careerProgression);
  
  // Infer soft skills
  const softSkills = inferSoftSkills(data);
  
  return {
    story,
    tagline,
    softSkills
  };
};

const analyzeCareerProgression = (roles: ParsedData['roles']) => {
  const seniority = roles.some(role => 
    role.title.toLowerCase().includes('senior') || 
    role.title.toLowerCase().includes('lead') || 
    role.title.toLowerCase().includes('principal')
  ) ? 'senior' : roles.some(role => 
    role.title.toLowerCase().includes('junior') || 
    role.title.toLowerCase().includes('intern')
  ) ? 'junior' : 'mid';
  
  const hasLeadership = roles.some(role => 
    role.title.toLowerCase().includes('lead') || 
    role.title.toLowerCase().includes('manager') || 
    role.title.toLowerCase().includes('director')
  );
  
  const companies = roles.map(role => role.company).filter(Boolean);
  
  return {
    seniority,
    hasLeadership,
    companyCount: companies.length,
    companies: companies.slice(0, 3)
  };
};

const analyzeTechnicalSkills = (skills: string[]) => {
  const frontend = skills.filter(skill => 
    ['React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Bootstrap'].includes(skill)
  );
  
  const backend = skills.filter(skill => 
    ['Node.js', 'Python', 'Java', 'C#', 'Express', 'Django', 'Flask', 'Spring', 'API', 'REST', 'GraphQL'].includes(skill)
  );
  
  const database = skills.filter(skill => 
    ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL'].includes(skill)
  );
  
  const cloud = skills.filter(skill => 
    ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'].includes(skill)
  );
  
  const isFullStack = frontend.length > 0 && backend.length > 0;
  const isCloudNative = cloud.length > 0;
  
  return {
    frontend,
    backend,
    database,
    cloud,
    isFullStack,
    isCloudNative,
    primaryStack: frontend.length > backend.length ? 'frontend' : backend.length > 0 ? 'backend' : 'general'
  };
};

const analyzeProjectImpact = (projects: ParsedData['projects']) => {
  const hasMultipleProjects = projects.length > 1;
  const technologies = projects.flatMap(p => p.tech_stack.split(', ')).filter(Boolean);
  const uniqueTech = [...new Set(technologies)];
  
  return {
    hasMultipleProjects,
    projectCount: projects.length,
    technologies: uniqueTech.slice(0, 5),
    diverseTech: uniqueTech.length > 3
  };
};

const generateIntroduction = (data: ParsedData, techExpertise: any) => {
  const templates = [
    `My journey in technology began with a curiosity about ${techExpertise.primaryStack === 'frontend' ? 'creating engaging user experiences' : techExpertise.primaryStack === 'backend' ? 'building robust systems' : 'solving complex problems'}, and has evolved into a passion for ${techExpertise.isFullStack ? 'full-stack development' : techExpertise.primaryStack + ' development'} that drives meaningful impact.`,
    
    `As ${data.target_role.includes('Senior') || data.target_role.includes('Lead') ? 'an experienced' : 'a dedicated'} ${data.target_role}, I've discovered that the best solutions emerge when ${techExpertise.isFullStack ? 'technical versatility meets creative problem-solving' : 'deep expertise combines with innovative thinking'}.`,
    
    `What started as an interest in ${data.skills[0] || 'technology'} has grown into a comprehensive understanding of ${techExpertise.isFullStack ? 'end-to-end application development' : techExpertise.primaryStack + ' technologies'}, with a focus on delivering solutions that make a real difference.`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};

const generateExperienceNarrative = (data: ParsedData, progression: any) => {
  const currentRole = data.roles[0];
  
  if (progression.hasLeadership) {
    return `In my role as ${currentRole.title} at ${currentRole.company}, I've had the opportunity to ${progression.seniority === 'senior' ? 'lead cross-functional teams and drive technical strategy' : 'mentor junior developers and contribute to architectural decisions'}. ${currentRole.description || 'My experience spans both hands-on development and strategic planning, ensuring that technical solutions align with business objectives.'} This combination of technical depth and leadership perspective has taught me that the most successful projects are built on both solid engineering principles and strong collaborative relationships.`;
  }
  
  return `Throughout my experience ${progression.companyCount > 1 ? 'across multiple organizations' : `at ${currentRole.company}`}, I've developed expertise in ${data.skills.slice(0, 3).join(', ')}${data.skills.length > 3 ? ' and other key technologies' : ''}. ${currentRole.description || 'My approach focuses on writing clean, maintainable code while delivering features that users love.'} ${progression.seniority === 'senior' ? 'This foundation has allowed me to tackle increasingly complex challenges and contribute to high-impact projects.' : 'Each project has strengthened my problem-solving abilities and deepened my understanding of software development best practices.'}`;
};

const generateProjectsNarrative = (data: ParsedData, impact: any) => {
  const firstProject = data.projects[0];
  
  if (impact.hasMultipleProjects) {
    return `My project portfolio demonstrates a range of technical capabilities, from ${firstProject.name} ${firstProject.tech_stack ? `using ${firstProject.tech_stack}` : ''} to ${impact.diverseTech ? 'diverse applications spanning multiple technology stacks' : 'focused solutions in my area of expertise'}. ${impact.diverseTech ? 'This diversity has taught me to adapt quickly to new technologies while maintaining consistent quality standards.' : 'This focused approach has allowed me to develop deep expertise in my chosen stack.'} Each project has reinforced my belief that great software comes from understanding both the technical requirements and the human needs behind them.`;
  }
  
  return `A standout example of my work is ${firstProject.name}, ${firstProject.summary || 'which showcases my ability to transform complex requirements into elegant solutions'}. ${firstProject.tech_stack ? `Built with ${firstProject.tech_stack}, this project` : 'This project'} demonstrates my commitment to ${impact.diverseTech ? 'leveraging the right technologies for each unique challenge' : 'mastering the tools that drive exceptional results'}. The experience reinforced my understanding that successful software development requires both technical excellence and a deep appreciation for user experience.`;
};

const generateFutureVision = (data: ParsedData, techExpertise: any) => {
  const visionTemplates = [
    `Looking ahead, I'm excited about opportunities to ${techExpertise.isCloudNative ? 'leverage cloud-native architectures and modern deployment practices' : 'explore emerging technologies and expand my technical toolkit'} while continuing to ${data.roles.some(r => r.description?.includes('mentor') || r.title.toLowerCase().includes('lead')) ? 'mentor the next generation of developers' : 'grow my technical leadership skills'}. I see myself contributing to ${techExpertise.isFullStack ? 'end-to-end solutions that bridge the gap between user needs and technical possibilities' : `innovative ${techExpertise.primaryStack} solutions that push the boundaries of what's possible`}.`,
    
    `My goal is to continue building technology that not only solves complex problems but also ${techExpertise.isCloudNative ? 'scales efficiently and maintains reliability under pressure' : 'creates intuitive experiences for users'}. ${data.target_role.includes('Senior') ? 'As I advance in my career, I want to combine deep technical expertise with strategic thinking to drive meaningful innovation.' : 'I\'m particularly interested in taking on challenges that will expand both my technical skills and my understanding of how technology impacts business outcomes.'}`,
    
    `The future of technology excites me, particularly the potential for ${techExpertise.isFullStack ? 'integrated solutions that seamlessly connect all layers of the application stack' : `${techExpertise.primaryStack} technologies to become even more powerful and accessible`}. I'm committed to staying at the forefront of these developments while never losing sight of the fundamental goal: creating technology that makes people's lives better.`
  ];
  
  return visionTemplates[Math.floor(Math.random() * visionTemplates.length)];
};

const generateTagline = (data: ParsedData, progression: any) => {
  const taglines = [
    `${progression.hasLeadership ? 'Leading teams to build' : 'Building'} innovative solutions with ${data.skills[0] || 'modern technologies'} since ${new Date().getFullYear() - 3}`,
    `Transforming complex problems into elegant ${data.target_role.toLowerCase().includes('frontend') ? 'user experiences' : data.target_role.toLowerCase().includes('backend') ? 'backend systems' : 'software solutions'} since ${new Date().getFullYear() - 4}`,
    `${progression.seniority === 'senior' ? 'Senior technologist' : 'Dedicated developer'} passionate about ${data.skills.slice(0, 2).join(' and ') || 'clean code and great user experiences'}`,
    `Bridging the gap between ${data.target_role.toLowerCase().includes('full') ? 'frontend creativity and backend reliability' : 'technical excellence and business impact'} since ${new Date().getFullYear() - 2}`
  ];
  
  return taglines[Math.floor(Math.random() * taglines.length)];
};

const inferSoftSkills = (data: ParsedData): Array<{skill: string, reasoning: string}> => {
  const softSkills = [];
  
  // Leadership
  if (data.roles.some(role => role.title.toLowerCase().includes('lead') || role.title.toLowerCase().includes('senior') || role.title.toLowerCase().includes('manager'))) {
    softSkills.push({
      skill: "Leadership",
      reasoning: `Demonstrated leadership experience as ${data.roles[0].title}, guiding teams and driving technical decisions`
    });
  }
  
  // Problem Solving
  if (data.projects.length > 1 || data.skills.length > 5) {
    softSkills.push({
      skill: "Problem Solving",
      reasoning: `Successfully delivered ${data.projects.length > 1 ? 'multiple projects' : 'complex projects'} using diverse technologies like ${data.skills.slice(0, 3).join(', ')}`
    });
  }
  
  // Adaptability
  if (data.skills.length > 7 || data.roles.length > 1) {
    softSkills.push({
      skill: "Adaptability",
      reasoning: `Experience with ${data.skills.length} different technologies${data.roles.length > 1 ? ` across ${data.roles.length} different roles` : ''} demonstrates strong adaptability`
    });
  }
  
  // Communication
  if (data.achievements.length > 0 || data.roles.some(role => role.description?.length > 50)) {
    softSkills.push({
      skill: "Communication",
      reasoning: "Documented achievements and detailed role descriptions indicate strong communication and documentation skills"
    });
  }
  
  // Default soft skills if none detected
  if (softSkills.length === 0) {
    softSkills.push(
      {
        skill: "Technical Excellence",
        reasoning: `Proficiency in ${data.skills.slice(0, 3).join(', ')} demonstrates commitment to technical excellence`
      },
      {
        skill: "Continuous Learning",
        reasoning: "Diverse skill set and project experience show dedication to continuous learning and growth"
      }
    );
  }
  
  return softSkills.slice(0, 3);
};
