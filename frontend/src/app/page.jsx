import posts from '@/data/posts';
import Link from 'next/link';
import Hero from '@/components/hero';
import Trending from '@/components/trending';
import Latest from '@/components/latest';

export default function Home() {
  return (
    <div className="container mx-auto py-2">
      <Hero posts={posts} />

      <Trending />

      <Latest />
      
    </div>
  );
}
