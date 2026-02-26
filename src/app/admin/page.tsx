'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AuthButton from '@/components/AuthButton'

const DEMO_USERS = [
  { id: '1', email: 'ceo@alparai.com', role: 'ceo', created_at: new Date().toISOString(), username: 'ceo_admin' },
  { id: '2', email: 'admin@alparai.com', role: 'admin', created_at: new Date().toISOString(), username: 'admin_user' }
]
const DEMO_MODELS = [
  { id: '1', name: 'AlparAI-V1', model_type: 'Security Scanner', status: 'active', deployed_at: new Date().toISOString() }
]
const DEMO_INCIDENTS = [
  { id: '1', title: 'Demo Olay', severity: 'medium', description: 'Demo açıklama', created_at: new Date().toISOString() }
]

export default function Admin() {
  const [users, setUsers] = useState<any[]>(DEMO_USERS)
  const [aiModels, setAiModels] = useState<any[]>(DEMO_MODELS)
  const [incidents, setIncidents] = useState<any[]>(DEMO_INCIDENTS)
  const [isDemo, setIsDemo] = useState(true)

  useEffect(() => {
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

        if (usersData && usersData.length > 0) {
          setUsers(usersData)
          setIsDemo(false)
        }

        if (modelsData) setAiModels(modelsData)
        if (incidentsData) setIncidents(incidentsData)
      } catch (err) {
        console.log('Demo mode')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="border-b border-[#1F2937] bg-[#EF4444]/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-[#10B981] transition">
              <span className="text-[#10B981]">ALPAR</span>
              <span className="text-[#EF4444]">AI</span>
            </Link>
            <span className="ml-4 text-[#EF4444]">/ CEO Admin Panel</span>
          </h1>
          <nav className="flex gap-4 items-center">
            <Link href="/" className="hover:text-[#10B981] transition">Ana Sayfa</Link>
            <Link href="/dashboard" className="hover:text-[#10B981] transition">Dashboard</Link>
            <AuthButton />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isDemo && (
          <div className="mb-4 p-4 bg-[#F59E0B]/20 border border-[#F59E0B] rounded-lg text-[#F59E0B] text-sm">
            ⚠️ Demo mod
          </div>
        )}

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
