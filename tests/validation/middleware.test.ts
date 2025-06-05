import { describe, it, expect, vi } from 'vitest';
import { withValidation, validateClass } from '../../src/validation/middleware';
import { z } from 'zod';

describe('Validation Middleware', () => {
  describe('withValidation', () => {
    it('should validate input parameters', async () => {
      // Define a schema for input validation
      const inputSchema = z.object({
        id: z.string(),
        value: z.number().positive()
      });

      // Create a mock function
      const mockFn = vi.fn().mockResolvedValue({ result: 'success' });
      
      // Apply validation middleware
      const validatedFn = withValidation(inputSchema, undefined, 'testMethod')(mockFn);
      
      // Call with valid parameters
      await validatedFn({ id: '123', value: 42 });
      expect(mockFn).toHaveBeenCalledWith({ id: '123', value: 42 });
      
      // Call with invalid parameters
      await expect(validatedFn({ id: '123', value: -1 })).rejects.toThrow('Invalid parameters for testMethod');
      await expect(validatedFn({ id: 123, value: 42 } as any)).rejects.toThrow('Invalid parameters for testMethod');
    });

    it('should validate output response', async () => {
      // Define a schema for output validation
      const outputSchema = z.object({
        result: z.string(),
        code: z.number()
      });

      // Create mock functions
      const successFn = vi.fn().mockResolvedValue({ result: 'success', code: 200 });
      const failureFn = vi.fn().mockResolvedValue({ result: 'success', code: 'invalid' });
      
      // Apply validation middleware
      const validatedSuccessFn = withValidation(undefined, outputSchema, 'testMethod')(successFn);
      const validatedFailureFn = withValidation(undefined, outputSchema, 'testMethod')(failureFn);
      
      // Call with valid output
      const result = await validatedSuccessFn();
      expect(result).toEqual({ result: 'success', code: 200 });
      
      // Call with invalid output
      await expect(validatedFailureFn()).rejects.toThrow('Invalid response from testMethod');
    });

    it('should pass through when no schemas are provided', async () => {
      const mockFn = vi.fn().mockResolvedValue({ result: 'success' });
      const validatedFn = withValidation()(mockFn);
      
      const input = { id: '123' };
      await validatedFn(input);
      expect(mockFn).toHaveBeenCalledWith(input);
    });

    it('should maintain the context (this) when called', async () => {
      const inputSchema = z.object({ id: z.string() });
      
      class TestClass {
        value = 'test';
        
        async testMethod(input: { id: string }) {
          return { result: this.value, input };
        }
      }
      
      const instance = new TestClass();
      instance.testMethod = withValidation<{id: string}, {result: string, input: {id: string}}>(inputSchema)(instance.testMethod);
      
      const result = await instance.testMethod({ id: '123' });
      expect(result).toEqual({ result: 'test', input: { id: '123' } });
    });
  });

  describe('validateClass', () => {
    it('should apply validation to class methods', async () => {
      // Define schemas
      const inputSchema = z.object({ id: z.string() });
      const outputSchema = z.object({ result: z.string() });
      
      // Define validation config
      const validationConfig = {
        testMethod: {
          input: inputSchema,
          output: outputSchema
        }
      };
      
      // Create a class with the decorator
      @validateClass(validationConfig)
      class TestClass {
        async testMethod(input: { id: string }) {
          return { result: `processed-${input.id}` };
        }
        
        async unvalidatedMethod(input: any) {
          return input;
        }
      }
      
      const instance = new TestClass();
      
      // Test validated method
      const result = await instance.testMethod({ id: '123' });
      expect(result).toEqual({ result: 'processed-123' });
      
      // Test with invalid input
      await expect(instance.testMethod({ id: 123 } as any)).rejects.toThrow();
      
      // Test unvalidated method
      const unvalidatedResult = await instance.unvalidatedMethod({ test: true });
      expect(unvalidatedResult).toEqual({ test: true });
    });
  });
});
