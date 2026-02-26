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
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#EF4444] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#EF4444] text-lg animate-pulse">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="border-b border-[#1F2937] bg-[#EF4444]/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-[#10B981] transition">
              <span className="neon-text-green">ALPAR</span>
              <span className="neon-text-red">AI</span>
            </Link>
            <span className="ml-4 text-[#EF4444]">/ CEO Admin Panel</span>
          </h1>
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-[#10B981] transition">Ana Sayfa</Link>
            <Link href="/dashboard" className="hover:text-[#10B981] transition">Dashboard</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-[#0B0F19] border border-[#EF4444]/30 rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-[#1F2937] bg-[#EF4444]/10">
                <h2 className="font-bold flex items-center gap-2">
                  <span>👑</span> Kullanıcı Yönetimi
                </h2>
              </div>
              <div className="overflow-x-auto">
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
                      <tr key={user.id} className="border-t border-[#1F2937] hover:bg-white/5">
                        <td className="p-3">
                          <p className="font-medium">{user.email}</p>
                          <p className="text-xs text-gray-500">@{user.username || 'kullanıcı yok'}</p>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            user.role === 'ceo' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
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
            </div>

            <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-[#1F2937]">
                <h2 className="font-bold flex items-center gap-2">
                  <span>🤖</span> AI Modelleri
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {aiModels.map((model) => (
                  <div key={model.id} className="flex justify-between items-center p-3 bg-[#030712] rounded">
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
                <button className="w-full py-2 border border-[#1F2937] rounded hover:border-[#10B981] transition">
                  + Yeni Model Deploy Et
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg overflow-hidden">
              <div className="p-4 border-b border-[#1F2937]">
                <h2 className="font-bold flex items-center gap-2">
                  <span>📊</span> Son Olaylar
                </h2>
              </div>
              <div className="divide-y divide-[#1F2937]">
                {incidents.map((incident) => (
                  <div key={incident.id} className="p-4 hover:bg-white/5">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{incident.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        incident.severity === 'critical' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
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

            <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6 mt-6">
              <h2 className="font-bold mb-4">Hızlı İşlemler</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="py-3 px-4 bg-[#10B981]/20 text-[#10B981] rounded hover:bg-[#10B981]/30 transition">
                  Rapor İndir
                </button>
                <button className="py-3 px-4 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition">
                  Uyarı Gönder
                </button>
                <button className="py-3 px-4 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition">
                  API Ayarları
                </button>
                <button className="py-3 px-4 bg-[#EF4444]/20 text-[#EF4444] rounded hover:bg-[#EF4444]/30 transition">
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
