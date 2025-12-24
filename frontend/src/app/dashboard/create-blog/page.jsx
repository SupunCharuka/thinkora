import React, { Suspense } from 'react';
import CreateBlogClient from './CreateBlogClient';

export default function CreateBlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <CreateBlogClient />
    </Suspense>
  );
}
