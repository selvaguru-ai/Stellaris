import React, { useState } from "react";
import {
  Users,
  Star,
  Gift,
  MessageSquare,
  Plus,
  Edit,
  Search,
  Filter,
  Heart,
  Trophy,
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  ThumbsUp,
  ThumbsDown,
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
import { Textarea } from "@/components/ui/textarea";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  preferences: string[];
  specialRequests: string[];
  lastOrderDate: string;
  averageOrderValue: number;
  favoriteItems: string[];
}

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  reward: string;
  type: "discount" | "free_item" | "special_offer";
  active: boolean;
  usageCount: number;
}

interface CustomerFeedback {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  orderItems: string[];
  response?: string;
  status: "pending" | "responded" | "resolved";
}

interface CustomerManagementProps {
  customers?: Customer[];
  loyaltyPrograms?: LoyaltyProgram[];
  feedback?: CustomerFeedback[];
  onAddCustomer?: (customer: Omit<Customer, "id">) => void;
  onUpdateCustomer?: (customerId: string, updates: Partial<Customer>) => void;
  onCreateLoyaltyProgram?: (program: Omit<LoyaltyProgram, "id">) => void;
  onRespondToFeedback?: (feedbackId: string, response: string) => void;
}

const CustomerManagement = ({
  customers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, City, State 12345",
      joinDate: "2023-06-15",
      totalOrders: 24,
      totalSpent: 687.5,
      loyaltyPoints: 1250,
      loyaltyTier: "Gold",
      preferences: ["Vegetarian", "No Spicy"],
      specialRequests: ["Extra napkins", "Light sauce"],
      lastOrderDate: "2024-01-20",
      averageOrderValue: 28.65,
      favoriteItems: ["Margherita Pizza", "Caesar Salad"],
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, City, State 12345",
      joinDate: "2023-08-22",
      totalOrders: 18,
      totalSpent: 425.75,
      loyaltyPoints: 850,
      loyaltyTier: "Silver",
      preferences: ["Gluten-Free"],
      specialRequests: ["Call before delivery"],
      lastOrderDate: "2024-01-18",
      averageOrderValue: 23.65,
      favoriteItems: ["Chicken Salad", "Garlic Bread"],
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      phone: "(555) 345-6789",
      address: "789 Pine St, City, State 12345",
      joinDate: "2023-12-10",
      totalOrders: 8,
      totalSpent: 185.25,
      loyaltyPoints: 370,
      loyaltyTier: "Bronze",
      preferences: ["Spicy Food"],
      specialRequests: [],
      lastOrderDate: "2024-01-15",
      averageOrderValue: 23.16,
      favoriteItems: ["Spicy Wings", "Pepperoni Pizza"],
    },
  ],
  loyaltyPrograms = [
    {
      id: "1",
      name: "Free Appetizer",
      description: "Get a free appetizer with your next order",
      pointsRequired: 500,
      reward: "Free Appetizer (up to $8 value)",
      type: "free_item",
      active: true,
      usageCount: 45,
    },
    {
      id: "2",
      name: "10% Off Next Order",
      description: "Save 10% on your next order",
      pointsRequired: 750,
      reward: "10% discount on entire order",
      type: "discount",
      active: true,
      usageCount: 32,
    },
    {
      id: "3",
      name: "Free Dessert",
      description: "Complimentary dessert with any main course",
      pointsRequired: 300,
      reward: "Free Dessert (up to $6 value)",
      type: "free_item",
      active: true,
      usageCount: 67,
    },
  ],
  feedback = [
    {
      id: "1",
      customerId: "1",
      customerName: "John Smith",
      rating: 5,
      comment: "Excellent food and fast delivery! The pizza was perfect.",
      date: "2024-01-20",
      orderItems: ["Margherita Pizza", "Garlic Bread"],
      response:
        "Thank you for your wonderful feedback! We're delighted you enjoyed your meal.",
      status: "responded",
    },
    {
      id: "2",
      customerId: "2",
      customerName: "Sarah Johnson",
      rating: 4,
      comment: "Good food, but delivery was a bit slow. Overall satisfied.",
      date: "2024-01-18",
      orderItems: ["Chicken Salad"],
      status: "pending",
    },
    {
      id: "3",
      customerId: "3",
      customerName: "Mike Wilson",
      rating: 3,
      comment: "Wings were not as spicy as expected. Could use more sauce.",
      date: "2024-01-15",
      orderItems: ["Spicy Wings"],
      status: "pending",
    },
  ],
  onAddCustomer = () => {},
  onUpdateCustomer = () => {},
  onCreateLoyaltyProgram = () => {},
  onRespondToFeedback = () => {},
}: CustomerManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState("All");
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] =
    useState<CustomerFeedback | null>(null);
  const [feedbackResponse, setFeedbackResponse] = useState("");
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, "id">>({
    name: "",
    email: "",
    phone: "",
    address: "",
    joinDate: new Date().toISOString().split("T")[0],
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    loyaltyTier: "Bronze",
    preferences: [],
    specialRequests: [],
    lastOrderDate: "",
    averageOrderValue: 0,
    favoriteItems: [],
  });
  const [newProgram, setNewProgram] = useState<Omit<LoyaltyProgram, "id">>({
    name: "",
    description: "",
    pointsRequired: 0,
    reward: "",
    type: "discount",
    active: true,
    usageCount: 0,
  });

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    const matchesTier =
      selectedTier === "All" || customer.loyaltyTier === selectedTier;
    return matchesSearch && matchesTier;
  });

  // Get loyalty tiers
  const loyaltyTiers = ["All", "Bronze", "Silver", "Gold", "Platinum"];

  // Get pending feedback
  const pendingFeedback = feedback.filter((f) => f.status === "pending");

  // Get tier badge variant
  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case "Platinum":
        return "default";
      case "Gold":
        return "secondary";
      case "Silver":
        return "outline";
      default:
        return "destructive";
    }
  };

  // Get rating stars
  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  // Handle add customer
  const handleAddCustomer = () => {
    onAddCustomer(newCustomer);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      joinDate: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
      loyaltyTier: "Bronze",
      preferences: [],
      specialRequests: [],
      lastOrderDate: "",
      averageOrderValue: 0,
      favoriteItems: [],
    });
    setIsAddCustomerOpen(false);
  };

  // Handle add loyalty program
  const handleAddProgram = () => {
    onCreateLoyaltyProgram(newProgram);
    setNewProgram({
      name: "",
      description: "",
      pointsRequired: 0,
      reward: "",
      type: "discount",
      active: true,
      usageCount: 0,
    });
    setIsAddProgramOpen(false);
  };

  // Handle feedback response
  const handleRespondToFeedback = () => {
    if (selectedFeedback && feedbackResponse.trim()) {
      onRespondToFeedback(selectedFeedback.id, feedbackResponse);
      setSelectedFeedback(null);
      setFeedbackResponse("");
    }
  };

  return (
    <div className="w-full bg-background p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Customer Relationship Management
        </h1>
        <p className="text-muted-foreground">
          Manage customer profiles, loyalty programs, and feedback
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loyalty Members
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter((c) => c.loyaltyTier !== "Bronze").length}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Customer Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {(
                customers.reduce((sum, c) => sum + c.totalSpent, 0) /
                customers.length
              ).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reviews
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingFeedback.length}</div>
            <p className="text-xs text-muted-foreground">Requires response</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="customers">Customer Profiles</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Programs</TabsTrigger>
          <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search customers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  {loyaltyTiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>
              <Dialog
                open={isAddCustomerOpen}
                onOpenChange={setIsAddCustomerOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                      Create a new customer profile with preferences and
                      details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newCustomer.name}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newCustomer.phone}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="loyaltyTier">Loyalty Tier</Label>
                        <select
                          id="loyaltyTier"
                          value={newCustomer.loyaltyTier}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              loyaltyTier: e.target
                                .value as Customer["loyaltyTier"],
                            })
                          }
                          className="w-full border rounded-md px-3 py-2 text-sm"
                        >
                          <option value="Bronze">Bronze</option>
                          <option value="Silver">Silver</option>
                          <option value="Gold">Gold</option>
                          <option value="Platinum">Platinum</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newCustomer.address}
                        onChange={(e) =>
                          setNewCustomer({
                            ...newCustomer,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddCustomerOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddCustomer}>Add Customer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Customer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="bg-background">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                    </div>
                    <Badge variant={getTierBadgeVariant(customer.loyaltyTier)}>
                      <Trophy className="h-3 w-3 mr-1" />
                      {customer.loyaltyTier}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Total Orders:
                      </span>
                      <div className="font-medium">{customer.totalOrders}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Total Spent:
                      </span>
                      <div className="font-medium">
                        ${customer.totalSpent.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Loyalty Points:
                    </span>
                    <Badge variant="outline">
                      <Gift className="h-3 w-3 mr-1" />
                      {customer.loyaltyPoints}
                    </Badge>
                  </div>
                  {customer.preferences.length > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground mb-1 block">
                        Preferences:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {customer.preferences.map((pref, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Loyalty Programs</h3>
              <p className="text-sm text-muted-foreground">
                Reward points system and special offers
              </p>
            </div>
            <Dialog open={isAddProgramOpen} onOpenChange={setIsAddProgramOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Program
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Loyalty Program</DialogTitle>
                  <DialogDescription>
                    Set up a new reward program for your customers.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="programName">Program Name</Label>
                    <Input
                      id="programName"
                      value={newProgram.name}
                      onChange={(e) =>
                        setNewProgram({ ...newProgram, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProgram.description}
                      onChange={(e) =>
                        setNewProgram({
                          ...newProgram,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pointsRequired">Points Required</Label>
                      <Input
                        id="pointsRequired"
                        type="number"
                        value={newProgram.pointsRequired}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            pointsRequired: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        value={newProgram.type}
                        onChange={(e) =>
                          setNewProgram({
                            ...newProgram,
                            type: e.target.value as LoyaltyProgram["type"],
                          })
                        }
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      >
                        <option value="discount">Discount</option>
                        <option value="free_item">Free Item</option>
                        <option value="special_offer">Special Offer</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reward">Reward Description</Label>
                    <Input
                      id="reward"
                      value={newProgram.reward}
                      onChange={(e) =>
                        setNewProgram({ ...newProgram, reward: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddProgramOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddProgram}>Create Program</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loyaltyPrograms.map((program) => (
              <Card key={program.id} className="bg-background">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{program.name}</CardTitle>
                    <Badge variant={program.active ? "default" : "secondary"}>
                      {program.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>{program.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <span className="font-medium">{program.reward}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Points Required:
                    </span>
                    <Badge variant="outline">{program.pointsRequired}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Times Used:</span>
                    <span className="font-medium">{program.usageCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline">
                      {program.type.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Program
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback & Reviews</CardTitle>
              <CardDescription>
                Monitor customer satisfaction and respond to feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedback.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="font-medium">{review.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.orderItems.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getRatingStars(review.rating)}
                          <span className="ml-2 text-sm font-medium">
                            {review.rating}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {review.comment}
                        </div>
                      </TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            review.status === "responded"
                              ? "default"
                              : review.status === "resolved"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {review.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedFeedback(review);
                              setFeedbackResponse("");
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                        )}
                        {review.status === "responded" && (
                          <Button size="sm" variant="outline">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            View Response
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feedback Response Dialog */}
      <Dialog
        open={selectedFeedback !== null}
        onOpenChange={() => setSelectedFeedback(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Customer Feedback</DialogTitle>
            <DialogDescription>
              {selectedFeedback && (
                <div className="mt-2">
                  <div className="font-medium">
                    {selectedFeedback.customerName}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getRatingStars(selectedFeedback.rating)}
                    <span className="ml-2 text-sm">
                      {selectedFeedback.rating}/5 stars
                    </span>
                  </div>
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="text-sm">{selectedFeedback.comment}</p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="response">Your Response</Label>
            <Textarea
              id="response"
              placeholder="Thank you for your feedback..."
              value={feedbackResponse}
              onChange={(e) => setFeedbackResponse(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedFeedback(null)}>
              Cancel
            </Button>
            <Button onClick={handleRespondToFeedback}>Send Response</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
