# Revix Paper Trading Platform

A full-featured cryptocurrency paper trading platform with AI mentorship, real-time market data, and competitive tournaments.

## Features

- **Paper Trading**: Trade with $50,000 virtual money, zero risk
- **AI Mentor**: Get personalized trading advice powered by GPT-4
- **Real-time Market Data**: Live cryptocurrency prices and charts
- **AI Signals**: Receive trading signals with confidence scores and explanations
- **Leaderboards**: Compete with other traders globally or weekly
- **Tournaments**: Join trading competitions with custom rules
- **Public Profiles**: Share your verified trading performance

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4
- **Real-time**: Socket.io
- **Charts**: Lightweight Charts (TradingView)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key
- CoinMarketCap API key (free tier works)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

4. Generate Prisma client and push schema to database:

```bash
npm run db:generate
npm run db:push
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
revix-trading-app/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/               # API routes
│   └── u/[alias]/         # Public profiles
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── charts/           # Chart components
│   └── ...
├── lib/                   # Utilities and configs
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth config
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
├── services/             # Business logic
│   ├── signal-generator.ts
│   ├── trade-executor.ts
│   └── mentor-service.ts
└── public/               # Static assets
```

## Development Workflow

```bash
# Start development server
npm run dev

# Run database migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
