// Standard API error response structure
export interface ApiErrorResponse {
    message: string;
    errors?: Record<string, string[]>; // validation errors
    statusCode?: number;
}

// Standard API success response structure
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string
}
