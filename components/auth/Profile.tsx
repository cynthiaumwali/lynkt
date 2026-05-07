'use client'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { createSupabaseClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

export default function Profile() {
    const [isPending, startTransition] = useTransition();
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const supabase = createSupabaseClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [])

    const displayName = user?.user_metadata?.full_name ||
        `${user?.user_metadata?.first_name ?? ''} ${user?.user_metadata?.last_name ?? ''}`.trim() ||
        user?.email

    const avatarUrl = user?.user_metadata?.avatar_url

    const handleLogout = async () => {
        startTransition(async () => {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            const { errorMessage } = await response.json();
            if (errorMessage) {
                toast.error(errorMessage);
            } else {
                toast.success("Logged out successfully");
                router.refresh();
                router.push("/login");
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex gap-2 items-center cursor-pointer">
                    {avatarUrl ? (
                        <Image
                            src={avatarUrl}
                            alt={displayName || 'User avatar'}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                        {displayName || 'Loading...'}
                    </span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-35" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout}>
                        {isPending ? "Logging out..." : "Sign Out"}
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}