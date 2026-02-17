// Generic loading state
export type LoadingState = "idle" | "loading" | "succeeded" | "failed";

// Generic async operation state
export interface AsyncState<T = null> {
    data: T;
    status: LoadingState;
    error: string | null
}

// Form field validation error
export interface FieldError {
    field: string;
    message: string;
}

