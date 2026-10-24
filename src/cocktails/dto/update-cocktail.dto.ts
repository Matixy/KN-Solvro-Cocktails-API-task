import { PartialType } from '@nestjs/swagger';
import { CreateCocktailDto } from './create-cocktail.dto';

// partial type inherits all properties of the CreateCocktailDto as optional
export class UpdateCocktailDto extends PartialType(CreateCocktailDto) {}
