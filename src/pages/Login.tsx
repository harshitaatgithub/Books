import { useState } from "react";
import { loginUser } from "../utils/auth";
import LoginComponent from "../components/LoginComponent.tsx";
import type { User } from "../types";

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

    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = existingUsers.some(
      (user: User) =>
        user.username === formData.username || user.email === formData.email
    );

    if (userExists) {
      setErrors(["Username or email already exists"]);
      return;
    }

    const newUser = {
      id: Date.now(),
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phone: "+1-555-0000",
      role: "user",
      status: "active",
    };

    existingUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(existingUsers));

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
    <LoginComponent
      isRegistering={isRegistering}
      setIsRegistering={setIsRegistering}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      formData={formData}
      handleInputChange={handleInputChange}
      errors={errors}
      setErrors={setErrors}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;
