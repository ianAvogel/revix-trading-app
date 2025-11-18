const { PrismaClient } = require('@prisma/client');
const { subHours } = require('date-fns');

const prisma = new PrismaClient();

async function runSeed() {
  console.log('Seeding historical data...');

  const symbols = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA'];
  const now = new Date();

  for (const symbol of symbols) {
    console.log(`Processing symbol: ${symbol}`);
    let price = 0;
    switch (symbol) {
      case 'BTC': price = 68000; break;
      case 'ETH': price = 3500; break;
      case 'SOL': price = 150; break;
      case 'DOGE': price = 0.15; break;
      case 'ADA': price = 0.45; break;
    }

    const data = [];
    for (let i = 0; i < 24 * 30; i++) { // 30 days of hourly data
      const timestamp = subHours(now, i);
      const priceFluctuation = (Math.random() - 0.5) * (price * 0.02);
      const newPrice = price + priceFluctuation;
      const open = newPrice;
      const high = newPrice * (1 + Math.random() * 0.01);
      const low = newPrice * (1 - Math.random() * 0.01);
      const close = newPrice + (Math.random() - 0.5) * (price * 0.005);
      const volume = Math.random() * 1000;

      data.push({ symbol, timestamp, open, high, low, close, volume });
      price = close;
    }

    await prisma.historicalData.deleteMany({ where: { symbol } });
    await prisma.historicalData.createMany({ data, skipDuplicates: true });

    console.log(`Successfully seeded ${symbol}.`);
  }
}

runSeed().then(() => {
    console.log('Seeding finished.');
    prisma.$disconnect();
}).catch(async (e) => {
    console.error('A critical error occurred during database seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
});


  .finally(async () => {
    await prisma.$disconnect()
  })
