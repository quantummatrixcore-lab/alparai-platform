'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AuthButton from '@/components/AuthButton'

const DEMO_INCIDENTS = [
  { id: '1', title: 'Demo Olay 1', severity: 'medium', status: 'pending', created_at: new Date().toISOString() }
]
const DEMO_USERS = [
  { id: '1', email: 'demo@alparai.com', role: 'ceo', created_at: new Date().toISOString(), username: 'demo_admin' }
]

export default function Dashboard() {
  const [incidents, setIncidents] = useState<any[]>(DEMO_INCIDENTS)
  const [users, setUsers] = useState<any[]>(DEMO_USERS)
  const [isDemo, setIsDemo] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        const { data: incidentsData } = await supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false })

        const { data: usersData } = await supabase
          .from('users')
          .select('*')

        if (incidentsData && incidentsData.length > 0) {
          setIncidents(incidentsData)
          setIsDemo(false)
        }

        if (usersData) setUsers(usersData)
      } catch (err) {
        console.log('Demo mode')
      }
    }

    fetchData()
  }, [])

  const totalIncidents = incidents.length
  const pendingIncidents = incidents.filter((i) => i.status === 'pending').length
  const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length

  return (
    <div className="min-h-screen bg-[#030712]">
      <header className="border-b border-[#1F2937] bg-[#030712]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-[#10B981] transition">
              <span className="text-[#10B981]">ALPAR</span>
              <span className="text-[#EF4444]">AI</span>
            </Link>
            <span className="ml-4 text-gray-400">/ Dashboard</span>
          </h1>
          <nav className="flex gap-4 items-center">
            <Link href="/" className="hover:text-[#10B981] transition">Ana Sayfa</Link>
            <Link href="/admin" className="hover:text-[#10B981] transition">Admin</Link>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6">
            <p className="text-gray-400 text-sm">Toplam Olay</p>
            <p className="text-3xl font-bold text-[#10B981]">{totalIncidents}</p>
          </div>
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6">
            <p className="text-gray-400 text-sm">Bekleyen</p>
            <p className="text-3xl font-bold text-[#F59E0B]">{pendingIncidents}</p>
          </div>
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6">
            <p className="text-gray-400 text-sm">Çözülen</p>
            <p className="text-3xl font-bold text-green-400">{resolvedIncidents}</p>
          </div>
          <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-6">
            <p className="text-gray-400 text-sm">Kullanıcılar</p>
            <p className="text-3xl font-bold text-blue-400">{users.length}</p>
          </div>
        </div>

        <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#1F2937]">
            <h2 className="font-bold">Tüm Olaylar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/50">
                <tr>
                  <th className="text-left p-3 text-gray-400 font-normal">Başlık</th>
                  <th className="text-left p-3 text-gray-400 font-normal">Şiddet</th>
                  <th className="text-left p-3 text-gray-400 font-normal">Durum</th>
                  <th className="text-left p-3 text-gray-400 font-normal">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.id} className="border-t border-[#1F2937] hover:bg-white/5">
                    <td className="p-3">{incident.title}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        incident.severity === 'critical' ? 'bg-[#EF4444]/20 text-[#EF4444]' :
                        incident.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                        incident.severity === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        incident.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                        incident.status === 'pending' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400 text-sm">
                      {new Date(incident.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
