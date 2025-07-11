'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  // Verificar si ya hay sesión activa
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileData?.role === 'teacher') {
          setProfile(profileData)
          setLoading(false) // Mostrar contenido del dashboard
        } else {
          router.push('/unauthorized')
        }
      } else {
        router.push('/login')
      }
    }

    checkSession()
  }, [router])

  if (loading) return <div>Cargando...</div>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2D5F2] text-gray-800 p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenida al Dashboard</h1>
      <p className="text-lg mb-6 max-w-md">
        Aquí puedes ver tu cronograma de clases y las tareas pendientes.
      </p>
      {/* Boton para cerrar sesión */}
      <button
        onClick={async () => {
          await supabase.auth.signOut()
          router.push('/login')
        }}
        className="bg-[#F20CA2] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
      >
        Cerrar sesión
      </button>
    </div>
  )
}