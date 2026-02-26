'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState, useCallback, useRef } from 'react'

export default function Home() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetched = useRef(false)

  const fetchData = useCallback(async (pageNum: number = 0, append: boolean = false) => {
    try {
      const supabase = createClient()
      const pageSize = 10
      
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000))
      
      const fetchPromise = supabase
        .from('incidents')
        .select('*, users(username, avatar_url)')
        .order('created_at', { ascending: false })
        .range(pageNum * pageSize, (pageNum + 1) * pageSize - 1)

      const result = await Promise.race([fetchPromise, timeoutPromise]) as any
      
      if (result?.data) {
        if (append) {
          setIncidents(prev => [...prev, ...result.data])
        } else {
          setIncidents(result.data)
        }
        setHasMore(result.data.length === pageSize)
      } else {
        if (!append) setIncidents([])
        setHasMore(false)
      }

      const trendingResult = await supabase
        .from('incidents')
        .select('*')
        .order('views', { ascending: false })
        .limit(5)
      
      if (trendingResult?.data) {
        setTrending(trendingResult.data)
      }
      
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Veri yüklenirken hata oluştu')
      if (!append) setIncidents([])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    
    const timer = setTimeout(() => {
      fetchData(0, false)
    }, 500)

    return () => clearTimeout(timer)
  }, [fetchData])

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    fetchData(nextPage, true)
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#10B981] text-lg animate-pulse">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="border-b border-[#1F2937] sticky top-0 bg-[#030712]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-[#10B981]">ALPAR</span>
            <span className="text-[#EF4444]">AI</span>
          </h1>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="hover:text-[#10B981] transition">Dashboard</Link>
            <Link href="/admin" className="hover:text-[#10B981] transition">Admin</Link>
            <Link href="/submit" className="px-4 py-2 bg-[#10B981] text-black font-bold rounded hover:shadow-[0_0_15px_#10B981] transition">
              + Olay Bildir
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-[#EF4444]/20 border border-[#EF4444] rounded-lg text-[#EF4444]">
            {error}
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

              {hasMore && incidents.length > 0 && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full py-3 border border-[#1F2937] rounded hover:border-[#10B981] transition disabled:opacity-50"
                >
                  {loadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                </button>
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
