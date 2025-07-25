import React, { useState } from "react";
import {
  Users,
  Clock,
  Calendar,
  Plus,
  Edit,
  Save,
  X,
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  AlertCircle,
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

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hourlyRate: number;
  status: "active" | "inactive" | "on-leave";
  hireDate: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  accessLevel: "staff" | "supervisor" | "manager" | "admin";
  totalHours: number;
  overtimeHours: number;
}

interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  position: string;
  status: "scheduled" | "completed" | "no-show" | "called-off";
}

interface Timesheet {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  breakTime: number;
  totalHours: number;
  overtimeHours: number;
  status: "pending" | "approved" | "rejected";
}

interface EmployeeManagementProps {
  employees?: Employee[];
  schedules?: Schedule[];
  timesheets?: Timesheet[];
  onAddEmployee?: (employee: Omit<Employee, "id">) => void;
  onUpdateEmployee?: (employeeId: string, updates: Partial<Employee>) => void;
  onDeleteEmployee?: (employeeId: string) => void;
  onUpdateSchedule?: (scheduleId: string, updates: Partial<Schedule>) => void;
  onApproveTimesheet?: (timesheetId: string) => void;
}

const EmployeeManagement = ({
  employees = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@tastybites.com",
      phone: "(555) 123-4567",
      position: "Head Chef",
      department: "Kitchen",
      hourlyRate: 25.0,
      status: "active",
      hireDate: "2023-01-15",
      address: "123 Main St, City, State 12345",
      emergencyContact: {
        name: "Jane Smith",
        phone: "(555) 987-6543",
      },
      accessLevel: "manager",
      totalHours: 160,
      overtimeHours: 8,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@tastybites.com",
      phone: "(555) 234-5678",
      position: "Server",
      department: "Front of House",
      hourlyRate: 15.0,
      status: "active",
      hireDate: "2023-03-20",
      address: "456 Oak Ave, City, State 12345",
      emergencyContact: {
        name: "Mike Johnson",
        phone: "(555) 876-5432",
      },
      accessLevel: "staff",
      totalHours: 140,
      overtimeHours: 0,
    },
    {
      id: "3",
      name: "Mike Wilson",
      email: "mike.wilson@tastybites.com",
      phone: "(555) 345-6789",
      position: "Line Cook",
      department: "Kitchen",
      hourlyRate: 18.0,
      status: "on-leave",
      hireDate: "2023-02-10",
      address: "789 Pine St, City, State 12345",
      emergencyContact: {
        name: "Lisa Wilson",
        phone: "(555) 765-4321",
      },
      accessLevel: "staff",
      totalHours: 120,
      overtimeHours: 4,
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@tastybites.com",
      phone: "(555) 456-7890",
      position: "Manager",
      department: "Management",
      hourlyRate: 30.0,
      status: "active",
      hireDate: "2022-11-05",
      address: "321 Elm St, City, State 12345",
      emergencyContact: {
        name: "Tom Davis",
        phone: "(555) 654-3210",
      },
      accessLevel: "admin",
      totalHours: 170,
      overtimeHours: 10,
    },
  ],
  schedules = [
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Smith",
      date: "2024-01-22",
      startTime: "08:00",
      endTime: "16:00",
      position: "Head Chef",
      status: "scheduled",
    },
    {
      id: "2",
      employeeId: "2",
      employeeName: "Sarah Johnson",
      date: "2024-01-22",
      startTime: "11:00",
      endTime: "19:00",
      position: "Server",
      status: "scheduled",
    },
    {
      id: "3",
      employeeId: "4",
      employeeName: "Emily Davis",
      date: "2024-01-22",
      startTime: "09:00",
      endTime: "17:00",
      position: "Manager",
      status: "completed",
    },
  ],
  timesheets = [
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Smith",
      date: "2024-01-21",
      clockIn: "08:00",
      clockOut: "16:30",
      breakTime: 30,
      totalHours: 8.0,
      overtimeHours: 0,
      status: "pending",
    },
    {
      id: "2",
      employeeId: "2",
      employeeName: "Sarah Johnson",
      date: "2024-01-21",
      clockIn: "11:00",
      clockOut: "19:15",
      breakTime: 30,
      totalHours: 7.75,
      overtimeHours: 0,
      status: "approved",
    },
  ],
  onAddEmployee = () => {},
  onUpdateEmployee = () => {},
  onDeleteEmployee = () => {},
  onUpdateSchedule = () => {},
  onApproveTimesheet = () => {},
}: EmployeeManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id">>({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    hourlyRate: 0,
    status: "active",
    hireDate: new Date().toISOString().split("T")[0],
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
    },
    accessLevel: "staff",
    totalHours: 0,
    overtimeHours: 0,
  });

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" ||
      employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments
  const departments = [
    "All",
    ...new Set(employees.map((employee) => employee.department)),
  ];

  // Get pending timesheets
  const pendingTimesheets = timesheets.filter(
    (timesheet) => timesheet.status === "pending",
  );

  // Get today's schedule
  const todaySchedule = schedules.filter(
    (schedule) => schedule.date === new Date().toISOString().split("T")[0],
  );

  // Handle add employee
  const handleAddEmployee = () => {
    onAddEmployee(newEmployee);
    setNewEmployee({
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      hourlyRate: 0,
      status: "active",
      hireDate: new Date().toISOString().split("T")[0],
      address: "",
      emergencyContact: {
        name: "",
        phone: "",
      },
      accessLevel: "staff",
      totalHours: 0,
      overtimeHours: 0,
    });
    setIsAddEmployeeOpen(false);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "on-leave":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Get access level badge variant
  const getAccessLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "admin":
        return "destructive";
      case "manager":
        return "default";
      case "supervisor":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="w-full bg-background p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Employee Management</h1>
        <p className="text-muted-foreground">
          Manage staff, schedules, timesheets, and access levels
        </p>
      </div>

      {/* Alerts */}
      {pendingTimesheets.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">
                Pending Timesheet Approvals
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pendingTimesheets.map((timesheet) => (
                <Badge key={timesheet.id} variant="destructive">
                  {timesheet.employeeName}: {timesheet.totalHours}h
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees">Employee Directory</TabsTrigger>
          <TabsTrigger value="scheduling">Employee Scheduling</TabsTrigger>
          <TabsTrigger value="timesheets">Timesheet Management</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search employees..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm"
                >
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              <Dialog
                open={isAddEmployeeOpen}
                onOpenChange={setIsAddEmployeeOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                      Add a new team member to your restaurant staff.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newEmployee.name}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
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
                          value={newEmployee.email}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
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
                          value={newEmployee.phone}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={newEmployee.position}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              position: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={newEmployee.department}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              department: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="hourlyRate">Hourly Rate</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          step="0.01"
                          value={newEmployee.hourlyRate}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              hourlyRate: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newEmployee.address}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyName">
                          Emergency Contact Name
                        </Label>
                        <Input
                          id="emergencyName"
                          value={newEmployee.emergencyContact.name}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              emergencyContact: {
                                ...newEmployee.emergencyContact,
                                name: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">
                          Emergency Contact Phone
                        </Label>
                        <Input
                          id="emergencyPhone"
                          value={newEmployee.emergencyContact.phone}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              emergencyContact: {
                                ...newEmployee.emergencyContact,
                                phone: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="accessLevel">Access Level</Label>
                      <select
                        id="accessLevel"
                        value={newEmployee.accessLevel}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            accessLevel: e.target
                              .value as Employee["accessLevel"],
                          })
                        }
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      >
                        <option value="staff">Staff</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddEmployeeOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddEmployee}>Add Employee</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Employee Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="bg-background">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                    </div>
                    <Badge variant={getStatusBadgeVariant(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>
                  <CardDescription>{employee.position}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${employee.hourlyRate.toFixed(2)}/hour</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Access Level:
                      </span>
                      <Badge
                        variant={getAccessLevelBadgeVariant(
                          employee.accessLevel,
                        )}
                        className="ml-2"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {employee.accessLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Total Hours:
                      </span>
                      <div className="font-medium">{employee.totalHours}h</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Overtime:</span>
                      <div className="font-medium">
                        {employee.overtimeHours}h
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={
                        employee.status === "active" ? "destructive" : "default"
                      }
                      size="sm"
                      className="flex-1"
                    >
                      {employee.status === "active" ? (
                        <UserX className="h-4 w-4 mr-1" />
                      ) : (
                        <UserCheck className="h-4 w-4 mr-1" />
                      )}
                      {employee.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Scheduling</CardTitle>
              <CardDescription>
                Create, update, and manage employee schedules and shift swaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Today's Schedule</h3>
                <div className="space-y-2">
                  {todaySchedule.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {schedule.employeeName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {schedule.position} • {schedule.startTime} -{" "}
                            {schedule.endTime}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          schedule.status === "completed"
                            ? "default"
                            : schedule.status === "no-show"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {schedule.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timesheet Management</CardTitle>
              <CardDescription>
                Track hours worked, overtime, and approve timesheets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In/Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timesheets.map((timesheet) => (
                    <TableRow key={timesheet.id}>
                      <TableCell>
                        <div className="font-medium">
                          {timesheet.employeeName}
                        </div>
                      </TableCell>
                      <TableCell>{timesheet.date}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {timesheet.clockIn} - {timesheet.clockOut}
                          </div>
                          <div className="text-muted-foreground">
                            Break: {timesheet.breakTime}min
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {timesheet.totalHours}h
                        </div>
                      </TableCell>
                      <TableCell>
                        {timesheet.overtimeHours > 0 ? (
                          <Badge variant="destructive">
                            {timesheet.overtimeHours}h OT
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            timesheet.status === "approved"
                              ? "default"
                              : timesheet.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {timesheet.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {timesheet.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => onApproveTimesheet(timesheet.id)}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
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
    </div>
  );
};

export default EmployeeManagement;
