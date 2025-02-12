import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { MoonIcon, SunIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import { useTheme } from '../contexts/ThemeProvider';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-xl sm:text-2xl font-bold">
                OpenAlgo
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 -mr-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <Cross1Icon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <HamburgerMenuIcon className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-10 h-10"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                ) : (
                  <SunIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                )}
              </Button>
              
              {!user ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Register</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Button onClick={handleLogout} variant="destructive">
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4 space-y-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-full justify-start"
              >
                {theme === 'light' ? (
                  <div className="flex items-center">
                    <MoonIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Dark Mode
                  </div>
                ) : (
                  <div className="flex items-center">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] mr-2" />
                    Light Mode
                  </div>
                )}
              </Button>
              
              {!user ? (
                <>
                  <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Login</Button>
                  </Link>
                  <Link to="/register" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full justify-start">Register</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
                  </Link>
                  <Button 
                    onClick={handleLogout} 
                    variant="destructive"
                    className="w-full justify-start"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow bg-background">
        <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 sm:py-6 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm sm:text-base text-foreground">{new Date().getFullYear()} OpenAlgo MultiUser. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
