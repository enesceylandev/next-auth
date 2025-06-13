import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRolesService } from "@/lib/auth/services/userRoles";
import { AUTH0_CONFIG } from "@/lib/config/auth";
import { UserRole } from "@/lib/types/auth";

const userRolesService = new UserRolesService();

export async function PUT(req: NextRequest) {
  try {
    const { userId, roleId, role } = await req.json();
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 400 }
      );
    }

    if (!role || !roleId) {
      return NextResponse.json(
        { success: false, message: "Missing role field" },
        { status: 400 }
      );
    }

    if (!AUTH0_CONFIG.roles.available.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      );
    }

    const updatedRoles = await userRolesService.changeUserRole(
      userId,
      role as UserRole
    );

    const mappedRoles = userRolesService.mapRolesToUserRoles(updatedRoles);

    return NextResponse.json({
      success: true,
      message: `Role successfully changed to ${role}`,
      newRoles: mappedRoles,
      userId: userId,
    });
  } catch (error) {
    console.error("Error in role change API:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to change role",
      },
      { status: 500 }
    );
  }
}
