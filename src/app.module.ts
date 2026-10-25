import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { CocktailsModule } from './cocktails/cocktails.module';
import { CocktailCategoriesModule } from './cocktail-categories/cocktail-categories.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, IngredientsModule, CocktailsModule, CocktailCategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
