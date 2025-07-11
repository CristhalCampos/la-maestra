'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import NavBar from '../../components/NavBar'
import Link from 'next/link'

const SUPABASE_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL

export default function Page() {
  const [weeks, setWeeks] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      // Verificar si es admin
      const {
        data: { session },
        error: sessionError
      } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Error obteniendo sesión:', sessionError)
        return
      }

      if (session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error cargando perfil:', profileError)
          return
        }

        if (profile?.role === 'admin') {
          setIsAdmin(true)
        }
      }

      // Cargar cronograma
      const { data: schedules, error: scheduleError } = await supabase
        .from('schedules')
        .select(`
          *,
          documents (
            url
          )
        `)
        .order('week_start', { ascending: true })

      if (scheduleError) {
        console.error('Error cargando cronograma:', scheduleError)
        return
      }

      // Cargar perfiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')

      if (profilesError) {
        console.error('Error cargando perfiles:', profilesError)
        return
      }

      // Mapear UUID a nombres
      const getNames = (ids) =>
        ids?.map((id) => profiles.find((p) => p.id === id)?.full_name || 'Desconocida')

      const schedulesWithNames = schedules.map((week) => ({
        ...week,
        plc_friday_names: getNames(week.plc_friday_teachers),
        plc_sunday_names: getNames(week.plc_sunday_teachers),
        lecheria_sunday_names: getNames(week.lecheria_sunday_teachers)
      }))

      setWeeks(schedulesWithNames)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <p className="text-center p-4">Cargando cronograma...</p>

  return (
    <>
      <NavBar />
      <div className="p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6">Cronograma Semanal</h1>

        <table className="min-w-full text-sm border border-gray-300 bg-white">
          <thead className="bg-[#3730F2] text-white">
            <tr>
              <th className="border px-3 py-2 text-left">Semana</th>
              <th className="border px-3 py-2 text-left">Tema</th>
              <th className="border px-3 py-2 text-left">Viernes PLC</th>
              <th className="border px-3 py-2 text-left">Domingo PLC</th>
              <th className="border px-3 py-2 text-left">Domingo Lechería</th>
              <th className="border px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week.id} className="border-t hover:bg-[#fafafa]">
                <td className="border px-3 py-2">
                  {/*new Date(week.week_start).toLocaleDateString()*/}
                  {week.week_start}
                </td>
                <td className="border px-3 py-2">{week.topic}</td>
                <td className="border px-3 py-2">
                  <ul>
                    {week.plc_friday_names?.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-3 py-2">
                  <ul>
                    {week.plc_sunday_names?.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-3 py-2">
                  <ul>
                    {week.lecheria_sunday_names?.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-3 py-2 text-center space-x-2">
                  {/* 
                  <Link
                    href={`/view?doc=${week.documents?.url}`}
                    className="bg-[#F2CB05] text-black px-2 py-1 rounded text-xs font-semibold hover:opacity-90"
                  >
                    Ver
                  </Link>
                  <a
                    href={`${SUPABASE_BASE_URL}/${week.documents?.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#F20CA2] text-white px-2 py-1 rounded text-xs font-semibold hover:opacity-90"
                  >
                    Descargar
                  </a>
                  */}
                  <Link
                    href={`${SUPABASE_BASE_URL}/${week.documents?.url}`}
                    className="bg-[#F2CB05] text-black px-2 py-1 rounded text-xs font-semibold hover:opacity-90"
                  >
                    Ver y descargar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isAdmin && (
          <div className="text-center mt-6">
            <Link
              href="/admin"
              className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
            >
              Volver al panel de administración
            </Link>
          </div>
        )}
      </div>
    </>
  )
}