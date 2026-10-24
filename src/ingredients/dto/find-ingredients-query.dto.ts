import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationQueryDto } from "../../common/pagination/dto/pagintaion-query.dto";
import { Transform, Type } from "class-transformer";

// enum for sorting ingredients attributes
export enum IngredientSortBy {
    NAME = 'name',
    ALCOHOL = 'alcohol',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export class FindIngredientsQueryDto extends PaginationQueryDto {
    //SORT BY ATTRIBUTE
    // property decorator for swagger doc
    @ApiPropertyOptional({ enum: IngredientSortBy, default: IngredientSortBy.NAME, description: "Sort by attribute for ingredients" })

    // validation decorators
    @IsEnum(IngredientSortBy)
    @IsOptional()
    
    sortBy: IngredientSortBy = IngredientSortBy.NAME; // default sort by name

    // FILTERS
    // search by name filter
    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter ingredients by name (case-insensitive)" })

    // validation decorators
    @IsString()
    @IsOptional()

    name?: string;

    // filter by alcohol content
    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter ingredients by alcohol content (true or false)" , type: Boolean})
    @Transform(({ obj, key }) => {
        if (obj[key] === 'true') return true;
        if (obj[key] === 'false') return false;
        return obj[key];
    })  // transform query param to boolean

    // validation decorators
    @IsBoolean()
    @IsOptional()

    isAlcoholic?: boolean;

    // filter by creation date
    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter ingredients created after this date (RRRR-MM-DD)" })
    @Type(() => Date) // transform query param to Date

    // validation decorators
    @IsDate()
    @IsOptional()

    createdAfter?: Date;

    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter ingredients created before this date (RRRR-MM-DD)" })
    @Type(() => Date) // transform query param to Date

    @IsDate()
    @IsOptional()

    createdBefore?: Date;

    // filter by updated date
    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter ingredients updated after this date (RRRR-MM-DD)" })
    @Type(() => Date) // transform query param to Date

    // validation decorators
    @IsDate()
    @IsOptional()

    updatedAfter?: Date;

    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter ingredients updated before this date (RRRR-MM-DD)" })
    @Type(() => Date) // transform query param to Date

    @IsDate()
    @IsOptional()

    updatedBefore?: Date;
}
