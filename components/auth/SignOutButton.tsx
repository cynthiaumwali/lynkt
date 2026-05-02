import React, { useTransition } from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SignOutButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const handleSignOut = async () => {
        startTransition(async () => {
            const response = await fetch("/api/auth/signout", { method: "POST" });
            const { errorMessage } = await response.json();
            if (errorMessage) {
                toast.error(errorMessage);
            }
            router.push("/login");
            toast.success("Logged out successfully!");
        })
    }
    return (
        <Button variant="outline" onClick={handleSignOut} disabled={isPending}>
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) :
                "Sign Out"
            }
        </Button>
    )
}
