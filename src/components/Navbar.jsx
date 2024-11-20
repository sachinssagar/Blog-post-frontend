'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');

    router.push('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand fw-bold text-primary">
          <i className="bi bi-pencil-square me-2"></i> Blog Post
        </Link>

        <div className="d-flex align-items-center">
          {isAuthenticated ? (
            <>
              <Link href="/posts" className="btn btn-outline-primary mx-2">
                <i className="bi bi-card-text me-1"></i> Posts
              </Link>
              <Link href="/posts/my-posts" className="btn btn-outline-secondary mx-2">
                <i className="bi bi-collection me-1"></i> My Posts
              </Link>
              <Link href="/auth/profile" className="btn btn-outline-info mx-2">
                <i className="bi bi-person-circle me-1"></i> Profile
              </Link>
              <button className="btn btn-outline-danger mx-2" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-outline-primary mx-2">
                <i className="bi bi-box-arrow-in-right me-1"></i> Login
              </Link>
              <Link href="/posts" className="btn btn-primary mx-2">
                <i className="bi bi-card-text me-1"></i> Posts
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
