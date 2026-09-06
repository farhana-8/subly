import React, {
  createContext,
  useState,
  useEffect,
} from 'react';

import authService from '../services/authService';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem('token')
  );

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [loading, setLoading] = useState(true);


  // ============================================================
  // RESTORE AUTHENTICATION
  // ============================================================

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken =
        localStorage.getItem('token');

      const storedUser =
        localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser =
            JSON.parse(storedUser);

          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);

        } catch (error) {
          console.error(
            'Failed to restore auth state:',
            error
          );

          localStorage.removeItem('token');
          localStorage.removeItem('user');

          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);


  // ============================================================
  // NORMAL LOGIN
  // ============================================================

  const login = async (credentials) => {
    const response =
      await authService.login(credentials);

    return processLoginResponse(
      response.data
    );
  };


  // ============================================================
  // GOOGLE LOGIN
  //
  // Used by BOTH:
  // - Login page
  // - Register page
  //
  // Backend endpoint:
  // POST /api/auth/google
  // ============================================================

  const googleLogin = async (credential) => {
    if (!credential) {
      throw new Error(
        'Google authentication failed: No credential received.'
      );
    }

    const response =
      await authService.googleLogin(
        credential
      );

    return processLoginResponse(
      response.data
    );
  };


  // ============================================================
  // REGISTER
  // ============================================================

  const register = async (data) => {
    const response =
      await authService.register(data);

    return response.data;
  };


  // ============================================================
  // VERIFY EMAIL
  // ============================================================

  const verifyEmail = async (data) => {
    const response =
      await authService.verifyEmail(data);

    return response.data;
  };


  // ============================================================
  // RESEND VERIFICATION
  // ============================================================

  const resendVerification = async (data) => {
    const response =
      await authService.resendVerification(data);

    return response.data;
  };


  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  const forgotPassword = async (email) => {
    const response =
      await authService.forgotPassword(email);

    return response.data;
  };


  // ============================================================
  // RESET PASSWORD
  // ============================================================

  const resetPassword = async (data) => {
    const response =
      await authService.resetPassword(data);

    return response.data;
  };


  // ============================================================
  // PROCESS LOGIN / GOOGLE LOGIN RESPONSE
  //
  // Normalizes different backend response structures.
  // Always returns:
  //
  // {
  //   token,
  //   user,
  //   data
  // }
  // ============================================================

  const processLoginResponse = (responseData) => {
    /*
     * Backend may return a few common variants:
     *
     * {
     *   jwt: "...",
     *   user: {...}
     * }
     *
     * {
     *   token: "...",
     *   user: {...}
     * }
     *
     * {
     *   data: {
     *     jwt: "...",
     *     user: {...}
     *   }
     * }
     *
     * {
     *   data: {
     *     accessToken: "...",
     *     profile: {...}
     *   }
     * }
     */

    let payload =
      responseData &&
      typeof responseData === 'object'
        ? { ...responseData }
        : {};

    if (
      payload.data &&
      typeof payload.data === 'object'
    ) {
      payload = {
        ...payload,
        ...payload.data,
      };
    }

    // ----------------------------------------------------------
    // FIND JWT TOKEN
    // ----------------------------------------------------------

    const jwt =
      payload.jwt ||
      payload.token ||
      payload.accessToken ||
      payload.idToken ||
      responseData?.jwt ||
      responseData?.token ||
      responseData?.accessToken ||
      responseData?.idToken ||
      responseData?.data?.jwt ||
      responseData?.data?.token ||
      responseData?.data?.accessToken ||
      responseData?.data?.idToken;


    // ----------------------------------------------------------
    // FIND USER
    // ----------------------------------------------------------

    let authenticatedUser =
      payload.user ||
      payload.profile ||
      payload.account ||
      responseData?.user ||
      responseData?.profile ||
      responseData?.account ||
      responseData?.data?.user ||
      responseData?.data?.profile ||
      responseData?.data?.account ||
      null;


    /*
     * Some backends return user properties directly
     * instead of putting them inside "user".
     */

    if (
      !authenticatedUser &&
      (
        payload.email ||
        payload.firstName ||
        payload.lastName ||
        payload.name
      )
    ) {
      authenticatedUser = {
        id: payload.id,
        firstName:
          payload.firstName ||
          payload.givenName ||
          payload.first_name,
        lastName:
          payload.lastName ||
          payload.familyName ||
          payload.last_name,
        email: payload.email,
        role: payload.role,
        roles: payload.roles,
        status: payload.status,
        emailVerified:
          payload.emailVerified,
      };
    }


    // ----------------------------------------------------------
    // TOKEN REQUIRED
    // ----------------------------------------------------------

    if (!jwt) {
      console.error(
        'Authentication response did not contain a JWT:',
        responseData
      );

      throw new Error(
        'Authentication failed: No token received from server.'
      );
    }


    // ----------------------------------------------------------
    // SAVE TOKEN
    // ----------------------------------------------------------

    setToken(jwt);

    localStorage.setItem(
      'token',
      jwt
    );


    // ----------------------------------------------------------
    // SAVE USER
    // ----------------------------------------------------------

    if (authenticatedUser) {
      setUser(authenticatedUser);

      localStorage.setItem(
        'user',
        JSON.stringify(authenticatedUser)
      );
    }


    // ----------------------------------------------------------
    // AUTHENTICATED
    // ----------------------------------------------------------

    setIsAuthenticated(true);


    // ----------------------------------------------------------
    // RETURN PREDICTABLE STRUCTURE
    // ----------------------------------------------------------

    return {
      token: jwt,
      user: authenticatedUser,
      data: responseData,
    };
  };


  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };


  // ============================================================
  // UPDATE USER
  // ============================================================

  const updateUserInfo = (nextUser) => {
    setUser((currentUser) => {
      const mergedUser = {
        ...(currentUser || {}),
        ...(nextUser || {}),
      };

      localStorage.setItem(
        'user',
        JSON.stringify(mergedUser)
      );

      return mergedUser;
    });
  };


  // ============================================================
  // REFRESH USER
  // ============================================================

  const refreshUser = async () => {
    try {
      const response =
        await api.get(
          '/api/auth/me',
          {
            skipAuthRedirect: true,
          }
        );

      const profile =
        response.data?.data ||
        response.data;

      setUser(profile);

      localStorage.setItem(
        'user',
        JSON.stringify(profile)
      );

    } catch (error) {
      console.error(
        'Failed to refresh user:',
        error
      );
    }
  };


  // ============================================================
  // PROVIDER
  // ============================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,

        // Authentication
        login,
        googleLogin,
        register,

        // Email verification
        verifyEmail,
        resendVerification,

        // Password
        forgotPassword,
        resetPassword,

        // Session
        logout,

        // User
        updateUserInfo,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};