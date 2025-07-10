/**
 * Integration tests for session logging workflow
 * Tests the complete flow from resume upload to session completion
 */

import { 
  createSessionLog, 
  updateSessionWithResumeData, 
  updateSessionWithOriginalScore, 
  updateSessionWithOptimizedScore 
} from '@/services/logSessionService';
import { mockResumeJson, mockScoreResponse } from '../mocks/resumeTestMocks';

// Mock Supabase with more realistic behavior
const mockSessionId = 'integration-test-session';
let mockSessionData = {};

const mockSupabaseWithState = {
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: { id: 'test-user', email: 'test@example.com' } },
      error: null
    })
  },
  from: jest.fn().mockImplementation((table: string) => {
    if (table === 'session_logs') {
      return {
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: mockSessionId },
              error: null
            })
          })
        }),
        update: jest.fn().mockImplementation((data: any) => {
          // Simulate updating the mock session data
          mockSessionData = { ...mockSessionData, ...data };
          return {
            eq: jest.fn().mockResolvedValue({
              data: { ...mockSessionData, id: mockSessionId },
              error: null
            })
          };
        }),
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: mockSessionId, ...mockSessionData },
                error: null
              })
            })
          })
        })
      };
    }
    return {};
  })
};

jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseWithState
}));

describe('Session Logging Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionData = {};
  });

  describe('Complete session workflow', () => {
    it('should handle the complete session logging workflow', async () => {
      // Step 1: Create initial session log
      const sessionId = await createSessionLog('Software Engineer');
      expect(sessionId).toBe(mockSessionId);

      // Step 2: Update with resume data after schema processing
      await updateSessionWithResumeData(sessionId!, mockResumeJson);

      // Verify resume data was set
      expect(mockSessionData).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      });

      // Step 3: Update with original score
      await updateSessionWithOriginalScore(sessionId!, mockScoreResponse);

      // Verify original score was set
      expect(mockSessionData).toMatchObject({
        unoptimized_score: 75, // 0.75 * 100
        unoptimized_qualification: 'Qualified'
      });

      // Step 4: Update with optimized score
      const optimizedScore = {
        ...mockScoreResponse,
        similarity: 0.90,
        consensus_qualification: 'Highly Qualified'
      };

      await updateSessionWithOptimizedScore(sessionId!, optimizedScore);

      // Verify optimized score was set
      expect(mockSessionData).toMatchObject({
        optimized_score: 90,
        optimized_qualification: 'Highly Qualified'
      });

      // Final verification: All data should be present
      expect(mockSessionData).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        unoptimized_score: 75,
        unoptimized_qualification: 'Qualified',
        optimized_score: 90,
        optimized_qualification: 'Highly Qualified'
      });
    });

    it('should handle partial workflows gracefully', async () => {
      // Create session but don't complete all steps
      const sessionId = await createSessionLog('Data Scientist');
      expect(sessionId).toBe(mockSessionId);

      // Only update with resume data
      await updateSessionWithResumeData(sessionId!, mockResumeJson);

      // Verify partial data is correct
      expect(mockSessionData).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      });

      // Should not have score data
      expect(mockSessionData).not.toHaveProperty('unoptimized_score');
      expect(mockSessionData).not.toHaveProperty('optimized_score');
    });

    it('should handle workflow with missing optional data', async () => {
      const incompleteResume = {
        basics: {
          name: 'Jane Smith'
          // Missing email, phone
        },
        work: [],
        education: [],
        skills: []
      };

      const sessionId = await createSessionLog('Product Manager');
      
      await updateSessionWithResumeData(sessionId!, incompleteResume as any);

      expect(mockSessionData).toMatchObject({
        name: 'Jane Smith',
        email: '',
        phone: ''
      });
    });

    it('should handle score updates with missing qualification', async () => {
      const sessionId = await createSessionLog('Marketing Manager');
      
      const scoreWithoutQualification = {
        ...mockScoreResponse,
        consensus_qualification: undefined
      };

      await updateSessionWithOriginalScore(sessionId!, scoreWithoutQualification);

      expect(mockSessionData).toMatchObject({
        unoptimized_score: 75,
        unoptimized_qualification: 'Analysis failed'
      });
    });

    it('should handle zero scores correctly', async () => {
      const sessionId = await createSessionLog('Sales Representative');
      
      const zeroScore = {
        ...mockScoreResponse,
        similarity: 0
      };

      await updateSessionWithOriginalScore(sessionId!, zeroScore);

      expect(mockSessionData).toMatchObject({
        unoptimized_score: 0,
        unoptimized_qualification: 'Qualified'
      });
    });
  });

  describe('Error recovery scenarios', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error for update operations
      const errorMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' }
        })
      });

      mockSupabaseWithState.from.mockReturnValue({
        update: errorMock
      });

      const sessionId = 'test-session';

      // Should not throw errors
      await expect(updateSessionWithResumeData(sessionId, mockResumeJson))
        .resolves.not.toThrow();

      await expect(updateSessionWithOriginalScore(sessionId, mockScoreResponse))
        .resolves.not.toThrow();

      await expect(updateSessionWithOptimizedScore(sessionId, mockScoreResponse))
        .resolves.not.toThrow();
    });

    it('should handle network failures during session creation', async () => {
      // Mock network failure
      mockSupabaseWithState.from.mockImplementation(() => {
        throw new Error('Network timeout');
      });

      const sessionId = await createSessionLog('DevOps Engineer');
      
      // Should return null on failure
      expect(sessionId).toBeNull();
    });
  });

  describe('Data consistency checks', () => {
    it('should maintain data consistency across multiple updates', async () => {
      const sessionId = await createSessionLog('Full Stack Developer');
      
      // First round of updates
      await updateSessionWithResumeData(sessionId!, mockResumeJson);
      await updateSessionWithOriginalScore(sessionId!, mockScoreResponse);
      
      const firstSnapshot = { ...mockSessionData };
      
      // Second round of updates (simulating corrections)
      const correctedScore = {
        ...mockScoreResponse,
        similarity: 0.95,
        consensus_qualification: 'Exceptionally Qualified'
      };
      
      await updateSessionWithOptimizedScore(sessionId!, correctedScore);
      
      // Original data should still be present
      expect(mockSessionData).toMatchObject({
        ...firstSnapshot,
        optimized_score: 95,
        optimized_qualification: 'Exceptionally Qualified'
      });
    });
  });
});