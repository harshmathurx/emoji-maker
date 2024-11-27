import { Card } from "./card";
import { Skeleton } from "./skeleton";

export function PosterSkeleton() {
  return (
    <Card className="group overflow-hidden bg-zinc-900 dark:bg-zinc-900/90 backdrop-blur-sm border-0 rounded-xl shadow-lg">
      <div className="relative aspect-square">
        <Skeleton className="h-full w-full rounded-t-xl" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function PosterSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <PosterSkeleton key={i} />
      ))}
    </div>
  );
} 