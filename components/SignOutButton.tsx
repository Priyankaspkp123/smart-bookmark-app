'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleSignOut}
      className="bg-white/90 backdrop-blur text-purple-600 px-6 py-3 rounded-xl hover:bg-white transition transform hover:scale-105 font-semibold shadow-lg border border-white/20"
    >
      👋 Sign Out
    </button>
  )
}
