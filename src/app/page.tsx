'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        const { data: incidentsData } = await supabase
          .from('incidents')
          .select('*, users(username, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(20)

        const { data: trendingData } = await supabase
          .from('incidents')
          .select('*')
          .order('views', { ascending: false })
          .limit(5)

        if (mounted) {
          setIncidents(incidentsData || [])
          setTrending(trendingData || [])
          setLoading(false)
        }
      } catch (err) {
        console.error('Error:', err)
        if (mounted) setLoading(false)
      }
    }

    fetchData()

    return () => { mounted = false }
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-neon-red'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-neon-yellow'
      default: return 'text-green-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-neon-green text-xl animate-pulse">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="neon-text-green">ALPAR</span>
            <span className="neon-text-red">AI</span>
          </h1>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="hover:text-neon-green transition">Dashboard</Link>
            <Link href="/admin" className="hover:text-neon-green transition">Admin</Link>
            <Link href="/submit" className="px-4 py-2 bg-neon-green text-black font-bold rounded hover:shadow-[0_0_15px_var(--neon-green)] transition">
              + Olay Bildir
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
              Canlı Akış
            </h2>
            
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-card-bg border border-border rounded-lg p-4 hover:border-neon-green/50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{incident.title}</h3>
                      <p className="text-gray-400 text-sm">@{incident.users?.username || 'Anonymous'} • {new Date(incident.created_at).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(incident.severity || 'medium')} bg-black/50`}>
                      {(incident.severity || 'medium').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{incident.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-neon-green">
                      <span>▲</span> {incident.upvotes || 0}
                    </button>
                    <button className="flex items-center gap-1 hover:text-neon-red">
                      <span>▼</span> {incident.downvotes || 0}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-400">
                      <span>↗</span> Paylaş
                    </button>
                  </div>
                </div>
              ))}
              
              {incidents.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Henüz olay bildirilmedi.</p>
                  <Link href="/submit" className="text-neon-green hover:underline">İlk bildirimi sen yap</Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-card-bg border border-border rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-red rounded-full animate-pulse"></span>
                Trend
              </h2>
              <div className="space-y-3">
                {trending.map((incident, index) => (
                  <Link key={incident.id} href="#" className="block group">
                    <div className="flex gap-3 items-center">
                      <span className="text-2xl font-bold text-gray-600 group-hover:text-neon-red transition">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium group-hover:text-neon-green transition line-clamp-1">
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

              <div className="mt-6 pt-4 border-t border-border">
                <h3 className="font-bold mb-2">Kategoriler</h3>
                <div className="flex flex-wrap gap-2">
                  {['Güvenlik', 'Gizlilik', 'Dolandırıcılık', 'Taciz', 'Yanlış Bilgi'].map((cat) => (
                    <span key={cat} className="px-2 py-1 bg-black/50 rounded text-xs cursor-pointer hover:bg-neon-green/20 transition">
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
