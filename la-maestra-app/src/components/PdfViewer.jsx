'use client'

import { useState } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loadError, setLoadError] = useState(null)

  return (
    <div className="border shadow rounded p-4 bg-white">
      {loadError ? (
        <p className="text-red-600 font-semibold">{loadError}</p>
      ) : (
        <>
          <Document
            file={{ url: fileUrl }}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(err) => {
              console.error('❌ PDF load error:', err)
              setLoadError('❌ No se pudo cargar el documento.')
            }}
            loading={<p className="text-sm text-gray-500">Cargando documento...</p>}
          >
            <Page pageNumber={pageNumber} width={800} />
          </Document>

          {numPages && (
            <div className="flex justify-between items-center mt-4 text-sm">
              <button
                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                disabled={pageNumber === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                ◀ Página anterior
              </button>
              <p>Página {pageNumber} de {numPages}</p>
              <button
                onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                disabled={pageNumber === numPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              >
                Página siguiente ▶
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}