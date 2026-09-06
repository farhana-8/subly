import React, { useState } from 'react';

import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import { motion } from 'framer-motion';

import {
  Layout,
  ArrowRight,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

import { GoogleLogin } from '@react-oauth/google';

import useAuth from '../../hooks/useAuth';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState('');

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const {
    login,
    googleLogin,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isAdminEntry =
    location.pathname === '/admin/login';


  // ============================================================
  // GET FRIENDLY ERROR MESSAGE
  // ============================================================

  const getLoginErrorMessage = (err) => {
    const status = err?.response?.status;

    const serverData =
      err?.response?.data;

    // Backend message
    const serverMessage =
      serverData?.message ||
      serverData?.error ||
      serverData?.errorMessage;

    // ----------------------------------------------------------
    // 401 = wrong credentials
    // ----------------------------------------------------------

    if (status === 401) {
      return (
        serverMessage ||
        'Invalid email or password. Please check your credentials and try again.'
      );
    }

    // ----------------------------------------------------------
    // 403 = account access problem
    // ----------------------------------------------------------

    if (status === 403) {
      return (
        serverMessage ||
        'You do not have permission to sign in with this account.'
      );
    }

    // ----------------------------------------------------------
    // 400 = invalid request
    // ----------------------------------------------------------

    if (status === 400) {
      return (
        serverMessage ||
        'Please check your email and password and try again.'
      );
    }

    // ----------------------------------------------------------
    // 429 = too many requests
    // ----------------------------------------------------------

    if (status === 429) {
      return (
        serverMessage ||
        'Too many login attempts. Please wait a moment and try again.'
      );
    }

    // ----------------------------------------------------------
    // 500 / 502 / 503 / 504
    // ----------------------------------------------------------

    if (status >= 500) {
      return (
        serverMessage ||
        'The server is temporarily unavailable. Please try again in a moment.'
      );
    }

    // ----------------------------------------------------------
    // Network error
    // ----------------------------------------------------------

    if (
      err?.code === 'ERR_NETWORK' ||
      !err?.response
    ) {
      return (
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    }

    // ----------------------------------------------------------
    // Generic fallback
    // ----------------------------------------------------------

    return (
      serverMessage ||
      err?.message ||
      'Unable to sign in. Please try again.'
    );
  };


  // ============================================================
  // NORMAL LOGIN
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const trimmedEmail =
      email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const data = await login({
        email: trimmedEmail,
        password,
      });

      // --------------------------------------------------------
      // AuthContext now returns a predictable structure:
      // { token, user, data, raw }
      // --------------------------------------------------------

      const user =
        data?.user ||
        data?.data ||
        null;

      const isAdmin =
        user?.role === 'ADMIN' ||
        user?.roles?.includes('ADMIN');

      // --------------------------------------------------------
      // Admin login protection
      // --------------------------------------------------------

      if (
        isAdminEntry &&
        !isAdmin
      ) {
        logout();

        setError(
          'This account does not have admin access.'
        );

        return;
      }

      // --------------------------------------------------------
      // Determine destination
      // --------------------------------------------------------

      let target =
        isAdminEntry
          ? '/admin/dashboard'
          : location.state?.from?.pathname;

      if (
        !target ||
        target === '/' ||
        target.startsWith('/admin')
      ) {
        target =
          isAdmin
            ? '/admin/dashboard'
            : '/dashboard';
      }

      navigate(target, {
        replace: true,
      });

    } catch (err) {
      console.error(
        'Login failed:',
        err
      );

      setError(
        getLoginErrorMessage(err)
      );

    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // GOOGLE LOGIN
  // ============================================================

  const handleGoogleSuccess =
    async (credentialResponse) => {

      setError('');
      setGoogleLoading(true);

      try {
        if (
          !credentialResponse?.credential
        ) {
          throw new Error(
            'Google authentication failed. No credential was received.'
          );
        }

        const data =
          await googleLogin(
            credentialResponse.credential
          );

        const loggedInUser =
          data?.user ||
          data?.data ||
          null;

        const isAdmin =
          loggedInUser?.role === 'ADMIN' ||
          loggedInUser?.roles?.includes('ADMIN');

        // ------------------------------------------------------
        // Admin access check
        // ------------------------------------------------------

        if (
          isAdminEntry &&
          !isAdmin
        ) {
          logout();

          setError(
            'This account does not have admin access.'
          );

          return;
        }

        // ------------------------------------------------------
        // Destination
        // ------------------------------------------------------

        let target =
          isAdminEntry
            ? '/admin/dashboard'
            : location.state?.from?.pathname;

        if (
          !target ||
          target === '/' ||
          target.startsWith('/admin')
        ) {
          target =
            isAdmin
              ? '/admin/dashboard'
              : '/dashboard';
        }

        navigate(target, {
          replace: true,
        });

      } catch (err) {
        console.error(
          'Google login failed:',
          err
        );

        setError(
          getLoginErrorMessage(err)
        );

      } finally {
        setGoogleLoading(false);
      }
    };


  // ============================================================
  // GOOGLE ERROR
  // ============================================================

  const handleGoogleError = () => {
    setGoogleLoading(false);

    setError(
      'Google sign-in was cancelled or failed. Please try again.'
    );
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-bg-deep relative overflow-hidden transition-colors duration-300">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-violet/10 rounded-full blur-[120px] pointer-events-none">
      </div>


      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="w-full max-w-md relative z-10"
      >

        <div className="bg-bg-card border border-main rounded-[2rem] p-8 md:p-10 shadow-2xl backdrop-blur-xl">

          {/* HEADER */}

          <div className="text-center mb-10">

            <Link
              to="/"
              className="inline-flex items-center mb-6 group"
            >

              <div className="bg-gradient-to-br from-primary-violet to-primary-magenta p-2 rounded-xl">

                <Layout className="h-6 w-6 text-white" />

              </div>

              <span className="ml-3 text-2xl font-black text-main uppercase tracking-tighter">
                Subly
              </span>

            </Link>


            <h2 className="text-3xl font-black text-main">

              {isAdminEntry
                ? 'Admin access'
                : 'Welcome back'}

            </h2>


            <p className="text-muted mt-2">

              {isAdminEntry
                ? 'Sign in with an existing ADMIN account to continue.'
                : 'Enter your credentials to access your dashboard'}

            </p>

          </div>


          {/* ERROR */}

          {error && (

            <motion.div
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-5 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start gap-3 text-sm"
            >

              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />

              <span className="leading-relaxed">
                {error}
              </span>

            </motion.div>

          )}


          {/* GOOGLE LOGIN */}

          {!isAdminEntry && (

            <>

              <div className="flex justify-center w-full">

                {googleLoading ? (

                  <div className="w-full h-[44px] rounded-xl border border-main flex items-center justify-center">

                    <div className="h-5 w-5 border-2 border-primary-violet/30 border-t-primary-violet rounded-full animate-spin">
                    </div>

                    <span className="ml-3 text-sm font-semibold text-muted">
                      Signing in with Google...
                    </span>

                  </div>

                ) : (

                  <GoogleLogin
                    onSuccess={
                      handleGoogleSuccess
                    }
                    onError={
                      handleGoogleError
                    }
                    text="continue_with"
                    theme="outline"
                    size="large"
                    width="100%"
                  />

                )}

              </div>


              {/* DIVIDER */}

              <div className="flex items-center gap-4 my-7">

                <div className="flex-1 h-px bg-main">
                </div>

                <span className="text-xs font-bold text-muted uppercase tracking-widest">
                  OR
                </span>

                <div className="flex-1 h-px bg-main">
                </div>

              </div>

            </>

          )}


          {/* NORMAL LOGIN */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div className="space-y-2">

              <label className="text-sm font-bold text-muted ml-1">
                Email Address
              </label>

              <div className="relative group">

                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-violet transition-colors" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (error) {
                      setError('');
                    }
                  }}
                  className="w-full bg-bg-deep border border-main rounded-2xl py-4 pl-12 pr-4 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-violet/50 focus:border-primary-violet transition-all"
                  placeholder="name@company.com"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="space-y-2">

              <div className="flex justify-between items-center px-1">

                <label className="text-sm font-bold text-muted">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  title="Forgot Password"
                  className="text-xs text-primary-violet hover:text-primary-magenta font-bold transition-colors"
                >
                  Forgot?
                </Link>

              </div>


              <div className="relative group">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-violet transition-colors" />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (error) {
                      setError('');
                    }
                  }}
                  className="w-full bg-bg-deep border border-main rounded-2xl py-4 pl-12 pr-12 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-violet/50 focus:border-primary-violet transition-all"
                  placeholder="••••••••"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors focus:outline-none"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showPassword
                    ? (
                      <EyeOff className="h-5 w-5" />
                    )
                    : (
                      <Eye className="h-5 w-5" />
                    )}

                </button>

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={
                loading ||
                googleLoading
              }
              className={`w-full bg-gradient-to-r from-primary-violet to-primary-purple text-white rounded-2xl py-4 font-black text-lg shadow-lg shadow-primary-violet/20 hover:shadow-primary-violet/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                loading ||
                googleLoading
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
            >

              {loading ? (

                <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin">
                </div>

              ) : (

                <>

                  Sign In

                  <ArrowRight className="h-5 w-5" />

                </>

              )}

            </button>

          </form>


          {/* FOOTER */}

          <div className="mt-10 text-center">

            <p className="text-muted text-sm">

              {isAdminEntry ? (

                <>

                  Need standard user access?{' '}

                  <Link
                    to="/login"
                    className="text-main font-black hover:text-primary-violet transition-colors"
                  >
                    Sign in here
                  </Link>

                </>

              ) : (

                <>

                  Don't have an account?{' '}

                  <Link
                    to="/register"
                    className="text-main font-black hover:text-primary-violet transition-colors"
                  >
                    Start 14-day free trial
                  </Link>

                </>

              )}

            </p>

          </div>

        </div>

      </motion.div>

    </div>
  );
};

export default Login;