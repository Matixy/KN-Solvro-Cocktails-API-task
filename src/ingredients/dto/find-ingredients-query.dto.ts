import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { PaginationQueryDto } from "../../common/pagination/dto/pagintaion-query.dto";

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
}
