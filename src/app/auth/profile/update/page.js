'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import apiCalls from '@/api';

const UpdateProfile = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
      setInitialValues({
        username: storedUser.username,
        first_name: storedUser.first_name || '',
        last_name: storedUser.last_name || '',
        email: storedUser.email,
      });
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      first_name: Yup.string().required('First Name is required'),
      last_name: Yup.string().required('Last Name is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await apiCalls.updateUserProfile(values);
        if (response) {
          const updatedUser = {
            ...JSON.parse(localStorage.getItem('user')),
            ...values,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          toast.success('Profile updated successfully!');
          router.push('/auth/profile');
        } else {
          toast.error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('An error occurred while updating profile');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-light py-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header text-center border-0 bg-white py-3">
                <div className="mb-2">
                  <i className="bi bi-person-circle fs-1 text-primary"></i>
                </div>
                <h2 className="fs-4 mb-1">Edit Profile</h2>
                <p className="text-muted small mb-0">Update your personal information</p>
              </div>

              <form onSubmit={formik.handleSubmit}>
                <div className="card-body p-3">
                  <div className="mb-2 p-2 bg-light rounded-2">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-person text-primary me-2 mt-2"></i>
                      <div className="flex-grow-1">
                        <label className="text-muted small mb-1" htmlFor="username">
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className="form-control border-0 bg-light"
                          value={formik.values.username}
                          onChange={formik.handleChange}
                          placeholder="Enter your username"
                          required
                        />
                        {formik.errors.username && formik.touched.username && (
                          <div className="text-danger small">{formik.errors.username}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 p-2 bg-light rounded-2">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-person text-primary me-2 mt-2"></i>
                      <div className="flex-grow-1">
                        <div className="d-flex">
                          <div className="me-2 w-50">
                            <label className="text-muted small mb-1" htmlFor="first_name">
                              First Name
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              name="first_name"
                              className="form-control border-0 bg-light"
                              value={formik.values.first_name}
                              onChange={formik.handleChange}
                              placeholder="Enter your first name"
                              required
                            />
                            {formik.errors.first_name && formik.touched.first_name && (
                              <div className="text-danger small">{formik.errors.first_name}</div>
                            )}
                          </div>

                          <div className="w-50">
                            <label className="text-muted small mb-1" htmlFor="last_name">
                              Last Name
                            </label>
                            <input
                              type="text"
                              id="last_name"
                              name="last_name"
                              className="form-control border-0 bg-light"
                              value={formik.values.last_name}
                              onChange={formik.handleChange}
                              placeholder="Enter your last name"
                              required
                            />
                            {formik.errors.last_name && formik.touched.last_name && (
                              <div className="text-danger small">{formik.errors.last_name}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2 p-2 bg-light rounded-2">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-envelope text-primary me-2 mt-2"></i>
                      <div className="flex-grow-1">
                        <label className="text-muted small mb-1" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control border-0 bg-light"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          placeholder="Enter your email"
                          required
                        />
                        {formik.errors.email && formik.touched.email && (
                          <div className="text-danger small">{formik.errors.email}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer border-0 bg-light p-3">
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => router.push('/auth/profile')}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
