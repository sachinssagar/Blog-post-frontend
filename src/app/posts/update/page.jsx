'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import apiCalls from '@/api';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import JoditEditor from 'jodit-react';
import { useRouter } from 'next/navigation';

const UpdatePost = () => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const editor = useRef(null);
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await apiCalls.fetchPostBySlug(slug);
        setPost(response);
        setContent(response.content);
        toast.success('Post fetched successfully');
      } catch (err) {
        toast.error('Failed to fetch post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Content is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await apiCalls.updatePostBySlug(slug, values);
        if (response) {
          toast.success('Post updated successfully!');
          router.push('/posts/my-posts');
        } else {
          toast.error('Failed to update post. Please try again.');
        }
      } catch (err) {
        toast.error('Failed to update post. Please try again.');
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if (post) {
      formik.setValues({
        title: post.title,
        content: post.content,
      });
    }
  }, [post]);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4 border-0">
        <h1 className="text-center text-primary mb-4 fw-bold">Update Post</h1>
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
              placeholder="Enter post title"
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
                'Update Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
