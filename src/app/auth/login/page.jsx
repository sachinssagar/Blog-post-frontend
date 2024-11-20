'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import apiCalls from '@/api';

const Login = () => {
  const router = useRouter();

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await apiCalls.login(values);
        if (response) {
          localStorage.setItem('accessToken', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          localStorage.setItem('user', JSON.stringify(response.user));
          toast.success('Login successful!');
          window.location.href = '/posts/my-posts';
        } else {
          toast.error('Login failed. Please try again.');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
        console.error('Login error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow" style={{ width: '30rem' }}>
        <div className="card-body">
          <h1 className="card-title text-center mb-4">Login</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-control ${
                  formik.touched.username && formik.errors.username ? 'is-invalid' : ''
                }`}
                placeholder="Enter your username"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="text-danger">{formik.errors.username}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${
                  formik.touched.password && formik.errors.password ? 'is-invalid' : ''
                }`}
                placeholder="Enter your password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-danger">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="mb-0">
                Don’t have an account?{' '}
                <Link href="/auth/register" className="text-decoration-none text-primary fw-bold">
                  Create one
                </Link>
              </p>
            </div>
            <div className="text-center mt-2">
              <Link href="/auth/forgot-password" className="text-decoration-none text-primary">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
