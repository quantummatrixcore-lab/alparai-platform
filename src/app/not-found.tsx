import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#EF4444] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Sayfa Bulunamadı</h2>
        <p className="text-gray-400 mb-6">Aradığınız sayfa mevcut değil.</p>
        <Link 
          href="/"
          className="px-6 py-3 bg-[#10B981] text-black font-bold rounded hover:shadow-[0_0_20px_#10B981] transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
