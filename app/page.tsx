import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookmarkList from '@/components/BookmarkList'
import SignOutButton from '@/components/SignOutButton'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">✨ My Bookmarks</h1>
            <p className="text-white/90 text-sm">Save and organize your favorite links</p>
          </div>
          <SignOutButton />
        </div>
        <BookmarkList userId={user.id} />
      </div>
    </main>
  )
}
