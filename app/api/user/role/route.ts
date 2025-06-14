import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UserRolesService } from "@/lib/auth/services/userRoles";

const userRolesService = new UserRolesService();

export async function PUT(req: NextRequest) {
  try {
    const { userId, roleId } = await req.json();
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

    if (!roleId) {
      return NextResponse.json(
        { success: false, message: "Missing role field" },
        { status: 400 }
      );
    }

    const updatedRoles = await userRolesService.changeUserRole(userId, roleId);

    const mappedRoles = userRolesService.mapRolesToUserRoles(updatedRoles);

    return NextResponse.json({
      success: true,
      message: `Role successfully changed.`,
      newRoles: mappedRoles,
      userId: userId,
    });
  } catch (error) {
    console.error("Error in role change API:", error);

    const errorMessage =
      error instanceof Error
        ? `${error.message}\n${error.stack}`
        : "Failed to change role";

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
