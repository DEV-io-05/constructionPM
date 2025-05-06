/* eslint-disable no-console */
import { Component, ErrorInfo, ReactNode } from 'react';
// import { useNavigate } from '@tanstack/react-router';
import useAuthStore from '@/stores/authStore';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class AuthErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Authentication Error:', error);
    console.error('Error Info:', errorInfo);

    // Handle specific auth errors
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      useAuthStore.getState().reset();
      window.location.href = '/login';
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Authentication Error</h1>
            <p className="mt-2 text-gray-600">
              There was a problem with your authentication.
              Please try logging in again.
            </p>
            <button
              onClick={() => {
                useAuthStore.getState().reset();
                window.location.href = '/login';
              }}
              className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Return to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}