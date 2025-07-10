/**
 * Test Runner Utility
 * 
 * This utility provides helper functions for running comprehensive tests
 * and checking for common error patterns in the codebase.
 */

export interface TestSuite {
  name: string;
  tests: TestCase[];
}

export interface TestCase {
  name: string;
  description: string;
  run: () => Promise<TestResult>;
}

export interface TestResult {
  passed: boolean;
  error?: string;
  duration: number;
  details?: any;
}

export class TestRunner {
  private suites: TestSuite[] = [];
  private results: Map<string, TestResult[]> = new Map();

  addSuite(suite: TestSuite): void {
    this.suites.push(suite);
  }

  async runAll(): Promise<{ passed: number; failed: number; total: number }> {
    let passed = 0;
    let failed = 0;
    let total = 0;

    console.log('🚀 Starting comprehensive test run...\n');

    for (const suite of this.suites) {
      console.log(`📦 Running test suite: ${suite.name}`);
      const suiteResults: TestResult[] = [];

      for (const test of suite.tests) {
        const startTime = performance.now();
        
        try {
          const result = await test.run();
          result.duration = performance.now() - startTime;
          
          suiteResults.push(result);
          
          if (result.passed) {
            console.log(`  ✅ ${test.name} (${result.duration.toFixed(2)}ms)`);
            passed++;
          } else {
            console.log(`  ❌ ${test.name} - ${result.error}`);
            failed++;
          }
          
          total++;
        } catch (error) {
          const duration = performance.now() - startTime;
          const result: TestResult = {
            passed: false,
            error: error instanceof Error ? error.message : String(error),
            duration
          };
          
          suiteResults.push(result);
          console.log(`  ❌ ${test.name} - ${result.error}`);
          failed++;
          total++;
        }
      }

      this.results.set(suite.name, suiteResults);
      console.log('');
    }

    console.log(`📊 Test Results: ${passed} passed, ${failed} failed, ${total} total`);
    
    return { passed, failed, total };
  }

  generateReport(): string {
    const lines: string[] = [];
    lines.push('# Test Report');
    lines.push('');

    for (const [suiteName, results] of this.results) {
      lines.push(`## ${suiteName}`);
      lines.push('');

      const suitePassed = results.filter(r => r.passed).length;
      const suiteTotal = results.length;
      
      lines.push(`**Status:** ${suitePassed}/${suiteTotal} tests passed`);
      lines.push('');

      for (const result of results) {
        const status = result.passed ? '✅' : '❌';
        const duration = `(${result.duration.toFixed(2)}ms)`;
        
        if (result.passed) {
          lines.push(`${status} Test passed ${duration}`);
        } else {
          lines.push(`${status} Test failed: ${result.error} ${duration}`);
        }
      }
      
      lines.push('');
    }

    return lines.join('\n');
  }

  getResults(): Map<string, TestResult[]> {
    return new Map(this.results);
  }
}

// Common test patterns
export const createMockFunction = <T extends (...args: any[]) => any>(
  implementation?: T
): jest.MockedFunction<T> => {
  return jest.fn(implementation) as any;
};

export const createAsyncMockFunction = <T>(
  resolveValue?: T,
  rejectValue?: any
): jest.MockedFunction<() => Promise<T>> => {
  if (rejectValue) {
    return jest.fn().mockRejectedValue(rejectValue);
  }
  return jest.fn().mockResolvedValue(resolveValue);
};

export const expectNoConsoleErrors = (): void => {
  const originalError = console.error;
  const errors: string[] = [];
  
  console.error = (...args: any[]) => {
    errors.push(args.join(' '));
  };

  // Restore console.error after test
  afterEach(() => {
    console.error = originalError;
    if (errors.length > 0) {
      throw new Error(`Unexpected console errors: ${errors.join(', ')}`);
    }
  });
};

export const waitFor = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const expectEventuallyToEqual = async <T>(
  getValue: () => T,
  expectedValue: T,
  timeoutMs: number = 5000,
  intervalMs: number = 100
): Promise<void> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (getValue() === expectedValue) {
      return;
    }
    await waitFor(intervalMs);
  }
  
  throw new Error(`Expected ${getValue()} to equal ${expectedValue} within ${timeoutMs}ms`);
};