import Link from "next/link"

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2D5F2] text-gray-800 text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Acceso denegado</h1>
      <p className="text-lg mb-6">
        No tienes permisos para ver esta sección.
      </p>
      <Link
        href="/login"
        className="bg-[#F20CA2] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
      >
        Volver al inicio de sesión
      </Link>
    </div>
  )
}