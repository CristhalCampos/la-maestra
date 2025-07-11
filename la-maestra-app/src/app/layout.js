import './globals.css'
import Head from 'next/head'

export const metadata = {
  title: 'La Maestra',
  description: 'Aplicación para planificación semanal de clases',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <Head>
        <title>{metadata.title}</title>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-[#F2D5F2] text-gray-800 antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}