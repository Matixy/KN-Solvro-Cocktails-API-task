import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationQueryDto {
    // PAGE NUMBER
    // property decorator for swagger doc
    @ApiPropertyOptional({
        description: "Page number",
        default: 1,
        minimum: 1,
    })
    @Type(() => Number)

    // validation decorators
    @IsInt()
    @Min(1)
    @IsOptional()
    page: number = 1; // default value for page number

    // ITEMS PER PAGE
    // property decorator for swagger doc
    @ApiPropertyOptional({
        description: "Number of items per page",
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    @Type(() => Number)

    // validation decorators
    @IsInt()
    @Min(1)
    @Max(100) // provides a maximum limit for items per page to defend database from overloading
    @IsOptional()

    itemsPerPage: number = 10; // default value for items per page
}
