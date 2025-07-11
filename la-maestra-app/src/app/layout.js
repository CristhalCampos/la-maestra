import './globals.css'

export const metadata = {
  title: 'La Maestra',
  description: 'Aplicación para planificación semanal de clases',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}