import blogs from '@/data/blogs';
import Link from 'next/link';
import Hero from '@/components/hero';
import Trending from '@/components/trending';
import MostViewed from '@/components/mostViewed';
import Latest from '@/components/latest';

export default function Home() {
  return (
    <div className="container mx-auto py-2">
      <Hero blogs={blogs} />

      <Trending />
      
      <MostViewed />

      <Latest />
      
    </div>
  );
}
