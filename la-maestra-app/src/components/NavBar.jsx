'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../app/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const [userName, setUserName] = useState('')
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
    <header className="w-full bg-[#F2CB05] text-gray-800 px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <img src="/icon.png" alt="Logo" className="h-8 mr-2 inline-block" />
        <span className="text-xl font-bold">La Maestra</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xl font-semibold">
          {userName || 'nombre'}
        </span>
        <button
          onClick={handleLogout}
          className="bg-[#F20CA2] text-white px-4 py-2 rounded-full hover:opacity-90 font-medium transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}