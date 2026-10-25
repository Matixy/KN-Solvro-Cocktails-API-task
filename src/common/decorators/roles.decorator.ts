import { SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

// define a constant key for the roles metadata
export const ROLES_KEY = "roles";

// create a custom decorator to set roles metadata on route handlers
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);