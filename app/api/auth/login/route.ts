import { createSupabaseClient } from '@/lib/supabase/server';
import { getErrorMessage } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ errorMessage: 'Email and password are required' }, { status: 400 });
        }
        const supabase = await createSupabaseClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;

        return NextResponse.json({ errorMessage: null }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ errorMessage: getErrorMessage(error) }, { status: 500 });
    }
}