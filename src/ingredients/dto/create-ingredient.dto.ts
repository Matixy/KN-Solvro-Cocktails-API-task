import { IsString, IsNotEmpty, IsBoolean, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateIngredientDto {
    // NAME
    // propety decorator for swagger doc
    @ApiProperty({ 
        description: 'The name of the ingredient',
        example: 'Fresh Mint',
        maxLength: 100,
    })

    // validation decorators
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)

    name: string;

    // DESCRIPTION
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'The description of the ingredient',
        example: 'Green mint leaves',
    })

    // validation decorators
    @IsString()
    @IsNotEmpty()

    description: string;

    // ALCOHOL
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'Whether the ingredient is alcoholic or not',
        example: false,
    })

    // validation decorators
    @IsBoolean()
    @IsNotEmpty()

    alcohol: boolean;

    // PHOTO URL
    // propety decorator for swagger doc
    @ApiProperty({
        description: 'The URL of the ingredient photo',
        example: 'https://example.com/photos/fresh-mint.jpg',
        maxLength: 255,
    })

    // validation decorators
    @IsNotEmpty()
    @IsUrl()
    @MaxLength(255)
    
    photoUrl: string;
}
