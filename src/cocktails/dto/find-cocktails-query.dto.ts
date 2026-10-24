import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationQueryDto } from "../../common/pagination/dto/pagintaion-query.dto";
import { IsEnum, IsOptional } from "class-validator";

export enum CocktailSortBy {
  NAME = 'name',
  CATEGORY = 'category',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export class FindCocktailsQueryDto extends PaginationQueryDto {
    // SORT BY ATTRIBUTE
    // property decorator for swagger doc
    @ApiPropertyOptional({ enum: CocktailSortBy, default: CocktailSortBy.NAME, description: "Sort by attribute for cocktails" })

    // validation decorators
    @IsEnum(CocktailSortBy)
    @IsOptional()
    
    sortBy: CocktailSortBy = CocktailSortBy.NAME; // default sort by name
}