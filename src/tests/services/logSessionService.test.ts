import { 
  createSessionLog, 
  updateSessionWithResumeData, 
  updateSessionWithOriginalScore, 
  updateSessionWithOptimizedScore,
  saveFeedbackToDatabase 
} from '@/services/logSessionService';
import { supabase } from '@/integrations/supabase/client';
import { ResumeJson, ScoreResponse } from '@/types/resume';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn()
  }
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('LogSessionService', () => {
  const mockSessionId = 'test-session-id';
  const mockUserId = 'test-user-id';
  const mockUser = { id: mockUserId, email: 'test@example.com' };
  
  const mockResumeJson: ResumeJson = {
    basics: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      summary: 'Software engineer'
    },
    work: [],
    education: [],
    skills: []
  };

  const mockScoreResponse: ScoreResponse = {
    missing_keywords: ['leadership'],
    explanation: 'Good match',
    similarity: 0.85,
    consensus_qualification: 'Qualified'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default auth mock - cast to jest mock
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null
    });
  });

  describe('createSessionLog', () => {
    it('should create a new session log successfully', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: mockSessionId },
            error: null
          })
        })
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert
      } as any);

      const result = await createSessionLog('Software Engineer');

      expect(result).toBe(mockSessionId);
      expect(mockSupabase.from).toHaveBeenCalledWith('session_logs');
    });

    it('should handle creation error gracefully', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' }
          })
        })
      });

      mockSupabase.from.mockReturnValue({
        insert: mockInsert
      } as any);

      const result = await createSessionLog('Software Engineer');
      expect(result).toBeNull();
    });
  });

  describe('updateSessionWithResumeData', () => {
    it('should update session with resume data successfully', async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: {},
          error: null
        })
      });

      mockSupabase.from.mockReturnValue({
        update: mockUpdate
      } as any);

      await updateSessionWithResumeData(mockResumeJson);

      expect(mockSupabase.from).toHaveBeenCalledWith('session_logs');
      expect(mockUpdate).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      });
    });
  });

  describe('updateSessionWithOriginalScore', () => {
    it('should update session with original score successfully', async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: {},
          error: null
        })
      });

      mockSupabase.from.mockReturnValue({
        update: mockUpdate
      } as any);

      await updateSessionWithOriginalScore(mockScoreResponse);

      expect(mockSupabase.from).toHaveBeenCalledWith('session_logs');
      expect(mockUpdate).toHaveBeenCalledWith({
        unoptimized_score: 85,
        unoptimized_qualification: 'Qualified'
      });
    });
  });

  describe('updateSessionWithOptimizedScore', () => {
    it('should update session with optimized score successfully', async () => {
      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: {},
          error: null
        })
      });

      mockSupabase.from.mockReturnValue({
        update: mockUpdate
      } as any);

      await updateSessionWithOptimizedScore(mockScoreResponse);

      expect(mockSupabase.from).toHaveBeenCalledWith('session_logs');
      expect(mockUpdate).toHaveBeenCalledWith({
        optimized_score: 85,
        optimized_qualification: 'Qualified'
      });
    });
  });
});