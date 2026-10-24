import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength, Min, MinLength } from "class-validator";

export class RegisterDto {
    // EMAIL
    // property decorator for swagger doc
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })

    // validation decorators
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)

    email: string;

    // PASSWORD
    // property decorator for swagger doc
    @ApiProperty({ example: 'strongPassword123', description: 'The password of the user', minLength: 8 })

    // validation decorators
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @MinLength(8)

    password: string;
}