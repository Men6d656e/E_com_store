# E-commerce Store

A full-stack e-commerce application with TypeScript and JavaScript frontends, utilizing Next.js and Node.js.

## Project Structure

```
e-commereceStore_windSurf_nodeJS/
├── backend/           # Node.js/Express backend
├── frontend/          # Next.js frontend (TypeScript)
├── frontend-with-js/  # Next.js frontend (JavaScript)
├── docs-typescript/   # Documentation for TypeScript version
└── docs-javascript/   # Documentation for JavaScript version
```

## Features

- User Authentication & Authorization
- Product Management
- Shopping Cart
- Order Processing
- Admin Dashboard
- Reviews & Ratings
- Responsive Design

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd e-commereceStore_windSurf_nodeJS
   ```

2. Install dependencies for all projects:
   ```bash
   # Backend
   cd backend
   npm install

   # TypeScript Frontend
   cd ../frontend
   npm install

   # JavaScript Frontend
   cd ../frontend-with-js
   npm install

   # TypeScript Docs
   cd ../docs-typescript
   npm install

   # JavaScript Docs
   cd ../docs-javascript
   npm install
   ```

3. Set up environment variables:
   Create `.env` files in backend and both frontend directories using the provided `.env.example` templates.

4. Start the development servers:

   ```bash
   # Backend
   cd backend
   npm run dev

   # TypeScript Frontend
   cd frontend
   npm run dev

   # JavaScript Frontend
   cd frontend-with-js
   npm run dev
   ```

5. View documentation:
   ```bash
   # TypeScript Documentation
   cd docs-typescript
   npm run dev

   # JavaScript Documentation
   cd docs-javascript
   npm run dev
   ```

## Documentation

- TypeScript Version: http://localhost:3001/docs
- JavaScript Version: http://localhost:3002/docs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
