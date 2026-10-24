import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationQueryDto } from "../../common/pagination/dto/pagintaion-query.dto";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { Transform, Type } from "class-transformer";

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

    // FILTERS
    // filter by name
    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter cocktails by name (case-insensitive)" })

    // validation decorators
    @IsString()
    @IsOptional()

    name?: string;

    // filter by category id
    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter cocktails by category ID" })

    // validation decorators
    @IsUUID()
    @IsOptional()

    categoryId?: string;

    // filter by category name
    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter cocktails by category name (case-insensitive)" })

    // validation decorators
    @IsString()
    @IsOptional()

    categoryName?: string;

    // filter by alcoholic ingredients
    // property decorator for swagger doc
    @ApiPropertyOptional({ description: "Filter cocktails by alcoholic ingredients (true or false)" , type: Boolean})
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