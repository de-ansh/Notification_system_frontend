import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notification System POC',
  description: 'A proof-of-concept notification system for social media operations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
} 