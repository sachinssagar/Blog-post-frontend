'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiCalls from '@/api';
import { toast } from 'react-hot-toast';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await apiCalls.fetchAllPosts();

        if (response?.results) {
          setPosts(response.results);
          toast.success('Posts fetched successfully');
        } else {
          toast.error('Unexpected response. Please try again.');
        }
      } catch (err) {
        toast.error('Failed to fetch posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Fetching the latest posts...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-info" role="alert">
          No posts available at the moment. Check back later or{' '}
          <Link href="/posts/create" className="text-decoration-underline text-primary">
            create a new post
          </Link>
          !
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-primary fw-bold">Explore Our Posts</h1>
      <div className="row gy-4">
        {posts.map((post) => (
          <div key={post.slug} className="col-lg-4 col-md-6 col-sm-12">
            <Link
              href={`/posts/view?slug=${post.slug}`}
              className="card shadow-sm h-100 border-0 text-decoration-none"
              style={{ borderRadius: '12px', overflow: 'hidden' }}
            >
              <div className="card-body p-4">
                <h5 className="card-title text-dark fw-bold">{post.title}</h5>
                <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                  {post.content
                    ? post.content.replace(/<[^>]+>/g, '').slice(0, 120) + '...'
                    : 'No content available'}
                </p>
              </div>
              <div className="card-footer bg-light border-0 text-muted small d-flex justify-content-between align-items-center px-4 py-3">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span>Read More</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
