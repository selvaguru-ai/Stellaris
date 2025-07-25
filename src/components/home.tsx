import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Menu as MenuIcon,
  User,
  Search,
  Package,
  Users,
  BarChart3,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import MenuDisplay from "./menu/MenuDisplay";
import OrderCart from "./order/OrderCart";
import InventoryManagement from "./inventory/InventoryManagement";
import EmployeeManagement from "./employee/EmployeeManagement";
import ReportingAnalytics from "./reporting/ReportingAnalytics";
import CustomerManagement from "./crm/CustomerManagement";

const Home = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<
    "menu" | "inventory" | "employees" | "reporting" | "crm"
  >("menu");
  const [cartItems, setCartItems] = useState<
    Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      customizations?: string[];
      image?: string;
    }>
  >([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDarkMode(shouldUseDark);
    if (shouldUseDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const addToCart = (item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    customizations?: string[];
    image?: string;
  }) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      } else {
        return [...prev, item];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
            </Button>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="w-6 h-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-br from-primary to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Stellaris
              </span>
            </motion.div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant={activeView === "menu" ? "default" : "ghost"}
              className="text-base font-medium"
              onClick={() => setActiveView("menu")}
            >
              Menu
            </Button>
            <Button
              variant={activeView === "inventory" ? "default" : "ghost"}
              className="text-base font-medium"
              onClick={() => setActiveView("inventory")}
            >
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Button>
            <Button
              variant={activeView === "employees" ? "default" : "ghost"}
              className="text-base font-medium"
              onClick={() => setActiveView("employees")}
            >
              <Users className="h-4 w-4 mr-2" />
              Employees
            </Button>
            <Button
              variant={activeView === "reporting" ? "default" : "ghost"}
              className="text-base font-medium"
              onClick={() => setActiveView("reporting")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button
              variant={activeView === "crm" ? "default" : "ghost"}
              className="text-base font-medium"
              onClick={() => setActiveView("crm")}
            >
              <Users className="h-4 w-4 mr-2" />
              CRM
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search menu..." className="pl-8" />
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-2">
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                  variant="destructive"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Content Section */}
          <div
            className={`w-full ${isCartOpen && activeView === "menu" ? "md:w-2/3" : "md:w-full"} transition-all duration-300`}
          >
            {activeView === "menu" ? (
              <MenuDisplay onAddToCart={addToCart} />
            ) : activeView === "inventory" ? (
              <InventoryManagement />
            ) : activeView === "employees" ? (
              <EmployeeManagement />
            ) : activeView === "reporting" ? (
              <ReportingAnalytics />
            ) : (
              <CustomerManagement />
            )}
          </div>

          {/* Order Cart Section - Only shown for menu view */}
          {isCartOpen && activeView === "menu" && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-1/3 md:sticky md:top-24 md:self-start"
            >
              <OrderCart
                items={cartItems}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onClose={() => setIsCartOpen(false)}
              />
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Tasty Bites</h3>
              <p className="text-muted-foreground">
                Delicious food delivered to your doorstep.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 11am - 10pm
              </p>
              <p className="text-muted-foreground">
                Saturday - Sunday: 10am - 11pm
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-muted-foreground">
                123 Food Street, Cuisine City
              </p>
              <p className="text-muted-foreground">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Tasty Bites. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
