'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Admin() {
  const [users, setUsers] = useState<any[]>([])
  const [aiModels, setAiModels] = useState<any[]>([])
  const [incidents, setIncidents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        const { data: usersData } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })

        const { data: modelsData } = await supabase
          .from('ai_models')
          .select('*')
          .order('deployed_at', { ascending: false })

        const { data: incidentsData } = await supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (mounted) {
          setUsers(usersData || [])
          setAiModels(modelsData || [])
          setIncidents(incidentsData || [])
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-neon-red animate-pulse">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-neon-red/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-neon-green transition">
              <span className="neon-text-green">ALPAR</span>
              <span className="neon-text-red">AI</span>
            </Link>
            <span className="ml-4 text-neon-red">/ CEO Admin Panel</span>
          </h1>
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-neon-green transition">Ana Sayfa</Link>
            <Link href="/dashboard" className="hover:text-neon-green transition">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-card-bg border border-neon-red/30 rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-border bg-neon-red/10">
                <h2 className="font-bold flex items-center gap-2">
                  <span>👑</span> Kullanıcı Yönetimi
                </h2>
              </div>
              <table className="w-full">
                <thead className="bg-black/50">
                  <tr>
                    <th className="text-left p-3 text-gray-400 font-normal">Kullanıcı</th>
                    <th className="text-left p-3 text-gray-400 font-normal">Rol</th>
                    <th className="text-left p-3 text-gray-400 font-normal">Katılma</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-border hover:bg-white/5">
                      <td className="p-3">
                        <p className="font-medium">{user.email}</p>
                        <p className="text-xs text-gray-500">@{user.username || 'kullanıcı yok'}</p>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          user.role === 'ceo' ? 'bg-neon-red/20 text-neon-red' :
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">Henüz kullanıcı yok</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold flex items-center gap-2">
                  <span>🤖</span> AI Modelleri
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {aiModels.map((model) => (
                  <div key={model.id} className="flex justify-between items-center p-3 bg-black/50 rounded">
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs text-gray-500">{model.model_type}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      model.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {model.status}
                    </span>
                  </div>
                ))}
                {aiModels.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Deploy edilmiş AI modeli yok</p>
                )}
                <button className="w-full py-2 border border-border rounded hover:border-neon-green transition">
                  + Yeni Model Deploy Et
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-border">
                <h2 className="font-bold flex items-center gap-2">
                  <span>📊</span> Son Olaylar
                </h2>
              </div>
              <div className="divide-y divide-border">
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-4 hover:bg-white/5">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{incident.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        incident.severity === 'critical' ? 'bg-neon-red/20 text-neon-red' :
                        incident.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{incident.description}</p>
                  </div>
                ))}
                {incidents.length === 0 && (
                  <p className="p-4 text-center text-gray-500">Olay yok</p>
                )}
              </div>
            </div>

            <div className="bg-card-bg border border-border rounded-lg p-6 mt-6">
              <h2 className="font-bold mb-4">Hızlı İşlemler</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-4 bg-neon-green/20 text-neon-green rounded hover:bg-neon-green/30 transition">
                  Rapor İndir
                </button>
                <button className="py-3 px-4 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition">
                  Uyarı Gönder
                </button>
                <button className="py-3 px-4 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition">
                  API Ayarları
                </button>
                <button className="py-3 px-4 bg-neon-red/20 text-neon-red rounded hover:bg-neon-red/30 transition">
                  Acil Durdur
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
