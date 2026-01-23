import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-44 rounded-lg" />
        <Skeleton className="h-5 w-28 rounded-md" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-slate-50 p-6">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="mt-4 flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-64 rounded-md" />
          <Skeleton className="h-10 w-3/4 rounded-md" />
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-10 w-48 rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </div>

      <div className="mt-10">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="mt-6 h-40 w-full rounded-md" />
      </div>
    </div>
  );
}
