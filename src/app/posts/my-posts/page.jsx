'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiCalls from '@/api';
import { toast } from 'react-hot-toast';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await apiCalls.myPosts();

        if (response) {
          setPosts(response);
          toast.success('Posts fetched successfully');
        } else {
          toast.error('Failed to fetch posts. Please try again.');
        }
      } catch (err) {
        console.error('Fetch posts error:', err);
        toast.error('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async () => {
    try {
      await apiCalls.deletePostBySlug(deleteSlug);
      setPosts(posts.filter((post) => post.slug !== deleteSlug));
      toast.success('Post deleted successfully');
    } catch (err) {
      console.error('Delete post error:', err);
      toast.error('Failed to delete post. Please try again.');
    } finally {
      setDeleteSlug(null);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Fetching your posts...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-primary fw-bold">My Posts</h1>
      {posts.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <h5 className="fw-bold">No Posts Yet</h5>
          <p className="mb-0">You haven’t created any posts. Click below to start writing!</p>
        </div>
      ) : (
        <div className="row gy-4">
          {posts.map((post) => (
            <div key={post.slug} className="col-lg-4 col-md-6">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title text-dark">{post.title}</h5>
                  <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                    {post.content
                      ? post.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...'
                      : 'No content available'}
                  </p>
                </div>
                <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                  <div>
                    <Link
                      href={`/posts/view?slug=${post.slug}`}
                      className="btn btn-sm btn-info me-2"
                    >
                      View
                    </Link>
                    <Link
                      href={`/posts/update?slug=${post.slug}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edit
                    </Link>
                  </div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setDeleteSlug(post.slug)}
                    data-bs-toggle="modal"
                    data-bs-target="#deleteModal"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="d-grid gap-2 mt-4">
        <button
          className="btn btn-primary fw-bold py-2"
          onClick={() => router.push('/posts/create-posts')}
        >
          Create New Post
        </button>
      </div>

      <div
        className="modal fade"
        id="deleteModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">
                Confirm Deletion
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this post? This action cannot be undone.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                data-bs-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
