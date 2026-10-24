import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Ingredient, Prisma } from "@prisma/client";
import { PaginationItem } from "../common/pagination/pagination-item.interface";
import { PaginationUtil } from "../common/pagination/pagination-util";
import { FindIngredientsQueryDto } from "./dto/find-ingredients-query.dto";

@Injectable()
export class IngredientsService {
  // hermetic inject the PrismaService to interact with the database
  constructor(private readonly prisma: PrismaService) {}

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    try {
      return await this.prisma.ingredient.create({
        data: createIngredientDto,
      });
    } catch (error) {
      // handle unique constraint violation error (P2002) for ingredient name
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          "Ingredient with name " +
            createIngredientDto.name +
            " already exists.",
        );
      }

      // rethrow other errors
      throw error;
    }
  }

  async findAll(
    query: FindIngredientsQueryDto,
  ): Promise<PaginationItem<Ingredient>> {
    const { page, itemsPerPage, sortBy, sortOrder } = query;
    const skip = (page - 1) * itemsPerPage;

    const orderByClause: Prisma.IngredientOrderByWithRelationInput = {
      [sortBy]: sortOrder, // dynamically set sort and order based on the query parameters
    };

    const [data, totalItems] = await Promise.all([
      this.prisma.ingredient.findMany({
        skip: skip,
        take: itemsPerPage,
        orderBy: orderByClause, // order by the dynamically set column and order
      }),
      this.prisma.ingredient.count(),
    ]);

    return PaginationUtil.buildPaginationItem<Ingredient>(
      data,
      totalItems,
      page,
      itemsPerPage,
    );
  }

  async findOne(id: string): Promise<Ingredient> {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id },
    });

    if (!ingredient) {
      throw new NotFoundException("Ingredient with id " + id + " not found."); // throw 404 error if ingredient not found
    }

    return ingredient;
  }

  async update(
    id: string,
    updateIngredientDto: UpdateIngredientDto,
  ): Promise<Ingredient> {
    await this.findOne(id); // check if ingredient exists using the findOne method

    try {
      return await this.prisma.ingredient.update({
        where: { id },
        data: updateIngredientDto,
      });
    } catch (error) {
      // handle unique constraint violation error (P2002) for ingredient name
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const errorMessage = updateIngredientDto.name
          ? `Ingredient with name '${updateIngredientDto.name}' already exists.`
          : "Ingredient with provided unique data already exists.";

        throw new ConflictException(errorMessage);
      }

      // rethrow other errors
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // check if ingredient exists using the findOne method

    await this.prisma.ingredient.delete({
      where: { id },
    });
  }
}
