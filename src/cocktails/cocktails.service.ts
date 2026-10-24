import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCocktailDto } from "./dto/create-cocktail.dto";
import { UpdateCocktailDto } from "./dto/update-cocktail.dto";
import { PrismaService } from "../prisma/prisma.service";
import { Cocktail, Prisma } from "@prisma/client";
import { PaginationItem } from "../common/pagination/pagination-item.interface";
import { take } from "rxjs";

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
            // handle unique constraint violation error (P2002) for ingredient name
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException('Ingredient with name '+ createCocktailDto.name + ' already exists.');
            }
        
            // rethrow other errors
            throw error;
        }
  }

  async findAll(page: number, itemsPerPage: number): Promise<PaginationItem<Cocktail>> {
    const skip = (page - 1) * itemsPerPage;

    const [data, totalItems] = await Promise.all([
        this.prisma.cocktail.findMany({
            skip: skip,
            take: itemsPerPage,
            orderBy: { name: 'asc' }, // order by name ascending

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
        this.prisma.cocktail.count()
    ]);

    const totalPages = Math.ceil(totalItems / itemsPerPage) // calculate total pages

    return {
        data,
        meta: { // PaginationMeta object is used
            totalItems,
            itemsPerPage,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
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
            throw new ConflictException('Cocktail with name '+ updateCocktailDto.name + ' already exists.');
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
}
