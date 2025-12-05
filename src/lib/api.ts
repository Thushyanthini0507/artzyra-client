/**
 * API Response interface for consistent response structure
 * Used by the axios client and services
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
