'use client'
import { useState } from 'react'
import { supabase } from '../app/lib/supabase'

export default function UploadDocumentForm() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setMessage('')
  }

  const extractWeekLabel = (title) => {
    const match = title.match(/Semana\s[\w\s]+?(?=\s\d{4}|$)/i)
    return match ? match[0].trim() : ''
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !title) {
      setMessage('❌ Debes seleccionar un archivo y colocar un título.')
      return
    }

    setUploading(true)
    setMessage('')

    const year = '2025'
    const filePath = `${year}/${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('classes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (uploadError) {
      setMessage('❌ Error al subir el archivo.')
      setUploading(false)
      return
    }

    const weekLabel = extractWeekLabel(title)

    // Insertar en tabla documents
    const { error: insertError } = await supabase
      .from('documents')
      .insert({
        title,
        url: filePath,
        week_label: weekLabel
      })

    if (insertError) {
      setMessage('✅ Archivo subido, pero error al guardar en la base de datos.')
    } else {
      setMessage(`✅ Documento subido e insertado como: ${title}`)
    }

    setUploading(false)
    setFile(null)
    setTitle('')
  }

  return (
    <form onSubmit={handleUpload} className="bg-white text-gray-800 rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Subir documento a la carpeta 2025</h2>

      <div className="mb-4">
        <label className="block font-semibold">Título del documento</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 rounded w-full"
          required
        />
      </div>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        type="submit"
        disabled={uploading}
        className="bg-[#F20CA2] text-white px-4 py-2 rounded font-semibold hover:opacity-90"
      >
        {uploading ? 'Subiendo...' : 'Subir documento'}
      </button>

      {message && <p className="mt-2 text-sm">{message}</p>}
    </form>
  )
}