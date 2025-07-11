export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2D5F2] text-gray-800 text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">¡Ups! No pudimos encontrar esta página.</p>
      <a
        href="/"
        className="bg-[#F20CA2] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
      >
        Volver al inicio
      </a>
    </div>
  )
}