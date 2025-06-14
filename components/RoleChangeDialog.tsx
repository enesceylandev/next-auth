import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoleService } from "@/lib/auth/services/roleService";
import { AUTH_CONFIG } from "@/lib/config/role";
import { UserRole } from "@/lib/types/auth";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";

interface RoleChangeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentRole: UserRole;
  onRoleChange: (newRole: UserRole) => void;
}

export function RoleChangeDialog({
  isOpen,
  onOpenChange,
  userId,
  currentRole,
  onRoleChange,
}: RoleChangeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [changingRole, setChangingRole] = useState<UserRole | null>(null);

  const handleRoleChange = async (newRole: UserRole) => {
    try {
      setIsLoading(true);
      setChangingRole(newRole);
      // Changing the role in server
      const result = await RoleService.changeUserRole(userId, newRole);
      if (!result.success) {
        console.log("naber");
        throw new Error(result.message);
      }

      // Changing the role in client
      onRoleChange(newRole);

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to change role:", error);
    } finally {
      setIsLoading(false);
      setChangingRole(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>Current role:</span>
            <span
              data-testid="current-role"
              className="font-medium text-foreground"
            >
              {currentRole}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          {AUTH_CONFIG.roles.available.map(role => (
            <Button
              key={role}
              variant={role === currentRole ? "secondary" : "outline"}
              disabled={isLoading || role === currentRole}
              className="w-full justify-between"
              data-testid={`change-role-to-${role}`}
              onClick={() => handleRoleChange(role)}
            >
              <span>Switch to {role}</span>
              {isLoading && changingRole === role && (
                <LoaderIcon className="h-4 w-4 animate-spin" />
              )}
            </Button>
          ))}
        </div>
        <DialogDescription className="text-xs">
          Note: Role changes may take a few moments to take effect
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
