import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GoogleSignInButton from '@/components/GoogleSignInButton'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔖</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Smart Bookmark</h1>
          <p className="text-gray-600">Sign in to manage your bookmarks</p>
        </div>
        <GoogleSignInButton />
      </div>
    </main>
  )
}
