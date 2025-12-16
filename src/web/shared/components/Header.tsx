
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header as UIHeader, HeaderLogo, HeaderNav } from '@voilajsx/uikit/header';
import { Button } from '@voilajsx/uikit/button';
import { useTheme } from '@voilajsx/uikit/theme-provider';
import { useAuth } from '../../features/auth';
import { hasRole, route } from '../utils';
import type { NavigationItem } from '@voilajsx/uikit';
import {
  LayoutDashboard,
  User,
  LogOut,
  Sun,
  Moon,
  Shield,
  LogIn,
  UserPlus,
  Calendar,
  FileText,
  ClipboardList
} from 'lucide-react';

// Logo component
const Logo: React.FC = () => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center text-secondary-foreground font-bold text-sm">
      UI
    </div>
    <div>
      <h3 className="voila-brand-logo text-xl font-bold">MyApp</h3>
      <p className="text-xs text-background">Feature-Based Architecture</p>
    </div>
  </div>
);

// Theme actions component
const ThemeActions: React.FC = () => {
  const { theme, mode, setTheme, availableThemes, toggleMode } = useTheme();

  return (
    <div className="flex items-center gap-3">
      {/* Theme Selector */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="border border-input rounded px-3 py-2 text-sm focus:outline-none text-background"
      >
        {availableThemes.map(themeId => (
          <option key={themeId} value={themeId}>
            {themeId.charAt(0).toUpperCase() + themeId.slice(1)}
          </option>
        ))}
      </select>

      {/* Light/Dark Mode Toggle */}
      <Button onClick={toggleMode} variant="secondary" size="sm">
        {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="ml-2 hidden sm:inline">
          {mode === 'dark' ? 'Light' : 'Dark'}
        </span>
      </Button>
    </div>
  );
};

// Helper function to check if user has admin role
const isAdmin = (user: any): boolean => {
  return user?.role === 'admin' || hasRole(user, ['admin.tenant', 'admin.org', 'admin.system']);
};

// Unified Header Component that handles both authenticated and public states
export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build navigation items based on authentication state
  const navigationItems: NavigationItem[] = [];

  if (isAuthenticated) {
    // Authenticated navigation
    navigationItems.push(
      { 
        key: 'dashboard', 
        label: 'Dashboard', 
        href: route('/dashboard'), 
        icon: LayoutDashboard 
      }
    );

    // Add leave management links for all users - using the exact routes from auto-discovery
    navigationItems.push(
      { 
        key: 'apply-leave', 
        label: 'Apply Leave', 
        href: route('/leave/leave.apply'),  // Updated to match auto-discovery
        icon: FileText 
      },
      { 
        key: 'leave-history', 
        label: 'My Leaves', 
        href: route('/leave/leave.history'),  // Updated to match auto-discovery
        icon: Calendar 
      }
    );

    // Add admin leave management for admin users
    if (user && isAdmin(user)) {
      navigationItems.push({
        key: 'admin-leaves',
        label: 'Manage Leaves',
        href: route('/leave/leave.admin'),  // Updated to match auto-discovery
        icon: ClipboardList
      });
    }

    // Add admin menu items based on role
    if (user && hasRole(user, ['admin.tenant', 'admin.org', 'admin.system'])) {
      navigationItems.push({
        key: 'admin',
        label: 'Admin',
        href: route('/admin'),
        icon: Shield
      });
    }

    // Always add logout for authenticated users
    navigationItems.push(
      { 
        key: 'profile', 
        label: 'Profile', 
        href: route('/profile'), 
        icon: User 
      },
      {
        key: 'logout',
        label: 'Sign Out',
        href: route('/logout'),
        icon: LogOut
      }
    );
  } else {
    // Public navigation
    navigationItems.push(
      {
        key: 'login',
        label: 'Sign In',
        href: route('/auth/login'),
        icon: LogIn
      },
      {
        key: 'register',
        label: 'Sign Up',
        href: route('/auth/register'),
        icon: UserPlus
      }
    );
  }

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <UIHeader tone="brand" size="xl" position="sticky">
      <HeaderLogo>
        <Logo />
      </HeaderLogo>

      <HeaderNav
        navigation={navigationItems}
        currentPath={location.pathname}
        onNavigate={handleNavigation}
      />

      <div className="flex items-center ml-2">
        <ThemeActions />
      </div>
    </UIHeader>
  );
};

// Export PublicHeader as alias for backward compatibility
export const PublicHeader = Header;