import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    // EMAIL
    // property decorator for swagger doc
    @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })

    // validation decorators
    @IsEmail()
    @IsNotEmpty()

    email: string;

    // PASSWORD
    // property decorator for swagger doc
    @ApiProperty({ example: 'strongPassword123', description: 'The password of the user' })

    // validation decorators
    @IsString()
    @IsNotEmpty()

    password: string;
}