import { PartialType } from '@nestjs/swagger';
import { CreateIngredientDto } from './create-ingredient.dto';

// partial type inherits all properties of the CreateIngredientDto as optional
export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
