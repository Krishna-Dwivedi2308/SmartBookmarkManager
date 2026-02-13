'use client'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

export default function BookmarkList({
  bookmarks,
  onDelete,
}: {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
}) {
  if (bookmarks.length === 0) {
    return (
      <div className="rounded-xl bg-white/70 p-8 text-center text-gray-500 shadow-md backdrop-blur-md">
        No bookmarks yet. Add your first one above ✨
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Your Bookmarks</h2>

      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="flex items-center justify-between rounded-xl bg-white/70 p-5 shadow-md backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {/* Link section */}
          <div className="flex flex-col">
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium break-all text-indigo-600 hover:underline"
            >
              {b.title}
            </a>

            <span className="text-sm break-all text-gray-400">{b.url}</span>
          </div>

          {/* Delete button */}
          <button
            onClick={() => onDelete(b.id)}
            className="ml-4 rounded-lg bg-red-500 px-4 py-2 text-white shadow-sm transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
