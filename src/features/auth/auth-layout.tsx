interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='bg-primary-foreground container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-backhoe"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M13 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M13 19l-9 0" /><path d="M4 15l9 0" /><path d="M8 12v-5h2a3 3 0 0 1 3 3v5" /><path d="M5 15v-2a1 1 0 0 1 1 -1h7" /><path d="M21.12 9.88l-3.12 -4.88l-5 5" /><path d="M21.12 9.88a3 3 0 0 1 -2.12 5.12a3 3 0 0 1 -2.12 -.88l4.24 -4.24z" /></svg>
          <h1 className='text-xl font-medium'>ConstructionPM</h1>
        </div>
        {children}
      </div>
    </div>
  )
}
