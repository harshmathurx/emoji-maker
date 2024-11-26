import PosterGenerator from '@/components/PosterGenerator';
import PosterGrid from '@/components/PosterGrid';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Pixar Poster Creator</h1>
      <PosterGenerator />
      <PosterGrid />
    </div>
  );
}
