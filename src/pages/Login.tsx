import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import useAuthStore from '../store/authStore';
import { LogIn, Layers, AlertCircle, Mail } from 'lucide-react';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/popup-blocked') {
        setError(
          'Pop-up was blocked by your browser. Please enable pop-ups for this site to sign in with Google.'
        );
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500 rounded-full p-3">
              <Layers className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">TaskBoard Pro</h2>
          <p className="text-gray-600 mb-8 text-center">Advanced Task Collaboration with Workflow Automation</p>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-medium">Unable to Sign In</p>
                <p className="text-sm mt-1">{error}</p>
                {error.includes('pop-ups') && (
                  <a 
                    href="https://support.google.com/chrome/answer/95472?hl=en" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 underline mt-2 inline-block"
                  >
                    Learn how to enable pop-ups
                  </a>
                )}
              </div>
            </div>
          )}
          
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>{isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}</span>
            </button>
          </form>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5" 
            />
            <span>{isLoading ? 'Please wait...' : 'Sign in with Google'}</span>
          </button>
          
          <p className="mt-4 text-center text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
        
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <div className="text-center">
            <h3 className="font-medium text-gray-700 mb-1">Project collaboration made easy</h3>
            <p className="text-sm text-gray-500">
              Manage projects, automate workflows, and collaborate in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-6 text-center text-xs">
            <div>
              <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <LogIn className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-700">Task Management</p>
            </div>
            <div>
              <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <LogIn className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-gray-700">Real-time Updates</p>
            </div>
            <div>
              <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <LogIn className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-700">Workflow Automation</p>
            </div>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} TaskBoard Pro. All rights reserved.
      </p>
    </div>
  );
};

export default Login;