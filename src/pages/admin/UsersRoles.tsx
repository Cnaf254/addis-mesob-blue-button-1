import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  UserPlus,
  Users,
  Shield,
  Search,
  Loader2,
} from "lucide-react";

const roles = [
  { value: "member", label: "Member" },
  { value: "committee", label: "Loan Committee" },
  { value: "chairperson", label: "Chairperson" },
  { value: "accountant", label: "Accountant" },
  { value: "admin", label: "Admin" },
] as const;

const genders = ["Male", "Female"];
const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
const academicLevels = ["Primary", "Secondary", "Diploma", "Degree", "Masters", "PhD", "Other"];

interface NewUserForm {
  // Account
  email: string;
  password: string;
  role: string;
  // Personal
  first_name: string;
  middle_name: string;
  last_name: string;
  phone: string;
  alternate_phone: string;
  gender: string;
  dob: string;
  national_id: string;
  marital_status: string;
  // Employment
  employee_id: string;
  department: string;
  occupation: string;
  academic_level: string;
  work_experience: string;
  monthly_income: number;
  monthly_saving_amount: number;
  share_count: number;
  // Address
  address_line_1: string;
  address_line_2: string;
  city: string;
  region: string;
  postal_code: string;
  // Emergency
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relationship: string;
  emergency_contact_city: string;
  emergency_contact_region: string;
  // Heir
  heir_name: string;
  heir_relationship: string;
  heir_phone: string;
  heir_city: string;
  heir_region: string;
  heir_share_percent: number;
  // Referral
  referred_by: string;
}

