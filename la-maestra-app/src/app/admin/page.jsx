'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import NavBar from '../../components/NavBar'
import UploadDocumentForm from '../../components/UploadDocumentForm'
import Link from 'next/link'

export default function Page() {
  const [teachers, setTeachers] = useState([])
  const [documents, setDocuments] = useState([])
  const [form, setForm] = useState({
    week_start_date: '',
    topic: '',
    document_id: '',
    plc_friday_teachers: [],
    plc_sunday_teachers: [],
    lecheria_sunday_teachers: []
  })

  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const { data: teacherData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'teacher')

      const { data: fileData } = await supabase
        .from('documents')
        .select('id, title')

      setTeachers(teacherData || [])
      setDocuments(fileData || [])
    }

    fetchData()
  }, [])

  const toggleTeacher = (id, field) => {
    setForm((prev) => {
      const current = prev[field] || []
      const updated = current.includes(id)
        ? current.filter((tid) => tid !== id)
        : [...current, id]
      return { ...prev, [field]: updated }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { error } = await supabase.from('schedules').insert({
      week_start: form.week_start_date,
      topic: form.topic,
      document_id: form.document_id,
      plc_friday_teachers: form.plc_friday_teachers,
      plc_sunday_teachers: form.plc_sunday_teachers,
      lecheria_sunday_teachers: form.lecheria_sunday_teachers
    })

    if (error) setMessage('❌ Error al guardar el cronograma.')
    else setMessage('✅ Cronograma guardado correctamente.')
  }

  return (
    <>
      <NavBar />

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

        <UploadDocumentForm />

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
          <div>
            <label className="block font-semibold">Fecha de inicio de semana</label>
            <input
              type="date"
              className="border px-2 py-1 rounded w-full"
              value={form.week_start_date}
              onChange={(e) => setForm({ ...form, week_start_date: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Tema de la semana</label>
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Documento</label>
            <select
              className="border px-2 py-1 rounded w-full"
              value={form.document_id}
              onChange={(e) => setForm({ ...form, document_id: e.target.value })}
              required
            >
              <option value="">Seleccionar documento</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.title}</option>
              ))}
            </select>
          </div>

          {/* 📅 Viernes - Puerto La Cruz */}
          <div>
            <label className="block font-semibold mb-2">Viernes - Puerto La Cruz</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teachers.map((t) => (
                <label key={`plc-fri-${t.id}`} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded shadow-sm">
                  <input
                    type="checkbox"
                    value={t.id}
                    checked={form.plc_friday_teachers.includes(t.id)}
                    onChange={() => toggleTeacher(t.id, 'plc_friday_teachers')}
                    className="w-4 h-4 text-[#F20CA2] border-gray-300 rounded focus:ring-[#F20CA2]"
                  />
                  <span>{t.full_name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ☀️ Domingo - Puerto La Cruz */}
          <div>
            <label className="block font-semibold mb-2">Domingo - Puerto La Cruz</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teachers.map((t) => (
                <label key={`plc-sun-${t.id}`} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded shadow-sm">
                  <input
                    type="checkbox"
                    value={t.id}
                    checked={form.plc_sunday_teachers.includes(t.id)}
                    onChange={() => toggleTeacher(t.id, 'plc_sunday_teachers')}
                    className="w-4 h-4 text-[#F20CA2] border-gray-300 rounded focus:ring-[#F20CA2]"
                  />
                  <span>{t.full_name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 🌊 Domingo - Lechería */}
          <div>
            <label className="block font-semibold mb-2">Domingo - Lechería</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teachers.map((t) => (
                <label key={`lech-sun-${t.id}`} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded shadow-sm">
                  <input
                    type="checkbox"
                    value={t.id}
                    checked={form.lecheria_sunday_teachers.includes(t.id)}
                    onChange={() => toggleTeacher(t.id, 'lecheria_sunday_teachers')}
                    className="w-4 h-4 text-[#F20CA2] border-gray-300 rounded focus:ring-[#F20CA2]"
                  />
                  <span>{t.full_name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#F20CA2] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90"
          >
            Guardar cronograma
          </button>

          {message && <p className="mt-2 text-sm">{message}</p>}
        </form>
      </div>

      <Link href="/dashboard" className="block text-center mt-6 text-blue-500 hover:underline">
        Ir al Dashboard
      </Link>
    </>
  )
}