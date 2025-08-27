import { useState } from "react";
import { loginUser } from "../utils/auth";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import type {User} from "../types" 

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.username.trim()) {
      newErrors.push("Username is required");
    }

    if (!formData.password) {
      newErrors.push("Password is required");
    }

    if (isRegistering) {
      if (!formData.email.trim()) {
        newErrors.push("Email is required");
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.push("Email is invalid");
      }

      if (!formData.confirmPassword) {
        newErrors.push("Please confirm your password");
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.push("Passwords do not match");
      }

      if (formData.password.length < 6) {
        newErrors.push("Password must be at least 6 characters");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const token = loginUser(formData.username, formData.password);
    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } else {
      setErrors(["Invalid username or password"]);
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    // Simulate registration (in a real app, this would make an API call)
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if username or email already exists
    const userExists = existingUsers.some(
      (user: User) =>
        user.username === formData.username || user.email === formData.email
    );

    if (userExists) {
      setErrors(["Username or email already exists"]);
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(), // Simple ID generation
      username: formData.username,
      password: formData.password,
      email: formData.email,
      role: "user",
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    // Auto-login after registration
    const token = btoa(JSON.stringify(newUser));
    localStorage.setItem("token", token);

    alert("Registration successful! Welcome to the Library Management System.");
    window.location.href = "/dashboard";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <FaUser className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegistering ? "Create Account" : "Welcome to Your Library"}
          </h1>
          <p className="text-gray-600">
            {isRegistering
              ? "Join our library community today"
              : "Sign in to access your library account"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Email Field (Registration Only) */}
            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Registration Only) */}
            {isRegistering && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <ul className="text-red-600 text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {isRegistering ? "Create Account" : "Sign In"}
            </button>

            {/* Toggle Between Login and Register */}
            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-gray-600 mb-4">
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setFormData({
                    username: "",
                    password: "",
                    email: "",
                    confirmPassword: "",
                  });
                  setErrors([]);
                }}
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
              >
                {isRegistering ? "Sign In Instead" : "Create New Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