const initialForm: NewUserForm = {
  email: "", password: "", role: "member",
  first_name: "", middle_name: "", last_name: "",
  phone: "", alternate_phone: "", gender: "", dob: "",
  national_id: "", marital_status: "",
  employee_id: "", department: "", occupation: "",
  academic_level: "", work_experience: "",
  monthly_income: 0, monthly_saving_amount: 0, share_count: 0,
  address_line_1: "", address_line_2: "", city: "", region: "", postal_code: "",
  emergency_contact_name: "", emergency_contact_phone: "",
  emergency_contact_relationship: "", emergency_contact_city: "", emergency_contact_region: "",
  heir_name: "", heir_relationship: "", heir_phone: "",
  heir_city: "", heir_region: "", heir_share_percent: 100,
  referred_by: "",
};

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UsersAndRoles() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  const [form, setForm] = useState<NewUserForm>(initialForm);

  const set = (field: keyof NewUserForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const setNum = (field: keyof NewUserForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm((p) => ({ ...p, [field]: Number(e.target.value) || 0 }));

  const setSelect = (field: keyof NewUserForm) => (val: string) =>
    setForm((p) => ({ ...p, [field]: val }));

  const handleCreateUser = () => {
    if (!form.email || !form.password || !form.first_name || !form.last_name) {
      toast.error("Please fill in required fields: Email, Password, First Name, Last Name");
      return;
    }

    setLoading(true);

    // Simulate registration — add to local state
    const newId = crypto.randomUUID();
    setUsers((prev) => [
      ...prev,
      {
        id: newId,
        name: `${form.first_name} ${form.last_name}`,
        email: form.email,
        role: form.role,
        status: "Pending",
      },
    ]);

    toast.success("User registered successfully!");
    setForm(initialForm);
    setActiveTab("account");
    setOpenCreate(false);
    setLoading(false);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Users & Roles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Register and manage system users
          </p>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button variant="default" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Register User
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Register New User
              </DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto">
                  <TabsTrigger value="account" className="text-xs">Account</TabsTrigger>
                  <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
                  <TabsTrigger value="contact" className="text-xs">Contact</TabsTrigger>
                  <TabsTrigger value="employment" className="text-xs">Employment</TabsTrigger>
                  <TabsTrigger value="address" className="text-xs">Address</TabsTrigger>
                  <TabsTrigger value="emergency" className="text-xs">Emergency</TabsTrigger>
                  <TabsTrigger value="heir" className="text-xs">Heir</TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="h-[55vh] px-6 py-4">
                {/* ACCOUNT TAB */}
                <TabsContent value="account" className="mt-0 space-y-4">
                  <SectionHeading title="Account Information" />
                  <FormGrid>
                    <FormField label="Email *" value={form.email} onChange={set("email")} type="email" placeholder="user@example.com" />
                    <FormField label="Password *" value={form.password} onChange={set("password")} type="password" placeholder="Min 6 characters" />
                  </FormGrid>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Role *</Label>
                    <Select value={form.role} onValueChange={setSelect("role")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            <span className="flex items-center gap-2">
                              <Shield className="h-3 w-3" />
                              {r.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* PERSONAL TAB */}
                <TabsContent value="personal" className="mt-0 space-y-4">
                  <SectionHeading title="Personal Information" />
                  <FormGrid>
                    <FormField label="First Name *" value={form.first_name} onChange={set("first_name")} placeholder="First name" />
                    <FormField label="Middle Name" value={form.middle_name} onChange={set("middle_name")} placeholder="Middle name" />
                    <FormField label="Last Name *" value={form.last_name} onChange={set("last_name")} placeholder="Last name" />
                    <FormField label="National ID" value={form.national_id} onChange={set("national_id")} placeholder="National ID number" />
                    <FormField label="Date of Birth" value={form.dob} onChange={set("dob")} type="date" />
                  </FormGrid>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Gender</Label>
                      <Select value={form.gender} onValueChange={setSelect("gender")}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          {genders.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Marital Status</Label>
                      <Select value={form.marital_status} onValueChange={setSelect("marital_status")}>
                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>
                          {maritalStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* CONTACT TAB */}
                <TabsContent value="contact" className="mt-0 space-y-4">
                  <SectionHeading title="Contact Information" />
                  <FormGrid>
                    <FormField label="Phone Number" value={form.phone} onChange={set("phone")} placeholder="+251 9XX XXX XXX" />
                    <FormField label="Alternate Phone" value={form.alternate_phone} onChange={set("alternate_phone")} placeholder="+251 9XX XXX XXX" />
                  </FormGrid>
                  <FormField label="Referred By" value={form.referred_by} onChange={set("referred_by")} placeholder="Name of referrer (optional)" />
                </TabsContent>

                {/* EMPLOYMENT TAB */}
                <TabsContent value="employment" className="mt-0 space-y-4">
                  <SectionHeading title="Employment & Financial" />
                  <FormGrid>
                    <FormField label="Employee ID" value={form.employee_id} onChange={set("employee_id")} placeholder="Employee ID" />
                    <FormField label="Department" value={form.department} onChange={set("department")} placeholder="Department" />
                    <FormField label="Occupation" value={form.occupation} onChange={set("occupation")} placeholder="Job title" />
                    <FormField label="Work Experience" value={form.work_experience} onChange={set("work_experience")} placeholder="e.g. 5 years" />
                  </FormGrid>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Academic Level</Label>
                    <Select value={form.academic_level} onValueChange={setSelect("academic_level")}>
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>
                        {academicLevels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <SectionHeading title="Financial" />
                  <FormGrid>
                    <FormField label="Monthly Income (ETB)" value={form.monthly_income} onChange={setNum("monthly_income")} type="number" placeholder="0" />
                    <FormField label="Monthly Saving (ETB)" value={form.monthly_saving_amount} onChange={setNum("monthly_saving_amount")} type="number" placeholder="500" />
                    <FormField label="Share Count" value={form.share_count} onChange={setNum("share_count")} type="number" placeholder="0" />
                  </FormGrid>
                </TabsContent>

                {/* ADDRESS TAB */}
                <TabsContent value="address" className="mt-0 space-y-4">
                  <SectionHeading title="Address" />
                  <FormGrid>
                    <FormField label="Address Line 1" value={form.address_line_1} onChange={set("address_line_1")} placeholder="Street address" />
                    <FormField label="Address Line 2" value={form.address_line_2} onChange={set("address_line_2")} placeholder="Apt, suite, etc." />
                    <FormField label="City / Sub-City" value={form.city} onChange={set("city")} placeholder="City" />
                    <FormField label="Region" value={form.region} onChange={set("region")} placeholder="Region / Zone" />
                    <FormField label="Postal Code" value={form.postal_code} onChange={set("postal_code")} placeholder="Postal code" />
                  </FormGrid>
                </TabsContent>

                {/* EMERGENCY TAB */}
                <TabsContent value="emergency" className="mt-0 space-y-4">
                  <SectionHeading title="Emergency Contact" />
                  <FormGrid>
                    <FormField label="Contact Name" value={form.emergency_contact_name} onChange={set("emergency_contact_name")} placeholder="Full name" />
                    <FormField label="Contact Phone" value={form.emergency_contact_phone} onChange={set("emergency_contact_phone")} placeholder="Phone number" />
                    <FormField label="Relationship" value={form.emergency_contact_relationship} onChange={set("emergency_contact_relationship")} placeholder="e.g. Spouse, Parent" />
                    <FormField label="City" value={form.emergency_contact_city} onChange={set("emergency_contact_city")} placeholder="City" />
                    <FormField label="Region" value={form.emergency_contact_region} onChange={set("emergency_contact_region")} placeholder="Region" />
                  </FormGrid>
                </TabsContent>

                {/* HEIR TAB */}
                <TabsContent value="heir" className="mt-0 space-y-4">
                  <SectionHeading title="Heir / Beneficiary" />
                  <FormGrid>
                    <FormField label="Heir Name" value={form.heir_name} onChange={set("heir_name")} placeholder="Full name" />
                    <FormField label="Relationship" value={form.heir_relationship} onChange={set("heir_relationship")} placeholder="e.g. Son, Daughter" />
                    <FormField label="Phone" value={form.heir_phone} onChange={set("heir_phone")} placeholder="Phone number" />
                    <FormField label="City" value={form.heir_city} onChange={set("heir_city")} placeholder="City" />
                    <FormField label="Region" value={form.heir_region} onChange={set("heir_region")} placeholder="Region" />
                    <FormField label="Share %" value={form.heir_share_percent} onChange={setNum("heir_share_percent")} type="number" placeholder="100" />
                  </FormGrid>
                </TabsContent>
              </ScrollArea>

              {/* Footer */}
              <div className="flex items-center justify-between border-t p-4 bg-muted/30">
                <TabNavButtons active={activeTab} onTabChange={setActiveTab} />
                <Button onClick={handleCreateUser} disabled={loading} className="gap-2">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Register User
                </Button>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Registered Users</CardTitle>
            <CardDescription>All users in the system</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No users registered yet. Click "Register User" to add one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={u.status === "Active" ? "badge-active" : "badge-pending"}>
                        {u.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= HELPERS ================= */

const tabOrder = ["account", "personal", "contact", "employment", "address", "emergency", "heir"];

function TabNavButtons({ active, onTabChange }: { active: string; onTabChange: (t: string) => void }) {
  const idx = tabOrder.indexOf(active);
  return (
    <div className="flex gap-2">
      {idx > 0 && (
        <Button variant="outline" size="sm" onClick={() => onTabChange(tabOrder[idx - 1])}>
          Previous
        </Button>
      )}
      {idx < tabOrder.length - 1 && (
        <Button variant="secondary" size="sm" onClick={() => onTabChange(tabOrder[idx + 1])}>
          Next
        </Button>
      )}
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>;
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Input type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}
