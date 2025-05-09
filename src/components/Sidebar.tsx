import logo from "@/assets/logo2.png";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { label: "DASHBOARD", path: "/admin_dashboard" },
    { label: "COURSES", path: "/courses" },
    { label: "STUDENTS", path: "/students_dashboard" },
    { label: "CHAT", path: "/chat" },
    { label: "LIBRARY", path: "/library" },
    { label: "WALLET", path: "/coursedetails" },
    { label: "SETTINGS", path: "/settingspage" },
    { label: "LIBRARY", path: "/reserourceupload" },
    { label: "PAYMENTS", path: "/reserourcewalle" },
    { label: "ANALYTICS", path: "/analytics" },
    { label: "SETTINGS", path: "/settings" },
  ];

  return (
    <aside className="w-48  min-h-screen flex flex-col shadow-md">
      {/* Logo Section */}
      <div className="flex justify-center py-6">
        <div className="relative">
          <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
            <img src={logo} className="w-full h-full" alt="TOTO" />
          </div>
          <div className="text-center mt-1 font-semibold text-white">TOTO</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block py-3 px-4 mb-3 rounded-md font-medium text-sm transition-colors ${
                isActive
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
