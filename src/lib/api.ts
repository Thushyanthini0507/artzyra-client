const API_BASE_URL = "";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Client for making requests to Next.js API routes.
 * These routes handle cookie management and proxy to the backend.
 */
class NextApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      console.log(`[nextApi] Making request to: ${endpoint}`);
      const response = await fetch(endpoint, {
        ...options,
        headers,
        credentials: "include", // Include cookies (HTTP-only token) in requests
      });

      console.log(`[nextApi] Response status: ${response.status} for ${endpoint}`);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error(`[nextApi] Non-JSON response from ${endpoint}:`, text);
        return {
          success: false,
          error: `Server returned non-JSON response: ${text.substring(0, 100)}`,
        };
      }

      if (!response.ok) {
        console.error(`[nextApi] Error response from ${endpoint}:`, data);
        return {
          success: false,
          error: data.message || data.error || `Request failed with status ${response.status}`,
        };
      }

      console.log(`[nextApi] Success response from ${endpoint}:`, JSON.stringify(data, null, 2));
      console.log(`[nextApi] data.data exists:`, data.data !== undefined);
      console.log(`[nextApi] data.data value:`, data.data);
      
      const extractedData = data.data !== undefined ? data.data : data;
      console.log(`[nextApi] Extracted data:`, JSON.stringify(extractedData, null, 2));
      
      return {
        success: true,
        data: extractedData,
        message: data.message,
      };
    } catch (error) {
      console.error(`[nextApi] Network error for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Legacy API client for direct backend calls (if needed)
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: "include", // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || "Request failed",
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Use Next.js API routes for all operations (they handle cookies)
export const nextApi = new NextApiClient();
// Legacy export for backward compatibility
export const api = nextApi;
