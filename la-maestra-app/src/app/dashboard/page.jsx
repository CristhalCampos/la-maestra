'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import NavBar from '../../components/NavBar'
import Link from 'next/link'

const SUPABASE_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL

export default function Page() {
  const [weeks, setWeeks] = useState([])
  const [teacherName, setTeacherName] = useState('')
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
          .select('role, full_name')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error cargando perfil:', profileError)
          return
        }

        if (profile?.role === 'admin') {
          setIsAdmin(true)
        }

        setTeacherName(profile?.full_name || 'Desconocida')
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
        .order('week_date', { ascending: true })

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
      <div className="p-4 sm:p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">Cronograma 2025 - KIDS</h1>

        <div className="overflow-auto w-full">
          <table className="min-w-full text-sm border border-gray-300 bg-white">
            <thead className="bg-[#3730F2] text-white">
              <tr>
                <th className="border px-3 py-2 text-left">Semana</th>
                <th className="border px-3 py-2 text-left">Tema</th>
                <th className="border px-3 py-2 text-left">Domingo PLC</th>
                <th className="border px-3 py-2 text-left">Domingo Lechería</th>
                <th className="border px-3 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-semibold">
                <td className="border px-3 py-2">20 de Julio</td>
                <td className="border px-3 py-2">Día del niño</td>
                <td className="border px-3 py-2">Todas</td>
                <td className="border px-3 py-2">Todas</td>
                <td className="border px-3 py-2 text-center">—</td>
              </tr>

              {weeks.map((week) => (
                <tr
                  key={week.id}
                  className={`border-t ${
                    week.plc_sunday_names.includes(teacherName) ||
                    week.lecheria_sunday_names.includes(teacherName)
                      ? 'bg-[#373052] text-white'
                      : 'bg-white'
                  }`}
                >
                  <td className="border px-3 py-2">{week.week_label}</td>
                  <td className="border px-3 py-2">{week.topic}</td>
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
                  <td className="border px-3 py-2 text-center">
                    <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                      <a
                        href={`${SUPABASE_BASE_URL}/${week.documents?.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#F2CB05] text-black px-3 py-1 rounded text-xs font-semibold hover:opacity-90"
                      >
                        Ver
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isAdmin && (
          <div className="text-center mt-6">
            <Link
              href="/admin"
              className="inline-block text-blue-600 font-semibold hover:underline"
            >
              Volver al panel de administración
            </Link>
          </div>
        )}
      </div>
    </>
  )
}