import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      {/* image */}
      <Skeleton className="h-40 w-full rounded-xl" />

      {/* title + price + buttons */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
        <div className="pt-2 space-y-2">
          <Skeleton className="h-9 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
