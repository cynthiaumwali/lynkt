import React from 'react'
import { Button } from '../ui/button'
import { createSupabaseClient } from '@/lib/supabase/client';
import { Github } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignInWithGithub() {
    const supabase = createSupabaseClient();
    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                scopes: 'repo',
                redirectTo: `${window.location.origin}/api/auth/callback`
            }
        });
    }
    return (
        <Button
            onClick={handleSignIn}
            variant="outline"
            className="w-full cursor-pointer"
        >
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
        </Button>
    )
}
