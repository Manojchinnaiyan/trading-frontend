import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import type { Broker } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";
import Input from "../common/Input";

interface LoginFormProps {
  selectedBroker: Broker;
  onBack: () => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ selectedBroker, onBack }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const { login, signup, loading, error, clearError } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    clearError();

    if (!validateForm()) return;

    try {
      if (isSignup) {
        await signup(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err: any) {
      setErrors({ general: err.message });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific errors
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Clear general error
    if (error) {
      clearError();
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setErrors({});
    clearError();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <button
          onClick={onBack}
          className="absolute left-0 top-0 p-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div
          className={`w-16 h-16 ${selectedBroker.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg`}
        >
          {selectedBroker.logo}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <p className="text-gray-600">
          {isSignup ? "Sign up" : "Sign in"} to {selectedBroker.name}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
          autoComplete="email"
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          }
        />

        {/* Error Messages */}
        {(errors.general || error) && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-3">
            <p className="text-sm text-danger-700">{errors.general || error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center space-y-4">
        <button
          type="button"
          onClick={toggleMode}
          className="text-primary-600 text-sm hover:text-primary-700 underline"
        >
          {isSignup
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </button>

        {!isSignup && (
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
