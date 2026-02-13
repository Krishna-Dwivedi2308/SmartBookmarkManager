'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import BookmarkForm from '@/components/BookmarkForm'
import BookmarkList from '@/components/BookmarkList'

type Bookmark = {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string
}

export default function Dashboard() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  // Load authenticated user
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    loadUser()
  }, [supabase])

  // Fetch bookmarks
  const fetchBookmarks = useCallback(async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    setBookmarks(data || [])
  }, [supabase])

  // Initial fetch
  useEffect(() => {
    if (user) fetchBookmarks()
  }, [user, fetchBookmarks])

  // Realtime subscription
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        fetchBookmarks
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchBookmarks, supabase])

  // Delete bookmark
  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    fetchBookmarks()
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-lg text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6 py-10">
      <div className="w-full max-w-4xl space-y-8 rounded-2xl bg-white/90 p-8 shadow-2xl backdrop-blur-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
            <p className="text-gray-500">Welcome back, {user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-5 py-2 text-white shadow-sm transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <BookmarkForm user={user} onAdded={fetchBookmarks} />
          <BookmarkList bookmarks={bookmarks} onDelete={deleteBookmark} />
        </div>
      </div>
    </div>
  )
}
