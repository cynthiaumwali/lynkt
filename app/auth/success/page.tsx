'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase/client'

export default function AuthSuccess() {
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      } else {
        router.push('/login')
      }
    }
    checkSession()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-border border-t-blue-600" />
    </div>
  )
}