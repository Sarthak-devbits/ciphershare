import React from 'react'

const CardSkeleton = () => {
  return (
    <div className="container py-12 max-w-lg space-y-6 animate-pulse">
    <div className="h-6 w-2/3 bg-muted rounded" />
    <div className="h-4 w-full bg-muted rounded" />
    <div className="border rounded-xl bg-card p-6 space-y-4">
      <div className="h-5 w-1/2 bg-muted rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="h-4 w-1/2 bg-muted rounded" />
      </div>
      <div className="mt-6">
        <div className="h-10 w-full bg-muted rounded" />
      </div>
    </div>
  </div>
  )
}

export default CardSkeleton