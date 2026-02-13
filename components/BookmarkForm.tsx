'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function BookmarkForm({ user, onAdded }: any) {
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const addBookmark = async () => {
    setError('')

    if (!title.trim() || !url.trim()) {
      setError('Fields cannot be empty')
      return
    }

    await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    setTitle('')
    setUrl('')

    await onAdded()
  }

  return (
    <div className="space-y-4 rounded-xl bg-white/70 p-6 shadow-md backdrop-blur-md">
      <h2 className="text-lg font-semibold text-gray-800">Add Bookmark</h2>

      <div className="space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-black transition focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-black transition focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <button
        onClick={addBookmark}
        className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-medium text-white shadow-sm transition hover:opacity-90"
      >
        Add Bookmark
      </button>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </div>
  )
}
