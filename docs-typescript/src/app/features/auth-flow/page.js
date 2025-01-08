export default function AuthFlow() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Authentication Flow
      </h1>

      <div className="prose prose-blue max-w-none">
        <h2>Overview</h2>
        <p>
          The authentication system uses JWT (JSON Web Tokens) for secure user
          authentication. The flow includes registration, login, password reset, and
          token refresh mechanisms.
        </p>

        <h2>Implementation Details</h2>

        <h3>1. User Registration</h3>
        <p>When a user registers, the following steps occur:</p>
        <pre className="bg-gray-800 text-white p-4 rounded-md">
{`// frontend/src/app/auth/register/page.tsx
const handleRegister = async (data: RegisterFormData) => {
  try {
    const response = await api.post('/auth/register', data);
    const { token, user } = response.data;
    
    // Store token in secure cookie
    setCookie('token', token);
    
    // Update auth context
    setUser(user);
    
    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    handleError(error);
  }
};`}
        </pre>

        <h3>2. Login Process</h3>
        <p>The login process involves:</p>
        <ol>
          <li>Client-side validation using React Hook Form</li>
          <li>API call to authenticate credentials</li>
          <li>JWT token storage in HTTP-only cookie</li>
          <li>User state management with React Context</li>
        </ol>

        <pre className="bg-gray-800 text-white p-4 rounded-md">
{`// frontend/src/app/auth/login/page.tsx
const { login } = useAuth();

const handleLogin = async (data: LoginFormData) => {
  try {
    await login(data);
    router.push('/dashboard');
  } catch (error) {
    setError('Invalid credentials');
  }
};`}
        </pre>

        <h3>3. Token Management</h3>
        <p>
          Tokens are managed using HTTP-only cookies for security. The
          authentication context handles token refresh and logout:
        </p>

        <pre className="bg-gray-800 text-white p-4 rounded-md">
{`// frontend/src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the context implementation
}`}
        </pre>

        <h3>4. Protected Routes</h3>
        <p>Routes are protected using middleware:</p>

        <pre className="bg-gray-800 text-white p-4 rounded-md">
{`// frontend/src/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}`}
        </pre>

        <h2>Type Definitions</h2>
        <p>Key types used in the authentication system:</p>

        <pre className="bg-gray-800 text-white p-4 rounded-md">
{`// frontend/src/types/auth.ts
interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterFormData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

interface AuthResponse {
  token: string;
  user: User;
}`}
        </pre>

        <h2>Error Handling</h2>
        <p>Authentication errors are handled using custom error classes:</p>

        <pre className="bg-gray-800 text-white p-4 rounded-md">
{`// frontend/src/utils/errors.ts
export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Usage in components
try {
  await login(credentials);
} catch (error) {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'invalid_credentials':
        setError('Invalid email or password');
        break;
      case 'account_locked':
        setError('Account is locked. Please contact support.');
        break;
      default:
        setError('An unexpected error occurred');
    }
  }
}`}
        </pre>

        <h2>Security Considerations</h2>
        <ul>
          <li>Tokens are stored in HTTP-only cookies</li>
          <li>Passwords are hashed using bcrypt</li>
          <li>CSRF protection is enabled</li>
          <li>Rate limiting on authentication endpoints</li>
          <li>Input validation on both client and server</li>
        </ul>

        <h2>Testing</h2>
        <p>Authentication tests cover:</p>

        <pre className="bg-gray-800 text-white p-4 rounded-md">
{`// frontend/src/__tests__/auth.test.tsx
describe('Authentication', () => {
  it('should login successfully with valid credentials', async () => {
    render(<LoginPage />);
    // ... test implementation
  });

  it('should show error message with invalid credentials', async () => {
    // ... test implementation
  });

  it('should maintain auth state after page refresh', async () => {
    // ... test implementation
  });
});`}
        </pre>

        <h2>Related Components</h2>
        <ul>
          <li>
            <code>LoginForm</code> - Handles user login
          </li>
          <li>
            <code>RegisterForm</code> - Handles user registration
          </li>
          <li>
            <code>ForgotPasswordForm</code> - Handles password reset requests
          </li>
          <li>
            <code>AuthGuard</code> - HOC for protecting routes
          </li>
        </ul>

        <h2>API Endpoints</h2>
        <table>
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/api/auth/register</td>
              <td>POST</td>
              <td>Register new user</td>
            </tr>
            <tr>
              <td>/api/auth/login</td>
              <td>POST</td>
              <td>User login</td>
            </tr>
            <tr>
              <td>/api/auth/logout</td>
              <td>POST</td>
              <td>User logout</td>
            </tr>
            <tr>
              <td>/api/auth/refresh</td>
              <td>POST</td>
              <td>Refresh access token</td>
            </tr>
          </tbody>
        </table>

        <h2>Common Issues and Solutions</h2>
        <h3>Token Expiration</h3>
        <p>
          If the token expires, the system automatically attempts to refresh it
          using the refresh token. If both tokens are expired, the user is
          redirected to the login page.
        </p>

        <h3>Cross-Tab Authentication</h3>
        <p>
          Authentication state is synchronized across browser tabs using the
          broadcast channel API:
        </p>

        <pre className="bg-gray-800 text-white p-4 rounded-md">
{`// frontend/src/utils/auth-sync.ts
const authChannel = new BroadcastChannel('auth');

authChannel.onmessage = (event) => {
  if (event.data.type === 'LOGOUT') {
    // Sync logout across tabs
    logout();
  }
};`}
        </pre>

        <h2>Next Steps</h2>
        <p>To learn more about related topics, check out:</p>
        <ul>
          <li>
            <a href="/advanced/security">Security Best Practices</a>
          </li>
          <li>
            <a href="/features/user-management">User Management</a>
          </li>
          <li>
            <a href="/backend/authentication">Backend Authentication</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
