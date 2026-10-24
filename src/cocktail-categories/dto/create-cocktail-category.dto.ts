import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCocktailCategoryDto {
    // NAME
    // propety decorator for swagger doc
    @ApiProperty({ 
        description: 'The name of the cocktail category',
        example: 'Classic',
        maxLength: 100,
    })

    // validation decorators
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)

    name: string;
}
