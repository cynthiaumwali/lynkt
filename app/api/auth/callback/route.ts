import { createSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function GET(request: NextRequest) {
    const { origin } = new URL(request.url)
    try {
        const { searchParams, origin } = new URL(request.url)
        const code = searchParams.get('code')

        if (!code) {
            return NextResponse.redirect(`${origin}/login`)
        }
        const supabase = await createSupabaseClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) throw error
        if (data.session) {
            const user = data.session.user
            const githubToken = data.session.provider_token

            const { error: tokenError } = await supabase.from('github_tokens').upsert({
                user_id: user.id,
                tokens: githubToken
            })
            if (tokenError) throw tokenError
        }

        return NextResponse.redirect(`${origin}/`)
    } catch (error) {
        Sentry.captureException(error)
        return NextResponse.redirect(`${origin}/auth/success`)
    }
}