'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export default function Dashboard() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    const fetchData = async () => {
      try {
        const supabase = createClient()
        
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 5000))
        
        const incidentsPromise = supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false })

        const usersPromise = supabase
          .from('users')
          .select('*')

        const [incidentsResult, usersResult] = await Promise.race([
          Promise.all([incidentsPromise, usersPromise]),
          Promise.all([timeoutPromise, timeoutPromise])
        ]) as any[]

        if (incidentsResult[0]?.data) {
          setIncidents(incidentsResult[0].data)
        } else {
          setIncidents([])
        }

        if (usersResult[1]?.data) {
          setUsers(usersResult[1].data)
        } else {
          setUsers([])
        }

        setError(null)
      } catch (err) {
        console.error(err)
        setError('Veri yüklenirken hata oluştu')
        setIncidents([])
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchData, 500)
    return () => clearTimeout(timer)
  }, [])

  const totalIncidents = incidents.length
  const pendingIncidents = incidents.filter((i) => i.status === 'pending').length
  const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length

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
    <div className="-[#030712]">
      min-h-screen bg<header className="border-b border-[#1F2937] bg-[#030712]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="hover:text-[#10B981] transition">
              <span className="text-[#10B981]">ALPAR</span>
              <span className="text-[#EF4444]">AI</span>
            </Link>
            <span className="ml-4 text-gray-400">/ Dashboard</span>
          </h1>
          <nav className="flex gap-4">
            <Link href="/" className="hover:text-[#10B981] transition">Ana Sayfa</Link>
            <Link href="/admin" className="hover:text-[#10B981] transition">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-4 bg-[#EF4444]/20 border border-[#EF4444] rounded-lg text-[#EF4444]">
            {error}
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
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      <p className="text-2xl mb-2">✅</p>
                      <p>Sistem Temiz - Henüz Olay Yok</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
