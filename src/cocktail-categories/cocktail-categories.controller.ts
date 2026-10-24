import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { CocktailCategoriesService } from './cocktail-categories.service';
import { CreateCocktailCategoryDto } from './dto/create-cocktail-category.dto';
import { UpdateCocktailCategoryDto } from './dto/update-cocktail-category.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CocktailCategory } from '@prisma/client';
import { PaginationQueryDto } from '../common/pagination/dto/pagintaion-query.dto';
import { PaginationItem } from '../common/pagination/pagination-item.interface';

// define the API tags for the Cocktail Categories controller in swagger doc
@ApiTags('Cocktail Categories')
@Controller('cocktail-categories')
export class CocktailCategoriesController {
  constructor(private readonly cocktailCategoriesService: CocktailCategoriesService) {}

  @Post()
  // docs for swagger
  @ApiOperation({ summary: 'Create a new cocktail category' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The cocktail category has been successfully created.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Cocktail category with this name already exists.' })
  async create(@Body() createCocktailCategoryDto: CreateCocktailCategoryDto): Promise<CocktailCategory> {
	// call service method to create new cocktail category after successful validation of request body through the CreateCocktailCategoryDto
    return this.cocktailCategoriesService.create(createCocktailCategoryDto);
  }

  @Get()
  // docs for swagger
  @ApiOperation({ summary: 'Get a paginated list of cocktail categories' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a paginated list of cocktail categories.' })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginationItem<CocktailCategory>> {
	return this.cocktailCategoriesService.findAll(query.page, query.itemsPerPage);
  }

  @Get(':id')
  // docs for swagger
  @ApiOperation({ summary: 'Get a cocktail category by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cocktail category' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the cocktail category.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No cocktail category found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid id format.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CocktailCategory> {
    return this.cocktailCategoriesService.findOne(id);
  }

  @Patch(':id')
  // docs for swagger
  @ApiOperation({ summary: 'Update a cocktail category by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cocktail category' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The cocktail category has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No cocktail category found.' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCocktailCategoryDto: UpdateCocktailCategoryDto): Promise<CocktailCategory> {
    return this.cocktailCategoriesService.update(id, updateCocktailCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // set the response status code to 204 No Content
  // docs for swagger
  @ApiOperation({ summary: 'Delete a cocktail category by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cocktail category' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The cocktail category has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No cocktail category found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.cocktailCategoriesService.remove(id);
  }
}
