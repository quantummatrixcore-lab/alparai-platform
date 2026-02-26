'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function mockPiiGuardian(file: File): Promise<{ safe: boolean; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const random = Math.random()
      if (random > 0.7) {
        resolve({ 
          safe: false, 
          message: '⚠️ PII Guardian: Kişisel veri tespit edildi. Yüz/kimlik bilgileri bulanıklaştırılacak.' 
        })
      } else {
        resolve({ 
          safe: true, 
          message: '✅ PII Guardian: Hassas veri tespit edilmedi. Dosya yüklemeye hazır.' 
        })
      }
    }, 1500)
  })
}

export default function Submit() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [piiStatus, setPiiStatus] = useState<{ safe: boolean; message: string } | null>(null)
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
      setPiiStatus({ safe: false, message: '🔄 PII Guardian analiz ediyor...' })
      const result = await mockPiiGuardian(file)
      setPiiStatus(result)
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-neon-green transition">
              <span className="neon-text-green">ALPAR</span>
              <span className="neon-text-red">AI</span>
            </Link>
            <span className="ml-4 text-gray-400">/ Olay Bildir</span>
          </h1>
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-neon-green transition">Ana Sayfa</Link>
            <Link href="/dashboard" className="hover:text-neon-green transition">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card-bg border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>📢</span> Olay Bildir
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Başlık *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-border rounded focus:border-neon-green focus:outline-none"
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
                className="w-full px-4 py-2 bg-black/50 border border-border rounded focus:border-neon-green focus:outline-none"
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
                  className="w-full px-4 py-2 bg-black/50 border border-border rounded focus:border-neon-green focus:outline-none"
                  placeholder="Şehir, Ülke"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-border rounded focus:border-neon-green focus:outline-none"
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
                      className="accent-neon-green"
                    />
                    <span className={`capitalize ${
                      sev === 'critical' ? 'text-neon-red' :
                      sev === 'high' ? 'text-orange-500' :
                      sev === 'medium' ? 'text-neon-yellow' :
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
                className="w-full px-4 py-2 bg-black/50 border border-border rounded focus:border-neon-green focus:outline-none"
              />
              {piiStatus && (
                <div className={`mt-2 p-3 rounded text-sm ${
                  piiStatus.safe ? 'bg-green-500/20 text-green-400' : 'bg-neon-yellow/20 text-neon-yellow'
                }`}>
                  {piiStatus.message}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-neon-green text-black font-bold rounded hover:shadow-[0_0_20px_var(--neon-green)] transition disabled:opacity-50"
              >
                {loading ? 'Gönderiliyor...' : 'Olayı Bildir'}
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-border rounded hover:border-gray-500 transition"
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
