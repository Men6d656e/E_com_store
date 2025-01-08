export default function Home() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        E-commerce Platform Documentation
      </h1>

      <div className="prose prose-blue max-w-none">
        <p className="lead">
          Welcome to the documentation for our full-stack e-commerce platform. This
          comprehensive guide will help you understand the architecture,
          implementation, and features of both the frontend and backend components.
        </p>

        <h2>Project Overview</h2>
        <p>
          Our e-commerce platform is built using modern web technologies and best
          practices. It consists of:
        </p>
        <ul>
          <li>
            <strong>Backend:</strong> Node.js with Express, MongoDB database
          </li>
          <li>
            <strong>Frontend (TypeScript):</strong> Next.js 14 with TypeScript and
            Tailwind CSS
          </li>
          <li>
            <strong>Frontend (JavaScript):</strong> Next.js 14 with Redux Toolkit
            and Tailwind CSS
          </li>
        </ul>

        <h2>Key Features</h2>
        <ul>
          <li>User authentication and authorization</li>
          <li>Product catalog with categories and search</li>
          <li>Shopping cart and checkout process</li>
          <li>Order management system</li>
          <li>Admin dashboard</li>
          <li>Inventory tracking</li>
          <li>Review and rating system</li>
          <li>Email notification system</li>
          <li>Product recommendations</li>
        </ul>

        <h2>Getting Started</h2>
        <p>
          To get started with the project, visit the following sections:
        </p>
        <ul>
          <li>
            <a href="/installation">Installation Guide</a> - Set up the development
            environment
          </li>
          <li>
            <a href="/project-structure">Project Structure</a> - Understand the
            codebase organization
          </li>
          <li>
            <a href="/backend/architecture">Backend Architecture</a> - Learn about
            the server-side implementation
          </li>
          <li>
            <a href="/frontend-ts/architecture">Frontend (TypeScript)</a> -
            Explore the TypeScript version
          </li>
          <li>
            <a href="/frontend-js/architecture">Frontend (JavaScript)</a> -
            Explore the JavaScript version with Redux
          </li>
        </ul>

        <h2>Tech Stack</h2>
        <h3>Backend</h3>
        <ul>
          <li>Node.js & Express.js</li>
          <li>MongoDB with Mongoose</li>
          <li>JWT Authentication</li>
          <li>Express Middleware</li>
          <li>API Security (Helmet, CORS, Rate Limiting)</li>
        </ul>

        <h3>Frontend (Both Versions)</h3>
        <ul>
          <li>Next.js 14</li>
          <li>Tailwind CSS</li>
          <li>React Hook Form</li>
          <li>Axios for API calls</li>
          <li>React Query (TypeScript version)</li>
          <li>Redux Toolkit (JavaScript version)</li>
        </ul>

        <h2>Contributing</h2>
        <p>
          We welcome contributions to improve the platform. Please read our
          contribution guidelines before submitting pull requests.
        </p>

        <h2>Support</h2>
        <p>
          If you need help or have questions, please:
        </p>
        <ul>
          <li>Check the documentation thoroughly</li>
          <li>Look for similar issues in the issue tracker</li>
          <li>Create a new issue if needed</li>
        </ul>
      </div>
    </div>
  );
}
