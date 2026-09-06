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

    const initializeAuth = async () => {

      const storedToken =
        localStorage.getItem('token');

      const storedUser =
        localStorage.getItem('user');

      if (storedToken && storedUser) {

        try {

          setToken(storedToken);

          setUser(
            JSON.parse(storedUser)
          );

          setIsAuthenticated(true);

        } catch (error) {

          console.error(
            'Failed to restore auth state:',
            error
          );

          logout();
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
  // ============================================================

  const googleLogin = async (credential) => {

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
  // PROCESS LOGIN RESPONSE
  // ============================================================

  const processLoginResponse = (responseData) => {

    const payload =
      responseData?.data ||
      responseData ||
      {};

    const jwt =
      payload.jwt ||
      payload.token ||
      payload.accessToken;

    const authenticatedUser =
      payload.user ||
      (
        payload.email
          ? {
              id: payload.id,
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              role: payload.role,
              status: payload.status,
              emailVerified:
                payload.emailVerified,
            }
          : null
      );

    if (!jwt) {

      throw new Error(
        'Authentication failed: No token received from server.'
      );
    }

    setToken(jwt);
    setUser(authenticatedUser);
    setIsAuthenticated(true);

    localStorage.setItem(
      'token',
      jwt
    );

    if (authenticatedUser) {

      localStorage.setItem(
        'user',
        JSON.stringify(authenticatedUser)
      );
    }

    return responseData;
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