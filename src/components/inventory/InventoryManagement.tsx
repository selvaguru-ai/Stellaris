import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Bell,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastRestocked: string;
  usedInRecipes: string[];
}

interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  items: string[];
  lastOrder: string;
  totalOrders: number;
}

interface InventoryManagementProps {
  items?: InventoryItem[];
  vendors?: Vendor[];
  onUpdateStock?: (itemId: string, newStock: number) => void;
  onAddItem?: (item: Omit<InventoryItem, "id">) => void;
  onDeleteItem?: (itemId: string) => void;
}

const InventoryManagement = ({
  items = [
    {
      id: "1",
      name: "Tomatoes",
      category: "Vegetables",
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unit: "lbs",
      costPerUnit: 2.5,
      supplier: "Fresh Farm Co",
      lastRestocked: "2024-01-20",
      usedInRecipes: ["Margherita Pizza", "Caesar Salad", "Pasta Marinara"],
    },
    {
      id: "2",
      name: "Mozzarella Cheese",
      category: "Dairy",
      currentStock: 8,
      minStock: 15,
      maxStock: 30,
      unit: "lbs",
      costPerUnit: 4.2,
      supplier: "Dairy Direct",
      lastRestocked: "2024-01-18",
      usedInRecipes: ["Margherita Pizza", "Lasagna", "Caprese Salad"],
    },
    {
      id: "3",
      name: "Ground Beef",
      category: "Meat",
      currentStock: 12,
      minStock: 8,
      maxStock: 25,
      unit: "lbs",
      costPerUnit: 6.8,
      supplier: "Prime Meats",
      lastRestocked: "2024-01-19",
      usedInRecipes: ["Classic Burger", "Beef Tacos", "Meatballs"],
    },
    {
      id: "4",
      name: "Flour",
      category: "Pantry",
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      unit: "lbs",
      costPerUnit: 1.2,
      supplier: "Grain Supply Co",
      lastRestocked: "2024-01-15",
      usedInRecipes: ["Pizza Dough", "Bread", "Pasta"],
    },
    {
      id: "5",
      name: "Olive Oil",
      category: "Pantry",
      currentStock: 3,
      minStock: 5,
      maxStock: 12,
      unit: "bottles",
      costPerUnit: 8.5,
      supplier: "Mediterranean Imports",
      lastRestocked: "2024-01-10",
      usedInRecipes: ["Caesar Salad", "Garlic Bread", "Pasta"],
    },
  ],
  vendors = [
    {
      id: "1",
      name: "Fresh Farm Co",
      contact: "John Smith",
      email: "john@freshfarm.com",
      phone: "(555) 123-4567",
      items: ["Tomatoes", "Lettuce", "Onions", "Bell Peppers"],
      lastOrder: "2024-01-20",
      totalOrders: 45,
    },
    {
      id: "2",
      name: "Dairy Direct",
      contact: "Sarah Johnson",
      email: "sarah@dairydirect.com",
      phone: "(555) 234-5678",
      items: ["Mozzarella Cheese", "Cheddar Cheese", "Milk", "Butter"],
      lastOrder: "2024-01-18",
      totalOrders: 32,
    },
    {
      id: "3",
      name: "Prime Meats",
      contact: "Mike Wilson",
      email: "mike@primemeats.com",
      phone: "(555) 345-6789",
      items: ["Ground Beef", "Chicken Breast", "Pork Chops", "Salmon"],
      lastOrder: "2024-01-19",
      totalOrders: 28,
    },
  ],
  onUpdateStock = () => {},
  onAddItem = () => {},
  onDeleteItem = () => {},
}: InventoryManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<{
    [key: string]: number;
  }>({});
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    category: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: "",
    costPerUnit: 0,
    supplier: "",
    lastRestocked: new Date().toISOString().split("T")[0],
    usedInRecipes: [],
  });

  // Filter items based on search and category
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ["All", ...new Set(items.map((item) => item.category))];

  // Get low stock items
  const lowStockItems = items.filter(
    (item) => item.currentStock <= item.minStock,
  );

  // Calculate stock level percentage
  const getStockLevel = (item: InventoryItem) => {
    return Math.min((item.currentStock / item.maxStock) * 100, 100);
  };

  // Get stock status
  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return "low";
    if (item.currentStock >= item.maxStock * 0.8) return "high";
    return "normal";
  };

  // Handle stock adjustment
  const handleStockAdjustment = (itemId: string, adjustment: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const newStock = Math.max(0, item.currentStock + adjustment);
      onUpdateStock(itemId, newStock);
    }
  };

  // Handle manual stock update
  const handleManualStockUpdate = (itemId: string) => {
    const adjustment = stockAdjustment[itemId];
    if (adjustment !== undefined) {
      onUpdateStock(itemId, adjustment);
      setStockAdjustment((prev) => ({ ...prev, [itemId]: undefined }));
      setEditingItem(null);
    }
  };

  // Handle add new item
  const handleAddItem = () => {
    onAddItem(newItem);
    setNewItem({
      name: "",
      category: "",
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: "",
      costPerUnit: 0,
      supplier: "",
      lastRestocked: new Date().toISOString().split("T")[0],
      usedInRecipes: [],
    });
    setIsAddItemOpen(false);
  };

  return (
    <div className="w-full bg-background p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">
          Monitor stock levels, manage suppliers, and track ingredient usage
        </p>
      </div>

      {/* Alert for low stock items */}
      {lowStockItems.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">Low Stock Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <Badge key={item.id} variant="destructive">
                  {item.name}: {item.currentStock} {item.unit}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stock">Stock Monitoring</TabsTrigger>
          <TabsTrigger value="adjustments">Inventory Adjustments</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Management</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search ingredients..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                    <DialogDescription>
                      Add a new ingredient or supply to your inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newItem.name}
                          onChange={(e) =>
                            setNewItem({ ...newItem, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={newItem.category}
                          onChange={(e) =>
                            setNewItem({ ...newItem, category: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="currentStock">Current Stock</Label>
                        <Input
                          id="currentStock"
                          type="number"
                          value={newItem.currentStock}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              currentStock: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="minStock">Min Stock</Label>
                        <Input
                          id="minStock"
                          type="number"
                          value={newItem.minStock}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              minStock: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxStock">Max Stock</Label>
                        <Input
                          id="maxStock"
                          type="number"
                          value={newItem.maxStock}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              maxStock: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                          id="unit"
                          value={newItem.unit}
                          onChange={(e) =>
                            setNewItem({ ...newItem, unit: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="costPerUnit">Cost per Unit</Label>
                        <Input
                          id="costPerUnit"
                          type="number"
                          step="0.01"
                          value={newItem.costPerUnit}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              costPerUnit: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        id="supplier"
                        value={newItem.supplier}
                        onChange={(e) =>
                          setNewItem({ ...newItem, supplier: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddItemOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddItem}>Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>
                Real-time stock levels and ingredient tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockLevel = getStockLevel(item);
                    const stockStatus = getStockStatus(item);
                    const isEditing = editingItem === item.id;

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Used in:{" "}
                              {item.usedInRecipes.slice(0, 2).join(", ")}
                              {item.usedInRecipes.length > 2 && " +more"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Progress value={stockLevel} className="w-20" />
                            <Badge
                              variant={
                                stockStatus === "low"
                                  ? "destructive"
                                  : stockStatus === "high"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {stockStatus}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                className="w-20"
                                value={
                                  stockAdjustment[item.id] ?? item.currentStock
                                }
                                onChange={(e) =>
                                  setStockAdjustment({
                                    ...stockAdjustment,
                                    [item.id]: parseInt(e.target.value) || 0,
                                  })
                                }
                              />
                              <span className="text-sm text-muted-foreground">
                                {item.unit}
                              </span>
                            </div>
                          ) : (
                            <span>
                              {item.currentStock} {item.unit}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>${item.costPerUnit.toFixed(2)}</TableCell>
                        <TableCell className="text-sm">
                          {item.supplier}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleManualStockUpdate(item.id)
                                  }
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingItem(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingItem(item.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleStockAdjustment(item.id, -1)
                                  }
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleStockAdjustment(item.id, 1)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adjustments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Adjustments</CardTitle>
              <CardDescription>
                Manual stock adjustments for damaged goods or new deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current: {item.currentStock} {item.unit}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStockAdjustment(item.id, -5)}
                      >
                        <TrendingDown className="h-4 w-4 mr-1" />
                        -5
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStockAdjustment(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStockAdjustment(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStockAdjustment(item.id, 5)}
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +5
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Management</CardTitle>
              <CardDescription>
                Manage supplier contacts and order histories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vendors.map((vendor) => (
                  <Card key={vendor.id} className="bg-background">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">{vendor.contact}</p>
                        <p className="text-sm text-muted-foreground">
                          {vendor.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vendor.phone}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium mb-2">Supplies:</p>
                        <div className="flex flex-wrap gap-1">
                          {vendor.items.slice(0, 3).map((item, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {item}
                            </Badge>
                          ))}
                          {vendor.items.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{vendor.items.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Last Order:
                        </span>
                        <span>{vendor.lastOrder}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Total Orders:
                        </span>
                        <span>{vendor.totalOrders}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex gap-2 w-full">
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-1" />
                          History
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Bell className="h-4 w-4 mr-1" />
                          Order
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
