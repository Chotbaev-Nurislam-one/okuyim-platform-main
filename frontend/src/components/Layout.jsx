import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  BriefcaseIcon,
  ChartBarIcon,
  BookOpenIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon,
  ShieldCheckIcon,
  TrophyIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

function Layout({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Кейсы", path: "/dashboard", icon: BriefcaseIcon },
    { name: "Статистика", path: "/statistics", icon: ChartBarIcon },
    { name: "Теория", path: "/theory", icon: BookOpenIcon },
    { name: "Рейтинг", path: "/leaderboard", icon: TrophyIcon },
  ];

  if (user?.role === "admin") {
    navItems.push({ name: "Админка", path: "/admin", icon: ShieldCheckIcon });
  }

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post("/auth/logout").catch(() => {});
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      onLogout();
      navigate("/login");
      setIsLoggingOut(false);
      setShowMobileMenu(false);
    }
  };

  // Закрытие меню при смене страницы
  useEffect(() => {
    setShowMobileMenu(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Десктопный хедер (виден на планшетах и выше) */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">О</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Окуйм</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                </Link>
              ))}
            </nav>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isLoggingOut}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </button>

              {showUserMenu && !isLoggingOut && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Профиль</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>Настройки</span>
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Выход</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Мобильный хедер (только на телефонах) */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 md:hidden">
        <div className="px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">О</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Окуйм</span>
          </Link>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* User avatar button */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-full flex items-center justify-center"
            >
              <UserCircleIcon className="w-5 h-5 text-indigo-600" />
            </button>

            {/* Menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showMobileMenu ? (
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              ) : (
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Мобильное выпадающее меню пользователя */}
        {showUserMenu && !isLoggingOut && (
          <div className="absolute top-14 right-4 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setShowUserMenu(false)}
            >
              <UserIcon className="w-4 h-4" />
              <span>Профиль</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setShowUserMenu(false)}
            >
              <Cog6ToothIcon className="w-4 h-4" />
              <span>Настройки</span>
            </Link>
            <hr className="my-1" />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span>Выход</span>
            </button>
          </div>
        )}
      </header>

      {/* Мобильная навигация (слайд-меню) */}
      {showMobileMenu && (
        <>
          {/* Оверлей */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Меню */}
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl z-50 animate-slide-in md:hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="p-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Мобильная нижняя навигация (для быстрого доступа) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-bottom">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-all min-w-[60px] ${
                isActive(item.path) ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content с отступами для мобильной навигации */}
      <main className="pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <Outlet />
        </div>
      </main>

      {/* Loading overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex items-center space-x-3">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-500 border-t-transparent"></div>
            <span className="text-gray-700">Выход...</span>
          </div>
        </div>
      )}

      {/* Стили для анимации */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}

export default Layout;
