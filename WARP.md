# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React TypeScript application built with Vite that displays backlink performance analysis dashboards for Fortinet. The project visualizes SEO and backlink data using interactive charts and tables, with data sourced from Google Search Console (GSC) and Moz.

## Development Commands

### Setup and Installation
```bash
npm install
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Set `GEMINI_API_KEY` in `.env.local` for AI-powered insights generation.

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **Charts**: Recharts library
- **AI Integration**: Google Gemini AI for generating key findings

### Project Structure
```
├── components/           # Reusable UI components
│   ├── DashboardHeader.tsx      # KPI cards display
│   ├── BacklinkGrowthChart.tsx  # Monthly backlink trend visualization
│   ├── KeywordPerformanceChart.tsx # Keyword ranking charts
│   ├── DaDistributionChart.tsx  # Domain Authority distribution pie chart
│   ├── PerformanceSummaryTable.tsx # URL performance comparison table
│   ├── KeyFindings.tsx          # AI-generated insights component
│   └── BacklinkBestPractices.tsx # Static best practices content
├── data/
│   └── mockData.ts      # All dashboard data definitions
├── services/
│   └── geminiService.ts # AI service for generating insights
├── types.ts             # TypeScript type definitions
└── App.tsx              # Main application component
```

### Key Architectural Patterns

**Data Flow**: The application uses a simple props-down data flow pattern. All data is imported from `mockData.ts` in `App.tsx` and passed down to individual components.

**Component Structure**: Components are organized by functionality - chart components handle visualization, the summary table handles tabular data, and utility components handle specific UI elements like KPI cards.

**Styling Architecture**: Uses Tailwind CSS with a custom color scheme (`#575757` for text, `#006FCA` for primary brand color, `#00B6B5` for accents, `#F0F0F0` for backgrounds). All styling is inline with Tailwind classes.

**Type Safety**: Strong TypeScript typing throughout with interfaces defined in `types.ts` for all data structures (KPI data, backlink growth, keyword performance, etc.).

### Data Model
The application works with several key data types:
- **KpiData**: Top-level metrics (URLs tracked, backlinks, keywords)
- **BacklinkGrowth**: Monthly backlink acquisition by page
- **KeywordRankingPerformance**: Search ranking improvements over time
- **PerformanceSummaryData**: Per-URL performance with status indicators

### External Dependencies
- Charts are rendered using Recharts library for interactive visualizations
- AI insights are generated via Google Gemini API (though currently returns hardcoded responses)
- Static assets include Fortinet and LeadWalnut logos in `/public`

## Key Development Notes

- The application is currently using mock data from `mockData.ts` - real data integration would replace this file
- The Gemini service is stubbed with hardcoded responses
- All date ranges are hardcoded for March-August 2025 period
- Components use responsive design patterns with Tailwind breakpoints (sm:, lg:)
- The app uses Vite's import map feature to load React and dependencies from CDN in development