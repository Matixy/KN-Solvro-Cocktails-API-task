import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // create a new PostgreSQL connection pool using the connection string from the environment variable
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL 
    });
    
    // initialize the PrismaPg adapter with the connection pool for postgreSQL
    const adapter = new PrismaPg(pool);

    // call the super constructor of PrismaClient with the adapter
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}