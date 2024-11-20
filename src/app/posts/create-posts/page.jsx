'use client';

import { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import apiCalls from '@/api';
import JoditEditor from 'jodit-react';

const CreatePost = () => {
  const editor = useRef(null);
  const router = useRouter();
  const [content, setContent] = useState('');

  const initialValues = {
    title: '',
    content: '',
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const response = await apiCalls.createPost(values);

      if (response) {
        toast.success('Post created successfully!');
        router.push('/posts/my-posts');
      } else {
        toast.error('Failed to create post. Please try again.');
      }

      setSubmitting(false);
    },
  });

  return (
    <div className="container my-2">
      <div className="card shadow-sm p-4 border-0">
        <h1 className="text-center text-primary mb-4 fw-bold">Create a New Post</h1>
        <form onSubmit={formik.handleSubmit} className="mx-auto" style={{ maxWidth: '800px' }}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label fw-semibold">
              Post Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className={`form-control ${
                formik.touched.title && formik.errors.title ? 'is-invalid' : ''
              }`}
              placeholder="Enter your post title"
              onChange={formik.handleChange}
              value={formik.values.title}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
              <div className="invalid-feedback">{formik.errors.title}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="form-label fw-semibold">
              Post Content <span className="text-danger">*</span>
            </label>
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1}
              onBlur={(newContent) => {
                setContent(newContent);
                formik.setFieldValue('content', newContent);
              }}
              className="border rounded"
            />
            {formik.touched.content && formik.errors.content && (
              <div className="text-danger mt-2">{formik.errors.content}</div>
            )}
          </div>

          <div className="d-grid mt-4">
            <button
              type="submit"
              className="btn btn-primary btn-lg fw-bold py-2"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" />
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
