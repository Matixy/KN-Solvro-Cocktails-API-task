import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Cocktails API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  let userToken: string;
  let adminToken: string;
  
  let testCategoryId: string;
  let testIngredientId: string;
  let userCocktailId: string;

  beforeAll(async () => {
    // create a testing module with the AppModule
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
    
    // clear the database before tests
    await prisma.cocktail.deleteMany();
    await prisma.ingredient.deleteMany(); 
    await prisma.cocktailCategory.deleteMany();
    await prisma.user.deleteMany({ 
      where: { email: { in: ['e2e-user@cocktails.local', 'e2e-admin@cocktails.local'] } } 
    });

    // seed admin user and get token
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'e2e-admin@cocktails.local', password: 'AdminPassword123!' });

    await prisma.user.update({
      where: { email: 'e2e-admin@cocktails.local' },
      data: { role: 'ADMIN' } 
    });

    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'e2e-admin@cocktails.local', password: 'AdminPassword123!' });
    
    adminToken = adminLogin.body.accessToken;

    // seed standard user and get token
    const userResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'e2e-user@cocktails.local', password: 'UserPassword123!' });
    
    userToken = userResponse.body.accessToken;
  });

afterAll(async () => {
    // clear the database after tests
    await prisma.cocktail.deleteMany();
    await prisma.ingredient.deleteMany(); 
    await prisma.cocktailCategory.deleteMany();
    await prisma.user.deleteMany({ 
      where: { email: { in: ['e2e-user@cocktails.local', 'e2e-admin@cocktails.local'] } } 
    });

    // close the application and disconnect from the database
    await prisma.$disconnect();
    await app.close();
  });

  describe('Admin Operations (Categories & Ingredients)', () => {
    it('should block STANDARD USER from creating a category (403)', () => {
      return request(app.getHttpServer())
        .post('/api/cocktail-categories') 
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Test Category' })
        .expect(403); 
    });

    it('should allow ADMIN to create a category (201)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/cocktail-categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'E2E Classic' })
        .expect(201);
        
      testCategoryId = response.body.id;
    });

    it('should allow ADMIN to create an ingredient (201)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/ingredients') 
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'E2E Vodka',
          description: 'Test alcohol',
          alcohol: true,
          photoUrl: 'https://example.com/vodka.jpg'
        })
        .expect(201);
        
      testIngredientId = response.body.id;
    });
  });

  describe('User Cocktails Operations', () => {
    it('should block UNAUTHENTICATED user from creating a cocktail (401)', () => {
      return request(app.getHttpServer())
        .post('/api/cocktails')
        .send({ name: 'Phantom Drink', recipe: 'None', categoryId: testCategoryId })
        .expect(401);
    });

    it('should allow STANDARD USER to create a cocktail with ingredients (201)', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/cocktails')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'E2E Vodka Gimlet',
          recipe: 'Shake and strain.',
          categoryId: testCategoryId,
          ingredients: [
            { 
              ingredientId: testIngredientId, 
              amount: 50, 
              unit: 'ml' 
            }
          ]
        })
        .expect(201);

      userCocktailId = response.body.id;
      expect(userCocktailId).toBeDefined();
    });

    it('should allow PUBLIC access to read cocktails (200)', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/cocktails')
        .expect(200);

      expect(Array.isArray(response.body.data)).toBeTruthy();
      expect(response.body.data.some((c: any) => c.name === 'E2E Vodka Gimlet')).toBeTruthy();
    });

    it('should allow USER to update their OWN cocktail (200)', () => {
      return request(app.getHttpServer())
        .patch(`/api/cocktails/${userCocktailId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ recipe: 'Updated recipe instructions.' })
        .expect(200);
    });

    it('should block USER from updating someone else\'s cocktail (403)', async () => {
      // admin creates a cocktail first
      const adminCocktail = await request(app.getHttpServer())
        .post('/api/cocktails')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ 
          name: 'Admin Only Drink', 
          recipe: 'Secret', 
          categoryId: testCategoryId, 
          ingredients: [
            { 
              ingredientId: testIngredientId, 
              amount: 10, 
              unit: 'ml' 
            }
          ] 
        });
      
      // check that the cocktail was created successfully
      expect(adminCocktail.status).toBe(201);
      
      // user tries to update admins cocktail
      return request(app.getHttpServer())
        .patch(`/api/cocktails/${adminCocktail.body.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ recipe: 'Hacked by user' })
        .expect(403);
    });

    it('should allow USER to delete their OWN cocktail (204)', () => {
      return request(app.getHttpServer())
        .delete(`/api/cocktails/${userCocktailId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204);
    });
  });
});