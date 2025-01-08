export default function Installation() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Installation Guide</h1>

      <div className="prose prose-blue max-w-none">
        <h2>Prerequisites</h2>
        <ul>
          <li>Node.js (v18 or higher)</li>
          <li>MongoDB (v5 or higher)</li>
          <li>Git</li>
        </ul>

        <h2>Clone the Repository</h2>
        <pre className="bg-gray-800 text-white p-4 rounded-md">
          git clone https://github.com/yourusername/e-commerce-platform.git
        </pre>

        <h2>Backend Setup</h2>
        <ol>
          <li>
            Navigate to the backend directory:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              cd backend
            </pre>
          </li>
          <li>
            Install dependencies:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              npm install
            </pre>
          </li>
          <li>
            Create a .env file:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              {`PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
STRIPE_SECRET_KEY=your_stripe_secret_key`}
            </pre>
          </li>
          <li>
            Start the development server:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              npm run dev
            </pre>
          </li>
        </ol>

        <h2>Frontend (TypeScript) Setup</h2>
        <ol>
          <li>
            Navigate to the frontend directory:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              cd frontend
            </pre>
          </li>
          <li>
            Install dependencies:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              npm install
            </pre>
          </li>
          <li>
            Create a .env.local file:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              {`NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key`}
            </pre>
          </li>
          <li>
            Start the development server:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              npm run dev
            </pre>
          </li>
        </ol>

        <h2>Frontend (JavaScript) Setup</h2>
        <ol>
          <li>
            Navigate to the JavaScript frontend directory:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              cd frontend-with-js
            </pre>
          </li>
          <li>
            Install dependencies:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              npm install
            </pre>
          </li>
          <li>
            Create a .env.local file:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              {`NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key`}
            </pre>
          </li>
          <li>
            Start the development server:
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              npm run dev
            </pre>
          </li>
        </ol>

        <h2>Running the Complete Stack</h2>
        <p>
          To run the complete application, you need to have three terminal windows
          open:
        </p>
        <ol>
          <li>One for the backend server (running on port 5000)</li>
          <li>
            One for the TypeScript frontend (running on port 3000)
          </li>
          <li>
            One for the JavaScript frontend (running on port 3001)
          </li>
        </ol>

        <h2>Development Tools</h2>
        <p>Recommended tools for development:</p>
        <ul>
          <li>VS Code with the following extensions:
            <ul>
              <li>ESLint</li>
              <li>Prettier</li>
              <li>Tailwind CSS IntelliSense</li>
              <li>MongoDB for VS Code</li>
            </ul>
          </li>
          <li>MongoDB Compass (GUI for MongoDB)</li>
          <li>Postman (API testing)</li>
        </ul>

        <h2>Common Issues</h2>
        <h3>Port Already in Use</h3>
        <p>
          If port 3000 is already in use, Next.js will automatically try to use
          3001. You can also specify a different port:
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded-md">
          npm run dev -- -p 3002
        </pre>

        <h3>MongoDB Connection Issues</h3>
        <p>
          If you cannot connect to MongoDB, ensure that:
        </p>
        <ul>
          <li>MongoDB service is running</li>
          <li>Your connection string in .env is correct</li>
          <li>MongoDB is running on the default port (27017)</li>
        </ul>

        <h2>Next Steps</h2>
        <p>
          After installation, you can:
        </p>
        <ul>
          <li>
            <a href="/project-structure">Review the project structure</a>
          </li>
          <li>
            <a href="/backend/architecture">Learn about the backend architecture</a>
          </li>
          <li>
            <a href="/frontend-ts/architecture">
              Explore the TypeScript frontend
            </a>
          </li>
          <li>
            <a href="/frontend-js/architecture">
              Explore the JavaScript frontend
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
