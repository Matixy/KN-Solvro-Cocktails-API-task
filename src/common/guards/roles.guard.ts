import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from '@prisma/client';
import { ROLES_KEY } from "../decorators/roles.decorator";
import { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // get required roles from endpoint metadata
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(), // get decorator on method level
            context.getClass(), // get decorator on class level
        ]);

        if (!requiredRoles) {
            // if no roles are required, allow access
            return true;
        }

        const { user } = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>(); // get the user from the request

        if (!user) {
            // if no user is found in the request, deny access
            return false;
        }

        // check if the users role is included in the required roles
        const hasRole = requiredRoles.some((role) => role === user.role);

        if (!hasRole) {
            // if the user does not have the required role- deny access
            return false;
        }

        // if the user has the required role- allow access
        return true;
    }
    
}