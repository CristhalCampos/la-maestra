'use client'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import NavBar from '../../components/NavBar'

const PDFViewer = dynamic(() => import('../../components/PDFViewer'), { ssr: false })

const SUPABASE_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL

export default function ViewPage() {
  const searchParams = useSearchParams()
  const docPath = searchParams.get('doc')
  const fileUrl = `${SUPABASE_BASE_URL}/${docPath}`

  if (!docPath) {
    return (
      <>
        <NavBar />
        <div className="p-6 text-center text-red-600 font-medium">
          ⚠️ No se ha proporcionado ningún documento para visualizar.
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Visualizando documento</h1>
        <PDFViewer fileUrl={fileUrl} />
      </div>
    </>
  )
}