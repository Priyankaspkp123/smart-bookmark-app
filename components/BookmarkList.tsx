'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AddBookmarkForm from './AddBookmarkForm'

type Bookmark = {
  id: string
  url: string
  title: string
  created_at: string
}

export default function BookmarkList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchBookmarks()

    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setBookmarks(data)
    setLoading(false)
  }

  const deleteBookmark = async (id: string) => {
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' })
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div>
      <AddBookmarkForm onBookmarkAdded={fetchBookmarks} />
      
      <div className="mt-8 space-y-4">
        {bookmarks.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-12 text-center shadow-xl border border-white/20">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600 text-lg">No bookmarks yet. Add your first one above!</p>
          </div>
        ) : (
          bookmarks.map((bookmark, index) => {
            const colors = [
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-pink-500',
              'from-orange-500 to-red-500',
              'from-green-500 to-teal-500',
              'from-indigo-500 to-purple-500',
            ]
            const colorClass = colors[index % colors.length]
            
            return (
              <div
                key={bookmark.id}
                className="bg-white/95 backdrop-blur p-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-[1.02] flex justify-between items-start border border-white/20"
              >
                <div className="flex-1">
                  <div className={`inline-block bg-gradient-to-r ${colorClass} text-white px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
                    🔖 Bookmark
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{bookmark.title}</h3>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-pink-600 hover:underline text-sm break-all font-medium"
                  >
                    🌐 {bookmark.url}
                  </a>
                </div>
                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition transform hover:scale-110 font-semibold shadow-lg"
                >
                  🗑️ Delete
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
