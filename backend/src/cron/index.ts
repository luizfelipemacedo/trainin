import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

// Run every 5 days
const cronSchedule = '0 0 */5 * *';

export default cron.schedule(cronSchedule, async () => {
  const query = await prisma.$queryRaw`SELECT NOW()`;

  console.log('Cron job runned...', query);
});