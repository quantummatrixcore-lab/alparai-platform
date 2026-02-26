'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const [message, setMessage] = useState('Doğrulanıyor...')
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        setMessage('Hata: ' + error.message)
        return
      }

      if (session) {
        setMessage('Başarılı! Yönlendiriliyorsunuz...')
        setTimeout(() => router.push('/'), 1500)
      } else {
        setMessage('Oturum bulunamadı')
      }
    }

    handleAuthCallback()
  }, [supabase, router])

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="bg-[#0B0F19] border border-[#1F2937] rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-xl font-bold text-[#10B981] mb-2">{message}</h2>
      </div>
    </div>
  )
}
