import * as React from 'react'
import { Button } from '@/components/ui/button'

export default function Alerts(props: { message: string }) {
  // This is a placeholder component for the Alerts page.

  const { message } = props
  return (
    <div className='flex h-full w-full items-center justify-center'>
      <p>{message}</p>
      <Button onClick={() => alert(message)}>Show Alert</Button>
    </div>
  )
}
