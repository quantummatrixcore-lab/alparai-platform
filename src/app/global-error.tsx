'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="bg-[#0B0F19] border border-[#EF4444] rounded-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-[#EF4444] mb-2">Sistem Hatası</h2>
        <p className="text-gray-400 mb-6">Bir şeyler ters gitti. Lütfen tekrar deneyin.</p>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#10B981] text-black font-bold rounded hover:shadow-[0_0_20px_#10B981] transition"
        >
          Yeniden Dene
        </button>
      </div>
    </div>
  )
}
