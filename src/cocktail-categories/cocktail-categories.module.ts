import { Module } from '@nestjs/common';
import { CocktailCategoriesService } from './cocktail-categories.service';
import { CocktailCategoriesController } from './cocktail-categories.controller';
import { PrismaModule } from '../prisma/prisma.module'; // import db module

@Module({
  imports: [PrismaModule], // import db module
  controllers: [CocktailCategoriesController],
  providers: [CocktailCategoriesService],
})
export class CocktailCategoriesModule {}
