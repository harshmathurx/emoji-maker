import PosterGenerator from '@/components/PosterGenerator';
import PosterGrid from '@/components/PosterGrid';

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      <PosterGenerator />
      <PosterGrid showCreatorInfo={true} />
    </main>
  );
}
