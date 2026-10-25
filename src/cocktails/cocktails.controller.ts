import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ParseUUIDPipe, HttpCode, UseGuards } from '@nestjs/common';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { UpdateCocktailDto } from './dto/update-cocktail.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cocktail } from '@prisma/client';
import { PaginationItem } from '../common/pagination/pagination-item.interface';
import { FindCocktailsQueryDto } from './dto/find-cocktails-query.dto';
import { JWTAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';

// define the API tags for the Cocktails controller in swagger doc
@ApiTags('Cocktails')
@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Post()
  @UseGuards(JWTAuthGuard) // protect the route with JWT auth guard
  // docs for swagger
  @ApiBearerAuth() // add bearer auth to swagger doc for this route
  @ApiOperation({ summary: 'Create a new cocktail' })
  @ApiResponse({ status: HttpStatus.CREATED , description: 'The cocktail has been successfully created.' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Cocktail with this name already exists.' })
  async create(@Body() createCocktailDto: CreateCocktailDto, @CurrentUser() user: AuthenticatedUser): Promise<Cocktail> {
    // call service method to create new cocktail after successful validation through the CreateCocktailDto
    return this.cocktailsService.create(createCocktailDto, user);
  }

  @Get()
  // docs for swagger
  @ApiOperation({ summary: 'Get a paginated list of cocktails' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a paginated list of cocktails.' })
  async findAll(@Query() query: FindCocktailsQueryDto): Promise<PaginationItem<Cocktail>> {
    return this.cocktailsService.findAll(query);
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
  @UseGuards(JWTAuthGuard) // protect the route with JWT auth guard
  // docs for swagger
  @ApiBearerAuth() // add bearer auth to swagger doc for this route
  @ApiOperation({ summary: 'Update a cocktail by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cocktail'})
  @ApiResponse({ status: HttpStatus.OK, description: 'The cocktail has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cocktail not found.' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCocktailDto: UpdateCocktailDto, @CurrentUser() user: AuthenticatedUser): Promise<Cocktail> {
    return this.cocktailsService.update(id, updateCocktailDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // set the response status code to 204 No Content
  @UseGuards(JWTAuthGuard) // protect the route with JWT auth guard
  // docs for swagger
  @ApiBearerAuth() // add bearer auth to swagger doc for this route
  @ApiOperation({ summary: 'Delete a cocktail by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the cocktail'})
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The cocktail has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Cocktail not found.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'You are not authorized to delete this cocktail.' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
    return this.cocktailsService.remove(id, user);
  }
}
