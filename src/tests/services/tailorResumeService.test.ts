
import { tailorResume } from '@/services/api/tailorResumeService';
import { mockResumeJson } from '../mocks/resumeTestMocks';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    text: () => Promise.resolve(JSON.stringify({
      rationale: [
        "Added relevant keywords to align with job requirements",
        "Restructured work experience to highlight relevant accomplishments"
      ],
      resume: {
        basics: { name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
        work: [],
        education: [],
        skills: []
      }
    }))
  } as Response)
);

describe('tailorResume service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('tailorResume calls API with correct parameters', async () => {
    const jobPostingText = 'Software Engineer job description';
    
    await tailorResume(mockResumeJson, jobPostingText);
    
    expect(fetch).toHaveBeenCalled();
    const fetchCall = (fetch as jest.Mock).mock.calls[0];
    const url = fetchCall[0];
    const options = fetchCall[1];
    
    // Check URL contains encoded job posting
    expect(url).toContain(encodeURIComponent(jobPostingText));
    
    // Check request options
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body)).toEqual(mockResumeJson);
  });

  test('tailorResume returns both rationale and resume objects', async () => {
    const jobPostingText = 'Software Engineer job description';
    
    const result = await tailorResume(mockResumeJson, jobPostingText);
    
    expect(result.data).toBeDefined();
    expect(result.data?.rationale).toBeInstanceOf(Array);
    expect(result.data?.resume).toHaveProperty('basics');
  });

  test('tailorResume handles API errors', async () => {
    // Mock fetch to return an error
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error')
      } as Response)
    );
    
    const jobPostingText = 'Software Engineer job description';
    
    const result = await tailorResume(mockResumeJson, jobPostingText);
    
    expect(result.error).toBeDefined();
    expect(result.error).toContain('API error: 500');
    
    // Should still have fallback data
    expect(result.data).toBeDefined();
  });

  test('tailorResume handles network errors', async () => {
    // Mock fetch to throw an error
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );
    
    const jobPostingText = 'Software Engineer job description';
    
    const result = await tailorResume(mockResumeJson, jobPostingText);
    
    expect(result.error).toBeDefined();
    expect(result.error).toContain('Network error');
    
    // Should have fallback data
    expect(result.data).toBeDefined();
    expect(result.data?.resume).toBeDefined();
    expect(result.data?.rationale).toBeInstanceOf(Array);
  });
});
