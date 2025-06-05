/**
 * Validation utilities for Myriad SDK
 */

import { z } from 'zod';

/**
 * Validates input data against a Zod schema
 * 
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @param errorMessage Optional custom error message
 * @returns The validated data
 * @throws Error if validation fails
 */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  errorMessage = 'Validation error'
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => {
        const path = err.path.join('.');
        return `${path ? `${path}: ` : ''}${err.message}`;
      }).join('; ');
      
      throw new Error(`${errorMessage}: ${formattedErrors}`);
    }
    throw error;
  }
}

/**
 * Validates input parameters for API endpoints
 * 
 * @param schema The Zod schema to validate against
 * @param params The parameters to validate
 * @param methodName The name of the method for error messages
 * @returns The validated parameters
 */
export function validateParams<T extends z.ZodTypeAny>(
  schema: T,
  params: unknown,
  methodName: string
): z.infer<T> {
  return validate(schema, params, `Invalid parameters for ${methodName}`);
}

/**
 * Validates API response data
 * 
 * @param schema The Zod schema to validate against
 * @param data The response data to validate
 * @param methodName The name of the method for error messages
 * @returns The validated response data
 */
export function validateResponse<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  methodName: string
): z.infer<T> {
  return validate(schema, data, `Invalid response from ${methodName}`);
}
