# Product Search Application

A Next.js application that displays and manages products with search, filtering, and sorting capabilities.

## Features

- Server-side rendering with Next.js 13+
- MongoDB integration for data storage
- Product search with text search capabilities
- Price sorting (low to high, high to low)
- Availability filtering
- Pagination
- Product synchronization from XML feed
- Responsive design with Tailwind CSS and Shadcn component library

## Prerequisites

- Node.js 18+
- MongoDB database
- npm or yarn

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up MongoDB:

- Create a MongoDB database
- Update the `.env.local` file with your MongoDB connection string

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

app/
├── api/ # API routes
│ ├── products/ # Product search endpoint
│ └── sync/ # Product sync endpoint
├── components/ # React components
│ ├── FilterProducts.tsx # Search and filter controls
│ ├── Pagination.tsx # Pagination controls
│ ├── ProductCard.tsx # Product display card
│ └── SyncButton.tsx # Sync button component
├── lib/ # Utility functions
│ ├── db.ts # Database connection
│ └── syncProducts.ts # Product sync logic
├── models/ # Database models
│ └── Product.ts # Product schema
└── page.tsx # Main page component

## Database Schema

The Product model includes:

- id: Unique identifier
- title: Product title
- link: Product URL
- image_link: Product image URL
- price: Object containing amount and currency
- availability: Stock status

## API Endpoints

### GET /api/products

Query parameters:

- `page`: Page number (default: 1)
- `q`: Search query
- `availability`: Filter by availability
- `sort`: Sort by price (price_asc, price_desc)

### POST /api/sync

Synchronizes products from the XML feed

## Features Implementation

### Search

- Text search using MongoDB text index
- Debounced search input
- Server-side filtering

### Filtering

- Availability filter (All, In Stock, Out of Stock)
- Price sorting (Low to High, High to Low)

### Pagination

- Server-side pagination
- Page size: 10 items
- Previous/Next navigation

### Product Sync

- Fetches data from XML feed
- Updates existing products
- Removes deleted products
- Adds new products
