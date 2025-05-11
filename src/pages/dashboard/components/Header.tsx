import { Search, Menu, Bell, Sun, Moon, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-slate-950 border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses..."
            className="pl-10 w-[240px] bg-muted/20"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-accent rounded-full"></span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="ml-2 rounded-full"
          onClick={toggleTheme}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={darkMode ? "dark" : "light"}
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="outline-none">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user?.profile_picture} />
                <AvatarFallback>{user.firstName.slice(0, 1) + user.lastName.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={18}
              alignOffset={5}
              className="min-w-[260px] bg-white dark:bg-slate-900 rounded-md shadow-lg border border-gray-200 dark:border-slate-700 p-1 z-50"
            >
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profile_picture} />
                  <AvatarFallback>{user.firstName.slice(0, 1) + user.lastName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-slate-700 m-1" />
              <Link to="/user/profile">
                <DropdownMenu.Item className="group text-sm rounded-sm px-2 py-1.5 outline-none flex items-center gap-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenu.Item>
              </Link>
              <DropdownMenu.Item
                onClick={logout}
                className="group text-sm rounded-sm px-2 py-1.5 outline-none flex items-center gap-2 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenu.Item>
              <DropdownMenu.Arrow className="fill-gray-200 dark:fill-slate-700" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};

export default Header;