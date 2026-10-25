import { Role } from "@prisma/client";
import { SafeUser } from "../../users/users.service";

// structure inside JWT token payload
export interface JWTPayload {
    sub: string; // user id
    email: string; // user email
    role: Role; // user role
}

// structure of the response returned after successful login/registration
export interface AuthResponse {
    accessToken: string; // JWT token
    user: SafeUser; // user object without password
}