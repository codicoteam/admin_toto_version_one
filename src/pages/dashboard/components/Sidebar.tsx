import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  MessageSquare,
  Wallet,
  Settings,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: BookOpen, label: "Subjects", path: "/courses" },
    // { icon: MessageSquare, label: "Q&A Forum", path: "/qa" },
    { icon: Wallet, label: "Wallet", path: "/wallet" },
    { icon: Settings, label: "Settings", path: "/settings" },
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
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 z-30 bg-white dark:bg-slate-950 h-screen border-r border-border p-4 lg:static transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-center mb-8 relative">
          <div className=" items-center gap-2">
            <img className="h-32 mx-auto" src="/logo-full.png" alt="toto academy logo" />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden absolute top-1 right-1">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-primary-foreground p-4 rounded-xl">
            <h3 className="font-medium mb-1">Upgrade to Pro</h3>
            <p className="text-sm text-muted-foreground mb-3">Get unlimited access to all courses</p>
            <Button size="sm" className="w-full bg-primary">
              Upgrade Now
            </Button>
          </div>
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
