'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

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

        if (mounted) {
          setIncidents(incidentsData || [])
          setUsers(usersData || [])
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

  const totalIncidents = incidents.length
  const pendingIncidents = incidents.filter((i) => i.status === 'pending').length
  const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-neon-green animate-pulse">Yükleniyor...</div>
      </div>
    )
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
            <span className="ml-4 text-gray-400">/ Dashboard</span>
          </h1>
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-neon-green transition">Ana Sayfa</Link>
            <Link href="/admin" className="hover:text-neon-green transition">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card-bg border border-border rounded-lg p-6">
            <p className="text-gray-400 text-sm">Toplam Olay</p>
            <p className="text-3xl font-bold neon-text-green">{totalIncidents}</p>
          </div>
          <div className="bg-card-bg border border-border rounded-lg p-6">
            <p className="text-gray-400 text-sm">Bekleyen</p>
            <p className="text-3xl font-bold text-neon-yellow">{pendingIncidents}</p>
          </div>
          <div className="bg-card-bg border border-border rounded-lg p-6">
            <p className="text-gray-400 text-sm">Çözülen</p>
            <p className="text-3xl font-bold text-green-400">{resolvedIncidents}</p>
          </div>
          <div className="bg-card-bg border border-border rounded-lg p-6">
            <p className="text-gray-400 text-sm">Kullanıcılar</p>
            <p className="text-3xl font-bold text-blue-400">{users.length}</p>
          </div>
        </div>

        <div className="bg-card-bg border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold">Tüm Olaylar</h2>
          </div>
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
                <tr key={incident.id} className="border-t border-border hover:bg-white/5">
                  <td className="p-3">{incident.title}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      incident.severity === 'critical' ? 'bg-neon-red/20 text-neon-red' :
                      incident.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                      incident.severity === 'medium' ? 'bg-neon-yellow/20 text-neon-yellow' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      incident.status === 'resolved' ? 'bg-green-500/20 text-green-400' :
                      incident.status === 'pending' ? 'bg-neon-yellow/20 text-neon-yellow' :
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
              {incidents.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">Henüz olay yok</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
