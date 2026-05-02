import { createSupabaseClient } from '@/lib/supabase/server';
import { getErrorMessage } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { firstName, lastName, username, email, password } = await request.json();
        if (!firstName || !lastName || !username || !email || !password) {
            return NextResponse.json({ errorMessage: 'All fields are required' }, { status: 400 });
        }
        const supabase = await createSupabaseClient();
        const { error } = await supabase.auth.signUp({ email, password, 
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    username,
                }
            }
         });

        if (error) throw error;

        return NextResponse.json({ errorMessage: null }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ errorMessage: getErrorMessage(error) }, { status: 500 });
    }
}