import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = useSession();

  const links = [
    { name: "Home", path: "/" },
    { name: "Create Quiz", path: "/create" },
    { name: "My Quizzes", path: "/my-quizzes" },
    { name: "Solve Quiz", path: "/solve" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Quiz Master
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  isActive(link.path)
                    ? "text-primary font-medium"
                    : "text-gray-600 hover:text-primary"
                } transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
            {session ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            ) : (
              <Link
                to="/auth"
                className="text-primary hover:text-primary-hover transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden animate-fadeIn">
            <div className="pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    isActive(link.path)
                      ? "text-primary font-medium"
                      : "text-gray-600"
                  } block px-3 py-2 text-base hover:text-primary transition-colors duration-200`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {session ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start px-3 py-2"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              ) : (
                <Link
                  to="/auth"
                  className="block px-3 py-2 text-primary hover:text-primary-hover transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;