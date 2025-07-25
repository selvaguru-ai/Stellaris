import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import FoodItemCard from "./FoodItemCard";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
  vegetarian: boolean;
  spicy: boolean;
}

interface MenuDisplayProps {
  items?: MenuItem[];
  categories?: string[];
}

const MenuDisplay = ({
  items = [
    {
      id: "1",
      name: "Classic Burger",
      description:
        "Juicy beef patty with lettuce, tomato, cheese, and our special sauce",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
      category: "Burgers",
      popular: true,
      vegetarian: false,
      spicy: false,
    },
    {
      id: "2",
      name: "Margherita Pizza",
      description:
        "Traditional pizza with tomato sauce, mozzarella, and fresh basil",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80",
      category: "Pizza",
      popular: true,
      vegetarian: true,
      spicy: false,
    },
    {
      id: "3",
      name: "Caesar Salad",
      description:
        "Crisp romaine lettuce with parmesan, croutons, and Caesar dressing",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80",
      category: "Salads",
      popular: false,
      vegetarian: true,
      spicy: false,
    },
    {
      id: "4",
      name: "Spicy Chicken Wings",
      description: "Crispy chicken wings tossed in our signature hot sauce",
      price: 11.99,
      image:
        "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=500&q=80",
      category: "Appetizers",
      popular: true,
      vegetarian: false,
      spicy: true,
    },
    {
      id: "5",
      name: "Chocolate Brownie",
      description: "Rich chocolate brownie served with vanilla ice cream",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80",
      category: "Desserts",
      popular: false,
      vegetarian: true,
      spicy: false,
    },
    {
      id: "6",
      name: "Veggie Wrap",
      description:
        "Fresh vegetables and hummus wrapped in a whole wheat tortilla",
      price: 10.99,
      image:
        "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&q=80",
      category: "Wraps",
      popular: false,
      vegetarian: true,
      spicy: false,
    },
  ],
  categories = [
    "All",
    "Popular",
    "Burgers",
    "Pizza",
    "Salads",
    "Appetizers",
    "Desserts",
    "Wraps",
  ],
}: MenuDisplayProps) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
  });

  // Filter items based on active category, search query, and filters
  const filteredItems = items.filter((item) => {
    // Category filter
    if (activeCategory !== "All" && activeCategory !== "Popular") {
      if (item.category !== activeCategory) return false;
    } else if (activeCategory === "Popular") {
      if (!item.popular) return false;
    }

    // Search filter
    if (
      searchQuery &&
      !item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Dietary filters
    if (filters.vegetarian && !item.vegetarian) return false;
    if (filters.spicy && !item.spicy) return false;

    return true;
  });

  const toggleFilter = (filter: "vegetarian" | "spicy") => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  return (
    <div className="w-full bg-background p-4 md:p-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search menu..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => toggleFilter("vegetarian")}
            className={`px-3 py-1 rounded-full text-sm ${filters.vegetarian ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            Vegetarian
          </button>
          <button
            onClick={() => toggleFilter("spicy")}
            className={`px-3 py-1 rounded-full text-sm ${filters.spicy ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            Spicy
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs
        defaultValue="All"
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="w-full"
      >
        <TabsList className="w-full overflow-x-auto flex justify-start mb-6 bg-background border-b pb-1">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <FoodItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                vegetarian={item.vegetarian}
                spicy={item.spicy}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">
                No items found matching your criteria.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default MenuDisplay;
