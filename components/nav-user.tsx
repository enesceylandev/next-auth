"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { signOut, useSession } from "next-auth/react";
import { EllipsisVertical, LogOut, ShieldEllipsis } from "lucide-react";
import { useState } from "react";
import { UserRole } from "@/lib/types/auth";
import { RoleChangeDialog } from "./RoleChangeDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function NavUser() {
  const { data: session, update: updateSession } = useSession();
  const isMobile = useIsMobile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!session?.user) return null;

  const user = {
    image: session.user.image || "",
    name: session.user.name || "User",
    email: session.user.email || "",
    roles: session.user.roles || [],
  };

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      await updateSession({
        ...session,
        user: {
          ...session.user,
          roles: [newRole],
        },
      });
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar>
                {user && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar>
                  {user && <AvatarImage src={user.image} alt={user.name} />}
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    Role: {user.roles.join(", ")}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={event => {
                event.preventDefault();
                setIsDialogOpen(true);
              }}
            >
              <ShieldEllipsis className="mr-2 h-4 w-4" />
              Change Role
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <RoleChangeDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          userId={session.user.id}
          currentRole={user.roles[0]}
          onRoleChange={handleRoleChange}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
