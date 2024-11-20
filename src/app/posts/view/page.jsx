'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import apiCalls from '@/api';
import { toast } from 'react-hot-toast';

const ViewPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await apiCalls.fetchPostBySlug(slug);
        setPost(response);
        toast.success('Post fetched successfully');
      } catch (err) {
        toast.error('Failed to fetch post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const renderContent = () => {
    if (post.content && typeof post.content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: post.content }} />;
    } else if (post.content && typeof post.content === 'object') {
      return (
        <div className="post-content">
          {post.content.blocks.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                return (
                  <p key={index} className="mb-3">
                    {block.data.text}
                  </p>
                );
              case 'header':
                return (
                  <h2 key={index} className="mb-4">
                    {block.data.text}
                  </h2>
                );
              case 'quote':
                return (
                  <blockquote
                    key={index}
                    className="blockquote mb-4 p-3 border-start border-4 border-primary"
                  >
                    {block.data.text}
                  </blockquote>
                );
              case 'list':
                return (
                  <ul key={index} className="list-unstyled mb-4">
                    {block.data.items.map((item, idx) => (
                      <li key={idx} className="ms-3">
                        <i className="bi bi-dot text-primary me-2"></i>
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              default:
                return (
                  <p key={index} className="text-muted">
                    Unsupported block type: {block.type}
                  </p>
                );
            }
          })}
        </div>
      );
    }
    return <div>No content available</div>;
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Fetching the post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger" role="alert">
          Post not found. Please check the URL or try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="bg-light p-5 rounded shadow-sm">
        <button className="btn btn-secondary mb-4" onClick={() => router.back()}>
          Back
        </button>
        <h1 className="text-center mb-4 text-primary fw-bold">{post.title}</h1>
        <div className="content text-dark">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ViewPost;
