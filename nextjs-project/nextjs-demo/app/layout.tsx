import type { Metadata } from 'next'
import { inter } from '@/app/ui/fonts';
import '@/app/ui/globals.css'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* antialiased 详见https://tailwindcss.com/docs/font-smoothing */}
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
