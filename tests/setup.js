const { PrismaClient } = require('@prisma/client');
const { createClient } = require('redis');

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.NODE_ENV = 'test';

const prisma = new PrismaClient();
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
beforeAll(async () => {
  await redis.connect();
});

// Clean up database before each test
beforeEach(async () => {
  const tablenames = await prisma.$queryRaw`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname='public'
  `;

  for (const { tablename } of tablenames) {
    if (tablename !== '_prisma_migrations') {
      try {
        await prisma.$executeRawUnsafe(
          `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
        );
      } catch (error) {
        console.log({ error });
      }
    }
  }
});

// Cleanup and disconnect after tests
afterAll(async () => {
  await prisma.$disconnect();
  await redis.quit();
});

// Export instances for tests
module.exports = {
  prisma,
  redis
};