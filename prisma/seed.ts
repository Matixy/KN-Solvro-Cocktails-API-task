import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'

// create a new client instance with the psql adapter
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL})
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Seeding database...");

    // SEED COCKTAIL CATEGORIES
    const categoryClassic = await prisma.cocktailCategory.upsert({
        where: { name: "Classic" },
        update: {}, // if the category already exists- do nothing
        create: { name: "Classic" }, // if the category does not exist- create it
    });

    const categoryTropical = await prisma.cocktailCategory.upsert({
        where: { name: "Tropical" },
        update: {},
        create: { name: "Tropical" },
    });

    console.log("Cocktail categories seeded.");

    // SEED INGREDIENTS
    const ingredientVodka = await prisma.ingredient.upsert({
        where: { name: "Vodka" },
        update: {},
        create: { 
            name: "Vodka",
            description: "A clear distilled alcoholic beverage.",
            alcohol: true,
            photoUrl: "https://example.com/vodka.jpg",
        },
    });

    const ingredientRum = await prisma.ingredient.upsert({
        where: { name: "Rum" },
        update: {},
        create: {
            name: "Rum",
            description: "A distilled alcoholic beverage made from sugarcane byproducts.",
            alcohol: true,
            photoUrl: "https://example.com/rum.jpg",
        },
    });

    const ingredientLimeJuice = await prisma.ingredient.upsert({
        where: { name: "Lime Juice" },
        update: {},
        create: {
            name: "Lime Juice",
            description: "Juice extracted from fresh limes.",
            alcohol: false,
            photoUrl: "https://example.com/lime-juice.jpg",
        },
    });

    const ingredientSugarSyrup = await prisma.ingredient.upsert({
        where: { name: "Sugar Syrup" },
        update: {},
        create: {
            name: "Sugar Syrup",
            description: "A sweet syrup made from sugar and water.",
            alcohol: false,
            photoUrl: "https://example.com/sugar-syrup.jpg",
        },
    });

    const ingredientMint = await prisma.ingredient.upsert({
        where: { name: "Mint" },
        update: {},
        create: {
            name: "Mint",
            description: "Fresh leaves from the mint plant.",
            alcohol: false,
            photoUrl: "https://example.com/mint-leaves.jpg",
        },
    });

    console.log("Ingredients seeded.");

    // SEED USERS
    const adminUser = await prisma.user.upsert({
        where: { email: "admin@cocktails.local" },
        update: {},
        create: {
            email: "admin@cocktails.local",
            password: "temporary_password",
            role: "ADMIN",
        },
    });

    const standardUser = await prisma.user.upsert({
        where: { email: "bartender@cocktails.local" },
        update: {},
        create: {
            email: "bartender@cocktails.local",
            password: "temporary_password",
            role: "USER",
        },
    });

    console.log("Users seeded.");

   // SEED COCKTAILS
    const cocktailMojito = await prisma.cocktail.upsert({
        where: { name: "Mojito" },
        update: {},
        create: {
            name: "Mojito",
            recipe: "Muddle mint leaves with sugar syrup and lime juice. Add rum, top with crushed ice and stir.",
            categoryId: categoryTropical.id,
            createdBy: adminUser.id,
            ingredients: {
                create: [
                    { ingredientId: ingredientRum.id, amount: 50, unit: "ml" },
                    { ingredientId: ingredientLimeJuice.id, amount: 20, unit: "ml" },
                    { ingredientId: ingredientSugarSyrup.id, amount: 15, unit: "ml" },
                    { ingredientId: ingredientMint.id, amount: 10, unit: "leaves" },
                ],
            },
        },
    });

    const cocktailDaiquiri = await prisma.cocktail.upsert({
        where: { name: "Daiquiri" },
        update: {},
        create: {
            name: "Daiquiri",
            recipe: "Add all ingredients into a shaker with ice. Shake vigorously and strain into a chilled coupe glass.",
            categoryId: categoryClassic.id,
            createdBy: standardUser.id,
            ingredients: {
                create: [
                    { ingredientId: ingredientRum.id, amount: 60, unit: "ml" },
                    { ingredientId: ingredientLimeJuice.id, amount: 30, unit: "ml" },
                    { ingredientId: ingredientSugarSyrup.id, amount: 15, unit: "ml" },
                ],
            },
        },
    });

    const cocktailVodkaGimlet = await prisma.cocktail.upsert({
        where: { name: "Vodka Gimlet" },
        update: {},
        create: {
            name: "Vodka Gimlet",
            recipe: "Shake vodka and lime juice with ice. Strain into a glass and garnish with a lime wheel.",
            categoryId: categoryClassic.id,
            createdBy: adminUser.id,
            ingredients: {
                create: [
                    { ingredientId: ingredientVodka.id, amount: 60, unit: "ml" },
                    { ingredientId: ingredientLimeJuice.id, amount: 20, unit: "ml" },
                    { ingredientId: ingredientSugarSyrup.id, amount: 10, unit: "ml" },
                ],
            },
        },
    });

    console.log("Cocktails seeded.");
}

main()    
    .catch((e) => {
        console.error("Error occurred while seeding the database: ", e);
        process.exit(1);
    })
    .finally(async () => {
        // disconnect the prisma client after seeding- prevent hanging connections
        await prisma.$disconnect();
    });