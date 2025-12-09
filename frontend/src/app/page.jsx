import articles from '@/data/articles';
import Link from 'next/link';
import Hero from '@/components/hero';
import Trending from '@/components/trending';
import MostViewed from '@/components/mostViewed';
import Latest from '@/components/latest';

export default function Home() {
  return (
    <div className="container mx-auto py-2">
      <Hero articles={articles} />

      <Trending />
      
      <MostViewed />

      <Latest />
      
    </div>
  );
}
