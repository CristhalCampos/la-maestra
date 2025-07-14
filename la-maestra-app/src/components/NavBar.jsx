'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../app/lib/supabase'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function NavBar() {
  const [userName, setUserName] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single()

        if (profile?.full_name) {
          setUserName(profile.full_name)
        }
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="w-full bg-[#F2CB05] text-gray-800 px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src="/icon.png" alt="Logo" className="h-8 mr-2" />
          <span className="text-xl font-bold">La Maestra</span>
        </div>

        {/* Menú desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-lg font-semibold">{userName || 'nombre'}</span>
          <button
            onClick={handleLogout}
            className="bg-[#F20CA2] text-white px-4 py-2 rounded-full hover:opacity-90 font-medium transition"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Botón hamburguesa en móviles */}
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú móvil desplegable */}
      {isOpen && (
        <div className="md:hidden mt-4 flex justify-end items-center gap-4">
          <div className="text-base font-semibold">{userName || 'nombre'}</div>
          <button
            onClick={handleLogout}
            className="bg-[#F20CA2] text-white px-4 py-2 rounded-full hover:opacity-90 font-medium transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  )
}