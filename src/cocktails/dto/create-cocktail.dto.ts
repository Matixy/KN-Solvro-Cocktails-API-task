import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, arrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID, MaxLength, ValidateNested } from "class-validator";
import { CocktailIngredientDto } from "./cocktail-ingredient.dto";
import { Type } from "class-transformer";

export class CreateCocktailDto {
    // NAME
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'The name of the cocktail',
        example: 'Mojito',
        maxLength: 100,
    })
    
    // validation decorators
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)

    name: string;

    // RECIPE
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'The recipe of the cocktail',
        example: 'Muddle mint leaves with sugar and lime juice. Add rum and top with soda water.'
    })

    // validation decorators
    @IsString()
    @IsNotEmpty()

    recipe: string;

    // CATEGORY
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'The uuid category of the cocktail',
        example: '0f8b1e85-16bb-44e7-b97b-296159635dbc'
    })

    // validation decorators
    @IsUUID('4')
    @IsNotEmpty()

    categoryId: string;

    // INGREDIENTS
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'List of ingredients with unit & ammount',
        example: [CocktailIngredientDto]
    })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true }) // validate each item in the array is instance CocktailIngredientDto
    @Type(() => CocktailIngredientDto) // transform each item in the array to instance of CocktailIngredientDto

    ingredients: CocktailIngredientDto[];
}
