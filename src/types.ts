export interface ResumeData {
  name: string;
  title: string;
  summary: string;
  contact: {
    phone: string;
    email: string;
    location: string;
    linkedin: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: string[];
  clubs: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string[];
}

export interface Skill {
  name: string;
}

export interface Certification {
  title: string;
}

export interface Project {
  title: string;
  focus: string;
  problem?: string;
  role: string;
  skill?: string;
  tools?: string;
  result: string;
}
