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

      // Attempt to parse JSON response (BFF may return redirect info)
      let data: any = null;
      try {
        data = await response.json();
      } catch (parseError) {
        // ignore parse error; data will remain null
      }

      if (!response.ok) {
        let errorData = data;
        if (!errorData) {
          errorData = { detail: `Signin failed with status: ${response.status}` };
        }
        console.error('Signin error response:', errorData);
        throw new Error(errorData.detail || `Signin failed with status: ${response.status}`);
      }

      // If backend returned a redirect URL (fingerprint/challenge page), navigate the browser to it
      if (data && data.redirect) {
        if (typeof window !== 'undefined') {
          console.log('Redirecting browser to backend for fingerprint challenge:', data.redirect);
          window.location.replace(data.redirect);
          return Promise.resolve({ user: null as any });
        }
      }

      if (!data) {
        throw new Error('Signin failed: empty response from server');
      }

      // Assume valid AuthResponse
      const authData: AuthResponse = data;
      console.log('Signin successful, received user data:', authData.user);

      // Save the token IMMEDIATELY for subsequent requests and getUser() verification
      saveToken(authData.access_token);
      console.log('Token saved to sessionStorage, can now verify via getUser()');

      return { user: authData.user };
    } catch (error: any) {
      console.error('Signin error:', error);
      // Clear token on error
      saveToken(null);

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
    // Ensure we have the latest token (fallback to sessionStorage)
    const stored = getTokenFromStorage();
    if (!currentToken && stored) {
      currentToken = stored;
      console.log('Loaded token from sessionStorage for user verification');
    }

    if (!currentToken) {
      console.log('No token available, returning null user');
      return null;
    }

    console.log('Attempting to decode token for user info');

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

      const user: CurrentUser = {
        id: payload.sub,
        email: payload.email || payload.email_address || payload.email_addr || payload.username || payload.name,
      };

      console.log('Successfully decoded token, user:', user);

      return user;
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