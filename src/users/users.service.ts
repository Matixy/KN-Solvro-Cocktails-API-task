import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// define typescript type for safe user object that excludes the password field
export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // internal method for auth module for creating user
  async create(data: Prisma.UserCreateInput): Promise<SafeUser> {
    try {
      const user = await this.prisma.user.create({
        data,
      });

      return this.excludePassword(user);
    } catch (error) {
      // handle unique constraint violation error (P2002) for user email
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`User with email '${data.email}' already exists.`);
      }

      // rethrow other errors
      throw error;
    }
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(id: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return this.excludePassword(user);
  }

  // helper methods
  private excludePassword(user: User): SafeUser {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
