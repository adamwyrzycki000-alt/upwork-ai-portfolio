# Upfolio AI

An AI-powered portfolio generation tool for Upwork freelancers.

## Features

- **Smart Job Analysis**: AI analyzes Upwork job postings to extract tech stack, features, and requirements
- **Similar Product Discovery**: Finds live similar products and SaaS tools that match the job requirements
- **Auto Screenshot Capture**: Captures beautiful screenshots of similar products using Playwright
- **AI Experience Writing**: Generates professional case studies that sound like senior engineer-written content
- **PDF Export**: Creates beautifully designed PDF portfolios ready to send to clients
- **Customizable Templates**: Multiple themes and templates to match your personal brand

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials

5. Generate Prisma client:
```bash
npm run db:generate
```

6. Push the database schema:
```bash
npm run db:push
```

7. Run the development server:
```bash
npm run dev
```

### Docker

```bash
docker-compose up -d
```

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js
- **AI**: OpenAI GPT-4
- **Browser**: Playwright

## Project Structure

```
src/
├── app/              # Next.js app router pages and API routes
├── components/       # React components
├── lib/             # Utility functions and configurations
│   ├── ai/         # AI agents
│   ├── auth/       # Authentication configuration
│   └── db/         # Database client
├── types/          # TypeScript type definitions
└── hooks/         # Custom React hooks
```

## License

MIT