/**
 * Authentication service for frontend authentication
 * This service handles signup, signin, signout, and JWT token management
 * using our backend's JWT authentication endpoints.
 */


// Interface for auth response
interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
  };
}

// Interface for current user
interface CurrentUser {
  id: string;
  email: string;
}

// Store JWT token in memory only (more secure than localStorage)
let currentToken: string | null = null;

// Load token from sessionStorage on initialization (more secure than localStorage)
if (typeof window !== 'undefined') {
  const storedToken = sessionStorage.getItem('jwt_token');
  if (storedToken) {
    currentToken = storedToken;
  }
}

// Helper to save token
const saveToken = (token: string | null) => {
  currentToken = token;
  if (typeof window !== 'undefined' && token) {
    // Use sessionStorage instead of localStorage for better security
    // sessionStorage is cleared when the tab/window is closed
    sessionStorage.setItem('jwt_token', token);
  } else if (typeof window !== 'undefined') {
    sessionStorage.removeItem('jwt_token');
  }
};

// Helper to get token (always read from sessionStorage to ensure latest value)
const getTokenFromStorage = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('jwt_token');
  }
  return null;
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getTokenFromStorage() || currentToken; // Fallback to in-memory if sessionStorage not available
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const authService = {
  /**
   * Sign up a new user with email and password
   */
  signUp: async (email: string, password: string): Promise<{ user: CurrentUser }> => {
    try {
      console.log('Attempting signup via BFF');

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Signup response status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If response is not JSON, create a generic error
          errorData = { detail: `Signup failed with status: ${response.status}` };
        }

        console.error('Signup error response:', errorData);
        throw new Error(errorData.detail || `Signup failed with status: ${response.status}`);
      }

      const data: AuthResponse = await response.json();
      console.log('Signup successful, received user data:', data.user);

      // Save the token for subsequent requests
      saveToken(data.access_token);

      return { user: data.user };
    } catch (error: any) {
      console.error('Signup error:', error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach the authentication server. Please check that the backend is running and accessible.');
      }

      throw error;
    }
  },

  /**
   * Sign in an existing user with email and password
   */
  signIn: async (email: string, password: string): Promise<{ user: CurrentUser }> => {
    try {
      console.log('Attempting signin via BFF');

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Signin response status:', response.status);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If response is not JSON, create a generic error
          errorData = { detail: `Signin failed with status: ${response.status}` };
        }

        console.error('Signin error response:', errorData);
        throw new Error(errorData.detail || `Signin failed with status: ${response.status}`);
      }

      const data: AuthResponse = await response.json();
      console.log('Signin successful, received user data:', data.user);

      // Save the token for subsequent requests
      saveToken(data.access_token);

      return { user: data.user };
    } catch (error: any) {
      console.error('Signin error:', error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to reach the authentication server. Please check that the backend is running and accessible.');
      }

      throw error;
    }
  },

  /**
   * Sign out the current user and clear the session
   */
  signOut: async () => {
    try {
      // Clear the stored token
      saveToken(null);
    } catch (error) {
      console.error('Signout error:', error);
      // Still clear the local state even if there's an error
      saveToken(null);
    }
  },

  /**
   * Get the current user if authenticated (by checking token validity)
   */
  getUser: async (): Promise<CurrentUser | null> => {
    if (!currentToken) {
      return null;
    }

    // In a production implementation, we'd have an endpoint to verify and get user details
    // For now, we'll validate the token format and decode it safely
    try {
      // Validate JWT token format (has 3 parts separated by dots)
      const tokenParts = currentToken.split('.');
      if (tokenParts.length !== 3) {
        console.error('JWT token format is invalid');
        return null;
      }

      // Decode payload (second part) - note: this is not verification, just decoding
      // The actual verification happens on the backend via the BFF pattern
      let payload;
      try {
        // Add proper padding for base64 decoding
        const paddedPayload = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
        const missingPadding = paddedPayload.length % 4;
        const paddedBase64 = missingPadding !== 0 ? paddedPayload + '='.repeat(4 - missingPadding) : paddedPayload;

        payload = JSON.parse(atob(paddedBase64));
      } catch (decodeError) {
        console.error('Failed to decode JWT payload:', decodeError);
        return null;
      }

      // Ensure the payload contains required fields
      if (!payload.sub) {
        console.error('JWT token does not contain required sub field');
        return null;
      }

      // In a real implementation, we'd call an API endpoint to verify the token
      // For now, we'll return the decoded user info but with a warning in production
      if (process.env.NODE_ENV === 'production') {
        console.warn('Warning: User info is being decoded from JWT without verification. ' +
                     'In production, use an API endpoint to verify the token and get user info.');
      }

      return {
        id: payload.sub,
        email: payload.email || payload.email_address || payload.email_addr || payload.username || payload.name,
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  /**
   * Get the current JWT token
   */
  getToken: (): string | null => {
    return getTokenFromStorage() || currentToken;
  },

  /**
   * Get the current session (for compatibility with callback page)
   */
  getSession: async (): Promise<CurrentUser | null> => {
    return await authService.getUser();
  }
};

// Export individual methods for direct use
export const { signUp, signIn, signOut, getUser, getToken } = authService;

export default authService;