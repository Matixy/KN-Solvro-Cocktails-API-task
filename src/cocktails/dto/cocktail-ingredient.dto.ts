import { IsString, IsNotEmpty, IsUUID, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// internal dto for single cocktail ingredient
export class CocktailIngredientDto {
    // INGREDIENT ID
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'The uuid of the ingredient',
        example: '4fab6b30-a859-48d7-ae99-db8fd9c00de5'
    })

    // validation decorators
    @IsUUID('4')
    @IsNotEmpty()

    ingredientId: string;

    // AMOUNT
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'The amount of the ingredient used in the cocktail',
        example: 10
    })

    // validation decorators
    @IsNumber()
    @IsPositive()

    amount: number;

    // UNIT
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'The unit of the ingredient amount',
        example: 'ml'
    })

    // validation decorators
    @IsString()
    @IsNotEmpty()

    unit: string;
}