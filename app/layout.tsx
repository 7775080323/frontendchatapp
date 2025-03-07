import type { Metadata } from 'next'
import ReduxSetup from '../store/services/ReduxSetup'; 

import './globals.css'

export const metadata: Metadata = {
  title: 'signup',
  description: 'Real time chat application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-[url("/images/bg.jpg")] min-h-screen bg-cover bg-no-repeat bg-[#050505AB] bg-blend-overlay'>
        <ReduxSetup>{children}</ReduxSetup>
        </body>
    </html>
  )
}
