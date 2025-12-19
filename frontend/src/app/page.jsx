import Hero from '@/components/hero';
import Highlight from '@/components/highlight';
import MostViewed from '@/components/mostViewed';
import Latest from '@/components/latest';

export default function Home() {
  return (
    <div className="container mx-auto py-2">
      <Hero />

      <Highlight />

      <MostViewed />

      <Latest />

    </div>
  );
}
