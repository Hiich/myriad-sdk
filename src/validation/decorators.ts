/**
 * Validation decorators for Myriad SDK
 */

import { z } from 'zod';
import { validate } from './utils';

/**
 * Creates a validation decorator for method parameters
 * 
 * @param schema The Zod schema to validate against
 * @param paramIndex The index of the parameter to validate (defaults to 0)
 * @returns A method decorator that validates the specified parameter
 */
export function validateParam<T extends z.ZodTypeAny>(
  schema: T,
  paramIndex = 0
): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function(...args: any[]) {
      if (args.length > paramIndex) {
        const methodName = String(propertyKey);
        args[paramIndex] = validate(schema, args[paramIndex], `Invalid parameter for ${methodName}`);
      }
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

/**
 * Creates a validation decorator for method responses
 * 
 * @param schema The Zod schema to validate against
 * @returns A method decorator that validates the response
 */
export function validateResult<T extends z.ZodTypeAny>(
  schema: T
): MethodDecorator {
  return function(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const methodName = String(propertyKey);
      const result = await originalMethod.apply(this, args);
      return validate(schema, result, `Invalid response from ${methodName}`);
    };
    
    return descriptor;
  };
}

/**
 * Higher-order function to wrap API methods with validation
 * 
 * @param inputSchema Schema for validating input parameters
 * @param outputSchema Schema for validating output response
 * @param methodName Name of the method for error messages
 * @returns A function that wraps the original method with validation
 */
export function withValidation<I, O>(
  inputSchema: z.ZodType<I>,
  outputSchema: z.ZodType<O>,
  methodName: string
) {
  return function(
    target: any,
    originalMethod: (...args: any[]) => Promise<any>
  ) {
    return async function(this: any, ...args: any[]): Promise<O> {
      // Validate input
      const validatedInput = validate(inputSchema, args[0], `Invalid parameters for ${methodName}`);
      
      // Replace the first argument with the validated input
      args[0] = validatedInput;
      
      // Call the original method
      const result = await originalMethod.apply(this, args);
      
      // Validate output
      return validate(outputSchema, result, `Invalid response from ${methodName}`);
    };
  };
}

/**
 * Creates a validation wrapper for API methods
 * This is a simpler approach that doesn't use decorators
 * 
 * @param fn The original function to wrap
 * @param inputSchema Schema for validating input
 * @param outputSchema Schema for validating output
 * @param methodName Name of the method for error messages
 * @returns A wrapped function with validation
 */
export function createValidatedMethod<I, O>(
  fn: (input: I) => Promise<O>,
  inputSchema: z.ZodType<I>,
  outputSchema: z.ZodType<O>,
  methodName: string
): (input: I) => Promise<O> {
  return async function(input: I): Promise<O> {
    // Validate input
    const validatedInput = validate(inputSchema, input, `Invalid parameters for ${methodName}`);
    
    // Call the original function
    const result = await fn(validatedInput);
    
    // Validate output
    return validate(outputSchema, result, `Invalid response from ${methodName}`);
  };
}
