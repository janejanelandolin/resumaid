
import { JobPosting, ResumeJson, ScoreResponse, UploadData } from '@/contexts/ResumeContext';

// Mock job posting
export const mockJobPosting: JobPosting = {
  id: 'job-123',
  title: 'Software Engineer',
  description: 'We are looking for a skilled software engineer with React experience.',
  requirements: ['3+ years of experience', 'React', 'TypeScript'],
  skills: ['React', 'TypeScript', 'JavaScript'],
  userProvided: false
};

// Mock resume JSON
export const mockResumeJson: ResumeJson = {
  basics: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    summary: 'Experienced software engineer with React expertise'
  },
  work: [
    {
      name: 'Tech Company',
      position: 'Senior Developer',
      startDate: '2020-01',
      endDate: '2023-01',
      summary: 'Led team of developers',
      highlights: ['Improved app performance by 30%']
    }
  ],
  education: [
    {
      institution: 'University',
      area: 'Computer Science',
      studyType: 'Bachelor',
      startDate: '2015-09',
      endDate: '2019-06'
    }
  ],
  skills: [
    {
      name: 'Frontend Development',
      keywords: ['React', 'JavaScript', 'TypeScript']
    }
  ]
};

// Mock score response
export const mockScoreResponse: ScoreResponse = {
  score: 75,
  qualification: 'Qualified',
  missing_keywords: ['Angular'],
  explanation: 'Good match for the position but missing some desired skills.',
  similarity: 0.75
};

// Mock tailored resume response
export const mockTailoredResponse = {
  rationale: [
    'Added relevant keywords to align with job requirements',
    'Restructured work experience to highlight relevant accomplishments'
  ],
  resume: {
    ...mockResumeJson,
    basics: {
      ...mockResumeJson.basics,
      summary: 'Experienced software engineer with React and TypeScript expertise'
    }
  }
};

// Mock upload data
export const mockUploadData: UploadData = {
  id: 'upload-123',
  filename: 'resume.pdf',
  content: 'Resume content goes here'
};

// Mock file
export const createMockFile = (name = 'resume.pdf', type = 'application/pdf', size = 1024) => {
  const file = new File(['mock file content'], name, { type });
  Object.defineProperty(file, 'size', {
    get() {
      return size;
    }
  });
  return file;
};
