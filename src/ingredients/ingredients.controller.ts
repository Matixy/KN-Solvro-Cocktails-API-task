import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseIntPipe, DefaultValuePipe, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Ingredient } from './entities/ingredient.entity';
import { PaginationItem } from '../common/pagination/pagination-item.interface';
import { PaginationQueryDto } from '../common/pagination/dto/pagintaion-query.dto';

// define the API tags for the Ingredients controller in swagger doc
@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  // docs for swagger
  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The ingredient has been successfully created.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Ingredient with this name already exists.' })
  async create(@Body() createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    // call service method to create new ingredient after successful validation of  request body through the CreateIngredientDto
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  // docs for swagger
  @ApiOperation({ summary: 'Get a paginated list of ingredients' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a paginated list of ingredients.' })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginationItem<Ingredient>> {
    return this.ingredientsService.findAll(query.page, query.itemsPerPage);
  }

  @Get(':id')
  // docs for swagger
  @ApiOperation({ summary: 'Get an ingredient by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the ingredient'})
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the ingredient.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ingredient not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID format.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Ingredient> {
    return this.ingredientsService.findOne(id);
  }

  @Patch(':id')
  // docs for swagger
  @ApiOperation({ summary: 'Update an ingredient by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the ingredient'})
  @ApiResponse({ status: HttpStatus.OK, description: 'The ingredient has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ingredient not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateIngredientDto: UpdateIngredientDto
  ): Promise<Ingredient> {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // set the response status code to 204 No Content
  // docs for swagger
  @ApiOperation({ summary: 'Delete an ingredient by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the ingredient'})
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The ingredient has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ingredient not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.ingredientsService.remove(id);
  }
}
