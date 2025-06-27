import AuthForm from "@/components/AuthForm";
import GoogleSSOButton from "@/components/GoogleSSOButton";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  //   const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate();
  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      //   await login(data.email, data.password)
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  const handleGoogleLogin = async () => {
    try {
      //   await loginWithGoogle()
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed", error);
    }
  };
  return (
    <div className=" md:mt-0 md:min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col-reverse md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-600 mt-2">
              Sign in to access your secure vault
            </p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
            <AuthForm type="login" onSubmit={handleLogin} />
            <div className="my-6 flex items-center">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            <GoogleSSOButton onClick={handleGoogleLogin} />
            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary hover:text-blue-600 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right side - Decorative */}
      <div className="w-full md:w-1/2 hidden md:flex bg-primary text-white p-8  items-center justify-center min-h-[30vh] md:min-h-0">
        <div className="max-w-md">
          <svg
            className="w-full max-w-xs mx-auto mb-6 md:mb-8 h-auto"
            viewBox="0 0 1090 928"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle opacity="0.1" cx="545" cy="464" r="464" fill="white" />
            <circle opacity="0.1" cx="545" cy="464" r="298" fill="white" />
            <circle opacity="0.1" cx="545" cy="464" r="170" fill="white" />
            <path
              d="M545 628V464M545 464V300M545 464H709M545 464H381"
              stroke="white"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <rect
              x="490"
              y="409"
              width="110"
              height="110"
              rx="10"
              fill="white"
            />
            <path
              d="M545 354C545 343.507 553.507 335 564 335H653C663.493 335 672 343.507 672 354V409H545V354Z"
              fill="white"
            />
            <path
              d="M545 574C545 584.493 553.507 593 564 593H653C663.493 593 672 584.493 672 574V519H545V574Z"
              fill="white"
            />
            <path
              d="M418 464C418 453.507 426.507 445 437 445H490V519H418V464Z"
              fill="white"
            />
            <path
              d="M672 464C672 453.507 680.507 445 691 445H744V519H672V464Z"
              fill="white"
            />
          </svg>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-center">
            Secure Your Digital Assets
          </h2>
          <p className="text-base md:text-lg opacity-90 text-center">
            SecureVault provides industry-leading security features to keep your
            sensitive information protected at all times.
          </p>
          <div className="mt-6 md:mt-8 grid grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-3 rounded-full mb-2 md:mb-3">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-center text-sm md:text-base">
                End-to-End Encryption
              </h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-3 rounded-full mb-2 md:mb-3">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-center text-sm md:text-base">
                Advanced Protection
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
