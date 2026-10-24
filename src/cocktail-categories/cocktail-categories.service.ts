import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateCocktailCategoryDto } from "./dto/create-cocktail-category.dto";
import { UpdateCocktailCategoryDto } from "./dto/update-cocktail-category.dto";
import { PrismaService } from "../prisma/prisma.service";
import { CocktailCategory, Prisma } from "@prisma/client";
import { PaginationItem } from "../common/pagination/pagination-item.interface";
import { PaginationUtil } from "../common/pagination/pagination-util";

@Injectable()
export class CocktailCategoriesService {
  // hermetic inject the PrismaService to interact with the database
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCocktailCategoryDto: CreateCocktailCategoryDto,
  ): Promise<CocktailCategory> {
    try {
      return await this.prisma.cocktailCategory.create({
        data: createCocktailCategoryDto,
      });
    } catch (error) {
      // handle unique constraint violation error (P2002) for cocktail category name
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          "Cocktail category with name " +
            createCocktailCategoryDto.name +
            " already exists.",
        );
      }

      // rethrow other errors
      throw error;
    }
  }

  async findAll(
    page: number,
    itemsPerPage: number,
  ): Promise<PaginationItem<CocktailCategory>> {
    const skip = (page - 1) * itemsPerPage;

    const [data, totalItems] = await Promise.all([
      this.prisma.cocktailCategory.findMany({
        skip: skip,
        take: itemsPerPage,
        orderBy: { name: "asc" }, // order by name ascending
      }),
      this.prisma.cocktailCategory.count(),
    ]);

    return PaginationUtil.buildPaginationItem<CocktailCategory>(
      data,
      totalItems,
      page,
      itemsPerPage,
    );
  }

  async findOne(id: string): Promise<CocktailCategory> {
    const cocktailCategory = await this.prisma.cocktailCategory.findUnique({
      where: { id },
    });

    if (!cocktailCategory) {
      throw new NotFoundException(
        "Cocktail category with id " + id + " not found.",
      ); // throw 404 error if cocktail category not found
    }

    return cocktailCategory;
  }

  async update(
    id: string,
    updateCocktailCategoryDto: UpdateCocktailCategoryDto,
  ): Promise<CocktailCategory> {
    await this.findOne(id); // check if cocktail category exists using the findOne method

    try {
      return await this.prisma.cocktailCategory.update({
        where: { id },
        data: updateCocktailCategoryDto,
      });
    } catch (error) {
      // handle unique constraint violation error (P2002) for cocktail category name
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException(
          "Cocktail category with name " +
            updateCocktailCategoryDto.name +
            " already exists.",
        );
      }

      // rethrow other errors
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // check if cocktail category exists using the findOne method

    await this.prisma.cocktailCategory.delete({
      where: { id },
    });
  }
}
