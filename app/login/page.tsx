'use client'

import { createClient } from '@/lib/supabase-browser'

export default function Login() {
  const supabase = createClient()

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6">
      {/* Glass card */}
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/90 p-10 text-center shadow-2xl backdrop-blur-lg">
        {/* Logo / Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Smart Bookmark</h1>
          <p className="text-gray-500">
            Save and sync your favorite links in real time
          </p>
        </div>

        {/* Login button */}
        <button
          onClick={login}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-5 py-3 shadow-sm transition hover:bg-gray-50"
        >
          {/* Google icon */}
          <svg className="h-5 w-5" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.9-6.9C35.98 2.36 30.4 0 24 0 14.64 0 6.48 5.48 2.52 13.44l8.02 6.22C12.44 13.3 17.76 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.14 24.5c0-1.66-.14-3.26-.42-4.8H24v9.1h12.42c-.54 2.92-2.18 5.4-4.66 7.08l7.22 5.6c4.22-3.88 6.66-9.6 6.66-16.98z"
            />
            <path
              fill="#FBBC05"
              d="M10.54 28.66a14.5 14.5 0 010-9.32l-8.02-6.22A24 24 0 000 24c0 3.88.94 7.56 2.52 10.88l8.02-6.22z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.4 0 11.78-2.12 15.7-5.76l-7.22-5.6c-2.02 1.36-4.6 2.16-8.48 2.16-6.24 0-11.56-3.8-13.46-9.16l-8.02 6.22C6.48 42.52 14.64 48 24 48z"
            />
          </svg>

          <span className="font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-400">
          Secure login powered by Google OAuth
        </p>
      </div>
    </div>
  )
}
