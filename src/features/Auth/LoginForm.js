/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { useFormik } from 'formik';

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
  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateLoginForm,
    onSubmit: (values) => {
      // eslint-disable-next-line no-alert
      // eslint-disable-next-line no-undef
      alert(JSON.stringify(values, null, 2));
    },
  });

  const registerationForm = useFormik({
    initialValues: {
      username: '',
      email: '',
      verifyEmail: '',
      password: '',
      verifyPassword: '',
    },
    validateRegisterationForm,
    onSubmit: (values) => {
      // eslint-disable-next-line no-alert
      // eslint-disable-next-line no-undef
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className="authForms">
      <div className="registerationForm">
        <div className="title">register</div>
        <form onSubmit={registerationForm.handleSubmit}>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            onChange={registerationForm.handleChange}
            onBlur={registerationForm.handleBlur}
            value={registerationForm.values.username}
          />
          {registerationForm.touched.username && registerationForm.errors.username ? (
            <div>{registerationForm.errors.username}</div>
          ) : null}

          <input
            id="email"
            name="email"
            type="email"
            placeholder="email"
            onChange={registerationForm.handleChange}
            onBlur={registerationForm.handleBlur}
            value={registerationForm.values.email}
          />
          {registerationForm.touched.email && registerationForm.errors.email ? (
            <div>{registerationForm.errors.email}</div>
          ) : null}

          <input
            id="verifyEmail"
            name="verifyEmail"
            type="email"
            placeholder="verify email"
            onChange={registerationForm.handleChange}
            onBlur={registerationForm.handleBlur}
            value={registerationForm.values.verifyEmail}
          />
          {registerationForm.touched.verifyEmail && registerationForm.errors.verifyEmail ? (
            <div>{registerationForm.errors.verifyEmail}</div>
          ) : null}

          <input
            id="password"
            name="password"
            type="password"
            placeholder="password"
            onChange={registerationForm.handleChange}
            onBlur={registerationForm.handleBlur}
            value={registerationForm.values.password}
          />
          {registerationForm.touched.password && registerationForm.errors.password ? (
            <div>{registerationForm.errors.password}</div>
          ) : null}

          <input
            id="verifyPassword"
            name="verifyPassword"
            type="password"
            placeholder="verify password"
            onChange={registerationForm.handleChange}
            onBlur={registerationForm.handleBlur}
            value={registerationForm.values.verifyPassword}
          />
          {registerationForm.touched.verifyPassword && registerationForm.errors.verifyPassword ? (
            <div>{registerationForm.errors.verifyPassword}</div>
          ) : null}

          <div className="button" onClick={() => registerationForm.submitForm()}>
            <FaUserPlus size="20px" />
            <span>Sign Up</span>
          </div>
        </form>
      </div>

      <div className="loginForm">
        <div className="title">login</div>
        <form onSubmit={loginForm.handleSubmit}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email"
            onChange={loginForm.handleChange}
            onBlur={loginForm.handleBlur}
            value={loginForm.values.email}
          />
          {loginForm.touched.email && loginForm.errors.email ? (
            <div>{loginForm.errors.email}</div>
          ) : null}

          <input
            id="password"
            name="password"
            type="password"
            placeholder="password"
            onChange={loginForm.handleChange}
            onBlur={loginForm.handleBlur}
            value={loginForm.values.password}
          />
          {loginForm.touched.password && loginForm.errors.password ? (
            <div>{loginForm.errors.password}</div>
          ) : null}

          <div className="button" onClick={() => registerationForm.submitForm()}>
            <FaSignInAlt size="20px" />
            <span>Sign In</span>
          </div>
          <div
            className="link"
            onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'mywindow')}
          >
            Forgot password?
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
