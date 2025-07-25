import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  Activity,
  Clock,
  Star,
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

interface SalesReport {
  id: string;
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topCategory: string;
  growth: number;
}

interface InventoryReport {
  id: string;
  itemName: string;
  category: string;
  consumed: number;
  wasted: number;
  efficiency: number;
  forecastNeed: number;
  unit: string;
}

interface CustomerInsight {
  id: string;
  type: string;
  description: string;
  value: string;
  trend: "up" | "down" | "stable";
}

interface EmployeePerformance {
  id: string;
  employeeName: string;
  position: string;
  customerRating: number;
  ordersServed: number;
  hoursWorked: number;
  efficiency: number;
}

interface ReportingAnalyticsProps {
  salesReports?: SalesReport[];
  inventoryReports?: InventoryReport[];
  customerInsights?: CustomerInsight[];
  employeePerformance?: EmployeePerformance[];
  onGenerateReport?: (type: string, period: string) => void;
  onExportReport?: (reportId: string, format: string) => void;
}

const ReportingAnalytics = ({
  salesReports = [
    {
      id: "1",
      period: "Today",
      totalSales: 2450.75,
      totalOrders: 87,
      averageOrderValue: 28.17,
      topCategory: "Main Courses",
      growth: 12.5,
    },
    {
      id: "2",
      period: "This Week",
      totalSales: 15680.25,
      totalOrders: 542,
      averageOrderValue: 28.93,
      topCategory: "Beverages",
      growth: 8.3,
    },
    {
      id: "3",
      period: "This Month",
      totalSales: 68450.5,
      totalOrders: 2341,
      averageOrderValue: 29.24,
      topCategory: "Main Courses",
      growth: 15.7,
    },
  ],
  inventoryReports = [
    {
      id: "1",
      itemName: "Tomatoes",
      category: "Vegetables",
      consumed: 45,
      wasted: 3,
      efficiency: 93.8,
      forecastNeed: 52,
      unit: "lbs",
    },
    {
      id: "2",
      itemName: "Ground Beef",
      category: "Meat",
      consumed: 28,
      wasted: 1,
      efficiency: 96.6,
      forecastNeed: 35,
      unit: "lbs",
    },
    {
      id: "3",
      itemName: "Mozzarella Cheese",
      category: "Dairy",
      consumed: 22,
      wasted: 2,
      efficiency: 91.7,
      forecastNeed: 28,
      unit: "lbs",
    },
  ],
  customerInsights = [
    {
      id: "1",
      type: "Repeat Customers",
      description: "Customers who ordered more than 3 times this month",
      value: "68%",
      trend: "up",
    },
    {
      id: "2",
      type: "Popular Menu Items",
      description: "Most ordered items this week",
      value: "Margherita Pizza, Caesar Salad, Pasta Marinara",
      trend: "stable",
    },
    {
      id: "3",
      type: "Customer Demographics",
      description: "Primary age group of customers",
      value: "25-40 years (45%)",
      trend: "up",
    },
  ],
  employeePerformance = [
    {
      id: "1",
      employeeName: "Sarah Johnson",
      position: "Server",
      customerRating: 4.8,
      ordersServed: 156,
      hoursWorked: 32,
      efficiency: 4.9,
    },
    {
      id: "2",
      employeeName: "John Smith",
      position: "Head Chef",
      customerRating: 4.6,
      ordersServed: 203,
      hoursWorked: 40,
      efficiency: 5.1,
    },
    {
      id: "3",
      employeeName: "Mike Wilson",
      position: "Line Cook",
      customerRating: 4.4,
      ordersServed: 178,
      hoursWorked: 35,
      efficiency: 5.1,
    },
  ],
  onGenerateReport = () => {},
  onExportReport = () => {},
}: ReportingAnalyticsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [reportType, setReportType] = useState("sales");

  // Get trend icon
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  // Get efficiency color
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-green-600";
    if (efficiency >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="w-full bg-background p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reporting & Analytics</h1>
        <p className="text-muted-foreground">
          Track sales performance, inventory usage, and customer insights
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,680.25</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.3%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">542</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.1%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Order Value
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$28.93</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.7%</span> from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.2</span> from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Usage</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="employees">Employee Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="Last Month">Last Month</option>
                </select>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Sales Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {salesReports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{report.period}</CardTitle>
                    <Badge
                      variant={report.growth > 0 ? "default" : "destructive"}
                    >
                      {report.growth > 0 ? "+" : ""}
                      {report.growth}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ${report.totalSales.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">{report.totalOrders}</div>
                      <p className="text-muted-foreground">Orders</p>
                    </div>
                    <div>
                      <div className="font-medium">
                        ${report.averageOrderValue.toFixed(2)}
                      </div>
                      <p className="text-muted-foreground">Avg Order</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Top Category
                    </p>
                    <Badge variant="outline">{report.topCategory}</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Usage Report</CardTitle>
              <CardDescription>
                Track inventory consumption, waste, and forecast future needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Consumed</TableHead>
                    <TableHead>Wasted</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Forecast Need</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryReports.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.itemName}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.consumed} {item.unit}
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600">
                          {item.wasted} {item.unit}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={item.efficiency} className="w-16" />
                          <span
                            className={`text-sm font-medium ${getEfficiencyColor(
                              item.efficiency,
                            )}`}
                          >
                            {item.efficiency}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.forecastNeed} {item.unit}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>
                Data on repeat customers, popular menu items, and demographics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <Users className="h-8 w-8 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">{insight.type}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        <div className="text-lg font-semibold">
                          {insight.value}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(insight.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Performance</CardTitle>
              <CardDescription>
                Monitor employee performance based on customer feedback and work
                hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Customer Rating</TableHead>
                    <TableHead>Orders Served</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeePerformance.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="font-medium">
                          {employee.employeeName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.position}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">
                            {employee.customerRating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {employee.ordersServed}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {employee.hoursWorked}h
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            employee.efficiency >= 5
                              ? "default"
                              : employee.efficiency >= 4
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {employee.efficiency.toFixed(1)} orders/hour
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportingAnalytics;
