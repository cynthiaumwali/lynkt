import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export default function Profile() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
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
                <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-300" />
                    <span className="text-sm font-medium text-gray-900">John Doe</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-35" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleLogout}>
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


