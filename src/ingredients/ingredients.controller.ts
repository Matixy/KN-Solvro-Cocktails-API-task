import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Ingredient } from './entities/ingredient.entity';

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
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (default: 1)' })
  @ApiQuery({name: 'itemsPerPage', required: false, type: Number, description: 'Number of items per page for pagination (default: 10)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns a paginated list of ingredients.' })
  findAll() {
    return this.ingredientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsService.update(+id, updateIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingredientsService.remove(+id);
  }
}
