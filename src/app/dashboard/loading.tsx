import { Skeleton, SkeletonStats, SkeletonList } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[rgb(var(--background))] animate-fade-in">
      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton width="200px" height={36} className="mb-2" />
        <Skeleton width="320px" height={20} />
      </div>

      {/* Stats Grid skeleton */}
      <SkeletonStats count={4} className="mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4" />

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects skeleton */}
        <div className="rounded-xl border border-[rgb(var(--border-light))] bg-[rgb(var(--card))]">
          <div className="p-6 border-b border-[rgb(var(--border-light))]">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton width="140px" height={24} className="mb-1" />
                <Skeleton width="180px" height={16} />
              </div>
              <Skeleton width="80px" height={20} />
            </div>
          </div>
          <div className="p-4">
            <SkeletonList items={5} />
          </div>
        </div>

        {/* Pending Invoices skeleton */}
        <div className="rounded-xl border border-[rgb(var(--border-light))] bg-[rgb(var(--card))]">
          <div className="p-6 border-b border-[rgb(var(--border-light))]">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton width="160px" height={24} className="mb-1" />
                <Skeleton width="120px" height={16} />
              </div>
              <Skeleton width="80px" height={20} />
            </div>
          </div>
          <div className="p-4">
            <SkeletonList items={5} />
          </div>
        </div>
      </div>
    </div>
  )
}
