/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { postLogin, postRegister, showLoginFormAction } from './authSlice';
import { showTypingtestAction } from '../TypingTest/typingtestSlice';

const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 6) {
    errors.password = 'Must be more than 6 characters';
  }
  return errors;
};

const validateRegisterationForm = (values) => {
  const errors = {};

  if (!values.username) {
    errors.username = 'Required';
  } else if (values.username.length > 20) {
    errors.username = 'Must be less than 20 characters';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.verifyEmail) {
    errors.verifyEmail = 'Required';
  } else if (values.verifyEmail !== values.email) {
    errors.verifyEmail = 'Email must be matched in both fields';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 6) {
    errors.password = 'Must be more than 6 characters';
  }

  if (!values.verifyPassword) {
    errors.verifyPassword = 'Required';
  } else if (values.verifyPassword !== values.password) {
    errors.verifyPassword = 'Password must be matched in both fields';
  }
  return errors;
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const loginStatus = useSelector((state) => state.auth.login.status);
  const registrationStatus = useSelector((state) => state.auth.registration.status);
  const loginError = useSelector((state) => state.auth.login.error);
  const registrationError = useSelector((state) => state.auth.registration.error);
  const hasLogin = useSelector((state) => state.auth.hasLogin);

  useEffect(() => {
    if (hasLogin === true) {
      dispatch(showLoginFormAction({ show: false }));
      dispatch(showTypingtestAction({ show: true }));
    }
  }, [hasLogin]);

  return (
    <div className="authForms">
      <div className="registerationForm">
        <div className="title">register</div>
        <Formik
          initialValues={{
            username: '',
            email: '',
            verifyEmail: '',
            password: '',
            verifyPassword: '',
          }}
          validate={validateRegisterationForm}
          onSubmit={(values) => {
            dispatch(
              postRegister({
                username: values.username,
                email: values.email,
                password: values.password,
              })
            );
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            submitForm,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
              />
              {touched.username && errors.username ? (
                <div className="errorMessage">{errors.username}</div>
              ) : null}

              <input
                id="email"
                name="email"
                type="email"
                placeholder="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {touched.email && errors.email ? (
                <div className="errorMessage">{errors.email}</div>
              ) : null}

              <input
                id="verifyEmail"
                name="verifyEmail"
                type="email"
                placeholder="verify email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.verifyEmail}
              />
              {touched.verifyEmail && errors.verifyEmail ? (
                <div className="errorMessage">{errors.verifyEmail}</div>
              ) : null}

              <input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {touched.password && errors.password ? (
                <div className="errorMessage">{errors.password}</div>
              ) : null}

              <input
                id="verifyPassword"
                name="verifyPassword"
                type="password"
                placeholder="verify password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.verifyPassword}
              />
              {touched.verifyPassword && errors.verifyPassword ? (
                <div className="errorMessage">{errors.verifyPassword}</div>
              ) : null}
              {touched.verifyPassword &&
              registrationStatus === 'error' &&
              registrationError !== null ? (
                <div className="errorMessage">{registrationError}</div>
              ) : null}

              <div className="button" onClick={() => submitForm()}>
                <FaUserPlus size="20px" />
                <span>Sign Up</span>
              </div>
            </form>
          )}
        </Formik>
      </div>

      <div className="loginForm">
        <div className="title">login</div>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validate={validateLoginForm}
          onSubmit={(values) => {
            dispatch(postLogin({ email: values.email, password: values.password }));
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            submitForm,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {touched.email && errors.email ? (
                <div className="errorMessage">{errors.email}</div>
              ) : null}

              <input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {touched.password && errors.password ? (
                <div className="errorMessage">{errors.password}</div>
              ) : null}
              {touched.password && loginStatus === 'error' && loginError !== null ? (
                <div className="errorMessage">{loginError}</div>
              ) : null}

              <div className="button" onClick={() => submitForm()}>
                <FaSignInAlt size="20px" />
                <span>Sign In</span>
              </div>
              <div
                className="link"
                onClick={() =>
                  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'mywindow')
                }
              >
                Forgot password?
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
