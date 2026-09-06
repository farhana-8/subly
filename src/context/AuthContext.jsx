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
    () => localStorage.getItem('token')
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('token'))
  );

  const [loading, setLoading] = useState(true);

  // ============================================================
  // RESTORE AUTHENTICATION
  // ============================================================

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken =
          localStorage.getItem('token');

        const storedUser =
          localStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);

          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(
          'Failed to restore authentication:',
          error
        );

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ============================================================
  // NORMAL EMAIL/PASSWORD LOGIN
  // ============================================================

  const login = async (credentials) => {
    const response =
      await authService.login(credentials);

    return processLoginResponse(response.data);
  };

  // ============================================================
  // GOOGLE LOGIN
  // ============================================================

  const googleLogin = async (credential) => {
    const response =
      await authService.googleLogin(credential);

    return processLoginResponse(response.data);
  };

  // ============================================================
  // PROCESS LOGIN RESPONSE
  // ============================================================

  const processLoginResponse = (responseData) => {
    const payload =
      responseData?.data ??
      responseData ??
      {};

    const jwt =
      payload?.jwt ??
      payload?.token ??
      payload?.accessToken;

    const authenticatedUser =
      payload?.user ??
      (
        payload?.email
          ? {
              id: payload.id,
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              role: payload.role,
              roles: payload.roles,
              status: payload.status,
              emailVerified:
                payload.emailVerified,
            }
          : null
      );

    // ----------------------------------------------------------
    // No token = login was not successful
    // ----------------------------------------------------------

    if (!jwt) {
      throw new Error(
        'Login was unsuccessful. The server did not return an authentication token.'
      );
    }

    // ----------------------------------------------------------
    // Save authentication
    // ----------------------------------------------------------

    setToken(jwt);
    setIsAuthenticated(true);

    localStorage.setItem('token', jwt);

    if (authenticatedUser) {
      setUser(authenticatedUser);

      localStorage.setItem(
        'user',
        JSON.stringify(authenticatedUser)
      );
    } else {
      setUser(null);
      localStorage.removeItem('user');
    }

    // ----------------------------------------------------------
    // Return a predictable object to Login.jsx
    // ----------------------------------------------------------

    return {
      token: jwt,
      user: authenticatedUser,
      data: authenticatedUser,
      raw: responseData,
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
      const response = await api.get(
        '/api/auth/me',
        {
          skipAuthRedirect: true,
        }
      );

      const profile =
        response.data?.data ??
        response.data;

      if (profile) {
        setUser(profile);

        localStorage.setItem(
          'user',
          JSON.stringify(profile)
        );
      }

      return profile;
    } catch (error) {
      console.error(
        'Failed to refresh user:',
        error
      );

      return null;
    }
  };

  // ============================================================
  // CONTEXT
  // ============================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,

        login,
        googleLogin,

        logout,

        updateUserInfo,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};