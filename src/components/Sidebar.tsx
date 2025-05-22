import React from "react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo2.png";
import { Button } from "antd";

const Sidebar = ({ isOpen = true, onClose = () => {} }) => {
  const navItems = [
    { label: "DASHBOARD", path: "/admin_dashboard" },
    { label: "COURSES", path: "/courses" },
    { label: "STUDENTS", path: "/students" },
    { label: "CHAT", path: "/chat" },
    { label: "LIBRARY", path: "/library" },
    { label: "PAYMENTS", path: "/payments" },
    { label: "ANALYTICS", path: "/analytics" },
    { label: "SETTINGS", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 z-30 bg-white dark:bg-slate-950 h-screen border-r border-border p-4 lg:static transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <h1 className="font-bold text-xl text-primary">Toto Academy</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block py-3 px-4 mb-2 rounded-md font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`
              }
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Section */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-primary-foreground p-4 rounded-xl">
            <h3 className="font-medium mb-1">Upgrade to Pro</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get unlimited access to all courses
            </p>
            <Button size="small" className="w-full bg-primary text-white">
              Upgrade Now
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
