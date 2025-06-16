import React, { ReactNode } from "react";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
  showUserMenu?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightElement,
  showUserMenu = true,
  className = "",
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <header
      className={`bg-white border-b border-gray-200 pt-safe ${className}`}
    >
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 truncate mt-1">{subtitle}</p>
            )}
          </div>

          {/* Right Side - Controls */}
          <div className="flex items-center space-x-2 ml-4">
            {rightElement}

            {showUserMenu && (
              <div className="relative">
                <div className="flex items-center space-x-3">
                  {/* User Info */}
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  {/* User Avatar */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-600 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
