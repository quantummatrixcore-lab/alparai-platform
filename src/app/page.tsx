'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AuthButton from '@/components/AuthButton'

const DEMO_INCIDENTS = [
  {
    id: '1',
    title: 'Demo Olay - Sistem Test',
    description: 'Bu bir demo olaydır. Gerçek veriler yüklenene kadar burada görünecektir.',
    severity: 'medium',
    created_at: new Date().toISOString(),
    upvotes: 5,
    downvotes: 0,
    users: { username: 'demo_user' }
  }
]

export default function Home() {
  const [incidents, setIncidents] = useState<any[]>(DEMO_INCIDENTS)
  const [trending, setTrending] = useState<any[]>([])
  const [isDemo, setIsDemo] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        const { data: incidentsData } = await supabase
          .from('incidents')
          .select('*, users(username, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(20)

        if (incidentsData && incidentsData.length > 0) {
          setIncidents(incidentsData)
          setIsDemo(false)
        }

        const { data: trendingData } = await supabase
          .from('incidents')
          .select('*')
          .order('views', { ascending: false })
          .limit(5)

        if (trendingData) setTrending(trendingData)
      } catch (err) {
        console.log('Demo mode - using cached data')
      }
    }

    fetchData()
  }, [])

  const handleShare = (platform: string, title: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = `AlparAI'da yeni olay: ${title}`
    
    if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-[#EF4444]'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-[#F59E0B]'
      default: return 'text-green-400'
    }
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="border-b border-[#1F2937] sticky top-0 bg-[#030712]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-[#10B981]">ALPAR</span>
            <span className="text-[#EF4444]">AI</span>
          </h1>
          <nav className="flex gap-4 items-center">
            <Link href="/dashboard" className="hover:text-[#10B981] transition">Dashboard</Link>
            <Link href="/admin" className="hover:text-[#10B981] transition">Admin</Link>
            <Link href="/submit" className="px-4 py-2 bg-[#10B981] text-black font-bold rounded hover:shadow-[0_0_15px_#10B981] transition">
              + Olay Bildir
            </Link>
            <AuthButton />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isDemo && (
          <div className="mb-4 p-4 bg-[#F59E0B]/20 border border-[#F59E0B] rounded-lg text-[#F59E0B] text-sm">
            ⚠️ Demo mod - Supabase bağlantısı kurulamadı
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
              Canlı Akış
            </h2>
            
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-4 hover:border-[#10B981]/50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{incident.title}</h3>
                      <p className="text-gray-400 text-sm">@{incident.users?.username || 'Anonim'} • {new Date(incident.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(incident.severity || 'medium')} bg-black/50`}>
                      {(incident.severity || 'medium').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{incident.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-[#10B981]">
                      <span>▲</span> {incident.upvotes || 0}
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#EF4444]">
                      <span>▼</span> {incident.downvotes || 0}
                    </button>
                    <button onClick={() => handleShare('x', incident.title)} className="flex items-center gap-1 hover:text-[#10B981]">
                      <span>X</span>
                    </button>
                    <button onClick={() => handleShare('linkedin', incident.title)} className="flex items-center gap-1 hover:text-blue-400">
                      <span>in</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {incidents.length === 0 && (
                <div className="text-center py-12 bg-[#0B0F19] border border-[#1F2937] rounded-lg">
                  <p className="text-4xl mb-4">✅</p>
                  <p className="text-gray-400">Sistem Temiz - Henüz Olay Bildirilmedi</p>
                  <Link href="/submit" className="text-[#10B981] hover:underline block mt-2">İlk bildirimi sen yap</Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></span>
                Trend
              </h2>
              <div className="space-y-3">
                {trending.map((incident, index) => (
                  <Link key={incident.id} href="#" className="block group">
                    <div className="flex gap-3 items-center">
                      <span className="text-2xl font-bold text-gray-600 group-hover:text-[#EF4444] transition">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium group-hover:text-[#10B981] transition line-clamp-1">
                          {incident.title}
                        </p>
                        <p className="text-xs text-gray-500">{incident.views || 0} görüntüleme</p>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {trending.length === 0 && (
                  <p className="text-gray-500 text-sm">Trend olay yok</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#1F2937]">
                <h3 className="font-bold mb-2">Kategoriler</h3>
                <div className="flex flex-wrap gap-2">
                  {['Güvenlik', 'Gizlilik', 'Dolandırıcılık', 'Taciz', 'Yanlış Bilgi'].map((cat) => (
                    <span key={cat} className="px-2 py-1 bg-black/50 rounded text-xs cursor-pointer hover:bg-[#10B981]/20 transition">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
