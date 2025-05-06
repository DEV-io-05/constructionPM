import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ValidationError {
  field: string;
  message: string;
}

interface ServerError {
  message: string;
  errors?: ValidationError[];
}

export function handleServerError(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ServerError | undefined;
    
    // Handle validation errors
    if (data?.errors && data.errors.length > 0) {
      data.errors.forEach(err => {
        toast.error(`${err.field}: ${err.message}`);
      });
      return;
    }

    // Handle rate limiting errors
    if (error.response?.status === 429) {
      toast.error('Too many attempts. Please try again later.');
      return;
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    // Handle other server errors
    if (data?.message) {
      toast.error(data.message);
      return;
    }
  }

  // Handle network or other errors
  toast.error('An unexpected error occurred. Please try again.');
}

export function handleAuthError(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ServerError | undefined;

    // Handle specific auth-related errors
    switch (error.response?.status) {
      case 401:
        toast.error(data?.message || 'Invalid credentials');
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 429:
        toast.error('Too many login attempts. Please try again later.');
        break;
      default:
        handleServerError(error);
    }
    return;
  }

  // Handle other errors
  toast.error('Authentication failed. Please try again.');
}
