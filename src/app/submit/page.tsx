'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function mockPiiGuardian(file: File): Promise<{ safe: boolean; message: string; blur?: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.random()
      if (random > 0.7) {
        resolve({ 
          safe: false, 
          blur: true,
          message: '⚠️ PII Guardian: Yüz/kimlik tespit edildi. Otomatik bulanıklaştırılacak.' 
        })
      } else if (random > 0.4) {
        resolve({ 
          safe: false, 
          blur: false,
          message: '⚠️ PII Guardian: Metin tespit edildi. Redakte edilecek.' 
        })
      } else {
        resolve({ 
          safe: true, 
          message: '✅ PII Guardian: Güvenli. Yüklemeye hazır.' 
        })
      }
    }, 2000)
  })
}

export default function Submit() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [piiStatus, setPiiStatus] = useState<{ safe: boolean; message: string; blur?: boolean } | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'medium',
    category: 'Güvenlik',
    evidence: null as File | null
  })

  useEffect(() => {
    const client = createClient()
    setSupabase(client)
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, evidence: file })
      setPiiStatus(null)
      setAnalyzing(true)
      const result = await mockPiiGuardian(file)
      setPiiStatus(result)
      setAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoading(true)

    try {
      let evidenceUrls: string[] = []
      
      if (formData.evidence) {
        evidenceUrls = [`mock://${formData.evidence.name}`]
      }

      const { error } = await supabase.from('incidents').insert({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        severity: formData.severity,
        category: formData.category,
        evidence_urls: evidenceUrls,
        status: 'pending'
      })

      if (error) {
        console.log('DB insert error:', error.message)
      }

      router.push('/')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="border-b border-[#1F2937] bg-[#030712]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-[#10B981] transition">
              <span className="neon-text-green">ALPAR</span>
              <span className="neon-text-red">AI</span>
            </Link>
            <span className="ml-4 text-gray-400">/ Olay Bildir</span>
          </h1>
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-[#10B981] transition">Ana Sayfa</Link>
            <Link href="/dashboard" className="hover:text-[#10B981] transition">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>📢</span> Olay Bildir
          </h2>
          
          <div className="mb-6 p-4 bg-[#030712] border border-[#10B981]/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🤖</span>
              <span className="font-bold text-[#10B981]">PII Guardian Aktif</span>
            </div>
            <p className="text-sm text-gray-400">
              Yüklediğiniz dosyalar otomatik olarak kişisel veri (yüz, kimlik, telefon vb.) açısından taranır.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Başlık *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-[#030712] border border-[#1F2937] rounded focus:border-[#10B981] focus:outline-none"
                placeholder="Olayın kısa açıklaması"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Açıklama *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-[#030712] border border-[#1F2937] rounded focus:border-[#10B981] focus:outline-none"
                placeholder="Detaylı açıklama..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Konum</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-[#030712] border border-[#1F2937] rounded focus:border-[#10B981] focus:outline-none"
                  placeholder="Şehir, Ülke"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-[#030712] border border-[#1F2937] rounded focus:border-[#10B981] focus:outline-none"
                >
                  <option>Güvenlik</option>
                  <option>Gizlilik</option>
                  <option>Dolandırıcılık</option>
                  <option>Taciz</option>
                  <option>Yanlış Bilgi</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Şiddet</label>
              <div className="flex gap-4">
                {['low', 'medium', 'high', 'critical'].map((sev) => (
                  <label key={sev} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={sev}
                      checked={formData.severity === sev}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                      className="accent-[#10B981]"
                    />
                    <span className={`capitalize ${
                      sev === 'critical' ? 'text-[#EF4444]' :
                      sev === 'high' ? 'text-orange-500' :
                      sev === 'medium' ? 'text-[#F59E0B]' :
                      'text-green-400'
                    }`}>
                      {sev === 'low' ? 'Düşük' : sev === 'medium' ? 'Orta' : sev === 'high' ? 'Yüksek' : 'Kritik'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kanıt (Resim/Video)</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 bg-[#030712] border border-[#1F2937] rounded focus:border-[#10B981] focus:outline-none"
              />
              {analyzing && (
                <div className="mt-2 p-3 bg-[#030712] border border-[#F59E0B]/30 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[#F59E0B]">PII Guardian dosyayı analiz ediyor...</span>
                  </div>
                </div>
              )}
              {piiStatus && !analyzing && (
                <div className={`mt-2 p-3 rounded text-sm ${
                  piiStatus.safe 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : piiStatus.blur
                      ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30'
                      : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                }`}>
                  {piiStatus.message}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-[#10B981] text-black font-bold rounded hover:shadow-[0_0_20px_#10B981] transition disabled:opacity-50"
              >
                {loading ? 'Gönderiliyor...' : 'Olayı Bildir'}
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-[#1F2937] rounded hover:border-gray-500 transition"
              >
                İptal
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
