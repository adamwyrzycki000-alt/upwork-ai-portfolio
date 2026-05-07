# Upfolio AI - Specification Document

## 1. Project Overview

**Project Name:** Upfolio AI  
**Project Type:** SaaS Web Application  
**Purpose:** AI-powered portfolio generation tool for Upwork freelancers  
**Core Functionality:** Takes Upwork job posting as input → finds similar live products → captures screenshots → generates professional PDF portfolio with experience descriptions

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod

### Backend
- **Runtime:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js (Email + Google)
- **Storage:** Local storage (development) / S3-compatible (production)

### AI & Automation
- **LLM:** OpenAI API (GPT-4)
- **Web Search:** Tavily API
- **Browser Automation:** Playwright
- **PDF Generation:** @react-pdf/renderer

### Infrastructure
- **Container:** Docker
- **Deployment:** Vercel, Railway, Render compatible

## 3. Core Features

### 3.1 Job Posting Analyzer
- Input: URL or pasted text
- Extract: Tech stack, features, industry, keywords, complexity, UI/UX requirements
- Classify: SaaS, AI tool, Fintech, CRM, Marketplace, Mobile app, Dashboard, Automation
- Output: Structured job analysis JSON

### 3.2 Similar Product Finder
- Search: Product Hunt, IndieHackers, GitHubTrending, SaaS directories
- Filter: Live products, recent launches, modern UI
- Ranking: Keyword similarity, feature overlap, tech stack relevance
- Output: Top 3-5 matched products with URLs and feature lists

### 3.3 Screenshot Engine
- Browser: Playwright with smart wait
- Capture: Homepage, dashboard, pricing, features, mobile views
- Optimization: Auto-scroll, wait for animations, smart crop
- Tagging: Feature categories (auth, dashboard, analytics, AI chat, payment, etc.)
- Storage: Local filesystem / S3

### 3.4 AI Experience Generator
- Input: Screenshot + job requirements
- Generate: Project descriptions in senior engineer voice
- Variants: Short, medium, enterprise versions
- Style: Human-written, achievement-focused, technical
- Output: Editable text with tone indicators

### 3.5 PDF Portfolio Generator
- Templates: Modern SaaS, Corporate, Creative
- Sections: Cover, summary, experience, screenshots, tech stack, architecture
- Features: Theme switching, editable sections, drag-drop ordering
- Export: High-quality PDF download
- Themes: Dark/Light mode

### 3.6 User Dashboard
- Workflow: Paste job → Generate → Preview → Edit → Export
- History: Previous portfolios with re-edit capability
- States: Loading indicators, progress tracking, error handling

## 4. UI/UX Specifications

### 4.1 Design System

**Color Palette:**
- Background Primary: `#0A0A0B` (near black)
- Background Secondary: `#141416` (dark gray)
- Background Tertiary: `#1C1C1F` (card surfaces)
- Border: `#27272A` (subtle borders)
- Text Primary: `#FAFAFA` (white)
- Text Secondary: `#A1A1AA` (muted)
- Accent Primary: `#6366F1` (indigo)
- Accent Hover: `#818CF8` (lighter indigo)
- Success: `#22C55E` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)

**Typography:**
- Font Family: `Geist Sans` (headings), `Geist Mono` (code)
- Heading 1: 48px, font-weight 700
- Heading 2: 36px, font-weight 600
- Heading 3: 24px, font-weight 600
- Body: 16px, font-weight 400
- Small: 14px, font-weight 400
- Caption: 12px, font-weight 500

**Spacing System:**
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px

**Border Radius:**
- sm: 6px, md: 8px, lg: 12px, xl: 16px, full: 9999px

### 4.2 Pages

**Landing Page:**
- Hero section with animated text
- Feature highlights (3 cards)
- How it works (3 steps)
- CTA buttons (Get Started, View Demo)
- Footer with links

**Dashboard:**
- Sidebar navigation (collapsed on mobile)
- Main content area
- Header with user menu
- Quick actions card
- Recent portfolios list
- Generate new portfolio CTA

**Generator Page:**
- Step 1: Job input (URL or text area)
- Step 2: Analysis progress indicator
- Step 3: Product matches preview
- Step 4: Screenshot gallery
- Step 5: Edit descriptions
- Step 6: PDF preview and export

**Portfolio Editor:**
- Split view: Preview + Editor
- Section reordering (drag-drop)
- Live text editing
- Theme switcher
- Export button

**History Page:**
- Card grid layout
- Search and filter
- Pagination

### 4.3 Components

**Buttons:**
- Primary: Indigo background, white text
- Secondary: Transparent, border, white text
- Ghost: No border, hover background
- Sizes: sm (32px), md (40px), lg (48px)

