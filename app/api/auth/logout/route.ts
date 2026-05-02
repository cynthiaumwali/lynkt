import { createSupabaseClient } from '@/lib/supabase/server';
import { getErrorMessage } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = await createSupabaseClient();
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        return NextResponse.json({ errorMessage: null }, {status: 200});
    } catch (error) {
        return NextResponse.json({ errorMessage: getErrorMessage(error) }, {status: 500});
    }
}