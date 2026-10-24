import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SafeUser, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './interfaces/auth.interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 10; // number of salt rounds for bcrypt hashing

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerDto: any): Promise<AuthResponse> {
        const { email, password } = registerDto;

        // hashing password before adding to db
        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

        const newUser = await this.usersService.create({
            email,
            password: hashedPassword,
        });

        // generate JWT token provides instant access to user after registration
        const accessToken = await this.generateJwtToken(newUser);

        return {
            access_token: accessToken,
            user: newUser,
        };
    }

    async login(loginDto: any): Promise<AuthResponse> {
        const { email, password } = loginDto;

        const user = await this.usersService.findByEmailWithPassword(email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password: _, ...safeUser } = user; // exclude password from the user object
        const accessToken = await this.generateJwtToken(user); // generate JWT token

        return {
            access_token: accessToken,
            user,
        };
    }

    private async generateJwtToken(newUser: SafeUser) {
        const payload = {
            sub: newUser.id,
            email: newUser.email,
            role: newUser.role,
        };

        return this.jwtService.signAsync(payload);
    }
}
