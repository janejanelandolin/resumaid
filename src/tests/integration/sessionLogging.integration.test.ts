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
          mockSessionData = { ...mockSessionData, ...data };
          return {
            eq: jest.fn().mockResolvedValue({
              data: { ...mockSessionData, id: mockSessionId },
              error: null
            })
          };
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
      await updateSessionWithResumeData(mockResumeJson);

      // Verify resume data was set
      expect(mockSessionData).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      });

      // Step 3: Update with original score
      await updateSessionWithOriginalScore(mockScoreResponse);

      // Verify original score was set
      expect(mockSessionData).toMatchObject({
        unoptimized_score: 75,
        unoptimized_qualification: 'Qualified'
      });

      // Step 4: Update with optimized score
      const optimizedScore = {
        ...mockScoreResponse,
        similarity: 0.90,
        consensus_qualification: 'Highly Qualified'
      };

      await updateSessionWithOptimizedScore(optimizedScore);

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
      const sessionId = await createSessionLog('Data Scientist');
      expect(sessionId).toBe(mockSessionId);

      // Only update with resume data
      await updateSessionWithResumeData(mockResumeJson);

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
  });
});