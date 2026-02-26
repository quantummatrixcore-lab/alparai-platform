'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="w-8"></div>
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img 
          src={user.user_metadata.avatar_url || 'https://via.placeholder.com/32'} 
          alt={user.email}
          className="w-8 h-8 rounded-full"
        />
        <button 
          onClick={handleSignOut}
          className="text-sm text-gray-400 hover:text-[#EF4444] transition"
        >
          Çıkış
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      className="px-4 py-2 bg-[#10B981] text-black font-bold rounded hover:shadow-[0_0_15px_#10B981] transition"
    >
      Giriş Yap
    </button>
  )
}
