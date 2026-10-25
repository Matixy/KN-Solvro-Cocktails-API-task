import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // import PrismaModule to use PrismaService for database interactions
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // export UsersService to be used in other modules (AuthModule)
})
export class UsersModule {}
