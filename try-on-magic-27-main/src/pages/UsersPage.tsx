import { useMemo, useState } from "react";
import { Search, Shield, User, Download, Ban, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: "User" | "Admin" | "Brand Manager";
  tryOns: number;
  joined: string;
  status: "active" | "inactive" | "suspended";
};

const initialUsers: UserItem[] = [
  { id: "u-1", name: "Sarah Chen", email: "sarah@email.com", role: "User", tryOns: 142, joined: "Jan 12, 2026", status: "active" },
  { id: "u-2", name: "James Miller", email: "james@email.com", role: "User", tryOns: 87, joined: "Jan 28, 2026", status: "active" },
  { id: "u-3", name: "Amira Patel", email: "amira@email.com", role: "Admin", tryOns: 312, joined: "Dec 5, 2025", status: "active" },
  { id: "u-4", name: "Luca Rossi", email: "luca@email.com", role: "User", tryOns: 56, joined: "Feb 1, 2026", status: "inactive" },
  { id: "u-5", name: "Emma Wilson", email: "emma@email.com", role: "User", tryOns: 203, joined: "Nov 15, 2025", status: "active" },
  { id: "u-6", name: "David Kim", email: "david@email.com", role: "Brand Manager", tryOns: 421, joined: "Oct 3, 2025", status: "active" },
];

const UsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [users, query]);

  const updateStatus = (id: string, status: UserItem["status"]) => {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, status } : user)));
  };

  const deleteUser = (id: string) => {
    setUsers((current) => current.filter((user) => user.id !== id));
  };

  const exportCsv = () => {
    const header = "name,email,role,tryOns,joined,status";
    const rows = filtered.map((user) =>
      [user.name, user.email, user.role, user.tryOns, user.joined, user.status].join(","),
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage platform users</p>
        </div>
        <Button size="sm" variant="outline" className="gap-2" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-9 bg-card border-border"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Try-Ons</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-secondary/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                    user.role === "Admin" ? "bg-primary/10 text-primary" : user.role === "Brand Manager" ? "bg-warning/10 text-warning" : "bg-secondary text-secondary-foreground"
                  }`}>
                    {user.role === "Admin" && <Shield className="h-3 w-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-sm text-muted-foreground">{user.tryOns}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{user.joined}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wider ${
                    user.status === "active"
                      ? "bg-success/10 text-success"
                      : user.status === "suspended"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    title="Suspend user"
                    onClick={() => updateStatus(user.id, "suspended")}
                  >
                    <Ban className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    title="Delete user"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
