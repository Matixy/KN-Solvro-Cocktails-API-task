import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCocktailDto } from "./dto/create-cocktail.dto";
import { UpdateCocktailDto } from "./dto/update-cocktail.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Cocktail, Prisma } from "@prisma/client";
import { PaginationItem } from "../common/pagination/pagination-item.interface";
import { PaginationUtil } from "../common/pagination/pagination-util";
import { CocktailSortBy, FindCocktailsQueryDto } from "./dto/find-cocktails-query.dto";

@Injectable()
export class CocktailsService {
    // hermetic inject the PrismaService to interact with the database
    constructor(private readonly prisma: PrismaService) {}

    async create(createCocktailDto: CreateCocktailDto): Promise<Cocktail> {
        const { name, recipe, categoryId, ingredients, createdBy } = createCocktailDto;

        try {
            // nested write to create cocktail with ingredients in one transaction
            const newCocktail = await this.prisma.cocktail.create({
                data: {
                    name,
                    recipe,
                    categoryId,
                    createdBy, // TODO temporary resolve for user id until authentication is implemented
                    ingredients: {
                        create: ingredients.map((ingredient) => ({
                        ingredientId: ingredient.ingredientId,
                        amount: ingredient.amount,
                        unit: ingredient.unit,
                        })),
                    },
                },

                // include category and ingredients with details
                include: {
                    category: true,
                    ingredients: {
                        include: {
                        ingredient: true,
                        },
                    },
                },
            });

            return newCocktail;
        } catch (error) {
            // handle unique constraint violation error (P2002) for cocktail name
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Cocktail with name '+ createCocktailDto.name + ' already exists.');
            }
        
            // rethrow other errors
            throw error;
        }
  }

  async findAll(query: FindCocktailsQueryDto): Promise<PaginationItem<Cocktail>> {
    const { page, itemsPerPage, sortBy, sortOrder } = query;
    const skip = (page - 1) * itemsPerPage;

    const orderByClause: Prisma.CocktailOrderByWithRelationInput = {};

    if (sortBy === CocktailSortBy.CATEGORY) {
        orderByClause.category = { name: sortOrder }; // order by category name if sortBy is category
    } else {
        orderByClause[sortBy] = sortOrder; // order by the specified column and order
    }

    // filter clausle 
    const whereClause = this.createWhereClauseObject(query);


    const [data, totalItems] = await Promise.all([
        this.prisma.cocktail.findMany({
            skip: skip,
            take: itemsPerPage,
            orderBy: orderByClause, // use the dynamically generated order by clause
            where: whereClause, // use the dynamically generated where clause
            // include category and ingredients with details
            include: {
                category: true,
                ingredients: {
                    include: {
                    ingredient: true,
                    },
                },
            },
        }),
        this.prisma.cocktail.count({
            where: whereClause,
        })
    ]);

    return PaginationUtil.buildPaginationItem<Cocktail>(data, totalItems, page, itemsPerPage);
  }

  async findOne(id: string): Promise<Cocktail> {
    const cocktail = await this.prisma.cocktail.findUnique({ 
        where: { id },

        // include category and ingredients with details
        include: {
            category: true,
            ingredients: {
                include: {
                ingredient: true,
                },
            },
        },
    });

    if (!cocktail) {
        throw new NotFoundException('Cocktail with id ' + id + ' not found.'); // throw 404 error if cocktail not found
    }

    return cocktail;
  }

  async update(id: string, updateCocktailDto: UpdateCocktailDto): Promise<Cocktail> {
    await this.findOne(id); // check if cocktail exists using the findOne method

    // destructuring updateCocktailDto 
    const {categoryId, createdBy, ingredients, ...restData } = updateCocktailDto;

    try {
      return await this.prisma.cocktail.update({
        where: { id },
        data: {
            ...restData,

            // if categoryId is provided, connect the cocktail to the new category
            ...(categoryId && { category: { connect: { id: categoryId }}}),

            ...(ingredients && {
                ingredients: {
                    deleteMany: {}, // delete all old relations for this cocktail & crete new

                    create: ingredients.map((item) => ({
                        ingredientId: item.ingredientId,
                        amount: item.amount,
                        unit: item.unit
                    })),
                },
            })
        },

        // include category and ingredients with details
        include: {
            category: true,
            ingredients: {
                include: {
                ingredient: true,
                },
            },
        },
      });
    } catch (error) {
        // handle unique constraint violation error (P2002) for cocktail name
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            const errorMessage = updateCocktailDto.name 
                ? `Cocktail with name '${updateCocktailDto.name}' already exists.` 
                : 'Cocktail with provided unique data already exists.';
                
            throw new ConflictException(errorMessage);
        }

        // rethrow other errors
        throw error;
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // check if cocktail exists using the findOne method

    await this.prisma.cocktail.delete({ 
        where: { id } 
    });
  }

  // helper methods
  private createWhereClauseObject = (query: FindCocktailsQueryDto): Prisma.CocktailWhereInput => {
    const { name, categoryId, categoryName, isAlcoholic, createdAfter, createdBefore, updatedAfter, updatedBefore } = query
    const whereClause: Prisma.CocktailWhereInput = {};

    // filter by name
    if (name) {
        whereClause.name = {
            contains: name,
            mode: "insensitive", // case-insensitive search
        };
    }

    // filter by category id
    if (categoryId) {
        whereClause.categoryId = categoryId;
    }

    // filter by category name- search in related table
    if (categoryName) {
        whereClause.category = {
            name: { contains: categoryName, mode: "insensitive" }, // case-insensitive search
        };
    }

    // filter by alcoholic ingredients
    if (isAlcoholic !== undefined) {
        whereClause.ingredients = isAlcoholic 
            ? { some: { ingredient: { alcohol: true } } } 
            : { none: { ingredient: { alcohol: true } } };
    }

        // filter by creation date
    if (createdAfter || createdBefore) {
        whereClause.createdAt = {}; // initialize the createdAt filter object

      if (createdAfter) {
        whereClause.createdAt.gte = createdAfter; // >= createdAfter
      }
      if (createdBefore) {
        whereClause.createdAt.lte = createdBefore; // <= createdBefore
      }
    }

    // filter by updated date
    if (updatedAfter || updatedBefore) {
      whereClause.updatedAt = {}; // initialize the updatedAt filter object

      if (updatedAfter) {
        whereClause.updatedAt.gte = updatedAfter; // >= updatedAfter
      }
      if (updatedBefore) {
        whereClause.updatedAt.lte = updatedBefore; // <= updatedBefore
      }
    }

    return whereClause;
  }
}