**Input Fields:**
- Dark background (#1C1C1F)
- Border on focus (#6366F1)
- Error state (red border)
- Label above, helper text below

**Cards:**
- Background (#1C1C1F)
- Border (#27272A)
- Hover: Subtle glow effect
- Padding: 24px

**Modal:**
- Centered, max-width 500px
- Backdrop blur
- Close button
- Action buttons at bottom

**Progress:**
- Step indicator with numbers
- Connected line between steps
- Active step highlighted

### 4.4 Animations

**Page Transitions:**
- Fade in: 200ms ease-out
- Slide up: 300ms spring

**Micro-interactions:**
- Button hover: Scale 1.02, 150ms
- Card hover: Border glow, 200ms
- Input focus: Border color, 150ms

**Loading States:**
- Skeleton shimmer
- Spinner rotation
- Progress bar animation

## 5. Database Schema

### Tables

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job Posts
CREATE TABLE job_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  url TEXT,
  content TEXT NOT NULL,
  analysis JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matched Products
CREATE TABLE matched_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_post_id UUID REFERENCES job_posts(id),
  url TEXT NOT NULL,
  name VARCHAR(255),
  description TEXT,
  features JSONB,
  similarity_score FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Screenshots
CREATE TABLE screenshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matched_product_id UUID REFERENCES matched_products(id),
  url TEXT NOT NULL,
  image_path VARCHAR(255),
  feature_tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated Descriptions
CREATE TABLE generated_descriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screenshot_id UUID REFERENCES screenshots(id),
  short_description TEXT,
  medium_description TEXT,
  enterprise_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Portfolios
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  job_post_id UUID REFERENCES job_posts(id),
  title VARCHAR(255),
  template VARCHAR(50),
  theme VARCHAR(50),
  sections JSONB,
  pdf_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 6. API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session

### Job Posts
- `POST /api/job-posts` - Create job post
- `GET /api/job-posts` - List user's job posts
- `GET /api/job-posts/:id` - Get single job post
- `DELETE /api/job-posts/:id` - Delete job post

### Products
- `POST /api/products/find` - Find similar products
- `GET /api/products/:id` - Get product details

### Screenshots
- `POST /api/screenshots/capture` - Capture screenshots
- `GET /api/screenshots/:id` - Get screenshot
- `DELETE /api/screenshots/:id` - Delete screenshot

### Descriptions
- `POST /api/descriptions/generate` - Generate descriptions
- `PUT /api/descriptions/:id` - Update description

### Portfolios
- `POST /api/portfolios` - Create portfolio
- `GET /api/portfolios` - List portfolios
- `GET /api/portfolios/:id` - Get portfolio
- `PUT /api/portfolios/:id` - Update portfolio
- `DELETE /api/portfolios/:id` - Delete portfolio
- `POST /api/portfolios/:id/export` - Export PDF

## 7. AI Agent Pipeline

### Agent 1: Job Analysis Agent
```
Input: Job posting text/URL
Process:
  1. Extract key requirements
  2. Identify tech stack
  3. Determine industry/domain
  4. Extract keywords
  5. Assess complexity
  6. Classify project type
Output: Structured analysis JSON
```

### Agent 2: Similar Product Finder
```
Input: Job analysis
Process:
  1. Generate search queries
  2. Search Product Hunt, IndieHackers, GitHub
  3. Filter live products
  4. Score by similarity
  5. Return top matches
Output: Array of matched products
```

### Agent 3: Screenshot Capture Agent
```
Input: Product URLs
Process:
  1. Launch Playwright browser
  2. Navigate to URL
  3. Wait for load
  4. Capture screenshots
  5. Tag features
  6. Save images
Output: Array of screenshot metadata
```

### Agent 4: Experience Writer Agent
```
Input: Screenshot + job requirements
Process:
  1. Analyze feature
  2. Match to job requirements
  3. Generate descriptions
  4. Adjust tone/style
  5. Humanize output
Output: Generated descriptions
```

### Agent 5: PDF Composer Agent
```
Input: Screenshots + descriptions + template
Process:
  1. Layout pages
  2. Insert content
  3. Apply theme
  4. Generate PDF
Output: PDF file
```

## 8. Acceptance Criteria

### Must Have
- [ ] User can sign up/login
- [ ] User can paste Upwork job posting
- [ ] AI analyzes job and extracts requirements
- [ ] System finds 3-5 similar live products
- [ ] System captures screenshots of products
- [ ] AI generates experience descriptions
- [ ] PDF portfolio is generated
- [ ] User can view and download PDF
- [ ] User can edit generated content
- [ ] Dashboard shows portfolio history

### Should Have
- [ ] Multiple PDF templates
- [ ] Theme switching (dark/light)
- [ ] Drag-drop section reordering
- [ ] Loading progress indicators
- [ ] Error handling with retry

### Nice to Have
- [ ] Portfolio scoring
- [ ] ATS optimization
- [ ] Upwork proposal generation
- [ ] Multilingual support
- [ ] One-click regeneration

## 9. File Structure

```
upfolio-ai/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── generate/
│   │   │   ├── portfolio/
│   │   │   │   ├── [id]/
│   │   │   │   └── edit/
│   │   │   └── history/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── job-posts/
│   │   │   ├── products/
│   │   │   ├── screenshots/
│   │   │   ├── descriptions/
│   │   │   └── portfolios/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── features/
│   ├── lib/
│   │   ├── db/
│   │   ├── auth/
│   │   └── ai/
│   ├── agents/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── prisma/
│   └── schema.prisma
├── public/
│   └── ...
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 10. Environment Variables

```
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
OPENAI_API_KEY=

# Search
TAVILY_API_KEY=

# Storage
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# App
NEXT_PUBLIC_APP_URL=
```