# Portfolio CMS Backend

A full-stack backend Content Management System for a developer portfolio built with Node.js, Express, TypeScript, and MongoDB.

## Features

- JWT-based authentication (admin only)
- Complete CRUD operations for portfolio sections
- MongoDB/Mongoose-based data storage
- Clean modular architecture
- Error handling middleware
- CORS, Helmet, and Morgan for security and logging

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Security:** helmet, cors
- **Logging:** morgan

## Project Structure

```
src/
├── config/         # Database & app configuration
├── controllers/    # Request handlers
├── middleware/     # Auth & error handling
├── models/         # Mongoose schemas
├── routes/         # API endpoints
├── services/       # Business logic
├── app.ts          # Express app setup
└── server.ts       # Entry point
```

## Installation

1. Clone and install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio_cms
JWT_SECRET=your_super_secret_jwt_key_change_this
```

4. Build and start the server:

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

## MongoDB Setup

Make sure MongoDB is running locally:

```bash
# On Windows (using MongoDB installed as service)
net start MongoDB

# Or using Docker
docker run -d -p 27017:27017 --name mongo mongo
```

## API Endpoints

### Authentication

**POST** `/api/auth/login` - Admin login

```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**POST** `/api/auth/create-admin` - Create admin user (one-time setup)

```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

### Portfolio (Protected - Requires JWT)

**GET** `/api/portfolio` - Get full portfolio

**PUT** `/api/portfolio` - Update entire portfolio

**PATCH** `/api/portfolio/:section` - Update specific section

Available sections: `hero`, `about`, `skills`, `experience`, `projects`, `education`, `reviews`, `blogs`, `contact`, `greeting`, `theme`

**POST** `/api/portfolio/seed` - Create initial default data

## Request Headers

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Data Models

### Portfolio Schema

```typescript
{
  hero: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    socialLinks: { github, linkedin, twitter, instagram };
  },
  about: {
    description: string;
    experience: number;
    clients: number;
    projects: number;
    years: number;
    avatar: string;
    email: string;
    phone: string;
    address: string;
  },
  skills: Array<{ name, level, category }>,
  experience: Array<{ title, company, duration, description, current }>,
  projects: Array<{ title, description, technologies, image, link, github, featured }>,
  education: Array<{ degree, institution, year, description }>,
  reviews: Array<{ name, role, content, avatar, rating }>,
  blogs: Array<{ title, slug, excerpt, content, image, date, tags, published }>,
  contact: { email, phone, location, social },
  greeting: { title, description, ctaText, ctaLink },
  theme: { primaryColor, secondaryColor, darkMode, font }
}
```

## Error Response Format

```json
{
  "success": false,
  "error": "Error description"
}
```

## Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- Admin-only routes protected by middleware
- Helmet for security headers
- CORS configuration

## License

MIT
