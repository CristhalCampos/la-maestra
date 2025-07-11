export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2D5F2] text-gray-800 p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenida</h1>
      <p className="text-lg mb-6 max-w-md">
        Esta es una aplicación para gestionar las clases y el cronograma de
        maestras de los viernes y domingos.
      </p>
      <a
        href="/login"
        className="bg-[#F20CA2] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
      >
        Iniciar sesión
      </a>
    </div>
  )
}