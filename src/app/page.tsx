'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        const { data: incidentsData, error: incidentsError } = await supabase
          .from('incidents')
          .select('*, users(username, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(20)

        if (incidentsError) {
          console.error('Incidents error:', incidentsError)
        }

        const { data: trendingData, error: trendingError } = await supabase
          .from('incidents')
          .select('*')
          .order('views', { ascending: false })
          .limit(5)

        if (trendingError) {
          console.error('Trending error:', trendingError)
        }

        setIncidents(incidentsData || [])
        setTrending(trendingData || [])
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
        <div className="text-neon-green text-xl animate-pulse">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-neon-red text-xl">Error: {error}</div>
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
              + Submit Incident
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
              Live Feed
            </h2>
            
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="bg-card-bg border border-border rounded-lg p-4 hover:border-neon-green/50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{incident.title}</h3>
                      <p className="text-gray-400 text-sm">by @{incident.users?.username || 'Anonymous'} • {new Date(incident.created_at).toLocaleDateString()}</p>
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
                      <span>↗</span> Share
                    </button>
                  </div>
                </div>
              ))}
              
              {incidents.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No incidents reported yet.</p>
                  <Link href="/submit" className="text-neon-green hover:underline">Be the first to report</Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-card-bg border border-border rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-red rounded-full animate-pulse"></span>
                Trending
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
                        <p className="text-xs text-gray-500">{incident.views || 0} views</p>
                      </div>
                    </div>
                  </Link>
                ))}
                
                {trending.length === 0 && (
                  <p className="text-gray-500 text-sm">No trending incidents</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <h3 className="font-bold mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Security', 'Privacy', 'Fraud', 'Harassment', 'Misinformation'].map((cat) => (
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
