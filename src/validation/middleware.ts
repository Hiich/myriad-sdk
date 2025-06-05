/**
 * Validation middleware for Myriad SDK
 */

import { z } from 'zod';
import { validate } from './utils';

/**
 * Creates a validation middleware for API methods
 * 
 * @param inputSchema Schema for validating input parameters (optional)
 * @param outputSchema Schema for validating output response (optional)
 * @param methodName Name of the method for error messages
 * @returns A function that wraps the original method with validation
 */
export function withValidation<I, O>(
  inputSchema?: z.ZodType<I>,
  outputSchema?: z.ZodType<O>,
  methodName = 'API method'
) {
  return function(
    originalMethod: (...args: any[]) => any
  ) {
    return async function(this: any, ...args: any[]): Promise<O> {
      // Validate input if schema provided and args exist
      if (inputSchema && args.length > 0) {
        const validatedInput = validate(inputSchema, args[0], `Invalid parameters for ${methodName}`);
        args[0] = validatedInput;
      }
      
      // Call the original method
      const result = await Promise.resolve(originalMethod.apply(this, args));
      
      // Validate output if schema provided
      if (outputSchema) {
        return validate(outputSchema, result, `Invalid response from ${methodName}`);
      }
      
      return result;
    };
  };
}

/**
 * Creates a class decorator that applies validation to all methods
 * 
 * @param validationConfig Configuration object mapping method names to validation schemas
 * @returns A class decorator function
 */
export function validateClass(
  validationConfig: Record<string, {
    input?: z.ZodType<any>,
    output?: z.ZodType<any>
  }>
) {
  return function<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        
        // Apply validation to each method specified in the config
        for (const [methodName, schemas] of Object.entries(validationConfig)) {
          const originalMethod = (this as any)[methodName];
          
          if (typeof originalMethod === 'function') {
            (this as any)[methodName] = withValidation(
              schemas.input,
              schemas.output,
              methodName
            )(originalMethod.bind(this));
          }
        }
      }
    };
  };
}
