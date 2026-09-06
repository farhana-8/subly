import React, {
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  motion,
} from 'framer-motion';

import {
  Layout,
  ArrowRight,
  Mail,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

import {
  GoogleLogin,
} from '@react-oauth/google';

import useAuth from '../../hooks/useAuth';


const Register = () => {

  const [firstName, setFirstName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);


  const {
    register,
    googleLogin,
  } = useAuth();


  const navigate =
    useNavigate();


  // ============================================================
  // NORMAL REGISTER
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');


    // ----------------------------------------------------------
    // NAME VALIDATION
    // ----------------------------------------------------------

    const trimmedFirstName =
      firstName.trim();

    const trimmedLastName =
      lastName.trim();


    if (
      !trimmedFirstName ||
      !trimmedLastName
    ) {
      setError(
        'First name and last name are required.'
      );

      return;
    }


    // ----------------------------------------------------------
    // EMAIL VALIDATION
    // ----------------------------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
      !emailRegex.test(
        normalizedEmail
      )
    ) {
      setError(
        'Please enter a valid email address.'
      );

      return;
    }


    // ----------------------------------------------------------
    // PASSWORD VALIDATION
    // ----------------------------------------------------------

    if (
      password.length < 8
    ) {
      setError(
        'Password must be at least 8 characters long.'
      );

      return;
    }


    if (
      !/[A-Z]/.test(password)
    ) {
      setError(
        'Password must contain at least one uppercase letter.'
      );

      return;
    }


    if (
      !/[a-z]/.test(password)
    ) {
      setError(
        'Password must contain at least one lowercase letter.'
      );

      return;
    }


    if (
      !/[0-9]/.test(password)
    ) {
      setError(
        'Password must contain at least one number.'
      );

      return;
    }


    if (
      !/[^A-Za-z0-9]/.test(password)
    ) {
      setError(
        'Password must contain at least one special character.'
      );

      return;
    }


    // ----------------------------------------------------------
    // CONFIRM PASSWORD
    // ----------------------------------------------------------

    if (
      password !== confirmPassword
    ) {
      setError(
        'Passwords do not match.'
      );

      return;
    }


    setLoading(true);


    try {

      await register({
        firstName:
          trimmedFirstName,

        lastName:
          trimmedLastName,

        email:
          normalizedEmail,

        password,
      });


      /*
       * Normal registration creates an
       * unverified account.
       *
       * Redirect to email verification.
       */

      navigate(
        '/verify-email',
        {
          replace: true,

          state: {
            email:
              normalizedEmail,
          },
        }
      );


    } catch (err) {

      console.error(
        'Registration failed:',
        err
      );


      const status =
        err?.response?.status;


      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.errorMessage;


      if (
        status === 409
      ) {

        setError(
          'An account with this email already exists. Please sign in instead.'
        );

      } else if (
        status === 400
      ) {

        setError(
          serverMessage ||
          'Invalid registration details. Please check your information and try again.'
        );

      } else if (
        status >= 500
      ) {

        setError(
          serverMessage ||
          'The server is temporarily unavailable. Please try again in a moment.'
        );

      } else {

        setError(
          serverMessage ||
          err?.message ||
          'Registration failed. Please try again.'
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // GOOGLE REGISTER / LOGIN
  //
  // IMPORTANT:
  //
  // The backend endpoint /api/auth/google is used here.
  //
  // If the Google account does not exist, the backend must
  // create the user.
  //
  // If the Google account already exists, the backend logs
  // the user in.
  // ============================================================

  const handleGoogleSuccess =
    async (credentialResponse) => {

      setError('');
      setGoogleLoading(true);


      try {

        // ------------------------------------------------------
        // CHECK GOOGLE CREDENTIAL
        // ------------------------------------------------------

        const credential =
          credentialResponse?.credential;


        if (!credential) {

          throw new Error(
            'Google authentication failed. No credential was received.'
          );

        }


        // ------------------------------------------------------
        // SEND GOOGLE CREDENTIAL TO BACKEND
        // ------------------------------------------------------

        const result =
          await googleLogin(
            credential
          );


        // ------------------------------------------------------
        // AUTHCONTEXT RETURNS:
        //
        // {
        //   token,
        //   user,
        //   data
        // }
        // ------------------------------------------------------

        const user =
          result?.user ||
          result?.data?.user ||
          result?.data?.profile ||
          null;

        const authToken =
          result?.token ||
          result?.data?.token ||
          result?.data?.jwt ||
          result?.data?.accessToken ||
          result?.data?.idToken;


        if (!authToken) {

          throw new Error(
            'Google authentication succeeded, but no application token was received.'
          );

        }


        // ------------------------------------------------------
        // DETERMINE ROLE
        // ------------------------------------------------------

        const isAdmin =
          user?.role === 'ADMIN' ||
          user?.roles?.includes('ADMIN');


        // ------------------------------------------------------
        // GOOGLE AUTHENTICATION SUCCESS
        // ------------------------------------------------------

        navigate(
          isAdmin
            ? '/admin/dashboard'
            : '/dashboard',
          {
            replace: true,
          }
        );

      } catch (err) {

        console.error(
          'Google registration/login failed:',
          err
        );


        const status =
          err?.response?.status;


        const serverData =
          err?.response?.data;


        const serverMessage =
          serverData?.message ||
          serverData?.error ||
          serverData?.errorMessage;


        // ------------------------------------------------------
        // GOOGLE ERROR MESSAGES
        // ------------------------------------------------------

        if (
          status === 409
        ) {

          setError(
            serverMessage ||
            'An account with this Google email already exists. Please sign in with Google instead.'
          );

        } else if (
          status === 400
        ) {

          setError(
            serverMessage ||
            'Google authentication request was invalid. Please try again.'
          );

        } else if (
          status === 401
        ) {

          setError(
            serverMessage ||
            'Google authentication failed. Please try again.'
          );

        } else if (
          status === 403
        ) {

          setError(
            serverMessage ||
            'Google authentication is not permitted for this account.'
          );

        } else if (
          status >= 500
        ) {

          setError(
            serverMessage ||
            'The server is temporarily unavailable. Please try again later.'
          );

        } else if (
          err?.code === 'ERR_NETWORK' ||
          !err?.response
        ) {

          setError(
            'Unable to connect to the server. Please check your connection and try again.'
          );

        } else {

          setError(
            serverMessage ||
            err?.message ||
            'Google registration failed. Please try again.'
          );

        }

      } finally {

        setGoogleLoading(false);

      }
    };


  // ============================================================
  // GOOGLE ERROR
  // ============================================================

  const handleGoogleError =
    () => {

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


      {/* BACKGROUND */}

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

          <div className="text-center mb-8">

            <Link
              to="/"
              className="inline-flex items-center mb-6"
            >

              <div className="bg-gradient-to-br from-primary-violet to-primary-magenta p-2 rounded-xl">

                <Layout className="h-6 w-6 text-white" />

              </div>


              <span className="ml-3 text-2xl font-black text-main uppercase tracking-tighter">

                Subly

              </span>

            </Link>


            <h2 className="text-3xl font-black text-main">

              Create your account

            </h2>


            <p className="text-muted mt-2">

              Start your 14-day free trial

            </p>

          </div>


          {/* ERROR */}

          {error && (

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="mb-5 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-start gap-3 text-sm"
            >

              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />

              <span className="leading-relaxed">

                {error}

              </span>

            </motion.div>

          )}


          {/* GOOGLE */}

          <div className="flex justify-center w-full">

            {googleLoading ? (

              <div className="w-full h-[44px] rounded-xl border border-main flex items-center justify-center">

                <div className="h-5 w-5 border-2 border-primary-violet/30 border-t-primary-violet rounded-full animate-spin">
                </div>

                <span className="ml-3 text-sm font-semibold text-muted">

                  Creating account with Google...

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


          {/* REGISTER FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            {/* FIRST / LAST NAME */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


              {/* FIRST NAME */}

              <div className="space-y-2">

                <label className="text-sm font-bold text-muted ml-1">

                  First Name

                </label>


                <div className="relative group">

                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-violet transition-colors" />


                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => {

                      setFirstName(
                        e.target.value
                      );

                      if (error) {
                        setError('');
                      }

                    }}
                    className="w-full bg-bg-deep border border-main rounded-2xl py-4 pl-12 pr-4 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-violet/50 focus:border-primary-violet transition-all"
                    placeholder="First name"
                  />

                </div>

              </div>


              {/* LAST NAME */}

              <div className="space-y-2">

                <label className="text-sm font-bold text-muted ml-1">

                  Last Name

                </label>


                <div className="relative group">

                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-violet transition-colors" />


                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => {

                      setLastName(
                        e.target.value
                      );

                      if (error) {
                        setError('');
                      }

                    }}
                    className="w-full bg-bg-deep border border-main rounded-2xl py-4 pl-12 pr-4 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-violet/50 focus:border-primary-violet transition-all"
                    placeholder="Last name"
                  />

                </div>

              </div>

            </div>


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

                    setEmail(
                      e.target.value
                    );

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

              <label className="text-sm font-bold text-muted ml-1">

                Password

              </label>


              <div className="relative group">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-violet transition-colors" />


                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => {

                    setPassword(
                      e.target.value
                    );

                    if (error) {
                      setError('');
                    }

                  }}
                  className="w-full bg-bg-deep border border-main rounded-2xl py-4 pl-12 pr-12 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-violet/50 focus:border-primary-violet transition-all"
                  placeholder="Minimum 8 characters"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showPassword ? (

                    <EyeOff className="h-5 w-5" />

                  ) : (

                    <Eye className="h-5 w-5" />

                  )}

                </button>

              </div>


              {/* PASSWORD REQUIREMENTS */}

              <div className="text-xs text-muted ml-1 space-y-1 pt-1">

                <p>
                  Password must contain:
                </p>

                <p
                  className={
                    password.length >= 8
                      ? 'text-green-500'
                      : 'text-muted'
                  }
                >
                  • At least 8 characters
                </p>

                <p
                  className={
                    /[A-Z]/.test(password)
                      ? 'text-green-500'
                      : 'text-muted'
                  }
                >
                  • At least one uppercase letter
                </p>

                <p
                  className={
                    /[a-z]/.test(password)
                      ? 'text-green-500'
                      : 'text-muted'
                  }
                >
                  • At least one lowercase letter
                </p>

                <p
                  className={
                    /[0-9]/.test(password)
                      ? 'text-green-500'
                      : 'text-muted'
                  }
                >
                  • At least one number
                </p>

                <p
                  className={
                    /[^A-Za-z0-9]/.test(password)
                      ? 'text-green-500'
                      : 'text-muted'
                  }
                >
                  • At least one special character
                </p>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="space-y-2">

              <label className="text-sm font-bold text-muted ml-1">

                Confirm Password

              </label>


              <div className="relative group">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary-violet transition-colors" />


                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  required
                  value={confirmPassword}
                  onChange={(e) => {

                    setConfirmPassword(
                      e.target.value
                    );

                    if (error) {
                      setError('');
                    }

                  }}
                  className="w-full bg-bg-deep border border-main rounded-2xl py-4 pl-12 pr-12 text-main placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-violet/50 focus:border-primary-violet transition-all"
                  placeholder="Repeat your password"
                />


                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) =>
                        !current
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {showConfirmPassword ? (

                    <EyeOff className="h-5 w-5" />

                  ) : (

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

                  Create Account

                  <ArrowRight className="h-5 w-5" />

                </>

              )}

            </button>

          </form>


          {/* FOOTER */}

          <div className="mt-8 text-center">

            <p className="text-muted text-sm">

              Already have an account?{' '}

              <Link
                to="/login"
                className="text-main font-black hover:text-primary-violet transition-colors"
              >

                Sign in

              </Link>

            </p>

          </div>

        </div>

      </motion.div>

    </div>
  );
};


export default Register;