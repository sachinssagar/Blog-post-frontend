'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const getFullName = () => {
    if (!user?.first_name && !user?.last_name) return 'Name not set';
    return `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
  };

  const ProfileItem = ({ icon, label, value }) => (
    <div className="mb-2 p-2 bg-light rounded-2">
      <div className="d-flex align-items-center">
        <i className={`bi ${icon} text-primary me-2`}></i>
        <div>
          <div className="text-muted small mb-0">{label}</div>
          <div className="fw-medium">{value || 'Not available'}</div>
        </div>
      </div>
    </div>
  );

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
                <h2 className="fs-4 mb-1">Profile Details</h2>
                <p className="text-muted small mb-0">Manage your personal information</p>
              </div>

              <div className="card-body p-3">
                <ProfileItem icon="bi-person" label="Username" value={user?.username} />
                <ProfileItem icon="bi-person-vcard" label="Full Name" value={getFullName()} />
                <ProfileItem icon="bi-envelope" label="Email Address" value={user?.email} />
              </div>

              <div className="card-footer border-0 bg-light p-3">
                <button
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                  onClick={() => router.push('/auth/profile/update')}
                >
                  <i className="bi bi-pencil-square"></i>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
