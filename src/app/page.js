'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [year, setYear] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.push('/posts');
    } else {
      setYear(new Date().getFullYear());
    }
  }, [router]);

  return (
    <div>
      <main className="container text-center my-5">
        <section className="mb-5">
          <h1 className="display-4 fw-bold">Welcome to Blog Post</h1>
          <p className="lead text-muted">
            Share your ideas, connect with others, and explore new perspectives through engaging
            blog posts.
          </p>
          <Link href="/auth/register" className="btn btn-primary btn-lg">
            Get Started
          </Link>
        </section>

        <section className="row text-center">
          <div className="col-md-4 mb-4">
            <Image src="/feature.png" alt="Write and Share" width={200} height={100} />
            <h3 className="mt-3">Write and Share</h3>
            <p>Express your thoughts and ideas with captivating blog posts.</p>
          </div>
          <div className="col-md-4 mb-4">
            <Image src="/feature.png" alt="Engage with Community" width={200} height={100} />
            <h3 className="mt-3">Engage with Community</h3>
            <p>Connect, discuss, and grow with like-minded individuals.</p>
          </div>
          <div className="col-md-4 mb-4">
            <Image src="/feature.png" alt="Explore Ideas" width={200} height={100} />
            <h3 className="mt-3">Explore Ideas</h3>
            <p>Discover diverse topics and broaden your knowledge horizon.</p>
          </div>
        </section>
      </main>

      <footer className="bg-light py-3 text-center">
        <p className="mb-1">© {year} Blog Post. All rights reserved.</p>
        <nav>
          <Link href="/about" className="text-muted mx-2">
            About
          </Link>
          <Link href="/contact" className="text-muted mx-2">
            Contact
          </Link>
          <Link href="/privacy" className="text-muted mx-2">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
