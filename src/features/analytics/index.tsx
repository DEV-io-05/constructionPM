import * as React from 'react'

export default function Analytics() {
  // const { data: analytics } = useGetAnalyticsQuery()

  return (
    <>
      <div className='flex h-full w-full flex-col items-center justify-center gap-4'>
        <h1 className='text-2xl font-bold'>Analytics</h1>
        <p className='text-gray-500'>No analytics data available.</p>
      </div>
    </>
  )
}
