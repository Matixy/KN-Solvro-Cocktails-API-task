import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseUUIDPipe, HttpCode } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cocktail } from '@prisma/client';
import { PaginationItem } from '../common/pagination/pagination-item.interface';
import { PaginationQueryDto } from '../common/pagination/dto/pagintaion-query.dto';

// define the API tags for the Cocktails controller in swagger doc
@ApiTags('Cocktails')
@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Post()
  // docs for swagger
  @ApiOperation({ summary: 'Create a new cocktail' })
  @ApiResponse({ status: HttpStatus.CREATED , description: 'The cocktail has been successfully created.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Cocktail with this name already exists.' })
  async create(@Body() createCocktailDto: CreateCocktailDto): Promise<Cocktail> {
    // call service method to create new cocktail after successful validation through the CreateCocktailDto
    return this.cocktailsService.create(createCocktailDto);
  }

  @Get()
  // docs for swagger
  @ApiOperation({ summary: 'Get a paginated list of cocktails' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a paginated list of cocktails.' })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginationItem<Cocktail>> {
    return this.cocktailsService.findAll(query.page, query.itemsPerPage);
  }

  @Get(':id')
  // docs for swagger
  @ApiOperation({ summary: 'Get a cocktail by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cocktail'})
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns the cocktail.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cocktail not found.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid ID format.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Cocktail> {
    return this.cocktailsService.findOne(id);
  }

  @Patch(':id')
  // docs for swagger
  @ApiOperation({ summary: 'Update a cocktail by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cocktail'})
  @ApiResponse({ status: HttpStatus.OK, description: 'The cocktail has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cocktail not found.' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCocktailDto: UpdateCocktailDto): Promise<Cocktail> {
    return this.cocktailsService.update(id, updateCocktailDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // set the response status code to 204 No Content
  // docs for swagger
  @ApiOperation({ summary: 'Delete a cocktail by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cocktail'})
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The cocktail has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cocktail not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.cocktailsService.remove(id);
  }
}
